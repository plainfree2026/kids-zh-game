const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, '识字游戏.html'), 'utf8');

const errors = [];
// 注入 mock TTS 引擎：jsdom 本身没有 speechSynthesis，若不注入则 Speech.supported=false，
// 所有 speak 会静默走 fallback，测试永远无法发现“真实不发音”的问题。
function installMockTTS(window) {
  window.__speakCalls = [];
  let _speaking = false, _paused = false, _pending = false;
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  window.speechSynthesis = {
    getVoices: function () { return [{ lang: 'zh-CN', name: 'Mock Mandarin', voiceURI: 'mock', default: true }]; },
    speak: function (u) {
      window.__speakCalls.push(u.text);
      _speaking = true; _pending = false;
      if (u.onstart) { try { u.onstart(); } catch (e) {} }
      setTimeout(function () { _speaking = false; if (u.onend) { try { u.onend(); } catch (e) {} } }, 5);
    },
    cancel: function () { window.__speakCalls.push('__cancel__'); _speaking = false; _pending = false; },
    pause: function () { _paused = true; },
    resume: function () { _paused = false; },
    get speaking() { return _speaking; },
    get paused() { return _paused; },
    get pending() { return _pending; }
  };
}
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  beforeParse: function (window) { installMockTTS(window); }
});
const w = dom.window;
w.addEventListener('error', (e) => errors.push('window error: ' + (e.error && e.error.stack || e.message)));
const D = w.document;
function $(s) { return D.querySelector(s); }
function $all(s) { return Array.prototype.slice.call(D.querySelectorAll(s)); }
function assert(c, m) { if (!c) { console.error('ASSERT FAIL: ' + m); process.exit(1); } else console.log('✓ ' + m); }

setTimeout(run, 150);

function run() {
  try {
    assert($('#view-home .progress-card'), '首页进度卡渲染');
    assert(JSON.parse(w.localStorage.getItem('shizi_progress_v1') || '{}'), 'localStorage 可读');
    assert(!$('[data-action="go-pinyin"]'), '首页已无「开始抓拼音」按钮(拼音内容已删除)');
    assert(!$('#view-home .pure-toggle'), '首页已无纯拼音开关(拼音内容已删除)');
    assert(!$all('#view-home .seg-btn').length, '首页已无测评模式切换(拼音测评已删除)');
    assert($('[data-action="go-game"]'), '首页有「开始抓字」按钮');
    assert($('[data-action="go-assess"]'), '首页有「开始测评」按钮');

    // 测评流程（识字测评：听音选字）
    $('[data-action="go-assess"]').click();
    assert($('#view-assess').classList.contains('active'), '测评视图激活');
    assert($all('#view-assess .opt').length === 4, '第1题4个选项');
    assert($('#view-assess .assess-speaker'), '听音选字显示喇叭按钮');
    assert(!$('#assess-char'), '听音选字不显示答案汉字(靠听做题)');
    assert(w.__speakCalls.length >= 1, '听音选字已真正触发语音播报(speak 被调用) count=' + w.__speakCalls.length);

    let steps = 0;
    (function step() {
      if ($('#view-result').classList.contains('active')) { afterAssess(); return; }
      if (steps++ > 400) { console.error('测评未在预期步数内完成'); process.exit(1); }
      const o = $all('#view-assess .opt');
      if (o.length && !o[0].disabled) o[0].click();
      setTimeout(step, 120);
    })();
  } catch (err) { console.error('TEST EXCEPTION:', err.stack); process.exit(1); }
}

function afterAssess() {
  try {
    assert($('#view-result').classList.contains('active'), '测评后结果页激活');
    const p = JSON.parse(w.localStorage.getItem('shizi_progress_v1'));
    assert(p.highestLevel >= 1, 'highestLevel 已存: ' + p.highestLevel);
    assert(p.assessedLevel >= 1, 'assessedLevel 已存: ' + p.assessedLevel);
    assert(!('highestPinyin' in p), '存储中已无 highestPinyin(拼音内容已删除)');

    // 抓字游戏 + 60秒倒计时
    $('[data-action="go-game"]').click();
    assert($('#view-game').classList.contains('active'), '抓字游戏视图激活');
    setTimeout(() => {
      assert($('#hud-time'), '计时器 HUD 存在');
      assert(/60s/.test($('#hud-time').textContent), '倒计时初始为 60s: ' + $('#hud-time').textContent);
      assert($('#hud-lives'), '命数 HUD 存在');
      assert($('#gt-char') && $('#gt-char').textContent === '？', '抓字模式顶部不泄露答案字(显示？而非汉字): ' + ($('#gt-char') && $('#gt-char').textContent));
      const fc = $all('#view-game .falling-char');
      assert(fc.length >= 1, '下落字已生成: ' + fc.length);
      const target = fc.filter(function (c) { return c.dataset.target === '1'; })[0] || fc[0];
      const before = parseInt($('#hud-score').textContent, 10) || 0;
      target.click();
      const after = parseInt($('#hud-score').textContent, 10) || 0;
      assert(after > before, '点中目标字得分增加 before=' + before + ' after=' + after);

      // 级别视图：字频默认 30 级
      $('[data-action="go-home"]').click();
      $('[data-action="go-level"]').click();
      const cells = $all('#view-level .lv-cell');
      assert(cells.length === 30, '字频模式 30 个级别格, got ' + cells.length);
      assert($all('#view-level .lv-cell:not(.locked)').length >= 1, '字频至少 1 级解锁');

      // 切换到年级类别
      const gradeBtn = $all('#view-level .cat-btn').filter(function (b) { return b.dataset.cat === 'grade'; })[0];
      assert(gradeBtn, '存在「按年级分」切换按钮');
      gradeBtn.click();
      const gCells = $all('#view-level .lv-cell');
      assert(gCells.length === 12, '年级模式 12 个册格, got ' + gCells.length);
      assert(/一年级上/.test(gCells[0].textContent), '首册为一年级上: ' + gCells[0].textContent.trim());

      // 确认级别视图已无「按拼音分」类别
      const pyBtn = $all('#view-level .cat-btn').filter(function (b) { return b.dataset.cat === 'pinyin'; })[0];
      assert(!pyBtn, '级别视图已无「按拼音分」类别(拼音内容已删除)');

      assert(w.__speakCalls.length >= 3, '全流程语音播报被真实调用多次(非静默) count=' + w.__speakCalls.length);

      console.log('\n=== 全部断言通过 ===');
      console.log('运行期捕获错误数:', errors.length);
      errors.forEach((e) => console.log(e));
      process.exit(errors.length ? 2 : 0);
    }, 400);
  } catch (err) { console.error('AFTER-ASSESS EXCEPTION:', err.stack); process.exit(1); }
}
