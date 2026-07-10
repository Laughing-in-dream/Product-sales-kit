# North America Sales Configurator

面向北美销售的产品选型向导（纯前端，无构建步骤，双击 index.html 即可运行）。

## 文件地图

| 路径 | 作用 | 可否手改 |
| --- | --- | --- |
| `index.html` | 页面骨架 | ✅ |
| `app.js` | 向导交互 + 全部业务规则（约 4400 行） | ✅ |
| `styles.css` | 样式 | ✅ |
| `catalog-data.js` | 物料数据，由脚本从 Excel 生成 | ❌ 禁止手改，改 Excel 后重新生成 |
| `scripts/extract_catalog.py` | Excel → catalog-data.js 生成脚本 | ✅ |
| `North America Sales List.xlsx` | 物料清单源数据（钉钉导出） | 数据源 |
| `North America Sales List-FILE/` | 各产品线图片库 | 资源 |
| `docs/knowledge/` | **产品需求知识库（唯一需求真相）** | ✅ 规则变更必须先改这里 |

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

## 已知技术债

- `app.js` 单文件过大（约 4400 行），8 个产品线的逻辑混在一起，后续可按产品线拆分模块。
- Excel 里的业务规则未完全结构化（单选/多选分组），目前靠"推荐预选 + 人工确认"。
- `docs/knowledge/` 中大量规则状态为"⚠️ 推断自代码"，需逐条人工确认。
