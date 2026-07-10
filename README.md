# North America Sales Configurator

这是一个基于 `North America Sales List.xlsx` 自动生成的本地选型/购物车工具原型。

> 📚 **产品需求知识库在 [docs/knowledge/](docs/README.md)** —— 所有产品限制规则
> （如 AD Plus 2.0 的摄像头路数上限）以知识库为准，改规则前先看那里。
> 开发约定见 [AGENTS.md](AGENTS.md)（所有 AI 工具共同遵守）。

## 当前能力

- 按产品线浏览
- 按系统方案切换
- 自动预选与当前方案直接关联的物料
- 手动补充线材、配件和可选件
- 实时汇总购物车
- 导出 CSV / JSON 清单

## 生成数据

先用内置 Python 生成前端数据文件：

```powershell
& "C:\Users\wwkch\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" .\scripts\extract_catalog.py
```

生成后会得到 `catalog-data.js`。

## 打开方式

直接双击打开 [index.html](C:\Users\wwkch\Desktop\North America Sales List\index.html) 即可。

## 现阶段限制

- Excel 里的业务规则还没有完全结构化，尤其是某些分组到底应当单选还是多选。
- 当前版本先按“推荐预选 + 人工确认”的方式工作。
- 如果后续你们愿意补一层规则表，我可以把这个工具升级成真正的傻瓜式向导。
