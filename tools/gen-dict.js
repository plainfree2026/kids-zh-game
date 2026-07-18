const fs = require('fs');
const path = require('path');
const chars = require('togscc/data/characters.json');
const { pinyin } = require('pinyin-pro');

const TOP = 3000;
const isHan = (c) => /[一-鿿]/.test(c);
const list = chars.filter(isHan).slice(0, TOP);

const dict = {};
const missing = [];
for (const c of list) {
  const py = pinyin(c, { toneType: 'symbol', type: 'string' }).trim();
  if (!py) { missing.push(c); continue; }
  dict[c] = py;
}

const out = path.resolve(__dirname, '../data/dict.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(dict));

console.log('源字表长度:', list.length);
console.log('字典条目数:', Object.keys(dict).length);
console.log('缺拼音字:', missing.length, missing.slice(0, 20).join(''));
const keys = Object.keys(dict);
console.log('抽样:', keys.slice(0, 12).map((k) => `${k}:${dict[k]}`).join('  '));
console.log('末样:', keys.slice(-12).map((k) => `${k}:${dict[k]}`).join('  '));
