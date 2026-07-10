// 极简 DOM 桩：让向导代码在 Node 里跑起来（应用只用到
// getElementById / querySelector(All) / innerHTML / addEventListener / classList）。
// 渲染结果以 innerHTML 字符串形式留存，供审计脚本检查。

class FakeClassList {
  constructor() { this._set = new Set(); }
  add(...names) { names.forEach((n) => this._set.add(n)); }
  remove(...names) { names.forEach((n) => this._set.delete(n)); }
  toggle(name, force) {
    const has = force !== undefined ? !force : this._set.has(name);
    if (has) this._set.delete(name); else this._set.add(name);
    return this._set.has(name);
  }
  contains(name) { return this._set.has(name); }
}

class FakeElement {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.innerHTML = "";
    this.textContent = "";
    this.value = "";
    this.checked = false;
    this.disabled = false;
    this.href = "";
    this.download = "";
    this.style = {};
    this.dataset = {};
    this.classList = new FakeClassList();
    this.children = [];
  }
  addEventListener() {}
  removeEventListener() {}
  setAttribute(name, value) { this[name] = value; }
  getAttribute(name) { return this[name] ?? null; }
  appendChild(child) { this.children.push(child); return child; }
  removeChild(child) { this.children = this.children.filter((c) => c !== child); return child; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  closest() { return null; }
  click() {}
  focus() {}
  scrollIntoView() {}
}

function makeDocument() {
  const byId = new Map();
  return {
    getElementById(id) {
      if (!byId.has(id)) byId.set(id, new FakeElement());
      return byId.get(id);
    },
    querySelector(selector) {
      if (!byId.has("sel:" + selector)) byId.set("sel:" + selector, new FakeElement());
      return byId.get("sel:" + selector);
    },
    querySelectorAll() { return []; },
    createElement(tag) { return new FakeElement(tag); },
    body: new FakeElement("body"),
    documentElement: new FakeElement("html"),
    addEventListener() {},
  };
}

module.exports = { makeDocument, FakeElement };
