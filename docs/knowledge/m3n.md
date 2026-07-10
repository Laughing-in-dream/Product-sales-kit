# M3N（产品线 id: `m3n`）

> M 系列 MDVR 方案，向导流程与 M1N 2.0 同构。

## 1. 方案构成

- 向导流程：选场景方案 → 接线 → 摄像头 → 可选件 → 导出
- 步骤对应 Excel 行号见 `js/04-product-meta.js: M3N_STEP_ROWS`

## 2. 硬性规则（既是知识也是限制）

| # | 规则 | 状态 | 来源 | 代码位置 |
| --- | --- | --- | --- | --- |
| 1 | 最大支持 **4 路 IPC + 4 路 AHD** | ⚠️ 推断自代码 | 代码反推 | `js/04-product-meta.js: M_SERIES_CHANNEL_RULES` |
| 2 | 扬声器仅提供 Speaker A（SKU 5190015100004），选中后自动带 Speaker Adapter Cable（SKU 1260011000026） | ✅ 已确认 | 用户 2026-07-10 确认 | `js/08-logic-mseries.js: m3nOptionalChildRows()` |
| 3 | DP7S 屏幕（SKU 5190012100075）选中后自动带 AHD Signal Adapter Cable（SKU 1210010100059），并必须选择一条 AHD 延长线（rows 24-27） | ✅ 已确认 | 用户 2026-07-10 确认 | `js/08-logic-mseries.js` |
| 4 | 每个 B2（SKU 5090091100025 / 5090091100026）都必须选择一条 IPC 延长线（rows 28-30）；1 个 / 2 个 B2 分别自动匹配单路 / 三合一 B2 适配线 | ✅ 已确认 | 用户 2026-07-10 确认 | `js/06-cart.js` |

## 3. 选配关系

- 摄像头延长线行号：AHD → rows 24-27，IPC → rows 28-30（`M3N_CAMERA_EXTENSION_ROWS`）。
- DP7S 也使用 AHD 延长线 rows 24-27；B2 使用 IPC 延长线 rows 28-30。

## 4. 关键 SKU

见 `catalog-data.js`（M3N 产品线）。

## 5. 待确认问题

- [ ] 4 路 IPC + 4 路 AHD 是否为同时上限？
- [ ] 各场景方案的单选/多选规则尚未结构化。
