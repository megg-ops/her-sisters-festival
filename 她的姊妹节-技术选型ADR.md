# 《她的姊妹节》技术选型 ADR

> 文档版本：v0.1（2026-08-28）
> 状态：除标注「待拍板」的条目外均为已定决策
> 上位约束：PRD §17 技术假设、§16 无障碍、§18 验收标准；贵客松提交要求（可访问 URL、评委现场可玩）
> 迁移对象：`她的姊妹节-demo.html`（1526 行单文件白盒原型，点击式交互，无角色移动）

---

## ADR-001 工程形态：Vite + TypeScript，不引入 UI 框架

**状态**：已定
**背景**：现原型是单文件 HTML + 内联 JS。随场景、对白、小游戏、AI 问答增长，单文件不可维护；但 48h 内引入框架的迁移与学习成本必须权衡。
**决策**：
- 构建工具：**Vite**（零配置、TS 开箱、产物静态）。
- 语言：**TypeScript**（状态与场景数据结构多，类型防错收益高）。
- **不用** React/Vue/Svelte：本项目是数据驱动的场景切换 + 少量组件，DOM 直出足够；框架带来的路由/状态库收益小于其成本。
- 组件复用：`.impeccable/design.json` 的预制 CSS 直接平移为 `src/styles/`。
**备选与否决理由**：单文件继续堆叠（不可维护，8 场景 + 5 套问答必爆）；Preact（多一层心智，无明显速度收益）。
**后果**：所有 UI 手写，但换来最小依赖面与部署简单；design.json 组件 CSS 是唯一组件样式来源，防止风格漂移。

## ADR-002 渲染方案：DOM/CSS 分层 + 绝对定位热点，不引入 Canvas 与游戏引擎

**状态**：已定
**背景**：PRD §17 允许 DOM/CSS 与 Canvas 组合，但明确"不为 MVP 新增大型游戏引擎"。本作无自由移动、无碰撞、无镜头跟随（重构任务单已确认不做 WASD）。
**决策**：
- 场景 = 背景图 `<div>` + 立绘层 `<img>`（绝对定位、固定站位）+ 热点按钮层（代码叠加，不烘焙进图，DESIGN.md）。
- 转场、蒸汽、织纹噪点 = CSS 动画 / SVG。
- 人物换装 = 透明 PNG 层叠（同一素体锚点，z-index 分层）。
**后果**：无障碍（真实 button、焦点、字幕）几乎零成本达成，符合 §16；放弃的是粒子类效果，MVP 不需要。

## ADR-003 状态管理：单会话内存状态 + localStorage 仅存偏好

**状态**：已定
**背景**：PRD §14.1 定义会话状态；§18.3 明确"刷新页面＝重新开始并给出提示"，无需持久化剧情进度。
**决策**：
- 剧情状态（`mealComplete`/`outfitComplete`/`dialogueComplete`/`moodColor`/`outfitChoices`/`askedObjects`/`echoText`/`giftIntent`）全部内存态，`state.ts` 单一来源，`initialState()` 工厂复位。
- `localStorage` 只存：音量/字幕/减少动态偏好（重新体验时保留，PRD §15）。
- 不用 Redux/状态库；场景与任务进度由状态推导渲染（延续 demo 的 `renderTasks` 模式）。
**后果**："再体验一次"＝重新调用 `initialState()`，天然满足连续演示复位要求；刷新丢失进度是已声明的设计而非缺陷。

## ADR-004 AI 服务：Vercel Serverless 代理 + 6 秒超时 + 本地预设兜底

**状态**：模型选择**待拍板**，架构已定
**背景**：PRD §17 要求密钥不出服务端；§8.4 规定超时/离线兜底矩阵。本机模型盘点（2026-08-28）：dashscope 文本模型在清单内多为过期预览；openai-next 网关整体 2026-08-31 失效——覆盖 8/29 提交与 8/30 现场评审，赛后失效由预设兜底承接。
**决策**：
- 架构：前端 `fetch /api/ask`（与 `/api/echo`）→ Vercel Serverless Function（Node runtime）→ 上游网关；密钥只存在于 Vercel 环境变量。
- **推荐模型：`qwen3-max`（经 openai-next 网关，OpenAI 兼容协议）**——中文文化语境表现好、协议接入最省；回声诗同模型。
- 超时：服务端 6s 硬超时；前端并行持有该物件的预设回答，超时即无缝切换并打「离线资料」标签（剧情文档 §3.6）。
- 输入防护：长度限制、不复述不当输入（预设话术兜底），不做画像（PRD §14.2）。
**备选**：gemini-3.5-flash（快但中文文化细节弱于 qwen）；dashscope 直连（清单内文本模型状态不稳，赛后如需长期运营再评估）。
**运维步骤**：Vercel 项目环境变量配置 `AI_GATEWAY_KEY`（我提供值，你在 Vercel 控制台填入，密钥不进仓库）。

## ADR-005 知识库：仓库内结构化 JSON，前后端同构读取

**状态**：已定
**背景**：PRD §9.1 规定知识条目字段；离线兜底要求前端本地可读。
**决策**：
- `src/data/knowledge.json`：条目含 `id`、主题、适用场景、已审核事实、边界、来源机构/标题/链接、审核状态。首批 5 物件 ×3 问直接取自剧情文本 §三。
- 前端构建时内联（离线兜底与来源抽屉展示）；Serverless 端同文件作为回答上下文注入提示词（检索式：按物件 id 取条目，不做向量库）。
- 审核状态字段未过审的一律显示"原型资料 · 待当地复核"（DESIGN.md 抽屉规范）。
**后果**：无外部数据库依赖，知识条目可进 git 评审流；将来扩条目只需加 JSON。

## ADR-006 部署：Vercel（静态 SPA + Serverless Functions 同仓）

**状态**：已定
**背景**：提交要求"可直接访问的 URL"；Freya 有 Vercel 账号。
**决策**：
- 仓库即部署源：Vite 输出 `dist/` 为静态站，`api/*.ts` 自动成为 Functions；GitHub 仓库连接 Vercel，main 分支自动部署。
- 域名用 Vercel 免费子域即可（`her-sisters-festival.vercel.app` 类似）。
- **展位保底**：另用 `vite-plugin-singlefile` 出一个单文件构建存 `standby/`，展位断网时本地双击可玩（AI 走预设兜底，体验完整）。此项列为 P1，时间不够可砍。
**运维步骤**：你在 Vercel 导入 `megg-ops/her-sisters-festival`（Import → 框架自动识别 Vite），环境变量按 ADR-004 配置。

## ADR-007 资产格式与加载

**状态**：已定
**背景**：DESIGN.md 要求导出 AVIF/WebP；现场网络不稳。
**决策**：
- 生图原图存 `assets/`（带同名 `.md` 记录，不随前端部署）；前端用图存 `public/assets/`，**WebP 为主**（AVIF 编码慢、时间紧，正式期再补）。
- 首屏只加载封面 + S1；进入室内前预加载 A3/A4/B 组（`<link rel=preload>` 或 JS 预载），转场遮罩遮盖加载间隙。
- 单图 ≤500KB 红线，超出就压缩重导。

## ADR-008 迁移路径：按模块从 demo.html 抽取，不就地改造

**状态**：已定
**背景**：单文件 1526 行继续就地改会越改越脆；但其交互逻辑（点击热点、任务检查、三段做饭、换装步骤、抽屉）已验证过。
**决策**：demo.html 保留在仓库作参考实现，新代码按下表抽取重写，抽完一个场景验证一个：

| 新模块 | 来源（demo.html） | 备注 |
|---|---|---|
| `src/state.ts` | `initialState()` / `state` | 扩展 PRD §14.1 全字段 |
| `src/ui/dialogue.ts` | `narrate` / `npcSay` / `bubbleAdvance` | 气泡与对话带双通道，遵循重构任务单 §1.3 |
| `src/ui/hotspots.ts` + `tasks.ts` | `renderTasks` 与热点 DOM | 六态 + 键盘焦点 |
| `src/scenes/s0..s7.ts` | 各场景渲染片段 | 数据驱动：热点/对白/入口配置化，对白取自剧情文本 |
| `src/minigames/meal.ts` | `renderMeal` | 三步状态机，容错逻辑按剧情文档 S3 |
| `src/minigames/outfit.ts` | `renderOutfit` | 五层结构（demo 现为两层，按 PRD §8.3 扩） |
| `src/ai/client.ts` | 新增 | `/api/ask` + 超时兜底 |
| `api/ask.ts` / `api/echo.ts` | 新增 | Serverless 代理 |

**后果**：迁移期两份代码并存，以重构任务单 §四 验收标准为合并门槛；旧文件在 S0–S7 全部迁移并验收后移入 `archive/`。

---

## 目录结构（ADR-001/008 汇总）

```
her-sisters-festival/
├─ api/                    # Vercel Serverless
│  ├─ ask.ts               # 文化问答代理（6s 超时）
│  └─ echo.ts              # 回声诗生成
├─ src/
│  ├─ main.ts
│  ├─ state.ts
│  ├─ styles/              # design.json 平移
│  ├─ ui/                  # dialogue/hotspots/tasks/drawer/toast
│  ├─ scenes/              # s0.ts … s7.ts
│  ├─ minigames/           # meal.ts outfit.ts
│  ├─ ai/client.ts
│  └─ data/knowledge.json
├─ public/assets/          # 部署用图（WebP）
├─ assets/                 # 生图原图 + 资产记录 .md（不部署）
└─ （现有文档 + demo.html 参考实现）
```

## 待拍板清单

1. **AI 模型**：推荐 `qwen3-max`（openai-next 网关）。同意即开工；如你想用其他家模型，架构不变只换网关配置。
2. **展位单文件保底包**（ADR-006 P1 项）：做/砍。
3. Vercel 项目导入需要你登录操作（或告诉我你已登录 Vercel CLI，我来连）。
