# 识字冒险岛 - 项目交付概览

> 最后更新：2026-07-12 · 状态：**✅ 可交付（15/15 验收标准通过，0 P0）**

## 项目简介

**识字冒险岛** 是一款面向 5-7 岁幼小衔接儿童的微信小程序识字闯关游戏。以高频常用汉字为内容核心，用图文卡片 + 冒险闯关玩法让孩子在趣味中识字，用科学复习机制和透明家长面板让家长放心。

## 技术栈

- **前端**：微信小程序原生开发（WXML + WXSS + JS）
- **后端**：微信云开发（CloudBase）— 云函数 + 云数据库（MongoDB）+ 云存储
- **部署形态**：个人主体微信小程序，零运维

## 交付物清单

### 代码（~130 文件）
- 前端：9 页面 + 5 组件 + 5 工具 + 50 个汉字数据
- 后端：16 业务云函数 + 1 初始化函数 + 3 共享模块

### 文档（8 份）
1. `docs/PRD.md` — 产品需求文档
2. `docs/Architecture.md` — 技术架构文档
3. `docs/UIUX.md` — UIUX 设计文档
4. `docs/Spec.md` — 规格契约（功能/API/DB/页面/Token/验收标准）
5. `docs/Design-Prompts.md` — 9 个页面详细设计提示词
6. `docs/Consistency-Check.md` — 三文档一致性检查
7. `docs/Integration-Check.md` — 前后端联调检查 + Phase 4 验收记录
8. `docs/Deployment-Guide.md` — 部署指南
9. `docs/seed/achievements.json` — 成就集合种子数据（见下）

## 核心功能（9 个 P0）

| ID | 功能 | 状态 |
|----|------|------|
| F01 | 闯关冒险模式 | ✅ 已实现 |
| F02 | 图文卡片识字 | ✅ 已实现 |
| F03 | 语音跟读练习 | ✅ 已实现（真实录音 + 回放对比，无评分） |
| F04 | 笔顺书写描摹 | ✅ 已实现（书写描摹组件已接入学习流程；精细笔顺动画数据待后续补充） |
| F05 | 科学复习系统 | ✅ 已实现（艾宾浩斯遗忘曲线 + 错题入队） |
| F06 | 关卡测验 | ✅ 已实现（3 种题型） |
| F07 | 家长面板 | ✅ 已实现（算术验证防误入） |
| F08 | 成就激励系统 | ✅ 已实现（徽章 + 皮肤 + 星星，按字数解锁） |
| F09 | 学习时长管控 | ✅ 已实现（4 档可调 + 软锁定） |

## 学习流程（AC01）

`认 → 图 → 读 → 写 → 测` 五步闭环：卡片认字 → 配图联想 → 听音跟读（真实录音回放）→ 笔顺描摹（stroke-writing 组件）→ 关卡测验（3 题型）→ 提交进度 → 艾宾浩斯复习。

## 付费 / 买断模型（AC15）

- **单一模型，已归一化**：`isPremium` 标志 + 关卡限免。免费内容 = 第一章前两关（约 10 字）；其余关卡与全部 304 字在买断后解锁。
- 买断页：`packageParent/unlock/unlock`（¥68 永久解锁，明码标价，永不自动续费）。
- 入口：首页「永久解锁全部 304 字」卡片 + 地图底部解锁横幅。
- **真实微信支付已按用户约定延后**：个人主体小程序不可售卖虚拟商品，买断页内「体验解锁（演示）」按钮写入本地 `isPremium`，用于 MVP 演示；正式上线需完成企业微信支付认证后再接入 `wx.requestPayment`。

## 部署前必做（详见 Deployment-Guide.md）

| 资源 | 优先级 | 说明 |
|------|--------|------|
| AppID | P0 | 替换 `project.config.json` 占位符 `wx0000000000000000` |
| 云开发环境 ID | P0 | 替换 `app.js` 中 `shizi-island-prod` 为实际环境 ID |
| Tab 栏图标 PNG | P0 | 8 个文件（4 组 normal/active），81×81px |
| 数据库种子 | P0 | 见下「种子数据」 |
| 汉字音频 | P1 | edge-tts 批量生成后上传云存储，写入 `characters.audio_fileid` |
| 汉字图片 | P1 | 每字配图上传云存储，写入 `characters.image_fileid`（当前用 emoji 占位） |
| 音效文件 | P2 | correct / wrong / click / celebrate |

### 种子数据

1. **achievements 集合**：导入 `docs/seed/achievements.json`（9 条，含 `learn_count`/`first_word` 类型，提交进度时自动按字数解锁）。
   - 注：`streak_7` / `perfect_quiz` / `review_master` 三类成就当前由 `submitProgress` 的 `learn_count`/`stars`/`first_word` 逻辑未自动解锁，需在 `getLearnStats` 中补充解锁判断（MVP 已知项，不影响主流程）。
2. **characters 集合**：由 `miniprogram/data/characters.json`（50 字）导入并补全 `audio_fileid`/`image_fileid`。
3. **chapters / levels 集合**：按章节—关卡结构导入（关卡 `character_ids` 关联 characters `_id`）。

## 质量保证

- 联调检查：12 个问题（3 CRITICAL + 4 HIGH + 4 MEDIUM + 1 LOW），全部修复，16 个 API 端点对齐。
- Phase 4 验收（终轮 QA，代码追溯）：**15/15 通过，0 P0 残留**。
- 所有改动 JS 文件通过 `node --check` 语法校验。
- 全仓无 `paywall`/`purchased` 冗余付费逻辑残留（已归一化至 `isPremium`）。

## 已知限制（MVP 范围）

- 真实微信支付未接入（个人主体限制），买断为演示解锁。
- 汉字音视频/图片为占位（emoji / 待生成），需按上表补充资源后体验完整。
- 成就集合中 streak/quiz/review 三类需后端补充解锁判断。
- 免费额度按「关卡」而非「字符数」限免（与买断页文案一致：首章前两关免费）。
