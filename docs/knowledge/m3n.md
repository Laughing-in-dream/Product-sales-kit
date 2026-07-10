# M3N（产品线 id: `m3n`）

> M 系列 MDVR 方案，向导流程与 M1N 2.0 同构。

## 1. 方案构成

- 向导流程：选场景方案 → 接线 → 摄像头 → 可选件 → 导出
- 步骤对应 Excel 行号见 `js/04-product-meta.js: M3N_STEP_ROWS`

## 2. 硬性规则（既是知识也是限制）

| # | 规则 | 状态 | 来源 | 代码位置 |
| --- | --- | --- | --- | --- |
| 1 | 最大支持 **4 路 IPC + 4 路 AHD** | ⚠️ 推断自代码 | 代码反推 | `js/04-product-meta.js: M_SERIES_CHANNEL_RULES` |

## 3. 选配关系

- 摄像头延长线行号：AHD → rows 24-27，IPC → rows 28-30（`M3N_CAMERA_EXTENSION_ROWS`）。

## 4. 关键 SKU

见 `catalog-data.js`（M3N 产品线）。

## 5. 待确认问题

- [ ] 4 路 IPC + 4 路 AHD 是否为同时上限？
- [ ] 各场景方案的单选/多选规则尚未结构化。
