// 从 catalog-data.js 生成产品主数据（data/products.json + docs/product-index.md）
// 用法: node scripts/build_product_db.js
// 分类规则改动后重新运行即可，两份输出文件都是生成物，不要手改。

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const window = {};
eval(fs.readFileSync(path.join(ROOT, "catalog-data.js"), "utf8"));
const catalog = window.CATALOG;

// 统一分类体系（合理分类的唯一定义处）。
// 规则从上到下依次匹配，先命中先得。
// test(text, name)：text = 名称+原始分组 小写拼接；name = 仅名称小写。
// 电源盒必须在套装之前、且只看名称——否则会被 "C53 Kit" 这类分组值带偏。
const TAXONOMY = [
  { id: "power",     label: "电源",        test: (_, n) => /power box|power module|电源盒|电源模块/.test(n) },
  { id: "kit",       label: "核心套装",    test: (s) => /\bkit\b|套装/.test(s) },
  { id: "mdvr",      label: "主机 / MDVR", test: (s) => /mdvr|\bx3n|\bx1n|\bm1n-|record host|主机/.test(s) },
  { id: "cable",     label: "线材",        test: (s) => /cable|wire|harness|线/.test(s) },
  { id: "screen",    label: "屏幕",        test: (s) => /screen|monitor\b|屏/.test(s) },
  { id: "alarm",     label: "报警与提醒",  test: (s) => /\bb2\b|\bb3\b|alarm|speaker|notifier|buzzer|报警|蜂鸣|喇叭|振动器/.test(s) },
  { id: "camera",    label: "摄像头",      test: (s) => /camera|\bdms\b|\bbsd\b|revers|\bipc\b|\bahd\b|\bca\d+|\bc29|surveillance|镜头|摄像|监控/.test(s) },
  { id: "storage",   label: "存储",        test: (s) => /micro sd|\bssd\b|storage|存储卡?/.test(s) },
  { id: "gps",       label: "GPS / 定位",  test: (s) => /gps|inertial|惯导|定位/.test(s) },
  { id: "mount",     label: "支架与安装",  test: (s) => /bracket|screw|sunshade|mount|wrench|\btool\b|支架|螺丝|遮阳|扳手|工具/.test(s) },
  { id: "maintain",  label: "维护与标定",  test: (s) => /maintenance|calibrat|router adapter|dongle|标定|维护/.test(s) },
  { id: "misc",      label: "其他配件",    test: () => true },
];

function classify(item) {
  const name = String(item.name || "").toLowerCase();
  const text = `${name} ${String(item.group || "").toLowerCase()}`;
  for (const rule of TAXONOMY) {
    if (rule.test(text, name)) return rule.id;
  }
  return "misc";
}

function clean(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

const items = [];
const skuIndex = {};
for (const line of catalog.productLines) {
  for (const it of line.items) {
    const category = classify(it);
    items.push({
      productLine: line.id,
      sheetName: clean(line.sheetName),
      rowNumber: it.rowNumber,
      sku: it.partNumber,
      name: clean(it.name),
      group: clean(it.group),
      category,
      quantity: it.quantity || "",
      isDiagram: Boolean(it.isDiagram),
      images: (it.images || []).length,
    });
    if (it.partNumber) {
      (skuIndex[it.partNumber] ||= []).push(`${line.id}#row${it.rowNumber}`);
    }
  }
}

const db = {
  generatedFrom: "catalog-data.js（源头是 North America Sales List.xlsx）",
  generatedBy: "scripts/build_product_db.js",
  generatedAt: new Date().toISOString(),
  taxonomy: TAXONOMY.map((t) => ({ id: t.id, label: t.label })),
  productLines: catalog.productLines.map((p) => ({
    id: p.id,
    sheetName: clean(p.sheetName),
    itemCount: p.items.length,
    solutionCount: (p.solutions || []).length,
  })),
  itemCount: items.length,
  uniqueSkuCount: Object.keys(skuIndex).length,
  items,
  skuIndex,
};

fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "data", "products.json"), JSON.stringify(db, null, 2), "utf8");

// ---- 人可读索引 docs/product-index.md ----
const labelOf = Object.fromEntries(TAXONOMY.map((t) => [t.id, t.label]));
const lines = [];
lines.push("# 产品主数据索引（生成物，勿手改）");
lines.push("");
lines.push(`> 由 \`scripts/build_product_db.js\` 从 \`catalog-data.js\` 生成，机器可读版在 \`data/products.json\`。`);
lines.push(`> 更新方式：改 Excel → 重新生成 catalog-data.js → \`node scripts/build_product_db.js\`。`);
lines.push("");
lines.push(`共 **${db.productLines.length} 条产品线 / ${db.itemCount} 个物料 / ${db.uniqueSkuCount} 个去重 SKU**。`);
lines.push("");
lines.push("## 产品线总览");
lines.push("");
lines.push("| 产品线 id | Excel 工作表 | 物料数 | 方案数 | 知识库文档 |");
lines.push("| --- | --- | --- | --- | --- |");
const KB_DOC = {
  adplus20: "knowledge/adplus-2.0.md", m1n20: "knowledge/m1n-2.0.md", m3n: "knowledge/m3n.md",
  c6lite20: "knowledge/c6-lite-2.0.md", avm: "knowledge/avm.md", z5: "knowledge/z5.md",
  "960c53": "knowledge/960c53.md", "966c46ipc": "knowledge/966c46-ipc.md",
  gt1prodcmax: "knowledge/gt1-pro-dc-max.md", f6n: "knowledge/f6n.md",
  accessories: "knowledge/accessories.md",
  forkliftsolutionwaterproofc4: "knowledge/forklift-waterproof-c46.md",
};
for (const p of db.productLines) {
  const doc = KB_DOC[p.id] ? `[有](${KB_DOC[p.id]})` : "**缺**";
  lines.push(`| ${p.id} | ${p.sheetName} | ${p.itemCount} | ${p.solutionCount} | ${doc} |`);
}
lines.push("");

for (const p of catalog.productLines) {
  lines.push(`## ${clean(p.sheetName)}（\`${p.id}\`）`);
  lines.push("");
  const byCat = new Map();
  for (const it of items.filter((i) => i.productLine === p.id)) {
    if (!byCat.has(it.category)) byCat.set(it.category, []);
    byCat.get(it.category).push(it);
  }
  for (const t of TAXONOMY) {
    const list = byCat.get(t.id);
    if (!list || !list.length) continue;
    lines.push(`### ${t.label}（${list.length}）`);
    lines.push("");
    lines.push("| 行号 | SKU | 名称 | 原始分组 |");
    lines.push("| --- | --- | --- | --- |");
    for (const it of list) {
      const name = it.name.length > 60 ? it.name.slice(0, 60) + "…" : it.name;
      lines.push(`| ${it.rowNumber} | ${it.sku} | ${name} | ${it.group} |`);
    }
    lines.push("");
  }
}

lines.push("## 跨产品线复用的 SKU");
lines.push("");
lines.push("同一 SKU 出现在多条产品线（改价格/停产时都要检查）：");
lines.push("");
lines.push("| SKU | 出现位置 |");
lines.push("| --- | --- |");
let sharedCount = 0;
for (const [sku, refs] of Object.entries(skuIndex)) {
  const linesOfSku = new Set(refs.map((r) => r.split("#")[0]));
  if (linesOfSku.size > 1) {
    lines.push(`| ${sku} | ${refs.join(", ")} |`);
    sharedCount++;
  }
}
if (!sharedCount) lines.push("| （无） | |");
lines.push("");

fs.writeFileSync(path.join(ROOT, "docs", "product-index.md"), lines.join("\n"), "utf8");

// 控制台报告
const catCount = {};
for (const it of items) catCount[it.category] = (catCount[it.category] || 0) + 1;
console.log("分类分布:");
for (const t of TAXONOMY) console.log(`  ${t.label}: ${catCount[t.id] || 0}`);
console.log(`跨产品线复用 SKU: ${sharedCount}`);
console.log("已生成 data/products.json 与 docs/product-index.md");
