# North America Sales Configurator

面向北美销售的产品选型向导（纯前端，无构建步骤，双击 index.html 即可运行）。

> 本文件是所有 AI 编码工具（Claude Code / Codex / Cursor 等）**共同遵守的唯一工程约定**。
> CLAUDE.md 只是指向这里的指针，不要往那边写内容。

## 多 Agent 协作规矩

1. **开工前先看 `git log --oneline -10` 和 `git status`**，了解其他 agent 刚做了什么、
   有没有未提交的改动。有未提交改动时先问用户，不要直接覆盖或提交别人的半成品。
2. **每完成一个完整任务就 commit**，不要留大量未提交状态给下一个 agent。
3. **不要两个 agent 同时改同一批文件**（尤其 js/ 和 docs/knowledge/），用户负责串行调度。
4. 各工具的会话内记忆互不相通——**一切需要跨会话/跨工具传递的信息都必须落在
   本文件、docs/knowledge/ 或 commit 信息里**，不要指望"上次聊过"。

## 文件地图

| 路径 | 作用 | 可否手改 |
| --- | --- | --- |
| `index.html` | 页面骨架 + 脚本加载顺序（js/01 → js/12，顺序不可调换） | ✅ |
| `js/` | 应用代码，按加载顺序编号的 12 个普通 script（共享全局作用域，非 ES module） | ✅ |
| `styles.css` | 样式 | ✅ |
| `catalog-data.js` | 物料数据，由脚本从 Excel 生成 | ❌ 禁止手改，改 Excel 后重新生成 |
| `scripts/extract_catalog.py` | Excel → catalog-data.js 生成脚本 | ✅ |
| `North America Sales List.xlsx` | 物料清单源数据（钉钉导出） | 数据源 |
| `North America Sales List-FILE/` | 各产品线图片库 | 资源 |
| `docs/knowledge/` | **产品需求知识库（唯一需求真相）** | ✅ 规则变更必须先改这里 |
| `data/products.json` | 产品主数据库：205 个产品（SKU 去重），含分类/线长/分辨率/图片路径/usedBy（哪些产品线在用） | ❌ 生成物 |
| `docs/product-index.md` | 产品主数据的人可读索引 | ❌ 生成物 |
| `scripts/build_product_db.js` | catalog-data.js → 产品主数据 生成脚本（分类规则在这里改） | ✅ |
| `assets/products/` | 手动补图目录：照片按 `<SKU>.png` 命名放入即被数据库收录 | ✅ |
| `data/image-overrides.json` | 补图通道2：SKU → 项目内已有图片路径 | ✅ |

## 铁律（每次会话必须遵守）

1. **改任何业务规则前，先读 `docs/knowledge/` 里对应产品的文档。**
   产品限制（如"AD Plus 2.0 + Standard 电源盒最多 1 路 IPC + 1 路 AHD"）都记录在那里，
   代码实现必须与知识库一致。
2. **新需求先写进知识库，再改代码；两者放在同一个 commit。**
3. **所有文本文件一律 UTF-8（无 BOM）。** 用 PowerShell 写文件时必须显式指定
   `-Encoding utf8`，否则会写成 UTF-16 导致乱码。这是本项目历史乱码的主要来源。
4. `catalog-data.js` 是生成物，不要直接编辑；数据问题回溯到 Excel 或生成脚本。
5. 提交信息用中文，说明"改了哪条规则/哪个产品"，而不是只写"更新代码"。

## 重新生成数据

```powershell
python .\scripts\extract_catalog.py
```

（README 中记录了旧的 python 绝对路径，若本机 python 不可用可参考。）

## js/ 目录说明

原 4400 行的 app.js 已按原顺序无损拆分（2026-07-10，git 历史可查证逐字节一致）：

| 文件 | 内容 |
| --- | --- |
| `01-bootstrap-i18n.js` | catalog 引导 + 双语 UI 文案 |
| `02-dom-state.js` | DOM 引用、全局 state、文本/预览工具、SKU_LIBRARY |
| `03-data-adplus.js` | AD Plus 2.0 的 customCatalog（主机/电源盒/接线/配件数据） |
| `04-product-meta.js` | 各产品线步骤定义、行号映射、M 系列路数规则、PRODUCT_META |
| `05-selection-logic.js` | 场景/选择状态逻辑 + AD Plus 路数限制规则（cameraCapacityRule 等） |
| `06-cart.js` | 清单汇总（selectedPresetItems / selectedCustomItems） |
| `07-render-common.js` | 通用步骤渲染 + Z5 |
| `08-logic-mseries.js` | M 系列选择逻辑 |
| `09-render-avm-c6.js` | AVM / C6 Lite 渲染 |
| `10-render-mseries.js` | M 系列渲染 |
| `11-render-adplus.js` | AD Plus 渲染 |
| `12-main.js` | 总渲染、导出、语言切换、事件绑定、启动 |

**约束：** 这些是普通 script（非 ES module，为了保住"双击 index.html 直接跑"），
靠 index.html 中的加载顺序共享全局作用域。新增文件必须考虑顺序；
新增的顶层可执行语句只能引用更早文件里定义的变量。

## 已知技术债

- Excel 里的业务规则未完全结构化（单选/多选分组），目前靠"推荐预选 + 人工确认"。
- `docs/knowledge/` 中大量规则状态为"⚠️ 推断自代码"，需逐条人工确认。
