const fs = require('fs');
const path = require('path').join(__dirname, 'index.html');
const code = fs.readFileSync(path, 'utf8').match(/<script>([\s\S]*)<\/script>/)[1];

function run(storageBlocked) {
  const els = {};
  const makeEl = () => ({
    value: '', textContent: '', innerHTML: '', placeholder: '', dataset: {},
    children: [],
    classList: { add() {}, remove() {}, toggle() {} },
    focus() {}, addEventListener() {},
    appendChild(c) { this.children.push(c); },
    querySelectorAll() { return []; },
    querySelector() { return { textContent: '' }; },
    onclick: null
  });
  const store = {};
  global.document = {
    getElementById(id) { if (!els[id]) els[id] = makeEl(); return els[id]; },
    createElement() { return makeEl(); }
  };
  global.localStorage = {
    getItem(k) { return k in store ? store[k] : null; },
    setItem(k, v) { if (storageBlocked) throw new Error('SecurityError: storage blocked'); store[k] = String(v); },
    removeItem(k) { delete store[k]; }
  };
  global.clearTimeout = () => {};
  global.setTimeout = () => {};
  eval(code + `
    ;globalThis.__t = {
      add(v) { document.getElementById('amountInput').value = v; document.getElementById('noteInput').value = '测试'; addRecord(); },
      addInvalid(v) { document.getElementById('amountInput').value = v; addRecord(); },
      clickSubmit(v) { document.getElementById('amountInput').value = v; document.getElementById('submitBtn').onclick(); },
      total() { return document.getElementById('monthTotal').textContent; },
      count() { return document.getElementById('monthCount').textContent; },
      listHtml() { return document.getElementById('list').innerHTML; },
      storageOk() { return storage.available; }
    };`);
  return globalThis.__t;
}

console.log('=== 场景1：localStorage 被禁（模拟当前预览环境）===');
let t = run(true);
t.clickSubmit('35');
console.log('点"记一笔" 35 元  -> 本月合计:', t.total(), '|', t.count(), '| 列表含记录:', t.listHtml().indexOf('餐饮') !== -1);
t.addInvalid('0');
console.log('输入 0 再点        -> 合计保持:', t.total(), '（应拒绝且不变）');
t.add('12.5');
console.log('再记 12.5         -> 本月合计:', t.total());
t.add('');
console.log('空金额再点        -> 本月合计:', t.total(), '（应保持 47.50）');

console.log('');
console.log('=== 场景2：localStorage 正常（模拟部署后环境）===');
t = run(false);
t.clickSubmit('35');
console.log('点"记一笔" 35 元  -> 本月合计:', t.total(), '|', t.count(), '| 列表含记录:', t.listHtml().indexOf('餐饮') !== -1);
t.add('12.5');
console.log('再记 12.5         -> 本月合计:', t.total());
