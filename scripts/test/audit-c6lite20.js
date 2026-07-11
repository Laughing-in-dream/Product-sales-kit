// C6 Lite 2.0 walkthrough audit. Run: node scripts/test/audit-c6lite20.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { makeDocument } = require("./dom-stub");
const ROOT = path.join(__dirname, "..", "..");
const sandbox = { console, window: { confirm: () => true }, document: makeDocument(), Blob: class Blob {}, URL: { createObjectURL() { return "blob:audit"; }, revokeObjectURL() {} }, setTimeout, clearTimeout };
vm.createContext(sandbox);
for (const rel of ["catalog-data.js", "js/01-bootstrap-i18n.js", "js/02-dom-state.js", "js/03-data-adplus.js", "js/04-product-meta.js", "js/05-selection-logic.js", "js/06-cart.js", "js/07-render-common.js", "js/08-logic-mseries.js", "js/09-render-avm-c6.js", "js/10-render-mseries.js", "js/11-render-adplus.js", "js/12-main.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), sandbox, { filename: rel });
const g = (expr) => vm.runInContext(expr, sandbox);
const out = ["# C6 Lite 2.0 向导审计报告", "", "> 自动验证核心套装、电源线、单/双镜头摄像机限制、R-Watch 与存储规则。", ""];
const issues = [];
const check = (ok, text, level = "bug") => { out.push(`- ${ok ? "✅" : level === "warn" ? "🟡" : "❌"} ${text}`); if (!ok) issues.push({ level, text }); };
const selected = (sku) => g(`selectedPresetItems().some(item => item.partNumber === ${JSON.stringify(sku)})`);
const set = (expr) => g(expr);

set("chooseProduct('c6lite20'); state.productPickerOpen = false; state.step = 1; render()");
const dual = g("c6Items([7])[0]");
const single = g("c6Items([8])[0]");
check(Boolean(dual && single), "单镜头与双镜头核心套装均存在");

set(`choosePackage(${JSON.stringify(dual.id)}); state.step = 3; render()`);
for (const camera of g("c6Items([20,21,22])")) {
  set(`state.selections[${JSON.stringify(camera.id)}] = { checked: true, quantity: '1', c6ExtRow: '16' }; normalizeC6Selections()`);
}
check(g("c6Items([20,21,22]).every(item => !state.selections[item.id]?.checked)"), "双镜头套装自动取消所有额外摄像机");

set(`choosePackage(${JSON.stringify(single.id)}); state.step = 3`);
const cameras = g("c6Items([20,21,22])");
set(`state.selections[${JSON.stringify(cameras[0].id)}] = { checked: true, quantity: '1', c6ExtRow: '17' }; state.selections[${JSON.stringify(cameras[1].id)}] = { checked: true, quantity: '1', c6ExtRow: '18' }; normalizeC6Selections()`);
check(g("c6Items([20,21,22]).filter(item => state.selections[item.id]?.checked).length") === 1, "单镜头套装最多保留 1 个额外摄像机");
check(selected("1260011100208"), "选择额外摄像机时自动带 AHD 视频拓展线");
check(selected("1260010100357"), "所选摄像机的 AHD 延长线进入清单");

set("state.step = 2; state.c6 = { powerModel: 'rs232' }; const rs = c6Items([10])[0]; setM3nPresetSelection(rs.id, true); render()");
check(selected("1261090100095"), "RS232 电源线进入清单");
set("const rw = c6Items([23])[0]; state.selections[rw.id] = { checked: true, quantity: '1' }; c6Items([10,11]).forEach(item => state.selections[item.id].checked = false); state.c6 = { powerModel: 'can' }; const can = c6Items([12])[0]; setM3nPresetSelection(can.id, true); normalizeC6Selections(); render()");
check(!selected("5190067100051"), "CAN 模式下 R-Watch 被自动排除");
const kitGroups = [dual, single].map(item => String(item.group || ""));
check(kitGroups.some(group => /CAN/i.test(group)), "当前可售清单含 CAN 核心套装；否则 CAN 电源线选择缺少对应主机", "warn");

set("state.step = 4; const sd = c6Items([24])[0]; state.selections[sd.id] = { checked: true, quantity: '1', variantPartNumber: '1610002100007' }; render()");
check(selected("1610002100007"), "可选 Micro SD 容量料号进入清单");
out.push("", `审计完成：🔴 ${issues.filter(issue => issue.level === 'bug').length} 个疑似 bug，🟡 ${issues.filter(issue => issue.level === 'warn').length} 个提醒`);
fs.writeFileSync(path.join(ROOT, "docs", "test-reports", "c6lite20-walkthrough.md"), out.join("\n"), "utf8");
console.log(`审计完成: 🔴 ${issues.filter(issue => issue.level === 'bug').length} 个疑似 bug，🟡 ${issues.filter(issue => issue.level === 'warn').length} 个提醒`);
console.log("报告: docs/test-reports/c6lite20-walkthrough.md");
process.exitCode = issues.some(issue => issue.level === "bug") ? 1 : 0;
