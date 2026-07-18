/* 识字冒险岛 · 网页版 单文件应用逻辑（已移除拼音相关全部内容） */
(function () {
  'use strict';

  // ---------- 数据 ----------
  var LEVEL_COUNT = 30;
  var PER_LEVEL = 100;
  var ASSESS_QUESTIONS = 20;
  var GAME_DURATION = 60; // 抓字 单局时长（秒）
  var ALL = Object.keys(DICT);

  // 人教版小学《识字表》会认字 各册字数（字序简单字在前，切分即近似年级递进）
  var GRADE_DEFS = [
    { name: '一年级上', count: 300 },
    { name: '一年级下', count: 280 },
    { name: '二年级上', count: 380 },
    { name: '二年级下', count: 380 },
    { name: '三年级上', count: 240 },
    { name: '三年级下', count: 240 },
    { name: '四年级上', count: 240 },
    { name: '四年级下', count: 240 },
    { name: '五年级上', count: 200 },
    { name: '五年级下', count: 200 },
    { name: '六年级上', count: 200 },
    { name: '六年级下', count: 200 }
  ];
  var GRADE_LEVELS = (function () {
    var arr = [], start = 0;
    for (var i = 0; i < GRADE_DEFS.length; i++) {
      var isLast = (i === GRADE_DEFS.length - 1);
      var cnt = isLast ? (ALL.length - start) : Math.min(GRADE_DEFS[i].count, ALL.length - start);
      if (cnt <= 0) break;
      arr.push({ name: GRADE_DEFS[i].name, chars: ALL.slice(start, start + cnt) });
      start += cnt;
    }
    return arr;
  })();

  function levelChars(level) {
    var start = (level - 1) * PER_LEVEL;
    return ALL.slice(start, start + PER_LEVEL);
  }
  function gradeChars(index) {
    var g = GRADE_LEVELS[index - 1];
    return g ? g.chars : ALL.slice(0, 100);
  }
  function getPool(category, level) {
    return (category === 'grade') ? gradeChars(level) : levelChars(level);
  }
  function randInt(n) { return Math.floor(Math.random() * n); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randInt(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pickDistractors(target, count) {
    var pool = ALL.filter(function (c) { return c !== target; });
    return shuffle(pool).slice(0, count);
  }
  function samplePool(pool, n) {
    if (pool.length >= n) return shuffle(pool).slice(0, n);
    var extra = ALL.filter(function (c) { return pool.indexOf(c) === -1; });
    return shuffle(pool.concat(shuffle(extra).slice(0, n - pool.length))).slice(0, n);
  }

  // ---------- 存储 ----------
  var STORE_KEY = 'shizi_progress_v1';
  var Storage = {
    get: function () {
      try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
    },
    save: function (p) {
      var cur = this.get();
      var next = {};
      for (var k in cur) next[k] = cur[k];
      for (var k2 in p) next[k2] = p[k2];
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    }
  };
  function getProgress() {
    var p = Storage.get();
    return {
      highestLevel: p.highestLevel || 1,
      highestGrade: p.highestGrade || 1,
      bestScore: p.bestScore || 0,
      bestCombo: p.bestCombo || 0,
      assessedLevel: p.assessedLevel || 0,
      lastAssess: p.lastAssess || null
    };
  }

  // ---------- 语音（鲁棒版：修复 Chrome 暂停 / GC 导致无声） ----------
  var Speech = {
    supported: ('speechSynthesis' in window),
    voices: [],
    current: null,
    init: function () {
      if (!this.supported) return;
      var self = this;
      var load = function () { self.voices = window.speechSynthesis.getVoices() || []; };
      load();
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    },
    pickVoice: function () {
      if (!this.voices.length) this.voices = window.speechSynthesis.getVoices() || [];
      var zh = this.voices.filter(function (v) {
        return /zh|cmn/i.test(v.lang) || /Chinese|普通话|国语/i.test(v.name);
      });
      return zh[0] || this.voices[0] || null;
    },
    speak: function (text, opts) {
      opts = opts || {};
      text = (text == null ? '' : String(text)).trim();
      if (!text) return;
      if (!this.supported) { this.fallback(text); return; }
      try {
        var synth = window.speechSynthesis;
        var self = this;
        var fire = function () {
          try { if (synth.paused) synth.resume(); } catch (e) {}
          var u = new SpeechSynthesisUtterance(text);
          u.lang = 'zh-CN';
          u.rate = opts.rate || 0.85;
          u.pitch = opts.pitch || 1.1;
          u.volume = 1;
          var v = self.pickVoice();
          if (v) u.voice = v;
          self.current = u;                         // 持有引用，防止被 GC 导致不发音
          u.onend = function () { if (self.current === u) self.current = null; };
          u.onerror = function () { if (self.current === u) self.current = null; };
          synth.speak(u);
        };
        // 关键修复：Chrome 在同一执行帧内「先 cancel 再 speak」会丢弃新 utterance → 永久无声。
        // 打断后用 setTimeout 让 cancel 生效，再 speak。90ms 在用户手势激活窗口内，不影响自动播报。
        try { synth.cancel(); } catch (e) {}
        if (synth.speaking || synth.pending) setTimeout(fire, 90);
        else fire();
      } catch (e) { this.fallback(text); }
    },
    fallback: function (text) {
      var h = document.getElementById('sound-hint');
      if (h) { h.textContent = '🔊 ' + text; h.classList.add('show'); setTimeout(function () { h.classList.remove('show'); }, 1200); }
    }
  };

  // ---------- 提示音（Web Audio 合成，明亮愉悦的“叮”，用于庆祝/答对） ----------
  var Sound = {
    ctx: null,
    init: function () {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC && !this.ctx) this.ctx = new AC();
      } catch (e) {}
    },
    resume: function () { try { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); } catch (e) {} },
    // 单音钟琴“叮”：基频 + 八度泛音，快起音指数衰减，明亮不刺耳（鼓励/庆祝用）
    chime: function () {
      try {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        var ctx = this.ctx, now = ctx.currentTime;
        var partials = [[880, 0.5], [1760, 0.16]]; // A5 + 八度，钟琴音色
        for (var i = 0; i < partials.length; i++) {
          var osc = ctx.createOscillator(), gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = partials[i][0];
          var peak = partials[i][1];
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(peak, now + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(now); osc.stop(now + 0.55);
        }
      } catch (e) {}
    },
    // 轻柔“噗”提示（答错用）：低音短促下行，不刺耳
    wrong: function () {
      try {
        if (!this.ctx) this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        var ctx = this.ctx, now = ctx.currentTime;
        var osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.3);
      } catch (e) {}
    }
  };

  // ---------- 状态 ----------
  var state = {
    view: 'home', assess: null, game: null, result: null,
    selectedCategory: 'freq', selectedLevel: 1
  };

  function showView(name) {
    state.view = name;
    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) views[i].classList.remove('active');
    var el = document.getElementById('view-' + name);
    if (el) el.classList.add('active');
    var back = document.getElementById('btn-back');
    if (back) back.style.display = (name === 'home') ? 'none' : 'flex';
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    handleAction(t.dataset.action, t);
  });

  function handleAction(action, el) {
    switch (action) {
      case 'go-home': stopGame(); showView('home'); renderHome(); break;
      case 'go-assess': startAssess(); break;
      case 'go-game': startGame(state.selectedCategory, state.selectedLevel); break;
      case 'go-level': renderLevel(); showView('level'); break;
      case 'level-cat': state.selectedCategory = el.dataset.cat; renderLevel(); break;
      case 'assess-answer': onAssessAnswer(el.dataset.val, el); break;
      case 'game-tap': onGameTap(el.dataset.char, el.dataset.target === '1', el); break;
      case 'replay': replay(); break;
      case 'level-pick': {
        var lv = parseInt(el.dataset.level, 10);
        var prog = getProgress();
        var highest = (state.selectedCategory === 'grade') ? (prog.highestGrade || 1) : (prog.highestLevel || 1);
        if (lv <= highest) {
          state.selectedLevel = lv;
          var label = (state.selectedCategory === 'grade') ? GRADE_LEVELS[lv - 1].name : (lv + '级');
          showView('home'); renderHome();
          mascotSay('已选：' + label + '，去抓字吧！', '🎯');
        }
        break;
      }
      case 'speak-char': Speech.speak(el.dataset.char); break;
    }
  }

  // ---------- 首页 ----------
  function renderHome() {
    var p = getProgress();
    var sec = document.getElementById('view-home');
    var selLabel = (state.selectedCategory === 'grade') ? GRADE_LEVELS[state.selectedLevel - 1].name : (state.selectedLevel + '级');
    sec.innerHTML =
      '<div class="hero">' +
        '<div class="mascot-big" id="home-mascot">🦊</div>' +
        '<h1>识字冒险岛</h1>' +
        '<p class="subtitle">听音测评 · 抓字</p>' +
      '</div>' +
      '<div class="progress-card">' +
        '<div class="pc-item"><span class="pc-num">' + p.highestLevel + '</span><span class="pc-label">字频级别</span></div>' +
        '<div class="pc-item"><span class="pc-num">' + p.bestScore + '</span><span class="pc-label">最高分</span></div>' +
        '<div class="pc-item"><span class="pc-num">' + p.bestCombo + '</span><span class="pc-label">最高连击</span></div>' +
      '</div>' +
      '<div class="btn-col">' +
        '<button class="btn btn-primary" data-action="go-assess">🎯 开始测评（听音选字）</button>' +
        '<button class="btn btn-game" data-action="go-game">🎮 开始抓字</button>' +
        '<button class="btn btn-ghost" data-action="go-level">🗺️ 选择级别（当前：' + selLabel + '）</button>' +
      '</div>' +
      '<p class="hint">小提示：点字就能听到发音哦～</p>';
  }

  // ---------- 测评（听音选字） ----------
  function startAssess() {
    var prog = getProgress();
    var level = Math.min(Math.max(prog.highestLevel, 1), LEVEL_COUNT);
    var questions = samplePool(levelChars(level), ASSESS_QUESTIONS);
    state.assess = { level: level, questions: questions, index: 0, correct: 0, answer: null };
    showView('assess');
    renderAssessQuestion();
  }
  function renderAssessQuestion() {
    var a = state.assess;
    var q = a.questions[a.index];
    var sec = document.getElementById('view-assess');
    var pct = (a.index / ASSESS_QUESTIONS) * 100;
    var opts = shuffle([q].concat(pickDistractors(q, 3)));
    var optHtml = '';
    for (var j = 0; j < opts.length; j++) {
      optHtml += '<button class="opt" data-action="assess-answer" data-val="' + opts[j] + '">' + opts[j] + '</button>';
    }
    a.answer = q;
    sec.innerHTML =
      '<div class="quiz-head">' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="quiz-count">第 ' + (a.index + 1) + ' / ' + ASSESS_QUESTIONS + ' 题 · 识字测评</div>' +
      '</div>' +
      '<div class="quiz-body">' +
        '<button class="assess-speaker" data-action="speak-char" data-char="' + q + '">🔊</button>' +
        '<button class="speak-big" data-action="speak-char" data-char="' + q + '">🔊 听一听</button>' +
        '<p class="quiz-tip">听到哪个字？点出来！</p>' +
        '<div class="opt-grid">' + optHtml + '</div>' +
      '</div>';
    Speech.speak(q);
  }
  function onAssessAnswer(val, el) {
    if (el && el.disabled) return;
    var a = state.assess;
    var correct = (val === a.answer);
    var opts = document.querySelectorAll('#view-assess .opt');
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].dataset.val === a.answer) opts[i].classList.add('correct');
      if (!correct && opts[i].dataset.val === val) opts[i].classList.add('wrong');
      opts[i].disabled = true;
    }
    if (correct) { a.correct++; mascotPraise(); confettiBurst(16); }
    else { mascotSay('再想想~', '🤔'); }
    setTimeout(function () {
      a.index++;
      if (a.index >= ASSESS_QUESTIONS) finishAssess();
      else renderAssessQuestion();
    }, correct ? 850 : 1300);
  }
  function finishAssess() {
    var a = state.assess;
    var rate = a.correct / ASSESS_QUESTIONS;
    var prog = getProgress();
    var suggested = Math.min(LEVEL_COUNT, Math.max(1, Math.round(rate * LEVEL_COUNT)));
    var estimated = suggested * PER_LEVEL;
    var saveObj = { lastAssess: new Date().toISOString(), assessedLevel: suggested, highestLevel: Math.max(prog.highestLevel, suggested) };
    Storage.save(saveObj);
    state.result = {
      mode: 'assess',
      title: '测评完成！',
      lines: [
        '答对 ' + a.correct + ' / ' + ASSESS_QUESTIONS + ' 题',
        '你大约认识 <b>' + estimated + '</b> 个字',
        '建议从第 <b>' + suggested + '</b> 级开始'
      ],
      praise: suggested >= 20 ? '识字小高手！' : (suggested >= 10 ? '进步飞快！' : '继续加油哦！')
    };
    renderResult();
    showView('result');
  }

  // ---------- 游戏（抓字） ----------
  function stopGame() {
    var g = state.game;
    if (g) {
      if (g.spawnTimer) clearTimeout(g.spawnTimer);
      if (g.tickTimer) clearInterval(g.tickTimer);
      g.running = false;
    }
  }
  function startGame(category, level) {
    stopGame();
    state.selectedCategory = category; state.selectedLevel = level;
    var pool = getPool(category, level);
    state.game = {
      category: category, level: level, pool: pool,
      score: 0, combo: 0, lives: 3, timeLeft: GAME_DURATION,
      spawnTimer: null, tickTimer: null, falling: [], running: true
    };
    showView('game');
    renderGameHud();
    Sound.init(); Sound.resume();
    Speech.speak('开始');
    spawnRound();
    state.game.tickTimer = setInterval(tick, 1000);
  }
  function tick() {
    var g = state.game;
    if (!g || !g.running) return;
    g.timeLeft--;
    updateTime();
    if (g.timeLeft <= 0) endGame();
  }
  function renderGameHud() {
    var g = state.game;
    var sec = document.getElementById('view-game');
    sec.innerHTML =
      '<div class="game-hud">' +
        '<div class="hud-lives" id="hud-lives">' + repeat('❤️', g.lives) + '</div>' +
        '<div class="hud-time" id="hud-time">⏱ ' + g.timeLeft + 's</div>' +
        '<div class="hud-score">分 <b id="hud-score">' + g.score + '</b></div>' +
      '</div>' +
      '<div class="game-target">' +
        '<span class="gt-label">抓：</span><span class="gt-char" id="gt-char">？</span>' +
        '<button class="speak-small" id="gt-speak" data-action="speak-char" data-char="？">🔊</button>' +
        '<div class="gt-sub" id="gt-sub">点中听到的字</div>' +
      '</div>' +
      '<div class="game-field" id="game-field"></div>';
  }
  function updateTime() {
    var t = document.getElementById('hud-time');
    if (t) t.textContent = '⏱ ' + Math.max(0, state.game.timeLeft) + 's';
  }
  function repeat(s, n) { var r = ''; for (var i = 0; i < n; i++) r += s; return r; }
  function spawnRound() {
    var g = state.game;
    if (!g.running) return;
    var gt = document.getElementById('gt-char');
    var sp = document.getElementById('gt-speak');
    var field = document.getElementById('game-field');
    var fieldW = field.clientWidth || 320;

    // ---- 抓字：听音 → 汉字下落，点中听到的字 ----
    var target = samplePool(g.pool, 1)[0];
    var correctVal = target;
    var tiles = shuffle([target].concat(pickDistractors(target, 2 + randInt(2))));
    var speakText = target;

    if (gt) gt.textContent = '？';
    if (sp) sp.dataset.char = speakText;
    if (speakText) Speech.speak(speakText);

    var n = tiles.length;
    for (var i = 0; i < n; i++) {
      var c = tiles[i];
      var el = document.createElement('div');
      el.className = 'falling-char';
      el.dataset.action = 'game-tap';
      el.textContent = c;
      el.dataset.char = '';
      el.dataset.target = (c === correctVal) ? '1' : '0';
      var x = (fieldW / (n + 1)) * (i + 1) - 24;
      el.style.left = Math.max(4, Math.min(fieldW - 52, x)) + 'px';
      var dur = Math.max(3.0, 6.8 - g.score / 150);
      el.style.animationDuration = dur + 's';
      field.appendChild(el);
      var obj = { el: el, char: c, target: (c === correctVal), endTime: Date.now() + dur * 1000, dead: false };
      g.falling.push(obj);
      (function (o) { el.addEventListener('animationend', function () { onFallEnd(o); }); })(obj);
    }
    var interval = Math.max(1100, 3000 - g.score / 100);
    g.spawnTimer = setTimeout(spawnRound, interval);
  }
  function onFallEnd(obj) {
    var g = state.game;
    if (!g || obj.dead) return;
    obj.dead = true;
    try { obj.el.remove(); } catch (e) {}
    g.falling = g.falling.filter(function (o) { return o !== obj; });
    if (obj.target) loseLife('miss');
  }
  function onGameTap(char, isTarget, el) {
    var g = state.game;
    if (!g || !g.running) return;
    var obj = null;
    for (var i = 0; i < g.falling.length; i++) if (g.falling[i].el === el) obj = g.falling[i];
    if (!obj || obj.dead) return;
    obj.dead = true;
    if (isTarget) {
      g.combo++;
      g.score += 10 + Math.min(g.combo, 20) * 2;
      el.classList.add('pop-correct');
      Sound.chime();
      mascotPraise();
      if (g.combo % 5 === 0) confettiBurst(22);
    } else {
      g.combo = 0;
      el.classList.add('pop-wrong');
      Sound.wrong();
      loseLife('wrong');
    }
    try { el.style.animation = 'none'; } catch (e) {}
    setTimeout(function () { try { obj.el.remove(); } catch (e2) {} }, 200);
    g.falling = g.falling.filter(function (o) { return o !== obj; });
    updateHud();
  }
  function loseLife(reason) {
    var g = state.game;
    g.lives--;
    g.combo = 0;
    updateHud();
    if (reason === 'miss') mascotSay('哎呀，漏掉啦', '😢');
    else mascotSay('点错啦', '😢');
    if (g.lives <= 0) endGame();
  }
  function updateHud() {
    var g = state.game;
    var lv = document.getElementById('hud-lives');
    var sc = document.getElementById('hud-score');
    var cb = document.getElementById('hud-combo');
    if (lv) lv.textContent = repeat('❤️', Math.max(0, g.lives));
    if (sc) sc.textContent = g.score;
    if (cb) cb.textContent = g.combo > 1 ? ('连击 ' + g.combo) : '';
    updateTime();
  }
  function endGame() {
    var g = state.game;
    g.running = false;
    if (g.spawnTimer) clearTimeout(g.spawnTimer);
    if (g.tickTimer) clearInterval(g.tickTimer);
    for (var i = 0; i < g.falling.length; i++) { try { g.falling[i].el.remove(); } catch (e) {} }
    g.falling = [];
    var prog = getProgress();
    var isRecord = g.score >= prog.bestScore;
    var saveObj = {
      bestScore: Math.max(prog.bestScore, g.score),
      bestCombo: Math.max(prog.bestCombo, g.combo)
    };
    if (g.category === 'grade') saveObj.highestGrade = Math.max(prog.highestGrade || 1, g.level);
    else saveObj.highestLevel = Math.max(prog.highestLevel || 1, g.level);
    Storage.save(saveObj);
    state.result = {
      mode: 'game',
      title: '游戏结束',
      lines: [
        '抓字 · 本局得分 <b>' + g.score + '</b>',
        '最高连击 <b>' + g.combo + '</b>',
        isRecord ? '新纪录！🎉' : '再接再厉！'
      ],
      praise: g.score > 200 ? '抓字小天才！' : (g.score > 80 ? '越来越棒！' : '多玩几次更厉害！')
    };
    renderResult();
    showView('result');
  }

  // ---------- 级别（字频 / 年级 双类别） ----------
  function renderLevel() {
    var prog = getProgress();
    var cat = state.selectedCategory;
    var sec = document.getElementById('view-level');
    var cells = '';
    if (cat === 'grade') {
      var hg = prog.highestGrade || 1;
      for (var i2 = 0; i2 < GRADE_LEVELS.length; i2++) {
        var lv2 = i2 + 1;
        var unlockedG = lv2 <= hg;
        var gg = GRADE_LEVELS[i2];
        var sampleG = unlockedG ? gg.chars.slice(0, 4).join(' ') : '🔒';
        cells += lvCell(lv2, gg.name, sampleG, unlockedG);
      }
    } else {
      var hf = prog.highestLevel || 1;
      for (var j = 1; j <= LEVEL_COUNT; j++) {
        var unlocked2 = j <= hf;
        var sample2 = unlocked2 ? levelChars(j).slice(0, 4).join(' ') : '🔒';
        cells += lvCell(j, j + '级', sample2, unlocked2);
      }
    }
    var unlockedCount = (cat === 'grade') ? (prog.highestGrade || 1) : (prog.highestLevel || 1);
    var total = (cat === 'grade') ? GRADE_LEVELS.length : LEVEL_COUNT;
    var title = (cat === 'grade') ? '按年级选择' : '按字频选择';
    sec.innerHTML =
      '<div class="cat-toggle">' +
        '<button class="cat-btn ' + (cat === 'freq' ? 'on' : '') + '" data-action="level-cat" data-cat="freq">按字频分</button>' +
        '<button class="cat-btn ' + (cat === 'grade' ? 'on' : '') + '" data-action="level-cat" data-cat="grade">按年级分</button>' +
      '</div>' +
      '<h2 class="lv-title">' + title + '</h2>' +
      '<div class="lv-grid">' + cells + '</div>' +
      '<p class="hint">已解锁 ' + unlockedCount + ' / ' + total + '</p>';
  }
  function lvCell(lv, label, sample, unlocked) {
    return '<button class="lv-cell ' + (unlocked ? '' : 'locked') + '" data-action="level-pick" data-level="' + lv + '"' + (unlocked ? '' : ' disabled') + '>' +
      '<span class="lv-num">' + label + '</span>' +
      '<span class="lv-sample">' + sample + '</span>' +
    '</button>';
  }

  // ---------- 结果 ----------
  function replay() {
    if (state.result && state.result.mode === 'assess') startAssess();
    else startGame(state.selectedCategory, state.selectedLevel);
  }
  function renderResult() {
    var r = state.result;
    var sec = document.getElementById('view-result');
    var lines = '';
    for (var i = 0; i < r.lines.length; i++) lines += '<p>' + r.lines[i] + '</p>';
    var isAssess = (r.mode === 'assess');
    var replayLabel = isAssess ? '再测一次' : '再玩一次';
    sec.innerHTML =
      '<div class="result-card">' +
        '<div class="mascot-big">' + (isAssess ? '🤩' : '🏆') + '</div>' +
        '<h2>' + r.title + '</h2>' +
        '<div class="result-lines">' + lines + '</div>' +
        '<p class="result-praise">' + r.praise + '</p>' +
        '<div class="btn-col">' +
          '<button class="btn btn-primary" data-action="replay">' + replayLabel + '</button>' +
          '<button class="btn btn-game" data-action="go-game">🎮 去抓字</button>' +
          '<button class="btn btn-ghost" data-action="go-home">🏠 回家</button>' +
        '</div>' +
      '</div>';
  }

  // ---------- 趣味反馈 ----------
  function mascotSay(text, emoji) {
    var m = document.getElementById('home-mascot');
    if (m && emoji) m.textContent = emoji;
    var el = document.getElementById('mascot-toast');
    if (!el) return;
    el.innerHTML = '<span class="mt-emoji">' + (emoji || '🦊') + '</span><span class="mt-text">' + text + '</span>';
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 1400);
  }
  function mascotPraise() {
    var praises = [['真棒！', '🤩'], ['厉害！', '😎'], ['好厉害！', '🤩'], ['太棒啦！', '😍']];
    var p = praises[randInt(praises.length)];
    mascotSay(p[0], p[1]);
  }
  function confettiBurst(n) {
    var layer = document.getElementById('confetti-layer');
    if (!layer) return;
    var colors = ['#FF8C42', '#4ECDC4', '#95E1A3', '#FFD93D', '#FF6B9D'];
    for (var i = 0; i < n; i++) {
      var d = document.createElement('div');
      d.className = 'confetti';
      d.style.left = (Math.random() * 100) + '%';
      d.style.background = colors[randInt(colors.length)];
      d.style.animationDelay = (Math.random() * 0.3) + 's';
      d.style.animationDuration = (0.9 + Math.random() * 0.6) + 's';
      layer.appendChild(d);
      (function (node) { setTimeout(function () { node.remove(); }, 1800); })(d);
    }
  }

  // ---------- 初始化 ----------
  function init() {
    Speech.init();
    var back = document.getElementById('btn-back');
    if (back) back.addEventListener('click', function () {
      if (state.view !== 'home') { stopGame(); showView('home'); renderHome(); }
    });
    renderHome();
    showView('home');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
