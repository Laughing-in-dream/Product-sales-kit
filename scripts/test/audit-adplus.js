// AD Plus 2.0 向导全遍历审计
// 用法: node scripts/test/audit-adplus.js
// 在 Node 里加载真实的应用代码（DOM 用桩替代），沿着向导的每一步把所有选项
// 都点一遍，记录"每一步有什么、选了之后出现什么"，并用知识库规则判定疑似 bug。
// 输出: docs/test-reports/adplus20-walkthrough.md

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { makeDocument } = require("./dom-stub");

const ROOT = path.join(__dirname, "..", "..");

// ---------- 搭建沙箱并加载应用 ----------
const sandbox = {
  console,
  window: { confirm: () => true },
  document: makeDocument(),
  Blob: class Blob { constructor(parts) { this.parts = parts; } },
  URL: { createObjectURL(blob) { sandbox.__lastBlob = blob; return "blob:audit"; }, revokeObjectURL() {} },
  setTimeout, clearTimeout,
};
vm.createContext(sandbox);

const SCRIPTS = [
  "catalog-data.js",
  "js/01-bootstrap-i18n.js", "js/02-dom-state.js", "js/03-data-adplus.js",
  "js/04-product-meta.js", "js/05-selection-logic.js", "js/06-cart.js",
  "js/07-render-common.js", "js/08-logic-mseries.js", "js/09-render-avm-c6.js",
  "js/10-render-mseries.js", "js/11-render-adplus.js", "js/12-main.js",
];
for (const rel of SCRIPTS) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), sandbox, { filename: rel });
}
const g = (expr) => vm.runInContext(expr, sandbox);

// ---------- 报告与问题收集 ----------
const out = [];
const issues = [];
const seenIssues = new Set();
const say = (line = "") => out.push(line);
function flag(level, where, desc) {
  // 同一问题在多个电源盒分支下重复出现时只记一次
  if (seenIssues.has(level + desc)) return;
  seenIssues.add(level + desc);
  issues.push({ level, where, desc });
}

function imgExists(rel) { return fs.existsSync(path.join(ROOT, rel)); }
function itemByRow(row) { return g(`findItemByRow(${JSON.stringify(row)})`); }
function fmtItem(item) {
  if (!item) return "（行号解析失败）";
  const name = g("displayCatalogText")(item.name) || item.name;
  return `${String(name).split("\n")[0].slice(0, 40)}（SKU ${item.partNumber}）`;
}
function cableLen(item) { return g("extractCableLength")(item) || "?"; }

function checkRows(rows, where) {
  const found = [];
  for (const row of rows || []) {
    const item = itemByRow(row);
    if (!item || !item.partNumber) flag("bug", where, `行号 ${row} 在 catalog 里解析不到带 SKU 的物料`);
    else {
      found.push(item);
      if (!(item.images || []).length) {
        // catalog 无图时，页面还有 SKU_LIBRARY / 兜底预览图两道保险，都没有才算缺图
        const fallback = g("fallbackItemPreviewAsset")(item) || g("skuInfo")(item.partNumber)?.image || "";
        if (!fallback) flag("warn", where, `行 ${row} ${fmtItem(item)} 页面上没有任何图片（catalog 与兜底图均缺）`);
        else if (!imgExists(fallback)) flag("bug", where, `行 ${row} ${fmtItem(item)} 兜底图文件不存在: ${fallback}`);
      } else {
        for (const img of item.images) if (!imgExists(img)) flag("bug", where, `行 ${row} 图片文件不存在: ${img}`);
      }
    }
  }
  return found;
}

// 延长线长度顺序检查：选项应从短到长排列，乱序容易让销售选错
function checkLengthOrder(options, where, label) {
  const lens = options.map((o) => parseFloat(String(cableLen(o)).replace(/[^\d.]/g, ""))).filter((v) => !Number.isNaN(v));
  if (lens.length < 2) return;
  const sorted = [...lens].every((v, i, arr) => i === 0 || arr[i - 1] <= v);
  if (!sorted) flag("warn", where, `「${label}」的长度选项顺序异常: ${options.map(cableLen).join(" / ")}（未按从短到长排列，且默认选中第一项）`);
}

function renderOk(where) {
  try {
    g("render()");
    const html = g("wizardStageEl.innerHTML");
    if (!html || html.length < 50) flag("bug", where, `渲染输出异常（innerHTML 只有 ${html.length} 字符）`);
    return html;
  } catch (err) {
    flag("bug", where, `渲染抛异常: ${err.message}`);
    return "";
  }
}

// ---------- 开始遍历 ----------
say("# AD Plus 2.0 向导全遍历审计报告（生成物，勿手改）");
say("");
say(`> 由 \`node scripts/test/audit-adplus.js\` 生成。`);
say(`> 方法：在 Node 沙箱中加载真实应用代码，调用应用自身的交互函数遍历每个分支，`);
say(`> 并对照 docs/knowledge/adplus-2.0.md 的规则判定。`);
say("");

g("chooseProduct('adplus20')");
g("state.productPickerOpen = false");

// ===== 步骤 2：主机 =====
g("state.step = 2");
renderOk("步骤2-主机");
const hosts = g("customCatalog.hosts");
say(`## 步骤 2 · 选主机（共 ${hosts.length} 种）`);
say("");
for (const host of hosts) {
  say(`- **${host.title.en}**：${host.detail.en}`);
  if (!imgExists(host.image)) flag("bug", "步骤2-主机", `${host.id} 主机图片不存在: ${host.image}`);
  for (const [pb, row] of Object.entries(host.packageRows)) {
    const kit = itemByRow(row);
    if (!kit || !kit.partNumber) flag("bug", "步骤2-主机", `${host.id} + ${pb} 套装行号 ${row} 解析失败`);
    else say(`  - 搭配 ${pb} 电源盒 → 套装 ${fmtItem(kit)}`);
  }
}
say("");

// ===== 步骤 3：电源盒 =====
const powerBoxes = g("customCatalog.powerBoxes");
say(`## 步骤 3 · 选电源盒（共 ${powerBoxes.length} 种）`);
say("");
for (const pb of powerBoxes) say(`- **${pb.title.en}**：${pb.detail.en}`);
say("");

// ===== 步骤 4：接线（逐电源盒） =====
say(`## 步骤 4 · 选接线方式（逐电源盒遍历）`);
say("");
const wiringModes = g("customCatalog.wiringModes");
for (const pb of powerBoxes) {
  g(`setCustomHost('dual'); setCustomPowerBox('${pb.id}')`);
  g("state.step = 4");
  renderOk(`步骤4-接线-${pb.id}`);
  const defaultWiring = Object.entries(g("state.custom.wiring")).filter(([, v]) => v).map(([k]) => k);
  say(`### ${pb.title.en}`);
  say(`- 默认勾选: ${defaultWiring.join(", ") || "（无）"}`);
  for (const mode of wiringModes) {
    const support = mode.support[pb.id];
    if (!support) { say(`- ${mode.title.en}: 不支持`); continue; }
    const sku = g(`customWiringSku('${mode.id}', '${pb.id}')`);
    if (support === "builtin") say(`- ${mode.title.en}: 套装内置，无需单独物料`);
    else {
      const row = mode.rows?.[pb.id];
      const item = row ? itemByRow(row) : null;
      if (!item || !item.partNumber) flag("bug", `步骤4-${pb.id}`, `${mode.title.en} 行号 ${row} 解析失败`);
      say(`- ${mode.title.en}: 需要物料 ${fmtItem(item)}${sku && sku !== item?.partNumber ? `（另有专用 SKU ${sku}）` : ""}`);
    }
    const preview = g(`customWiringPreview('${mode.id}', '${pb.id}')`);
    if (preview && !imgExists(preview)) flag("bug", `步骤4-${pb.id}`, `${mode.title.en} 预览图不存在: ${preview}`);
  }
  say("");
}

// ===== 步骤 5：摄像头 / 视频组合（逐电源盒） =====
say(`## 步骤 5 · 选摄像头与屏幕（逐电源盒遍历）`);
say("");
const KB_RULE = {
  standard: { maxIpc: 1, maxAhd: 1, desc: "最多 1 路 IPC + 1 路 AHD（知识库规则 1）" },
  plus:     { maxIpc: 1, maxAhd: 1, desc: "最多 1 路 IPC + 1 路 AHD（知识库规则 1）" },
  max:      { maxIpc: 1, maxAhdWithIpc: 3, maxAhdOnly: 4, desc: "最多 1 IPC + 3 AHD，或 4 AHD（知识库规则 2）" },
};

for (const pb of powerBoxes) {
  g(`resetCustomState(); setCustomHost('dual'); setCustomPowerBox('${pb.id}')`);
  g("state.step = 5");
  renderOk(`步骤5-${pb.id}`);
  const visible = g("orderedCustomAccessories()");
  say(`### ${pb.title.en}（可见 ${visible.length} 项）`);
  say("");
  for (const acc of visible) {
    const title = acc.title?.en || acc.title?.zh || acc.id;
    const kind = acc.cameraType ? acc.cameraType.toUpperCase() + " 摄像头" : "非摄像头项";
    say(`- **${title}**（${kind}${acc.allowedPowerBoxes ? `，仅 ${acc.allowedPowerBoxes.join("/")}` : ""}）`);
    // 主件行号与图片
    if (acc.itemRow) checkRows([acc.itemRow], `步骤5-${pb.id}-${acc.id}`);
    // 勾选后出现的延长线
    g(`toggleCustomAccessory('${acc.id}', true)`);
    const st = g(`ensureAccessoryState('${acc.id}')`);
    if (acc.extensionRows?.length) {
      const options = checkRows(acc.extensionRows, `步骤5-${pb.id}-${acc.id}-延长线`);
      const lens = options.map((o) => cableLen(o)).join(" / ");
      const defaultPicked = options.find((o) => o.id === st.extension);
      say(`  - 勾选后出现「${acc.extensionLabel?.zh || "延长线"}」选择，共 ${options.length} 种（${lens}）` +
          `${acc.lockExtension ? "，锁定不可换" : `，默认 ${defaultPicked ? cableLen(defaultPicked) : "未选"}`}`);
      if (!st.extension) flag("warn", `步骤5-${pb.id}-${acc.id}`, "勾选后没有自动选中默认延长线");
      checkLengthOrder(options, `步骤5-${acc.id}`, acc.extensionLabel?.zh || acc.id + " 延长线");
    }
    if (acc.secondaryExtensionRows?.length) {
      const options = checkRows(acc.secondaryExtensionRows, `步骤5-${pb.id}-${acc.id}-第二延长线`);
      say(`  - 另出现「${acc.secondaryExtensionLabel?.zh || "第二延长线"}」，共 ${options.length} 种（${options.map(cableLen).join(" / ")}）`);
    }
    const maxQty = g(`maxAccessoryQuantity(${JSON.stringify(acc.id)} && customCatalog.accessories.find(a=>a.id===${JSON.stringify(acc.id)}))`);
    if (acc.cameraType) say(`  - 当前可选数量上限: ${maxQty}`);
    g(`toggleCustomAccessory('${acc.id}', false)`);
  }
  say("");

  // --- 容量规则压力测试 ---
  say(`**容量规则验证**（${KB_RULE[pb.id].desc}）：`);
  say("");
  const rule = KB_RULE[pb.id];
  const ipcAcc = visible.find((a) => a.cameraType === "ipc");
  const ahdAccs = visible.filter((a) => a.cameraType === "ahd");
  if (rule.maxAhd !== undefined) {
    // Standard / Plus：1 IPC + 1 AHD
    g(`toggleCustomAccessory('${ipcAcc.id}', true)`);
    g(`toggleCustomAccessory('${ahdAccs[0].id}', true)`);
    let status = g("cameraCapacityStatus()");
    say(`- 选 1 IPC + 1 AHD 后：IPC 剩余 ${status.ipcRemaining}、AHD 剩余 ${status.ahdRemaining}，警告=「${status.warning || "无"}」`);
    if (status.ipcRemaining !== 0 || status.ahdRemaining !== 0) flag("bug", `容量-${pb.id}`, `1+1 后剩余额度应为 0/0，实际 ${status.ipcRemaining}/${status.ahdRemaining}`);
    if (status.warning) flag("bug", `容量-${pb.id}`, `恰好达到上限时不应出现超限警告，实际出现:「${status.warning}」`);
    const secondAhdDisabled = g(`isAccessoryChoiceDisabled(customCatalog.accessories.find(a=>a.id==='${ahdAccs[1].id}'))`);
    say(`- 此时再选第二路 AHD（${ahdAccs[1].id}）：${secondAhdDisabled ? "✅ 被禁用" : "❌ 未被禁用"}`);
    if (!secondAhdDisabled) flag("bug", `容量-${pb.id}`, "超出 1 AHD 上限时第二路 AHD 未被禁用");
    // 强行把数量改成 2
    g(`setCustomAccessoryQuantity('${ahdAccs[0].id}', 2)`);
    const clamped = g(`ensureAccessoryState('${ahdAccs[0].id}')`).quantity;
    say(`- 强行把 AHD 数量改为 2：实际被${Number(clamped) <= 1 ? "钳制回 " + clamped + " ✅" : "接受为 " + clamped + " ❌"}`);
    if (Number(clamped) > 1) flag("bug", `容量-${pb.id}`, `数量钳制失效：AHD 数量可以被设为 ${clamped}`);
  } else {
    // PBM：1 IPC + 3 AHD 或 4 AHD
    g(`toggleCustomAccessory('${ipcAcc.id}', true)`);
    for (const a of ahdAccs.slice(0, 3)) g(`toggleCustomAccessory('${a.id}', true)`);
    let counts = g("selectedCameraCounts()");
    let status = g("cameraCapacityStatus()");
    say(`- 选 1 IPC + ${counts.ahd} AHD 后：剩余 IPC ${status.ipcRemaining} / AHD ${status.ahdRemaining}，警告=「${status.warning || "无"}」`);
    if (counts.ahd !== 3) flag("warn", `容量-${pb.id}`, `预期能选满 3 路 AHD，实际只选上 ${counts.ahd} 路（可能因每种摄像头限 1 个且 AHD 种类不足）`);
    if (status.warning) flag("bug", `容量-${pb.id}`, `1 IPC + ${counts.ahd} AHD 合规组合出现警告:「${status.warning}」`);
    // 0 IPC + 4 AHD
    g(`resetCustomState(); setCustomHost('dual'); setCustomPowerBox('${pb.id}')`);
    for (const a of ahdAccs) g(`toggleCustomAccessory('${a.id}', true)`);
    counts = g("selectedCameraCounts()");
    status = g("cameraCapacityStatus()");
    say(`- 不选 IPC、全选 AHD（${counts.ahd} 路）后：警告=「${status.warning || "无"}」，此时 IPC 剩余 ${status.ipcRemaining}`);
    if (counts.ahd >= 4 && status.ipcRemaining !== 0) flag("bug", `容量-${pb.id}`, "已 4 路 AHD 时 IPC 应剩 0");
    const ipcDisabled = g(`isAccessoryChoiceDisabled(customCatalog.accessories.find(a=>a.id==='${ipcAcc.id}'))`);
    if (counts.ahd >= 4) say(`- 4 路 AHD 时再选 IPC：${ipcDisabled ? "✅ 被禁用" : "❌ 未被禁用"}`);
    if (counts.ahd >= 4 && !ipcDisabled) flag("bug", `容量-${pb.id}`, "4 AHD 时 IPC 未被禁用");
  }
  say("");
}

// ===== 步骤 6：可选件（逐电源盒） =====
say(`## 步骤 6 · 可选件（逐电源盒遍历）`);
say("");
for (const pb of powerBoxes) {
  g(`resetCustomState(); setCustomHost('dual'); setCustomPowerBox('${pb.id}')`);
  g("state.step = 6");
  renderOk(`步骤6-${pb.id}`);
  const visible = g("visibleCustomOptionals()");
  say(`### ${pb.title.en}（可见 ${visible.length} 项）`);
  for (const opt of visible) {
    const title = opt.title?.en || opt.title?.zh || opt.id;
    say(`- **${title}**${opt.maxQuantity ? `（最多 ${opt.maxQuantity} 个）` : ""}`);
    if (opt.itemRow) checkRows([opt.itemRow], `步骤6-${pb.id}-${opt.id}`);
    if (opt.requiredRows?.length) {
      const req = checkRows(opt.requiredRows, `步骤6-${pb.id}-${opt.id}-必配件`);
      say(`  - 勾选后自动带出必配件: ${req.map(fmtItem).join("、")}`);
    }
    if (opt.extensionRows?.length) {
      const options = checkRows(opt.extensionRows, `步骤6-${pb.id}-${opt.id}-延长线`);
      say(`  - 延长线共 ${options.length} 种（${options.map(cableLen).join(" / ")}）${opt.lockExtension ? "，默认锁定第一种" : ""}`);
      checkLengthOrder(options, `步骤6-${opt.id}`, (opt.title?.zh || opt.id) + " 延长线");
      if (opt.lockExtension && options.length > 1) {
        flag("warn", `步骤6-${opt.id}`, `延长线被锁定为第一项（${cableLen(options[0])}），但实际有 ${options.length} 种长度可用——确认锁定是否是有意设计`);
      }
    }
    if (opt.maxQuantity) {
      g(`toggleCustomOptional('${opt.id}', true)`);
      g(`setOptionalQuantity('${opt.id}', ${opt.maxQuantity + 5})`);
      const qty = Number(g(`ensureOptionalState('${opt.id}')`).quantity);
      say(`  - 强行设置数量 ${opt.maxQuantity + 5} → 实际 ${qty} ${qty <= opt.maxQuantity ? "✅ 钳制生效" : "❌ 未钳制"}`);
      if (qty > opt.maxQuantity) flag("bug", `步骤6-${pb.id}-${opt.id}`, `数量上限 ${opt.maxQuantity} 未生效，可设为 ${qty}`);
      g(`toggleCustomOptional('${opt.id}', false)`);
    }
  }
  say("");
}

// R-Watch 互斥规则（知识库规则 7）
say(`**R-Watch 互斥验证**（知识库规则 7：Standard 电源盒 + CA42 拖挂转接 时不可选 R-Watch）：`);
g("resetCustomState(); setCustomHost('dual'); setCustomPowerBox('standard')");
g("toggleCustomAccessory('ca42', true); toggleAccessoryAddon('ca42', true)");
const rwatchDisabled = g("isOptionalDisabled(customCatalog.optionals.find(o=>o.id==='rwatch'))");
say(`- Standard + CA42 + 拖挂转接后，R-Watch ${rwatchDisabled ? "✅ 被禁用" : "❌ 仍可选"}`);
if (!rwatchDisabled) flag("bug", "步骤6-rwatch", "知识库规则 7 未生效：Standard+CA42拖挂 时 R-Watch 仍可选");
say("");

// ===== 步骤 7：清单与导出 =====
say(`## 步骤 7 · 清单汇总与导出（满配 PBM 方案）`);
say("");
g("resetCustomState(); setCustomHost('dual'); setCustomPowerBox('max')");
g("toggleCustomAccessory('c29n', true); toggleCustomAccessory('ca38', true); toggleCustomAccessory('screen', true)");
g("toggleCustomOptional('b2', true); toggleCustomOptional('b3', true); toggleCustomOptional('micro_sd', true)");
g("state.step = 7");
renderOk("步骤7-清单");
const items = g("selectedCustomItems()");
say(`满配方案共 ${items.length} 行物料：`);
say("");
const productsDb = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "products.json"), "utf8"));
const knownSkus = new Set(productsDb.products.map((p) => p.sku));
for (const it of items) {
  const name = String(g("displayCatalogText")(it.name) || it.name || "").split("\n")[0].slice(0, 45);
  say(`- ${it.partNumber || "❌ 无SKU"} × ${it.quantity || "?"} — ${name}`);
  if (!it.partNumber) flag("bug", "步骤7-清单", `清单行「${name}」没有 SKU`);
  else if (!knownSkus.has(String(it.partNumber).trim())) flag("warn", "步骤7-清单", `清单 SKU ${it.partNumber} 不在产品主数据库里（${name}）`);
  if (!it.quantity || Number(it.quantity) <= 0) flag("bug", "步骤7-清单", `${it.partNumber} 数量异常: ${it.quantity}`);
}
say("");
try {
  g("exportCsv()");
  const csv = sandbox.__lastBlob ? String(sandbox.__lastBlob.parts.join("")) : "";
  const csvRows = csv.trim().split("\n").length - 1;
  say(`CSV 导出：${csvRows} 行数据（清单 ${items.length} 行）${csvRows === items.length ? "✅ 一致" : "❌ 不一致"}`);
  if (csvRows !== items.length) flag("bug", "导出", `CSV 行数 ${csvRows} 与清单行数 ${items.length} 不一致`);
} catch (err) {
  flag("bug", "导出", `exportCsv 抛异常: ${err.message}`);
}
say("");

// ===== 静态资源全检 =====
const skuLib = g("SKU_LIBRARY");
for (const [sku, info] of Object.entries(skuLib)) {
  if (info.image && !imgExists(info.image)) flag("bug", "SKU_LIBRARY", `${sku} 图片不存在: ${info.image}`);
}
const suppl = g("SUPPLEMENTAL_PREVIEW_BY_PART");
for (const [sku, img] of Object.entries(suppl)) {
  if (typeof img === "string" && !imgExists(img)) flag("bug", "补充预览图", `${sku} 图片不存在: ${img}`);
}

// ===== 疑似 bug 汇总 =====
say(`## 疑似 Bug / 需要注意的问题（${issues.length} 条）`);
say("");
if (!issues.length) say("本次遍历未发现问题。");
const bugs = issues.filter((i) => i.level === "bug");
const warns = issues.filter((i) => i.level === "warn");
if (bugs.length) {
  say(`### 🔴 疑似 Bug（${bugs.length}）`);
  say("");
  bugs.forEach((i, n) => say(`${n + 1}. **[${i.where}]** ${i.desc}`));
  say("");
}
if (warns.length) {
  say(`### 🟡 提醒（${warns.length}）`);
  say("");
  warns.forEach((i, n) => say(`${n + 1}. **[${i.where}]** ${i.desc}`));
  say("");
}

fs.mkdirSync(path.join(ROOT, "docs", "test-reports"), { recursive: true });
const REPORT = path.join(ROOT, "docs", "test-reports", "adplus20-walkthrough.md");
fs.writeFileSync(REPORT, out.join("\n"), "utf8");
console.log(`审计完成: 🔴 ${bugs.length} 个疑似 bug, 🟡 ${warns.length} 个提醒`);
console.log(`报告: docs/test-reports/adplus20-walkthrough.md`);
process.exitCode = bugs.length ? 1 : 0;
