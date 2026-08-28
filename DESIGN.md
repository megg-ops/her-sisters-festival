---
name: "她的姊妹节"
description: "当代靛蓝织绘：以清晰交互亲历施洞苗族女孩的姊妹节一天"
colors:
  indigo-night: "oklch(18% 0.035 255)"
  indigo-ink: "oklch(24% 0.052 255)"
  indigo-cloth: "oklch(34% 0.073 257)"
  river-cyan: "oklch(52% 0.110 210)"
  river-cyan-bright: "oklch(72% 0.090 205)"
  madder-red: "oklch(48% 0.170 10)"
  madder-red-bright: "oklch(61% 0.190 15)"
  sun-ochre: "oklch(75% 0.130 84)"
  wood-dark: "oklch(28% 0.035 55)"
  wood-mid: "oklch(42% 0.045 58)"
  silver: "oklch(82% 0.015 245)"
  mist-white: "oklch(96% 0.006 250)"
  muted-text: "oklch(72% 0.014 250)"
  cloth-warm: "oklch(84% 0.035 85)"
  text-on-cloth: "oklch(15% 0.006 85)"
  danger: "oklch(63% 0.200 28)"
typography:
  display:
    fontFamily: "Source Han Serif SC, Noto Serif SC, Songti SC, STSong, serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Han Serif SC, Noto Serif SC, Songti SC, STSong, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Source Han Sans SC, Noto Sans SC, Microsoft YaHei, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Source Han Sans SC, Noto Sans SC, Microsoft YaHei, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Source Han Sans SC, Noto Sans SC, Microsoft YaHei, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.01em"
  caption:
    fontFamily: "Source Han Sans SC, Noto Sans SC, Microsoft YaHei, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.01em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  12: "48px"
components:
  button-primary:
    backgroundColor: "{colors.river-cyan}"
    textColor: "{colors.mist-white}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.indigo-cloth}"
    textColor: "{colors.mist-white}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.mist-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "44px"
  hotspot-action:
    backgroundColor: "{colors.river-cyan}"
    textColor: "{colors.mist-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 16px 10px 24px"
    height: "44px"
  task-panel:
    backgroundColor: "{colors.cloth-warm}"
    textColor: "{colors.text-on-cloth}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "20px"
    width: "320px"
  dialogue-band:
    backgroundColor: "{colors.indigo-night}"
    textColor: "{colors.mist-white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "18px 24px"
    width: "min(960px, calc(100vw - 48px))"
  text-input:
    backgroundColor: "{colors.indigo-ink}"
    textColor: "{colors.mist-white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    height: "48px"
---

# Design System: 她的姊妹节

> **合并说明（2026-08-28）**：本文档已并入 `她的姊妹节-视觉基调.md`（织物实现层：三层结构、CSS 纹理组件、生图提示词与生产纪律）。原文件已归档至 `archive/她的姊妹节-视觉基调.md`，仅供追溯，不再作为生产依据；`styles-v2/` 三张画风探索样张同一并归档至 `archive/styles-v2/`。此后设计决策以本文档为唯一权威来源。

## Overview

**Creative North Star: “当代靛蓝织绘（The Indigo Textile Stage）”**

本系统以 [B｜织物记忆](assets/ui-directions/B-textile-memory.png) 为唯一视觉基准。画面像一座由靛蓝布片、木楼结构和当代生活共同搭成的横向舞台：人物始终处在可理解的生活空间中，交互热点像缝在场景上的功能标签，但 UI 本身保持现代、清晰、克制。

“织物”是画面的材料语言，不是覆盖所有界面的主题皮肤。纹理主要存在于服饰、布料、场景边缘和转场遮罩；按钮、任务、字幕和输入框必须维持稳定的产品组件语法。整体以深靛蓝承载 50–60% 的视觉面积，木色提供真实生活基底，茜红和河青只用于叙事与交互焦点。

Demo 复刻 B 时必须保留其核心拓扑：16:9 横向舞台、左上任务面板、中央可见角色、分布在真实物件附近的热点标签、底部对话带。不得照搬 B 图中的英文、未经核验的纹样或过量装饰缝线。

**Key Characteristics:**

- 平面分层的 2D 织绘场景，不使用写实 3D 或照片拼贴。
- 当代木楼生活空间，而不是模糊的古代苗寨。
- 靛蓝主导，茜红负责人物与叙事，河青负责行动与导航。
- UI 贴近场景但不伪装成道具，操作优先于装饰。
- 一屏一个主要目标，场景画面始终占据至少 80% 的面积。
- 文化纹样必须有来源；不确定时使用无文化指向的基础几何肌理。

**画面三层结构（The Three-Layer Stage）：**

| 层 | 内容 | 实现方式 |
|---|---|---|
| 画框层 | 全屏最外的深色织物边框（约 1.5–2.5vw 宽），带经纬织纹与磨损斑驳 | CSS：`indigo-night` 底 + SVG 噪点 + 内阴影，不用生图 |
| 场景层 | 绘本式插画场景（S0–S7），人物可见，晨光克制 | AI 生图，见 Asset Production 的提示词基线 |
| 织物 UI 层 | 布片组件"缝"在场景上：热点、任务、对话、字幕 | 纯 CSS/SVG 绘制，见 Texture Toolkit，保证多组件像素级一致 |

画框内可整体叠加 2–3% 麻布颗粒噪点（`mix-blend-mode: multiply`），让插画与 UI 共享同一块"布"，但不得盖过正文、字幕、焦点环或操作标签的清晰度。

**The Stage Rule.** 所有主场景以 1440×810 作为设计基准，内容安全区为四周 32px。宽屏中保持横向舞台，不拉伸人物；不足 1024px 时收拢 HUD，而不是缩小文字到不可读。

**The Living Present Rule.** 每个室内场景至少出现一件自然的当代生活物件，但不得成为视觉噱头。传统与当代必须共同存在。

**The Verified Pattern Rule.** 服饰、绣片和银饰纹样只有在记录了地区、来源和审核状态后才能成为正式资产。生成图中的纹样一律视为占位。

## Colors

色彩来自 B 图的靛蓝织物、木楼暗部、茜红服装、河青热点和银饰高光。令牌以 OKLCH 为唯一规范值，以便后续生成稳定的明暗阶和保证对比度。

### Primary

- **靛夜（indigo-night）**：最深 HUD、字幕带、遮罩和夜间场景基底。不能铺满所有场景。
- **墨靛（indigo-ink）**：输入框、文化来源抽屉、热点完成态等深色主要 UI 表面（任务面板例外，见 Neutral 的 `cloth-warm`）。
- **布靛（indigo-cloth）**：次级按钮、选中背景、服饰主色和场景中的大面积织物。

### Secondary

- **河青（river-cyan）**：唯一默认操作色，用于可点击热点、主按钮、当前焦点和进行中任务。
- **亮河青（river-cyan-bright）**：焦点环、悬停高光、链接和暗底小面积文字。不得作为大面积背景。
- **茜红（madder-red）**：人物选择、服饰、情绪与叙事重点，不承担通用“错误”含义。
- **亮茜红（madder-red-bright）**：选中服饰、人物姓名或关键情绪反馈，小面积使用。

### Tertiary

- **日光赭（sun-ochre）**：时间、晨光、待注意状态和节日暖点，不用于普通主按钮。
- **危险朱（danger）**：真正的错误和不可恢复警告，禁止用于装饰。

### Neutral

- **深木（wood-dark）** 与 **中木（wood-mid）**：仅用于场景材质、物件和极少量分隔，不作为通用 UI 棕色主题。
- **银光（silver）**：边界、完成态、银饰高光和次级图标。
- **雾白（mist-white）**：暗底主文字和高对比前景。
- **淡灰字（muted-text）**：辅助说明。仅可用于与底色达到 4.5:1 对比的组合。
- **暖布白（cloth-warm）**：唯一允许的浅色 UI 表面，仅用于任务面板、记忆卡、文化手记等"布片/布卡"类组件的局部底色，不得用作全屏背景（见 No Parchment Rule）。
- **布面正文（text-on-cloth）**：暖布白表面上的正文色，对比度需 ≥4.5:1。

**The 60–25–10–5 Rule.** 单屏约 60% 靛蓝与暗部、25% 木色和环境中性、10% 雾白与银光、5% 茜红/河青/赭色焦点。任何高饱和色超过 10% 都意味着画面失控。

**The Semantic Accent Rule.** 河青始终表示“可以行动”，茜红始终表示“人物、服饰或情绪”，日光赭始终表示“时间或注意”。不得因场景换色而改变语义。

**The No Parchment Rule.** 禁止用米黄、羊皮纸或卷轴色作为全局页面背景。木色只属于真实场景材质；`cloth-warm` 是唯一例外，仅限任务面板、记忆卡等局部布片组件，且必须保持实底、直角/小圆角、无卷轴描边，不得让局部布片演变成古籍页面质感。

## Typography

**Display Font:** Source Han Serif SC / Noto Serif SC，后备 Songti SC、STSong、serif  
**Body Font:** Source Han Sans SC / Noto Sans SC，后备 Microsoft YaHei、system-ui、sans-serif  
**Label Font:** 与 Body Font 相同

**Character:** 标题宋体提供叙事与书卷气，出现在封面、章节名、场景标题（HUD 左上常驻的时间/地点标题）、换装与做饭步骤标题、结尾记忆卡；黑体承担所有任务、按钮、字幕、AI 对话和设置。这样既保留文化叙事气质，又不会把游戏操作做成古籍页面。场景标题虽常驻画面，但属于氛围信息而非可操作控件，因此不受 Controls Stay Sans 约束。

### Hierarchy

- **Display**（600，3rem，1.15）：封面项目名与最终章节标题；每屏最多一个。
- **Headline**（600，2rem，1.25）：场景标题、换装/做饭步骤标题。
- **Title**（600，1.375rem，1.35）：面板标题、人物名和关键选择。
- **Body**（400，1.125rem，1.65）：对白、说明和 AI 回答；正文宽度限制在 65ch 内。
- **Label**（600，0.9375rem，0.01em）：按钮、热点和任务项；禁止全大写和过宽字距。
- **Caption**（400，0.8125rem，1.45）：来源、时间、辅助状态；不得小于 13px。

**The Two-Family Rule.** 全项目只允许一套中文宋体与一套中文黑体。不得为“民族感”加入手写体、书法体或伪少数民族字体。

**The Controls Stay Sans Rule.** 所有可以点击、输入或改变状态的文字必须使用黑体。宋体永远不进入按钮和表单控件。

**The Chinese-First Rule.** 界面以简体中文为设计基准。英文只能作为可选翻译，不得让英文长度决定中文布局。

## Elevation

系统默认扁平分层。深度主要由场景前景/中景/背景、色块明度和遮挡关系建立，而不是由卡片阴影建立。UI 表面使用实色或近乎不透明的靛蓝，不采用装饰性毛玻璃。

### Shadow Vocabulary

- **场景浮层**（`0 4px 8px rgb(4 10 20 / 24%)`）：任务面板、对话带和文化来源抽屉，帮助其从复杂背景中分离。
- **交互抬升**（`0 2px 4px rgb(4 10 20 / 28%)`）：热点标签和按钮悬停，仅在状态变化时出现。
- **近景遮罩**（`0 12px 24px rgb(4 10 20 / 32%)`）：只用于换装或做饭的全屏近景面板；不得和 1px 装饰边框同时使用。

**The Flat-at-Rest Rule.** 按钮和标签静止时无阴影；悬停或键盘聚焦时才允许出现交互抬升。

**The One Depth Cue Rule.** 同一个组件只能通过色阶、边框或阴影中的一种方式表达层级。禁止“细边框 + 大柔光阴影”的幽灵卡片组合。

**The No Glass Rule.** 禁止默认使用 `backdrop-filter`、透明玻璃卡片或霓虹光晕。字幕需要可读时使用高不透明靛夜实色。

## Components

### Scene Artwork

- **媒介：** 数字绘制的织物拼贴感 2D 插画，轮廓清楚、色块克制、细节可分层导出。
- **层级：** 每个场景控制在背景、建筑、道具、角色、前景、环境动效 4–6 个层组，支持轻量视差。
- **纹理：** 织纹不透明度控制在 4–10%；仅布料近景可达到 15%。不得给皮肤、天空和所有 UI 统一叠加布纹。
- **光线：** 室内以冷晨光和低饱和环境光为主，火塘与蒸汽提供局部暖点；不采用金色电影滤镜。
- **轮廓：** 主要角色与交互物件使用深靛轮廓或明度分离，避免纯黑描边。
- **资产：** 正式场景优先生成或绘制无 UI 的干净底图，热点和标签必须由代码叠加，不能烘焙进图片。

### Character Illustration

- **比例：** 轻度写实的绘本人物，头身比约 1:6–1:7；避免 Q 版和写实照片脸。
- **姿态：** 自然劳动与交流姿态，不做面向游客的展示性摆拍。
- **一致性：** 为女主建立正面、3/4 侧面、侧面和关键表情表；同一套脸型、发型和肤色锁定全程。
- **服饰：** 日常装与姊妹节盛装分层导出；未经核验的刺绣和银饰不得进入正式版本。
- **当代性：** 可自然出现运动鞋、手机等当代物件，但不得靠“传统服饰 + 手机”制造反差噱头。

### Iconography

- 使用 1.75–2px 单色线性图标，圆端点与简单几何轮廓。
- 图标基准为 20px，热点圆章为 24px；装饰图标不得大于文字主信息。
- 禁止 Emoji、拟物 3D 图标和不同来源的混合图标包。
- 文化器物图标必须依据正式资产简化，不凭空发明象征。

### Texture Toolkit（织物细节库）

所有织物质感一律用 CSS/SVG 绘制，**不由 AI 生图**——保证不同组件间像素级一致，且不占生图配额。

- **缝线**：`border: dashed`（1.5–2px），色取当前底色对应的高对比中性色，低透明度叠加，只完整环绕、不单侧粗色条。
- **十字缝点**：`radial-gradient` 重复背景或伪元素小十字，苗绣十字绣意象，仅用于布片四角，不得覆盖正文。
- **靛染斑驳**：SVG `feTurbulence` 噪点叠加 + `mix-blend-mode: multiply`，透明度 ≤8%；仅用于画框层和布料近景，不叠加在正文、按钮或字幕上。
- **冰裂纹**（蜡染意象）：用于"记忆卡""文化手记"等记忆类组件的背景纹理，同样 ≤8% 透明度。
- **菱形纹带**（苗锦意象）：`repeating-linear-gradient` 45° 双色带，用于任务条、进度装饰边，不得用于正文背景。
- **流苏**：三条 2px 短线 + 末端小圆点，只用于对话框说话人标签与记忆卡，不进入按钮或热点。

### Buttons

- **Shape:** 轻微圆角矩形（8px），最小高度 44px；不得使用夸张 24px 以上圆角。
- **Primary:** 河青实色、雾白文字，左右内边距 20px；每屏最多一个主按钮。
- **Secondary:** 布靛实色、雾白文字；用于返回、稍后和次级确认。
- **Ghost:** 透明底、雾白文字，仅用于 HUD 与设置；悬停时使用墨靛底。
- **Hover:** 明度降低约 4%，上移 1px，180ms ease-out-quart；深色悬停同时提升白字对比度。
- **Focus:** 3px 亮河青外环，外偏移 2px；不能只依靠颜色改变。
- **Disabled:** 降低对比并保留标签，不使用仅 20% 透明度的不可读状态。

### Hotspot Action

这是复刻 B 的签名组件：一个 44px 圆形图标章与一个 44px 高标签相接，定位在真实物件附近。

- **Default:** 河青表示可行动；茜红仅用于服饰与人物表达类热点。
- **Inner stitch:** 允许 1px、低对比、完整环绕的短虚线，不能使用单侧粗色条。
- **Label:** 动词优先，如“准备姊妹饭”“选择盛装”“问问外婆”；禁止只写抽象名词。
- **State:** 未发现时弱化；可行动时稳定显示；完成后改为银光勾选与墨靛底。
- **Collision:** 标签不得遮挡人物脸、手和关键文化物件；同屏热点不超过 5 个。
- **Keyboard:** 获得焦点时显示编号和 3px 焦点环，Tab 顺序符合空间阅读顺序。

### Task Panel

- 固定在左上安全区，宽 280–320px；默认展示最多 4 项。
- **暖布白（cloth-warm）实底、8px 圆角**（布片是裁出来的，不是玻璃），边框为完整环绕、低对比的虚线缝线（`border: 2px dashed`，缝线色取 `indigo-cloth` 或 `text-on-cloth` 低透明度），仅可出现一次；不叠加阴影模糊 >8px。
- 场景标题（Headline 宋体）与任务列表（Body 黑体，`text-on-cloth`）共处同一布片，标题在上、任务在下。
- 当前任务使用河青图标，完成任务使用银光勾选，未开始任务使用空心圆轮廓（对应 `text-on-cloth`，非雾白——面板底色已反转为浅色）。
- 面板可收起为 44px 任务按钮，但桌面首次体验默认展开。
- 不显示百分比、经验值或游戏化评分。

```css
.task-panel{
  background:var(--cloth-warm);
  color:var(--text-on-cloth);
  border:2px dashed color-mix(in oklch, var(--text-on-cloth) 35%, transparent);
  border-radius:8px;
  box-shadow:0 4px 8px rgb(4 10 20 / 24%);
}
```

### Dialogue Band

- 位于底部中央，宽度不超过场景的 72%，与底边保持 24px 间距。
- 靛夜高不透明背景、8px 圆角，最多显示 4 行正文。
- 人物名使用亮茜红或亮河青，正文使用雾白；颜色随角色固定，不随情绪随机变化。
- 左侧可显示 48px 人物小头像或银饰分隔符，二者只能选一。
- 点击、Enter 或 Space 继续；自动播放永远不是默认行为。
- **适用范围**：旁白、内心独白、场景引导文字、门口/送别等无明确同屏说话对象的文本。这是默认对话通道。

### Speech Bubble（角色对话气泡）

> 2026-08-28 新增，为解决"点了外婆但完全看不到外婆"的问题而补的组件；不是取代 Dialogue Band，是分工。

- **适用范围**：**同屏有具体 NPC 立绘可见时**的对话——外婆、妈妈、阿月、赠饭对象。判断标准：屏幕上能看到这个人，对话就该从她/他身上长出来，不走底部通栏。
- **锚定**：气泡尾巴指向对应 NPC 立绘的头顶偏上方；NPC 是静态站位（不要求移动/寻路），气泡位置随该 NPC 在当前场景的固定坐标走，不需要摄像机跟随。
- **样式**：`cloth-warm` 或 `indigo-ink` 实底（跟随场景明暗自动选高对比的一种），2px 圆角矩形 + 小尾巴三角，尺寸随文字自适应，最大宽度 320px，不超过 4 行；不使用漫画式锯齿气泡框、不使用玻璃透明。
- **说话人**：气泡内不重复显示人物名（已经站在那里，不需要名牌），亮茜红/亮河青仅用于气泡内的关键词强调（可选）。
- **来源标记**：AI 回答仍需"资料来源"入口，做成气泡下方一个 28px 高的小织带标签，展开逻辑同 Cultural Source Drawer。
- **推进**：点击气泡本身、Enter 或 Space 继续；多句连续对话在同一气泡内翻页，不堆叠多个气泡。
- **六态**：默认（0 透明度）/ 出现（"缝上去"动效，200ms）/ 常显 / 收起（点击场景其他位置或完成对话后淡出）；不需要 hover/focus 态，气泡不是可点击控件本身，是内容容器。
- **与 Dialogue Band 共存**：同一时刻只显示一种——NPC 在场对话用气泡时，Dialogue Band 隐藏；旁白插入时气泡隐藏，Dialogue Band 出现。不得两者同屏叠加。

### AI Cultural Dialogue

- 作为外婆 Speech Bubble 的扩展层，从外婆气泡上方展开，不使用居中模态框。
- 建议问题为 44px 高的紧凑选项，默认布靛底；自由输入框高 48px。
- AI 思考状态使用三段轻微织线流动，2 秒后显示“外婆想了想……”。
- 回答下方必须有“资料来源”入口；来源从右侧抽屉展开，不中断主线。
- 离线预设回答与 AI 回答使用同一视觉组件，但显示“离线资料”状态。

### Cooking Interface

- 切换至厨房近景，原场景仍作为暗化背景，玩家保持空间连续感。
- 操作区使用底部工具带，不使用多层卡片网格。
- 食材同时使用颜色、图形和文字名称；拖拽必须有点击选择的等价操作。
- 正确反馈使用河青与银光，提示使用日光赭，真正错误才使用危险朱。
- 蒸汽、火光和米粒只做局部动效，不遮挡标签与字幕。

### Wardrobe Interface

- 女主全身位于画面中央偏右，服饰层位于左侧纵向轨道；始终保留全身预览。
- 每次只处理一个穿戴层级；可选项横向不超过 3 个。
- 选中项使用茜红背景和银光轮廓；不能用河青表达服饰审美选择。
- 穿戴成功后提供局部近景和一句场合说明，说明不超过 45 个汉字。

### Cultural Source Drawer

- 从右侧滑入，占宽 360–420px；不使用居中大模态框。
- 显示机构、资料标题、适用地域、审核状态和链接。
- 未审核内容必须标记“原型资料，待当地复核”，不能用弱化小字隐藏。
- Esc、关闭按钮和点击场景返回均可退出；焦点需锁定在抽屉内。

### Navigation and HUD

- 左上：时间/地点与任务；右上：文化手记、字幕、声音、设置。
- HUD 图标按钮均为 44px 点击区，图标 20px，不使用文字胶囊堆满顶栏。
- 场景切换由门、路径或人物行动触发，不额外增加底部导航栏。
- 手机竖屏显示“建议横屏”，但仍保留开始、设置与继续入口。

### Layout and Responsive Behavior

- **≥1440px:** 1440×810 舞台居中，可增加两侧靛夜留白，不扩展热点间距。
- **1024–1439px:** 场景按比例缩放，HUD 保持实际可读尺寸，任务面板宽 280px。
- **768–1023px 横屏:** 任务面板默认收起，对话带扩展至安全区宽度，热点标签可缩为图标章并在聚焦时展开。
- **<768px 或竖屏:** 不重排为完整竖屏游戏；提示旋转，并提供无障碍设置。
- 文本不得作为烘焙图片；中文增长 30% 时组件仍需容纳。

### Motion and Feedback

- 普通状态转换 180ms，面板/抽屉 280ms，场景转换 420–600ms。
- 标准缓动使用 ease-out-quart；禁止弹簧、回弹和装饰性循环漂浮。
- **布片入场统一用"缝上去"手法**：从 6px 偏移 + 1° 微旋 + 0 透明度进入，200ms ease-out——像最后一针落定；适用于任务面板、对话框、记忆卡首次出现，不适用于按钮悬停等高频交互反馈。
- 场景转场优先用布片遮挡、门框擦除或前景经过；不得使用每屏相同的淡入模板。
- `prefers-reduced-motion` 下取消视差和织线流动，只保留 120ms 交叉淡化或即时切换。
- 音效必须与状态反馈同步，但静音时视觉反馈完整。

### Asset Production

- 场景底图以 16:9、至少 2560×1440 生成，最终导出 AVIF/WebP；保留 PNG 分层母版。
- 角色采用透明 PNG/WebP 分层；同一角色所有场景共享色板和轮廓规则。
- 每个资产记录：名称、场景、地域、文化来源、审核状态、生成提示词、版本和授权。
- UI 不得直接使用生成图中的文字、图标和热点；全部用 HTML/CSS 重新实现。
- 正式合入前检查人物手部、银饰结构、服饰层次、建筑构造和文字伪影。

**提示词基线模板**（场景插画，非 UI）：

```
[场景内容]。绘本式插画，画在粗麻布上的质感，布纹肌理，
深靛蓝（indigo-ink 一带）主导的画面基调，暖木褐色过渡，
米白与天光灰蓝只出现在光源处，茜红仅小面积点缀，
柔和笔触，克制的单侧光照，边缘不描边，安静有生活气息，
当代生活痕迹自然存在，无文字，无水印
```

负面词基线：`文字，水印，金色描边，玻璃拟态，赛博，高饱和糖果色，动漫大眼，3D 渲染，照片写实`

**生产纪律：**

1. UI 一律 CSS/SVG 绘制（见 Texture Toolkit），AI 只产场景插画与立绘——一致性靠代码不靠运气。
2. 生图管线：OpenAI Next `/v1/images/generations` · `doubao-seedream-5-0-pro-260628` · 尺寸 1440×810（横）/ 1024×1024（物件特写）· 请求需带非默认 User-Agent；响应 JSON 与图片即时落盘（URL 24h 失效）；**全部素材须在 8/29 24:00 前生成完毕**（生图账号 8/31 失效）。
3. 每个资产先 `n=1` 验证构图与风格漂移，通过再批量；同一提示词不并发请求。
4. 正式资产以真实施洞参考素材为据（见 PRD 第 19 节），纹样、银饰形制不做"通用民族风"臆造。
5. 命名规范：`assets/{scene|char|prop}/名称-vN.png` + 同名 `.md` 记录参考来源、适用地域与审核状态。

## Do's and Don'ts

### Do:

- **Do** 以 B 图的横向舞台、任务面板、热点和底部对话带为原型布局基准。
- **Do** 使用 OKLCH 令牌，并逐个验证正文 4.5:1、大字 3:1 的对比度。
- **Do** 让场景插画承担氛围，让 HTML/CSS UI 承担操作与可访问性。
- **Do** 保持当代生活痕迹，使传统文化显得正在发生。
- **Do** 为所有拖拽提供点击替代，为所有声音提供字幕。
- **Do** 将文化来源、适用地区和审核状态与资产一同管理。
- **Do** 把织纹限制在服饰、布料和少量过渡材质上。
- **Do** 在每个屏幕只设置一个明确主行动。

### Don't:

- **Don't** 做旅游景区宣传片式的民族奇观陈列，不用银饰、篝火、敬酒和歌舞堆砌热闹。
- **Don't** 做泛“民族风”拼贴，不混用不同地区或苗族支系的服饰、纹样、器物和活动。
- **Don't** 采用古风手游式金色描边、卷轴按钮、夸张粒子或宫廷视觉语言。
- **Don't** 做儿童科普课件，不以长篇讲解和频繁百科弹窗代替体验。
- **Don't** 做恋爱养成游戏，不使用好感度、攻略数值、礼物数值或配对结局界面。
- **Don't** 直接复制 B 图的英文文案、生成式纹样或疑似不准确的服饰细节。
- **Don't** 使用 Emoji、写实照片脸、Q 版角色或通用“苗族美女”素材。
- **Don't** 在卡片上同时使用 1px 边框和大于 8px 模糊的软阴影。
- **Don't** 使用大于 16px 的容器圆角、渐变文字、玻璃拟态或霓虹描边。
- **Don't** 用单侧粗色条装饰卡片和任务项；缝线只能完整环绕且保持低对比。
- **Don't** 让装饰纹理降低正文、字幕、焦点环或操作标签的清晰度。
- **Don't** 将 UI、文字和热点烘焙进场景图。
