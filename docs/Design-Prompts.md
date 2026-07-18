# 儿童识字游戏 - 页面设计提示词

> 项目名称：识字冒险岛
> 文档版本：v1.0
> 更新日期：2026-07-12
> 设计负责人：颜好看
> 依据：Spec.md v1.0 + UIUX.md v1.0
> 用途：前端开发者据此实现各页面

---

## 目录

1. [首页（pages/home/home）](#1-首页pageshomehome)
2. [关卡地图页（pages/game/game）](#2-关卡地图页pagesgamegame)
3. [识字卡片页（packageLearn/card/card）](#3-识字卡片页packagelearncardcard)
4. [复习页（packageLearn/review/review）](#4-复习页packagelearnreviewreview)
5. [字典浏览页（packageLearn/dictionary/dictionary）](#5-字典浏览页packagelearndictionarydictionary)
6. [学习报告页（packageAchieve/report/report）](#6-学习报告页packageachievereportreport)
7. [成就墙页（packageAchieve/achievements/achievements）](#7-成就墙页packageachieveachievementsachievements)
8. [家长中心页（packageParent/parent/parent）](#8-家长中心页packageparentparentparent)
9. [设置页（packageParent/settings/settings）](#9-设置页packageparentsettingssettings)

---

## 全局通用规范

以下规范适用于所有页面，后续各页面不再重复说明：

- **页面背景**：`--color-bg-page: #FFF9F0`（暖奶白）
- **页面水平边距**：`--space-page-horizontal: 32rpx`（左右各留白32rpx）
- **底部Tab栏高度**：100rpx + 安全区域paddingBottom
- **顶部状态栏**：使用 `wx.getSystemInfoSync().statusBarHeight` 动态获取，导航栏总高度 = statusBarHeight + 44px
- **字体默认**：`--font-family-body: 阿里巴巴普惠体`，标题使用 `--font-family-display: 阿里妈妈方圆体`
- **默认文字色**：`--color-text-primary: #3D3D3D`
- **默认圆角**：卡片 `--radius-md: 16rpx`，按钮 `--radius-xl: 32rpx`
- **默认卡片阴影**：`--shadow-md: 0 4rpx 16rpx rgba(0,0,0,0.08)`
- **按钮点击反馈**：`scale(0.95)` + 颜色加深，时长 `--duration-fast: 150ms`
- **防连续点击**：按钮点击后300ms内禁用重复点击
- **安全区域**：关键操作按钮避开屏幕边缘32rpx以内

---

## 1. 首页（pages/home/home）

### 1.1 页面布局描述

首页采用自上而下的纵向布局，分为5个区域：

```
┌──────────────────────────────────┐
│         状态栏（系统）            │
├──────────────────────────────────┤
│  [头像] 你好，小明！     [设置⚙️] │ ← 顶部问候区（高度~120rpx）
│                                    │
│         吉祥物"字宝"               │
│         （待机呼吸动画）            │ ← 吉祥物区（高度~240rpx）
│                                    │
├──────────────────────────────────┤
│  ┌──────────────────────────────┐ │
│  │     继续学习                  │ │
│  │  ▶ 第3关 · 水果乐园           │ │ ← 继续学习按钮（高度96rpx，宽度70%）
│  │  进度 ●●●○○ 3/5字             │ │
│  └──────────────────────────────┘ │
├──────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐
│  │  🗺️    │  │  🏆    │  │  📊    │
│  │ 关卡   │  │ 成就   │  │ 报告   │
│  │ 地图   │  │ 墙    │  │       │
│  └────────┘  └────────┘  └────────┘│ ← 功能入口区（3列等分）
├──────────────────────────────────┤
│  ┌──────────────────────────────┐ │
│  │ 📅 今日目标                   │ │
│  │ 已学 3 字  ⭐⭐⭐              │ │ ← 今日目标卡片
│  │ ━━━━━━━━━━━━━━ 60%           │ │
│  └──────────────────────────────┘ │
├──────────────────────────────────┤
│  [首页]  [地图]  [报告]  [我的]   │ ← 底部Tab栏
└──────────────────────────────────┘
```

**尺寸比例**：
- 顶部问候区：占屏高约15%
- 吉祥物区：占屏高约25%
- 继续学习按钮区：占屏高约12%
- 功能入口区：占屏高约18%
- 今日目标卡片：占屏高约15%
- 底部Tab栏：100rpx + 安全区域

### 1.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 用户头像 | 64x64rpx（--avatar-md） | 圆形 | --radius-full | --shadow-sm | 左上角，点击进入设置 |
| 用户昵称 | auto | --color-text-primary | - | - | 字号H3(30rpx)，font-weight-bold |
| 设置图标 | 48x48rpx | --color-text-secondary | --radius-sm | - | 右上角齿轮图标 |
| 吉祥物形象 | 200x200rpx | 暖橙色系 | - | - | PNG/SVG，呼吸动画 |
| 继续学习按钮 | 宽70%，高96rpx | 背景--gradient-warm | --radius-xl | --shadow-primary | 主CTA，圆角大按钮 |
| 按钮内-图标 | 48x48rpx | #FFFFFF | - | - | 白色播放三角图标 |
| 按钮内-标题 | auto | #FFFFFF | - | - | "继续学习"，字号H3(30rpx)，Bold |
| 按钮内-副标题 | auto | rgba(255,255,255,0.85) | - | - | "第3关 · 水果乐园"，字号Body(26rpx) |
| 按钮内-进度点 | 12x12rpx | 已完成#FFD93D/未完成rgba(255,255,255,0.3) | --radius-full | - | 3/5进度指示 |
| 功能入口卡片 | 192x192rpx | --color-bg-card | --radius-lg | --shadow-sm | 3个等分卡片 |
| 功能入口图标 | 64x64rpx | 各自主题色 | - | - | 地图=薄荷蓝，成就=金黄，报告=嫩芽绿 |
| 功能入口文字 | auto | --color-text-primary | - | - | 字号Body(26rpx)，Medium |
| 今日目标卡片 | 宽100%，高160rpx | --color-bg-card | --radius-lg | --shadow-md | 日期+目标+进度 |
| 今日目标-进度条 | 宽80%，高16rpx | 背景#FFE8D1，填充--color-secondary-green | --radius-full | - | 动画填充 |
| 今日目标-星星 | 48x48rpx x3 | --color-accent-gold | - | - | 已获得的星星 |
| 底部Tab栏 | 宽100%，高100rpx+safe | --color-bg-card | 顶部--radius-sm | 顶部1px边框#FFE8D1 | 固定底部 |

### 1.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 用户昵称 | getUserInfo | `user.nickname` | 顶部问候显示 |
| 用户头像 | getUserInfo | `user.avatar` | 顶部头像显示 |
| 累计识字量 | getUserInfo | `user.total_learned` | 可选显示 |
| 总星星数 | getUserInfo | `user.total_stars` | 可选显示 |
| 当前章节ID | getUserInfo | `user.current_chapter` | 跳转关卡地图 |
| 当前关卡ID | getUserInfo | `user.current_level` | 跳转关卡地图 |
| 当前关卡标题 | getProgress | `summary.current_level_title` | 继续学习按钮副标题 |
| 当前关卡进度 | getProgress | `summary.current_level_progress` | 按钮内进度点 |
| 今日新学字数 | getProgress | `summary.today_new_chars` | 今日目标卡片 |
| 今日目标字数 | getProgress | `summary.daily_target` | 今日目标卡片 |
| 今日已获星星 | getProgress | `summary.today_stars` | 今日目标卡片星星 |
| 是否有待复习 | getReviewList | `characters.length > 0` | 触发复习弹窗 |

### 1.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 点击继续学习 | tap | 跳转到 packageLearn/card/card，传参 levelId + 当前字序号 | 按钮缩放0.95 + 点击音效 |
| 点击关卡地图入口 | tap | 跳转到 pages/game/game | 卡片缩放0.95 + 点击音效 |
| 点击成就墙入口 | tap | 跳转到 packageAchieve/achievements/achievements | 卡片缩放0.95 + 点击音效 |
| 点击学习报告入口 | tap | 跳转到 packageAchieve/report/report | 卡片缩放0.95 + 点击音效 |
| 点击设置图标 | tap | 跳转到 packageParent/settings/settings | 点击音效 |
| 点击头像 | tap | 跳转到 packageParent/parent/parent（需家长验证） | 弹出家长验证弹窗 |
| 点击吉祥物 | tap | 吉祥物切换表情（开心→惊喜→加油），播放问候语音 | scale 1.1 弹跳 + 语音 |
| 下拉刷新 | pullDownRefresh | 重新调用 getUserInfo + getProgress | 触发加载态 |
| 进入页面时有待复习 | onShow | 延迟500ms弹出复习引导弹窗 | 弹窗淡入 |
| 点击Tab栏各项 | tap | 切换到对应页面 | 当前Tab高亮变色 |

**复习引导弹窗**：
- 背景遮罩：`--color-bg-overlay: rgba(0,0,0,0.4)`，点击不关闭
- 弹窗主体：宽80%，背景--color-bg-card，圆角--radius-2xl(48rpx)，阴影--shadow-xl
- 标题："快来复习吧！"，字号H2(34rpx)，Bold，居中
- 副标题："你有N个字需要复习"，字号Body(26rpx)，--color-text-secondary
- 按钮1："去复习"——主按钮，--gradient-warm背景，高80rpx
- 按钮2："下次再说"——次级文字按钮，--color-text-secondary
- 动效：弹窗从底部滑入，时长--duration-slow(400ms)，--ease-bounce

### 1.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 继续学习按钮背景 | --gradient-warm | #FF8C42 → #FFD93D |
| 继续学习按钮文字 | --color-text-inverse | #FFFFFF |
| 功能入口-地图卡片图标 | --color-secondary-mint | #4ECDC4 |
| 功能入口-成就卡片图标 | --color-accent-gold | #FFB627 |
| 功能入口-报告卡片图标 | --color-secondary-green | #95E1A3 |
| 今日目标进度条填充 | --color-secondary-green | #95E1A3 |
| 今日目标进度条背景 | --color-border-default | #FFE8D1 |
| 今日目标星星 | --color-accent-gold | #FFB627 |
| Tab栏-首页高亮 | --color-primary-default | #FF8C42 |
| Tab栏-其他默认 | --color-text-secondary | #8A8A8A |

### 1.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 吉祥物呼吸 | 页面显示时，持续循环 | scale(1.0→1.05→1.0) | 2000ms | ease-in-out |
| 吉祥物表情切换 | 点击吉祥物 | 表情图片切换 + scale(1.1→1.0) | 300ms | --ease-bounce |
| 继续学习按钮脉冲 | 页面显示2秒后 | box-shadow脉冲扩散 | 1500ms | ease-out |
| 进度条填充动画 | 页面数据加载完成 | 宽度从0%→目标% | 600ms | --ease-out |
| 星星弹跳 | 今日目标星星显示 | scale(0→1) + 弹跳 | 400ms | --ease-bounce |
| 页面进入 | 从其他Tab切回 | 淡入 | 250ms | --ease-out |
| 复习弹窗出现 | onShow后500ms | 从底部滑入 | 400ms | --ease-bounce |

### 1.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 吉祥物区域显示加载动画（旋转的星星），其他区域骨架屏 | 页面首次加载或下拉刷新时 |
| **空状态（新用户）** | 继续学习按钮文案变为"开始第一关 · 认识自然"，进度点隐藏，今日目标显示"0/5字"，进度条0% | total_learned = 0 |
| **正常状态** | 显示当前进度 | 有学习记录的用户 |
| **全部完成** | 继续学习按钮变为"复习已学内容"，吉祥物穿毕业帽 | 所有关卡完成 |
| **网络错误** | 吉祥物区域替换为错误提示"网络好像断了"+重试按钮 | getUserInfo/getProgress失败 |
| **时长已达限** | 继续学习按钮变为灰色"今日学习已完成"，副标题"明天再来吧！"点击弹出时长提醒 | daily_time_limit已用完 |

### 1.8 响应式考量

| 屏幕高度 | 适配策略 |
|----------|----------|
| 高屏（≥812px） | 吉祥物区域放大至240rpx，功能入口卡片间距增大 |
| 标准屏（667-811px） | 按默认尺寸 |
| 低屏（≤666px） | 吉祥物区域缩小至160rpx，功能入口卡片缩至160x160rpx，今日目标卡片高度减至130rpx |
| 横屏 | 不支持，提示用户竖屏使用 |

---

## 2. 关卡地图页（pages/game/game）

### 2.1 页面布局描述

全屏冒险地图风格，纵向滚动展示关卡路径：

```
┌──────────────────────────────────┐
│         状态栏（系统）            │
├──────────────────────────────────┤
│ [←]  第一篇：自然万物      [📊]  │ ← 顶部导航栏（固定）
│        共5关 · 已学12字          │
├──────────────────────────────────┤
│                                    │
│     🌳        ⭐⭐⭐               │
│        ╭─── 关卡1 ───╮            │
│        │  [关卡1节点] │  已通关    │ ← 已通关关卡
│        ╰─────────────╯            │
│              │                    │
│              ╲╱                   │
│     🌲        ⭐⭐                 │
│        ╭─── 关卡2 ───╮            │
│        │  [关卡2节点] │  已通关    │
│        ╰─────────────╯            │
│              │                    │
│              ╲╱                   │
│     🏕️                            │
│    ╭─── 关卡3 ───╮                │
│    │ [字宝站这里] │  ← 当前关卡   │ ← 当前关卡（高亮脉冲）
│    ╰────────────╯                 │
│              │                    │
│              ╲╱                   │
│         🔒                        │
│    ╭─── 关卡4 ───╮                │
│    │  [锁定节点]  │  未解锁        │ ← 未解锁关卡
│    ╰────────────╯                 │
│              │                    │
│              ╲╱                   │
│         🔒                        │
│    ╭─── 关卡5 ───╮                │
│    │  [锁定节点]  │  未解锁        │
│    ╰────────────╯                 │
│                                    │
├──────────────────────────────────┤
│  [首页]  [地图]  [报告]  [我的]   │ ← 底部Tab栏
└──────────────────────────────────┘
```

**布局说明**：
- 顶部导航栏：固定不滚动，高度 = 状态栏 + 88rpx
- 地图区域：可纵向滚动，背景为冒险地图插画
- 关卡节点沿蜿蜒路径排布，左右交替偏移
- 底部Tab栏：固定不滚动
- 章节切换：左右滑动或点击顶部章节标题切换章节

### 2.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角圆角左箭头 |
| 章节标题 | auto | --color-text-primary | - | - | 字号H1(40rpx)，Bold，font-family-display |
| 章节统计 | auto | --color-text-secondary | - | - | "共5关 · 已学12字"，字号Caption(22rpx) |
| 章节切换按钮 | 48x48rpx x2 | --color-text-secondary | - | - | 左右箭头，切换章节 |
| 地图背景 | 全屏 | 场景插画 | - | - | 冒险地图SVG/PNG，固定不滚动 |
| 路径连线 | 6rpx宽 | #FFE8D1 | - | - | 蜿蜒虚线连接关卡节点 |
| 已通关节点 | 96x96rpx | --color-secondary-mint | --radius-full | --shadow-sm | 圆形按钮，显示关卡编号 |
| 已通关-星星 | 24x24rpx x3 | --color-accent-gold / #E0E0E0(未获) | - | - | 节点上方显示1-3星 |
| 当前关卡节点 | 112x112rpx | --gradient-warm | --radius-full | --shadow-primary | 放大尺寸，脉冲动画 |
| 当前关卡-吉祥物 | 80x80rpx | - | - | - | 站在节点旁，跳跃动画 |
| 未解锁节点 | 96x96rpx | #E0E0E0 | --radius-full | - | 灰色，中间显示锁图标 |
| 未解锁-锁图标 | 40x40rpx | --color-text-disabled | - | - | 挂锁图标 |
| 关卡标题标签 | auto | --color-bg-card | --radius-sm | --shadow-sm | 节点下方，显示关卡名称 |
| 关卡详情弹窗 | 宽86% | --color-bg-card | --radius-lg | --shadow-xl | 点击关卡后弹出 |
| 底部Tab栏 | 同首页 | 同首页 | 同首页 | 同首页 | 地图高亮薄荷蓝 |

**关卡详情弹窗**：
- 标题：关卡名称，字号H2(34rpx)，Bold
- 预览区：本关汉字预览（3-5个字横排，字号H2 34rpx，--font-family-handwriting）
- 统计："共N字 · 预计M分钟"
- 按钮-开始/重玩：主按钮，--gradient-warm，高80rpx，"开始学习"/"重新挑战"
- 按钮-关闭：次级文字按钮，"返回"
- 动效：从底部滑入，时长--duration-slow(400ms)

### 2.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 章节列表 | getChapters | `chapters[].chapter_number, title, description, icon, level_count, character_count` | 章节标题和统计 |
| 章节解锁状态 | getChapters | `chapters[].is_unlocked` | 章节是否可进入 |
| 关卡列表 | getLevels | `levels[].level_number, title, type, character_ids[], pass_threshold` | 关卡节点数据 |
| 关卡解锁状态 | getLevels | `levels[].is_unlocked` | 节点显示状态 |
| 关卡完成状态 | getProgress | `progress[].status, stars, score` | 节点星星和完成度 |
| 当前关卡ID | getUserInfo | `user.current_level` | 确定高亮关卡 |

### 2.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 点击已通关节点 | tap | 弹出关卡详情弹窗（重玩选项） | 节点缩放0.95 + 音效 |
| 点击当前关卡 | tap | 弹出关卡详情弹窗（开始选项） | 节点缩放0.95 + 音效 |
| 点击未解锁节点 | tap | Toast提示"完成前一关后解锁" | 轻微摇晃 + Toast |
| 点击开始学习 | tap（弹窗内） | 跳转 packageLearn/card/card，传参 levelId | 弹窗淡出 + 页面跳转 |
| 左右滑动 | swipe | 切换章节 | 章节内容横向滑入/滑出 |
| 点击章节切换箭头 | tap | 切换章节 | 同上 |
| 滚动地图 | swipe up/down | 地图区域纵向滚动 | 惯性滚动 |
| 点击Tab栏各项 | tap | 切换到对应页面 | Tab高亮变色 |

### 2.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 地图背景插画 | 场景色（柔和绿/蓝/橙） | 多色 |
| 路径连线 | --color-border-default | #FFE8D1 |
| 已通关节点 | --color-secondary-mint | #4ECDC4 |
| 已通关星星 | --color-accent-gold | #FFB627 |
| 当前关卡节点 | --gradient-warm | #FF8C42 → #FFD93D |
| 当前关卡阴影 | --shadow-primary | rgba(255,140,66,0.3) |
| 未解锁节点 | #E0E0E0 | 灰色 |
| 未解锁锁图标 | --color-text-disabled | #BFBFBF |
| 关卡标题标签背景 | --color-bg-card | #FFFFFF |
| Tab栏-地图高亮 | --color-secondary-mint | #4ECDC4 |

### 2.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 当前关卡脉冲 | 持续循环 | box-shadow扩散（0→1.5倍→0） | 1500ms | ease-out |
| 吉祥物跳跃 | 持续循环 | translateY(0→-10rpx→0) | 800ms | --ease-bounce |
| 已通关星星弹跳 | 关卡节点渲染时 | scale(0→1) | 300ms | --ease-bounce |
| 章节切换 | 左右滑动 | 内容横向滑入/滑出 | 300ms | --ease-out |
| 关卡详情弹窗 | 点击关卡 | 从底部滑入 | 400ms | --ease-bounce |
| 节点点击 | tap | scale(0.95→1.0) | 150ms | --ease-out |
| 新关卡解锁 | 解锁条件达成时 | 金色光效扩散 + scale(0→1.2→1.0) | 800ms | --ease-bounce |
| 页面进入 | onLoad | 从右滑入 | 250ms | --ease-out |

### 2.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 地图区域显示骨架屏（灰色圆形节点占位） | getLevels加载中 |
| **空状态（新用户）** | 仅关卡1为当前状态（高亮），其余全部锁定 | 首次进入 |
| **正常状态** | 按进度显示已通关/当前/未解锁节点 | 有学习记录 |
| **全部完成** | 所有关卡显示已通关，章节标题旁显示"✓ 已完成"徽章 | 章节内全部通关 |
| **章节锁定** | 章节切换箭头灰色不可点，提示"完成前一章节后解锁" | 前置章节未完成 |
| **网络错误** | 地图区域显示错误提示"加载失败"+重试按钮 | getLevels失败 |

### 2.8 响应式考量

| 屏幕高度 | 适配策略 |
|----------|----------|
| 高屏（≥812px） | 关卡节点间距增大至200rpx，装饰元素增多 |
| 标准屏（667-811px） | 关卡节点间距160rpx |
| 低屏（≤666px） | 关卡节点间距130rpx，节点缩小至80rpx |
| 横屏 | 不支持 |

---

## 3. 识字卡片页（packageLearn/card/card）

### 3.1 页面布局描述

核心学习页面，全屏沉浸式体验，无底部Tab栏：

```
┌──────────────────────────────────┐
│ [←]  ━━━━━━━●○○○○  3/5    [×]  │ ← 顶部进度栏（固定）
├──────────────────────────────────┤
│                                    │
│         mù                        │ ← 拼音（字号H2 34rpx）
│                                    │
│         ┌──────┐                  │
│         │      │                  │
│         │  木  │                  │ ← 汉字大字展示（≥120rpx）
│         │      │                  │   阿里妈妈东方大楷
│         └──────┘                  │
│                                    │
│         ┌──────────┐              │
│         │ 🌳 图片  │              │ ← 配图区（120x120rpx）
│         └──────────┘              │
│                                    │
│    木头  ·  树木  ·  木马          │ ← 例词区（字号Body-L 28rpx）
│                                    │
│                          [字宝😊]  │ ← 吉祥物反馈区
├──────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────┐ │
│  │ 🔊      │ │ 🎤      │ │ →   │ │ ← 底部操作区
│  │ 听发音  │ │ 跟读    │ │下一字│ │   （固定底部）
│  └─────────┘ └─────────┘ └─────┘ │
└──────────────────────────────────┘
```

**布局说明**：
- 顶部进度栏：固定，显示返回按钮、进度条、当前字/总字数、关闭按钮
- 中央卡片区域：占屏高约60%，包含拼音、汉字、配图、例词
- 底部操作区：固定底部，3个操作按钮等分
- 无底部Tab栏（沉浸式学习）

**5步学习流程**（对应Spec F01）：
1. **认字**：展示汉字大字 + 拼音 + 图片 + 发音
2. **图卡**：展示象形动画（汉字→实物图片变形动画）
3. **跟读**：播放发音 → 录音 → 回放 → 吉祥物鼓励
4. **书写**：笔顺动画演示 → 手指描摹
5. **测试**：跳转到复习页的测验模式

### 3.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角 |
| 进度条 | 宽40%，高12rpx | 背景#FFE8D1，填充--color-primary-default | --radius-full | - | 顶部居中 |
| 进度文字 | auto | --color-text-secondary | - | - | "3/5"，字号Caption(22rpx) |
| 关闭按钮 | 64x64rpx | --color-text-secondary | --radius-full | - | 右上角× |
| 拼音文字 | auto | --color-text-primary | - | - | 字号H2(34rpx)，Regular，居中 |
| 汉字大字 | ≥120rpx字号 | --color-text-primary | - | - | 阿里妈妈东方大楷，居中 |
| 配图区域 | 160x160rpx | 透明 | --radius-md | --shadow-sm | 关联实物图片 |
| 例词区域 | auto | --color-text-primary | - | - | 2-3个词组，字号Body-L(28rpx)，间距16rpx |
| 例词分隔符 | auto | --color-text-secondary | - | - | "·" 分隔 |
| 吉祥物 | 80x80rpx | - | - | - | 右下角，表情反馈 |
| 听发音按钮 | 160x96rpx | --color-secondary-mint | --radius-xl | --shadow-mint | 喇叭图标+文字 |
| 听发音-图标 | 48x48rpx | #FFFFFF | - | - | 白色喇叭 |
| 听发音-文字 | auto | #FFFFFF | - | - | "听发音"，字号Body(26rpx) |
| 跟读按钮 | 160x96rpx | --color-primary-default | --radius-xl | --shadow-primary | 麦克风图标+文字 |
| 跟读-图标 | 48x48rpx | #FFFFFF | - | - | 白色麦克风 |
| 跟读-文字 | auto | #FFFFFF | - | - | "跟读"，字号Body(26rpx) |
| 下一字按钮 | 120x96rpx | --color-bg-card | --radius-xl | --shadow-sm | 右箭头图标 |
| 下一字-图标 | 48x48rpx | --color-primary-default | - | - | 暖橙右箭头 |
| 象形动画区域 | 200x200rpx | 透明 | - | - | SVG动画，汉字变形为实物 |
| 笔顺演示区 | 200x200rpx | --color-bg-card | --radius-md | --shadow-sm | Canvas绘制笔顺 |
| 笔顺-描摹区域 | 200x200rpx | 透明 | --radius-md | - | 手指描摹区域 |
| 录音波形 | 宽60%，高48rpx | --color-secondary-mint | - | - | 录音时显示波形动画 |

### 3.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 汉字 | getLevelDetail | `characters[].char` | 大字展示 |
| 拼音 | getLevelDetail | `characters[].pinyin` | 拼音标注 |
| 笔画数 | getLevelDetail | `characters[].stroke_count` | 笔顺演示 |
| 部首 | getLevelDetail | `characters[].radical` | 可选展示 |
| 图片fileID | getLevelDetail | `characters[].image_fileid` | 配图 |
| 音频fileID | getAudioUrl | `audioMap[charId]` | 发音播放 |
| 例词 | getLevelDetail | `characters[].words[]` | 例词展示 |
| 例句 | getLevelDetail | `characters[].example_sentence` | 可选展示 |
| 关卡总字数 | getLevelDetail | `level.character_ids.length` | 进度条总数 |
| 当前字序号 | 页面状态 | `currentIndex` | 进度条当前值 |
| 学习行为记录 | logLearnAction | `{ characterId, action: 'learn', result, context }` | 记录学习行为 |

### 3.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 点击听发音 | tap | 播放标准发音音频 | 按钮缩放 + 波纹动画 + 音频播放 |
| 点击跟读 | tap | 请求麦克风权限→录音→播放回放→吉祥物鼓励 | 弹窗流程 |
| 点击下一字 | tap | 卡片左滑出→新字右滑入 | 滑动动画 + 点击音效 |
| 左滑卡片 | swipe left | 切换到下一字 | 卡片滑动动画 |
| 右滑卡片 | swipe right | 切换到上一字 | 卡片滑动动画 |
| 点击汉字 | tap | 重新播放发音 | 波纹动画 + 发音 |
| 点击配图 | tap | 图片放大查看 | 全屏图片查看器 |
| 点击返回 | tap | 弹出确认弹窗"确定退出学习吗？" | 确认弹窗 |
| 点击关闭 | tap | 同返回 | 同上 |
| 录音完成 | 录音结束 | 自动播放录音回放→吉祥物欢呼→1.5s后自动下一字 | 反馈动画 |
| 麦克风未授权 | tap跟读 | 弹出授权弹窗，拒绝后提示"可跳过跟读" | Toast提示 |
| 笔顺演示完成 | 动画结束 | 显示"描摹"按钮，可手指描摹 | 按钮出现 |
| 学习行为记录 | 每个操作 | 调用 logLearnAction 记录 | 静默，无UI反馈 |

**退出确认弹窗**：
- 背景遮罩：--color-bg-overlay
- 弹窗主体：宽80%，--color-bg-card，--radius-2xl(48rpx)
- 标题："确定退出学习吗？"，H2(34rpx)，Bold
- 副标题："你的进度已经保存了"，Body(26rpx)，--color-text-secondary
- 按钮1："继续学习"——主按钮，--gradient-warm
- 按钮2："确定退出"——次级文字按钮，--color-text-secondary

### 3.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 进度条填充 | --color-primary-default | #FF8C42 |
| 进度条背景 | --color-border-default | #FFE8D1 |
| 汉字大字 | --color-text-primary | #3D3D3D |
| 拼音 | --color-text-primary | #3D3D3D |
| 例词 | --color-text-primary | #3D3D3D |
| 听发音按钮 | --color-secondary-mint | #4ECDC4 |
| 听发音阴影 | --shadow-mint | rgba(78,205,196,0.3) |
| 跟读按钮 | --color-primary-default | #FF8C42 |
| 跟读阴影 | --shadow-primary | rgba(255,140,66,0.3) |
| 下一字按钮背景 | --color-bg-card | #FFFFFF |
| 下一字箭头 | --color-primary-default | #FF8C42 |
| 录音波形 | --color-secondary-mint | #4ECDC4 |

### 3.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 卡片切换-下一字 | 点击下一字/左滑 | 旧卡片左滑出+新卡片右滑入 | 300ms | --ease-out |
| 卡片切换-上一字 | 右滑 | 旧卡片右滑出+新卡片左滑入 | 300ms | --ease-out |
| 汉字出现 | 卡片切换后 | scale(0.8→1.0)+淡入 | 400ms | --ease-bounce |
| 拼音出现 | 汉字出现后200ms | 从上方滑入+淡入 | 300ms | --ease-out |
| 配图出现 | 拼音出现后200ms | scale(0→1)+弹跳 | 400ms | --ease-bounce |
| 例词出现 | 配图出现后200ms | 逐个淡入 | 每个间隔150ms | --ease-out |
| 听发音波纹 | 点击听发音 | 圆形波纹向外扩散 | 600ms | ease-out |
| 象形动画 | 认字步骤后 | 汉字SVG变形为实物图 | ≤5000ms | --ease-in-out |
| 笔顺动画 | 书写步骤 | 逐笔绘制，每笔不同颜色 | 每笔800ms | --ease-in-out |
| 吉祥物鼓励 | 跟读完成 | 跳跃+表情切换为欢呼 | 800ms | --ease-bounce |
| 进度条更新 | 切换字时 | 宽度增长 | 600ms | --ease-out |
| 按钮点击 | tap | scale(0.95→1.0) | 150ms | --ease-out |

### 3.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 中央显示吉祥物"加载中"动画（星星旋转） | getLevelDetail加载中 |
| **认字步骤** | 汉字+拼音+配图+例词，听发音按钮高亮 | 默认第一步 |
| **象形动画步骤** | 汉字变形为实物图片的SVG动画 | 第2步 |
| **跟读步骤** | 跟读按钮高亮脉冲，显示录音波形区域 | 第3步 |
| **书写步骤** | 笔顺动画区域显示，描摹按钮出现 | 第4步 |
| **最后一字** | 下一字按钮变为"完成本关" | 当前字=总字数 |
| **麦克风未授权** | 跟读按钮点击后弹出授权弹窗，可跳过 | 未授权麦克风 |
| **音频加载中** | 听发音按钮显示加载态（旋转图标） | 音频未缓存 |
| **网络错误** | 中央显示"加载失败"+重试按钮 | getLevelDetail失败 |
| **时长已达限** | 弹出时长提醒弹窗"今日学习时间到了"，按钮变为"返回首页" | daily_time_limit用完 |

### 3.8 响应式考量

| 屏幕高度 | 适配策略 |
|----------|----------|
| 高屏（≥812px） | 汉字字号增至140rpx，配图增至200x200rpx，各区域间距增大 |
| 标准屏（667-811px） | 按默认尺寸 |
| 低屏（≤666px） | 汉字字号100rpx，配图120x120rpx，例词字号Body(26rpx)，压缩垂直间距 |
| 横屏 | 不支持 |

---

## 4. 复习页（packageLearn/review/review）

### 4.1 页面布局描述

沉浸式复习页面，无底部Tab栏，3种复习题型切换：

```
┌──────────────────────────────────┐
│ [←]  ━━━━━━━━━●━━○○○  3/10  [×] │ ← 顶部进度栏（固定）
│         科学的复习时间到啦！        │
├──────────────────────────────────┤
│                                    │
│    ┌──────────────────────────┐   │
│    │  🔊 找出"大"字            │   │ ← 题目区（字号H2 34rpx）
│    │  (点击喇叭可以再听一次)    │   │
│    └──────────────────────────┘   │
│                                    │
│    ┌────────┐  ┌────────┐         │
│    │   大   │  │   小   │         │ ← 选项卡片区（2x2网格）
│    │        │  │        │         │   每个≥140x140rpx
│    └────────┘  └────────┘         │
│    ┌────────┐  ┌────────┐         │
│    │   天   │  │   太   │         │
│    │        │  │        │         │
│    └────────┘  └────────┘         │
│                                    │
│                    [字宝😊]        │ ← 吉祥物反馈区
├──────────────────────────────────┤
│         复习进度：3/10             │ ← 底部状态区
│         ⭐⭐⭐ 已收集               │
└──────────────────────────────────┘
```

**3种复习题型**（对应Spec F05）：
1. **认读**：看字选图——显示汉字，选择对应图片
2. **听音辨字**：听音选字——播放发音，选择对应汉字
3. **选词填空**：看图选词——显示图片，选择对应词组

### 4.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角，点击弹出确认 |
| 进度条 | 宽40%，高12rpx | 背景#FFE8D1，填充--color-secondary-mint | --radius-full | - | 薄荷蓝填充 |
| 进度文字 | auto | --color-text-secondary | - | - | "3/10" |
| 关闭按钮 | 64x64rpx | --color-text-secondary | --radius-full | - | 右上角 |
| 题目区域 | 宽90%，高100rpx | --color-bg-card | --radius-lg | --shadow-sm | 题目卡片 |
| 题目文字 | auto | --color-text-primary | - | - | 字号H2(34rpx)，Bold |
| 题目图标-喇叭 | 48x48rpx | --color-secondary-mint | - | - | 听音辨字题型显示 |
| 题目提示 | auto | --color-text-secondary | - | - | "点击喇叭再听一次"，Caption(22rpx) |
| 选项卡片 | 140x140rpx | --color-bg-card | --radius-md | --shadow-sm | 2x2网格排列 |
| 选项卡片-文字 | auto | --color-text-primary | - | - | 字号Body-L(28rpx) |
| 选项卡片-图片 | 120x120rpx | - | --radius-sm | - | 图片选项 |
| 选项-正确态 | 140x140rpx | --color-success(#52C41A) | --radius-md | --shadow-sm | 选中正确时变绿 |
| 选项-错误态 | 140x140rpx | --color-error(#FF7875) | --radius-md | --shadow-sm | 选中错误时变红 |
| 选项-未选中态 | 140x140rpx | --color-bg-card | --radius-md | --shadow-sm | 默认态 |
| 吉祥物 | 80x80rpx | - | - | - | 右下角，表情反馈 |
| 底部进度文字 | auto | --color-text-secondary | - | - | "复习进度：3/10" |
| 底部星星 | 32x32rpx x3 | --color-accent-gold | - | - | 已收集星星 |
| 反馈文字 | auto | --color-success / --color-error | - | - | "答对了！"/"再试试" |

### 4.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 复习字列表 | getReviewList | `characters[].char, pinyin, image_fileid, audio_fileid, words[]` | 题目数据 |
| 复习总数 | getReviewList | `characters.length` | 进度条总数（最大10） |
| 音频fileID | getAudioUrl | `audioMap[charId]` | 听音辨字题型 |
| 题型 | 页面生成 | `quizType: 'recognize' / 'listen' / 'fill'` | 当前题型 |
| 当前题序号 | 页面状态 | `currentIndex` | 进度条当前值 |
| 学习行为 | logLearnAction | `{ characterId, action: 'review', result: 'correct'/'wrong', context }` | 记录复习结果 |

### 4.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 点击喇叭 | tap | 重新播放题目发音 | 波纹动画 + 音频播放 |
| 点击选项 | tap | 判断对错→反馈动画→1.5s后下一题 | 对/错反馈 |
| 选对反馈 | 自动 | 选项变绿 + 星星弹跳 + 吉祥物欢呼 + 答对音效 + "答对了！"文字 | 1200ms动画 |
| 选错反馈 | 自动 | 选项变红 + 卡片轻微摇晃 + 柔和音效 + "再试试，你可以的"文字 | 400ms动画 |
| 选错后 | 1.5s后 | 正确答案高亮闪烁2次，然后进入下一题 | 高亮动画 |
| 点击返回 | tap | 弹出确认弹窗"确定退出复习吗？进度会保存" | 确认弹窗 |
| 完成所有题 | 自动 | 切换到复习完成弹窗 | 庆祝弹窗 |
| 每答5题 | 自动 | 小奖励动画（星星收集弹窗，1s后自动关闭） | 星星弹跳 |

**复习完成弹窗**：
- 背景遮罩：--color-bg-overlay
- 弹窗主体：宽86%，--color-bg-card，--radius-2xl(48rpx)，--shadow-xl
- 顶部：庆祝彩带动效（--gradient-warm背景条带）
- 标题："复习完成！"，Display(48rpx)，Heavy，居中
- 数据展示：答对N题/共M题，正确率X%
- 星星奖励："获得N颗星星"，星星弹跳动画
- 吉祥物：欢呼形象
- 按钮1："返回首页"——主按钮，--gradient-warm
- 按钮2："继续学习"——次级按钮
- 动效：从底部弹入，--duration-slow(400ms)，--ease-bounce

### 4.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 进度条填充 | --color-secondary-mint | #4ECDC4 |
| 题目卡片背景 | --color-bg-card | #FFFFFF |
| 喇叭图标 | --color-secondary-mint | #4ECDC4 |
| 选项默认背景 | --color-bg-card | #FFFFFF |
| 选项正确态 | --color-success | #52C41A |
| 选项错误态 | --color-error | #FF7875 |
| 正确反馈文字 | --color-success | #52C41A |
| 错误反馈文字 | --color-error | #FF7875 |
| 星星 | --color-accent-gold | #FFB627 |
| 完成弹窗渐变 | --gradient-warm | #FF8C42 → #FFD93D |

### 4.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 选项出现 | 新题加载 | 4个选项依次淡入+scale(0.8→1) | 每个间隔100ms | --ease-bounce |
| 选对-选项变绿 | 选对时 | 背景色过渡 | 150ms | --ease-out |
| 选对-星星弹跳 | 选对时 | 星星从选项中心弹出向外 | 1200ms | --ease-bounce |
| 选对-吉祥物 | 选对时 | 跳跃+表情切换为欢呼 | 800ms | --ease-bounce |
| 选错-选项变红 | 选错时 | 背景色过渡 | 150ms | --ease-out |
| 选错-卡片摇晃 | 选错时 | translateX左右摇晃2次 | 400ms | --ease-in-out |
| 正确答案高亮 | 选错后1.5s | scale(1.0→1.1→1.0)闪烁2次 | 800ms | --ease-bounce |
| 题目切换 | 1.5s后 | 旧题目上滑出+新题目下滑入 | 300ms | --ease-out |
| 进度条更新 | 切换题目时 | 宽度增长 | 600ms | --ease-out |
| 星星收集弹窗 | 每5题 | 从底部弹入+星星弹跳 | 400ms | --ease-bounce |
| 完成弹窗 | 所有题完成 | 从底部弹入 | 400ms | --ease-bounce |
| 喇叭波纹 | 点击喇叭 | 圆形波纹扩散 | 600ms | ease-out |

### 4.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 中央显示加载动画 | getReviewList加载中 |
| **认读题型** | 题目显示汉字，选项为4张图片 | 看字选图 |
| **听音辨字** | 题目显示喇叭图标，选项为4个汉字 | 听音选字 |
| **选词填空** | 题目显示图片，选项为4个词组 | 看图选词 |
| **答题中** | 显示当前题目和选项 | 默认状态 |
| **选对** | 选项变绿 + 反馈动画 | 答对 |
| **选错** | 选项变红 + 摇晃 + 鼓励语 | 答错 |
| **全部完成** | 复习完成弹窗 | 所有题答完 |
| **空状态** | "今天没有需要复习的字了！" + 吉祥物开心形象 + "返回首页"按钮 | getReviewList返回空 |
| **网络错误** | "加载失败" + 重试按钮 | API失败 |

### 4.8 响应式考量

| 屏幕高度 | 适配策略 |
|----------|----------|
| 高屏（≥812px） | 选项卡片增大至160x160rpx，题目区域增大 |
| 标准屏（667-811px） | 按默认尺寸 |
| 低屏（≤666px） | 选项卡片缩至120x120rpx，间距16rpx |
| 横屏 | 不支持 |

---

## 5. 字典浏览页（packageLearn/dictionary/dictionary）

### 5.1 页面布局描述

字典风格的汉字浏览页面，支持搜索和筛选：

```
┌──────────────────────────────────┐
│         状态栏（系统）            │
├──────────────────────────────────┤
│ [←]      汉字字典          [搜索] │ ← 顶部导航栏（固定）
├──────────────────────────────────┤
│  ┌──────────────────────────────┐│
│  │ 🔍 搜索汉字...               ││ ← 搜索框
│  └──────────────────────────────┘│
│                                    │
│  全部 | 已学 | 未学 | 易错         │ ← 筛选Tab栏
│                                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │ 大 │ │ 小 │ │ 天 │ │ 太 │    │ ← 汉字网格（4列）
│  │ ✅  │ │ ✅  │ │ 🔒  │ │ 🔒  │    │   每个字一个卡片
│  └────┘ └────┘ └────┘ └────┘    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │ 木 │ │ 林 │ │ 水 │ │ 火 │    │
│  │ ✅  │ │ ⭐  │ │ 🔒  │ │ 🔒  │    │
│  └────┘ └────┘ └────┘ └────┘    │
│                                    │
│  已学 45 / 共 300 字              │ ← 底部统计
├──────────────────────────────────┤
│  [首页]  [地图]  [报告]  [我的]   │ ← 底部Tab栏
└──────────────────────────────────┘
```

### 5.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角 |
| 页面标题 | auto | --color-text-primary | - | - | "汉字字典"，H1(40rpx)，Bold |
| 搜索按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 右上角搜索图标 |
| 搜索框 | 宽90%，高80rpx | --color-bg-card | --radius-xl | --shadow-sm | 左侧搜索图标+输入框 |
| 搜索框-图标 | 32x32rpx | --color-text-secondary | - | - | 放大镜图标 |
| 搜索框-占位文字 | auto | --color-text-disabled | - | - | "搜索汉字..."，Body(26rpx) |
| 筛选Tab | 等分宽，高64rpx | 选中=--color-primary-default/未选=透明 | --radius-full | - | "全部/已学/未学/易错" |
| 筛选Tab文字 | auto | 选中=#FFFFFF/未选=--color-text-secondary | - | - | Body(26rpx)，选中Bold |
| 汉字卡片 | 152x152rpx | --color-bg-card | --radius-md | --shadow-sm | 4列网格 |
| 汉字卡片-字 | auto | --color-text-primary | - | - | 字号H2(34rpx)，阿里妈妈东方大楷 |
| 汉字卡片-状态图标 | 24x24rpx | 已学=--color-success/未学=--color-text-disabled/易错=--color-error | - | - | 右上角状态标记 |
| 汉字卡片-选中态 | 152x152rpx | 边框--color-primary-default，2rpx | --radius-md | --shadow-primary | 选中时高亮 |
| 汉字详情弹窗 | 宽86% | --color-bg-card | --radius-lg | --shadow-xl | 点击字卡弹出 |
| 底部统计 | auto | --color-text-secondary | - | - | "已学45/共300字"，Caption(22rpx) |
| 底部Tab栏 | 同首页 | 同首页 | 同首页 | 同首页 | - |

**汉字详情弹窗**：
- 汉字大字：字号Display(48rpx)，阿里妈妈东方大楷，居中
- 拼音：字号H3(30rpx)，--color-text-secondary
- 部首/笔画：字号Body(26rpx)
- 配图：120x120rpx
- 例词：2-3个词组，字号Body-L(28rpx)
- 听发音按钮：--color-secondary-mint，高80rpx
- 关闭按钮：右上角×
- 动效：从底部滑入，--duration-slow(400ms)

### 5.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 汉字列表 | getCharacters | `characters[].char, pinyin, radical, stroke_count, image_fileid, words[]` | 字卡网格 |
| 学习状态 | getProgress | `progress[].status, characters[].is_learned` | 字卡状态图标 |
| 易错标记 | getProgress | `characters[].is_weak` | 易错筛选 |
| 总字数 | getCharacters | `total` | 底部统计 |
| 已学字数 | getProgress | `summary.total_learned` | 底部统计 |
| 音频fileID | getAudioUrl | `audioMap[charId]` | 详情弹窗发音 |

### 5.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 点击搜索框 | tap | 展开搜索输入，弹出键盘 | 边框变色 |
| 输入搜索 | input | 实时筛选匹配的汉字 | 列表实时更新 |
| 点击筛选Tab | tap | 切换筛选条件，列表更新 | Tab高亮切换 |
| 点击汉字卡片 | tap | 弹出汉字详情弹窗 | 卡片缩放 + 弹窗 |
| 点击听发音 | tap（弹窗内） | 播放发音 | 波纹动画 |
| 点击弹窗外 | tap | 关闭弹窗 | 弹窗淡出 |
| 上拉加载 | scrollToLower | 加载更多汉字 | 加载动画 |
| 下拉刷新 | pullDownRefresh | 重新加载字卡 | 刷新动画 |
| 点击Tab栏 | tap | 切换页面 | Tab高亮 |

### 5.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 搜索框背景 | --color-bg-card | #FFFFFF |
| 搜索框边框（聚焦） | --color-primary-default | #FF8C42 |
| 筛选Tab选中 | --color-primary-default | #FF8C42 |
| 汉字卡片背景 | --color-bg-card | #FFFFFF |
| 汉字文字 | --color-text-primary | #3D3D3D |
| 已学图标 | --color-success | #52C41A |
| 未学图标 | --color-text-disabled | #BFBFBF |
| 易错图标 | --color-error | #FF7875 |
| 卡片选中边框 | --color-primary-default | #FF8C42 |
| 听发音按钮 | --color-secondary-mint | #4ECDC4 |
| 底部统计文字 | --color-text-secondary | #8A8A8A |

### 5.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 卡片加载 | 页面/筛选切换 | 依次淡入+scale(0.8→1) | 每个间隔50ms | --ease-out |
| 筛选切换 | 点击Tab | 列表淡出→新列表淡入 | 250ms | --ease-out |
| 详情弹窗 | 点击字卡 | 从底部滑入 | 400ms | --ease-bounce |
| 弹窗关闭 | 点击外部/关闭 | 向下滑出+淡出 | 250ms | --ease-in |
| 搜索框聚焦 | tap | 边框颜色过渡 | 150ms | --ease-out |
| 卡片点击 | tap | scale(0.95→1.0) | 150ms | --ease-out |
| 听发音波纹 | tap | 圆形波纹扩散 | 600ms | ease-out |
| 页面进入 | onLoad | 从右滑入 | 250ms | --ease-out |

### 5.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 网格区域显示骨架屏（灰色方块占位） | getCharacters加载中 |
| **正常状态** | 按筛选条件显示汉字网格 | 默认 |
| **搜索结果空** | 中央显示"没有找到相关汉字"+空状态插画 | 搜索无匹配 |
| **未学筛选空** | "还没有未学的字了，太棒了！" + 吉祥物欢呼 | 未学列表为空 |
| **易错筛选空** | "没有易错字，继续保持！" | 易错列表为空 |
| **网络错误** | "加载失败" + 重试按钮 | API失败 |

### 5.8 响应式考量

| 屏幕宽度 | 适配策略 |
|----------|----------|
| 宽屏（≥414px） | 网格4列，卡片152x152rpx |
| 标准屏（375-413px） | 网格4列，卡片140x140rpx |
| 窄屏（≤374px） | 网格3列，卡片160x160rpx |

---

## 6. 学习报告页（packageAchieve/report/report）

### 6.1 页面布局描述

```
┌──────────────────────────────────┐
│         状态栏（系统）            │
├──────────────────────────────────┤
│ [←]      学习报告                │ ← 顶部导航栏（固定）
│         本周 · 本月              │ ← 周期切换Tab
├──────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐ │
│  │  本周学习概览                 │ │
│  │  ┌────┐ ┌────┐ ┌────┐       │ │ ← 概览卡片
│  │  │ 15 │ │ 5  │ │ 24 │       │ │   3个数据块
│  │  │新字│ │天数│ │星星│       │ │
│  │  └────┘ └────┘ └────┘       │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  📊 每日学习字数              │ │
│  │                              │ │
│  │    5 ┃  ██                   │ │ ← 柱状图
│  │    4 ┃  ██  ██               │ │
│  │    3 ┃  ██  ██  ██           │ │
│  │    2 ┃  ██  ██  ██  ██       │ │
│  │    1 ┃  ██  ██  ██  ██  ██   │ │
│  │      ┗━━━━━━━━━━━━━━━━━━━━━  │ │
│  │       一  二  三  四  五  六  日│ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🎯 识字进度                  │ │
│  │         ┌─────┐               │ │
│  │        ╱      ╲               │ │ ← 进度环
│  │       │  45%  │               │ │   圆形进度
│  │        ╲      ╱               │ │
│  │         └─────┘               │ │
│  │  已学135  未学165  需复习12   │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🌻 成长花园                  │ │
│  │  🌸🌼🌻🌷🌹🌺                │ │ ← 成长花园
│  │  每学会一个字，花园就多一朵花  │ │   可视化
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  📝 建议复习                  │ │
│  │  大  小  天  太               │ │ ← 薄弱字列表
│  │  木  林  水  火               │ │   横向滚动
│  └──────────────────────────────┘ │
│                                    │
├──────────────────────────────────┤
│  [首页]  [地图]  [报告]  [我的]   │ ← 底部Tab栏
└──────────────────────────────────┘
```

### 6.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角 |
| 页面标题 | auto | --color-text-primary | - | - | "学习报告"，H1(40rpx)，Bold |
| 周期切换Tab | 2等分，高56rpx | 选中=--color-secondary-green/未选=--color-bg-card | --radius-full | - | "本周/本月" |
| 周期Tab文字 | auto | 选中=#FFFFFF/未选=--color-text-secondary | - | - | Body(26rpx) |
| 概览卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 包含3个数据块 |
| 数据块 | 3等分 | 透明 | - | - | 内含数字+标签 |
| 数据块-数字 | auto | --color-primary-default | - | - | Fredoka，Bold，字号Display(48rpx) |
| 数据块-标签 | auto | --color-text-secondary | - | - | "新字/天数/星星"，Caption(22rpx) |
| 柱状图卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 每日学习字数 |
| 柱状图-标题 | auto | --color-text-primary | - | - | "每日学习字数"，H3(30rpx) |
| 柱状图-柱子 | 宽40rpx | --gradient-green | --radius-xs | - | 嫩芽绿渐变柱 |
| 柱状图-坐标 | auto | --color-text-secondary | - | - | Caption(22rpx) |
| 进度环卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 识字进度 |
| 进度环 | 200x200rpx | 环色--color-secondary-green，底色#FFE8D1 | - | - | 圆形进度环 |
| 进度环-百分比 | auto | --color-text-primary | - | - | "45%"，Display(48rpx)，Bold |
| 进度环-图例 | auto | --color-text-secondary | - | - | "已学/未学/需复习"，Caption(22rpx) |
| 成长花园卡片 | 宽100%，高160rpx | --color-bg-card | --radius-lg | --shadow-md | 花朵可视化 |
| 成长花园-花朵 | 48x48rpx | 多色 | - | - | SVG花朵图标 |
| 薄弱字卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 薄弱字列表 |
| 薄弱字-标题 | auto | --color-text-primary | - | - | "建议复习"，H3(30rpx) |
| 薄弱字-字卡 | 80x80rpx | --color-bg-page | --radius-sm | - | 单字卡片 |
| 薄弱字-文字 | auto | --color-text-primary | - | - | 字号Body-L(28rpx)，东方大楷 |
| 底部Tab栏 | 同首页 | 同首页 | 同首页 | 同首页 | 报告高亮嫩芽绿 |

### 6.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 周新学字数 | getLearnStats | `summary.new_chars_learned` | 概览数据块 |
| 周学习天数 | getLearnStats | `summary.active_days` | 概览数据块 |
| 周获得星星 | getLearnStats | `summary.total_stars_earned` | 概览数据块 |
| 每日统计 | getLearnStats | `dailyStats[].new_chars_learned, date` | 柱状图 |
| 累计识字量 | getUserInfo | `user.total_learned` | 进度环已学 |
| 总字数 | getCharacters | `total` | 进度环总数 |
| 需复习字数 | getReviewList | `characters.length` | 进度环需复习 |
| 薄弱字列表 | getReport | `report.weak_characters[]` | 薄弱字列表 |
| 学习报告 | getReport | `report.{period}` | 整体报告数据 |
| 学习时长 | getLearnStats | `dailyStats[].study_duration_seconds` | 可选展示 |

### 6.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 切换周期Tab | tap | 切换本周/本月数据，图表刷新 | Tab高亮 + 数据动画刷新 |
| 点击薄弱字 | tap | 跳转到 packageLearn/card/card，传参 characterId | 页面跳转 |
| 点击柱状图柱子 | tap | 显示当日详细数据Tooltip | Tooltip弹出 |
| 下拉刷新 | pullDownRefresh | 重新加载统计数据 | 刷新动画 |
| 点击Tab栏 | tap | 切换页面 | Tab高亮 |
| 滚动页面 | swipe | 纵向滚动查看所有卡片 | 惯性滚动 |

### 6.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 卡片背景 | --color-bg-card | #FFFFFF |
| 数据块数字 | --color-primary-default | #FF8C42 |
| 周期Tab选中 | --color-secondary-green | #95E1A3 |
| 柱状图柱子 | --gradient-green | #95E1A3 → #B8EFC2 |
| 进度环-进度色 | --color-secondary-green | #95E1A3 |
| 进度环-底色 | --color-border-default | #FFE8D1 |
| 薄弱字卡片背景 | --color-bg-page | #FFF9F0 |
| 薄弱字文字 | --color-text-primary | #3D3D3D |
| Tab栏-报告高亮 | --color-secondary-green | #95E1A3 |

### 6.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 数据块数字 | 页面加载 | 从0滚动到目标数字 | 800ms | --ease-out |
| 柱状图柱子 | 页面加载 | 从底部生长到目标高度 | 600ms | --ease-bounce |
| 进度环填充 | 页面加载 | stroke-dashoffset从满到目标 | 1000ms | --ease-out |
| 花朵绽放 | 页面加载 | 逐个scale(0→1)+旋转 | 每个间隔100ms | --ease-bounce |
| 周期切换 | tap | 数据重新动画 | 同上 | 同上 |
| 卡片出现 | 滚动进入视口 | 淡入+上移 | 250ms | --ease-out |
| 页面进入 | onLoad | 从右滑入 | 250ms | --ease-out |

### 6.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 各卡片显示骨架屏 | getLearnStats/getReport加载中 |
| **本周无数据** | 柱状图全0，"本周还没开始学习哦" | 新用户或本周未学习 |
| **正常状态** | 显示完整数据和图表 | 有学习记录 |
| **薄弱字为空** | "没有薄弱字，太棒了！" + 吉祥物点赞 | 无薄弱字 |
| **网络错误** | "加载失败" + 重试按钮 | API失败 |

### 6.8 响应式考量

| 屏幕高度 | 适配策略 |
|----------|----------|
| 高屏（≥812px） | 进度环增至240rpx，花园花朵增大 |
| 标准屏（667-811px） | 按默认尺寸 |
| 低屏（≤666px） | 进度环缩至160rpx，柱状图高度减半 |
| 横屏 | 不支持 |

---

## 7. 成就墙页（packageAchieve/achievements/achievements）

### 7.1 页面布局描述

```
┌──────────────────────────────────┐
│         状态栏（系统）            │
├──────────────────────────────────┤
│ [←]      成就墙                  │ ← 顶部导航栏（固定）
├──────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐ │
│  │        ⭐ 总星星数             │ │ ← 星星总数卡片
│  │         128                   │ │   大数字展示
│  │    ━━━━━━━━━━━━ 下一里程碑     │ │   进度条
│  │    距"200字达人"还差72颗       │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🔥 连胜火焰                  │ │ ← 连胜火焰卡片
│  │      [火焰动画]               │ │
│  │      连续学习 7 天             │ │
│  │  "坚持学习，火焰会更旺哦！"    │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🏅 勋章墙                    │ │ ← 勋章墙
│  │  ┌────┐ ┌────┐ ┌────┐       │ │   3列网格
│  │  │ 🏆  │ │ 🎖  │ │ 🔒  │       │ │
│  │  │初学者│ │7天  │ │100字│       │ │
│  │  │已解锁│ │已解锁│ │未解锁│       │ │
│  │  └────┘ └────┘ └────┘       │ │
│  │  ┌────┐ ┌────┐ ┌────┐       │ │
│  │  │ 🔒  │ │ 🔒  │ │ 🔒  │       │ │
│  │  │200字│ │300字│ │500字│       │ │
│  │  │未解锁│ │未解锁│ │未解锁│       │ │
│  │  └────┘ └────┘ └────┘       │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🎨 角色皮肤                  │ │ ← 兑换区
│  │  ┌────┐ ┌────┐ ┌────┐       │ │
│  │  │皮肤1│ │皮肤2│ │皮肤3│       │ │
│  │  │✅   │ │50⭐ │ │100⭐│       │ │
│  │  └────┘ └────┘ └────┘       │ │
│  └──────────────────────────────┘ │
│                                    │
├──────────────────────────────────┤
│  [首页]  [地图]  [报告]  [我的]   │ ← 底部Tab栏
└──────────────────────────────────┘
```

### 7.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角 |
| 页面标题 | auto | --color-text-primary | - | - | "成就墙"，H1(40rpx)，Bold |
| 星星总数卡片 | 宽100%，高180rpx | --gradient-warm | --radius-lg | --shadow-primary | 暖阳渐变背景 |
| 星星总数-图标 | 64x64rpx | #FFFFFF | - | - | 白色星星 |
| 星星总数-数字 | auto | #FFFFFF | - | - | Fredoka，Heavy，Display(48rpx) |
| 星星总数-标签 | auto | rgba(255,255,255,0.85) | - | - | "总星星数"，Body(26rpx) |
| 星星总数-进度条 | 宽80%，高8rpx | 背景 rgba(255,255,255,0.3)，填充#FFFFFF | --radius-full | - | 下一里程碑进度 |
| 星星总数-提示 | auto | rgba(255,255,255,0.85) | - | - | Caption(22rpx) |
| 连胜火焰卡片 | 宽100%，高200rpx | --color-bg-card | --radius-lg | --shadow-md | 白色背景 |
| 火焰动画 | 120x120rpx | 多色（橙/黄渐变） | - | - | Lottie或帧动画 |
| 连胜天数 | auto | --color-primary-default | - | - | "连续学习7天"，H2(34rpx)，Bold |
| 连胜提示 | auto | --color-text-secondary | - | - | "坚持学习，火焰会更旺" |
| 勋章墙卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 包含勋章网格 |
| 勋章墙-标题 | auto | --color-text-primary | - | - | "勋章墙"，H3(30rpx) |
| 勋章卡片 | 192x192rpx | 已解锁=--color-bg-card/未解锁=--color-bg-page | --radius-md | 已解锁=--shadow-sm | 3列网格 |
| 勋章-图标 | 80x80rpx | 已解锁=--color-accent-gold/未解锁=--color-text-disabled | - | - | 奖杯/勋章图标 |
| 勋章-名称 | auto | 已解锁=--color-text-primary/未解锁=--color-text-disabled | - | - | "初学者/7天/100字"，Body(26rpx) |
| 勋章-状态 | auto | 已解锁=--color-success/未解锁=--color-text-secondary | - | - | "已解锁/未解锁"，Caption(22rpx) |
| 兑换区卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 皮肤兑换 |
| 兑换区-标题 | auto | --color-text-primary | - | - | "角色皮肤"，H3(30rpx) |
| 皮肤卡片 | 192x192rpx | --color-bg-card | --radius-md | --shadow-sm | 3列网格 |
| 皮肤-预览 | 120x120rpx | - | - | - | 皮肤预览图 |
| 皮肤-状态 | auto | 已兑换=--color-success/未兑换=--color-accent-gold | - | - | "已拥有/需N⭐" |
| 底部Tab栏 | 同首页 | 同首页 | 同首页 | 同首页 | - |

### 7.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 总星星数 | getUserInfo | `user.total_stars` | 星星总数展示 |
| 累计识字量 | getUserInfo | `user.total_learned` | 里程碑计算 |
| 成就列表 | getAchievements | `achievements[].code, title, description, icon, threshold, reward_stars` | 勋章墙数据 |
| 已解锁成就 | getAchievements | `unlocked[].achievement_id, unlocked_at` | 勋章解锁状态 |
| 连胜天数 | getLearnStats | `summary.streak_days` | 连胜火焰 |
| 皮肤列表 | getAchievements | `achievements[?type='skin']` | 兑换区 |
| 皮肤拥有状态 | getAchievements | `unlocked[?type='skin']` | 皮肤状态 |

### 7.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 点击已解锁勋章 | tap | 弹出勋章详情弹窗（获得时间、描述） | 弹窗 + 音效 |
| 点击未解锁勋章 | tap | 弹出解锁条件弹窗（"学习N字后解锁"） | 弹窗 |
| 点击可兑换皮肤 | tap | 弹出兑换确认弹窗 | 确认弹窗 |
| 确认兑换 | tap（弹窗内） | 扣除星星，解锁皮肤，弹出成功弹窗 | 成功动画 |
| 点击已拥有皮肤 | tap | 弹出皮肤预览，可选择"装备" | 预览弹窗 |
| 点击Tab栏 | tap | 切换页面 | Tab高亮 |
| 下拉刷新 | pullDownRefresh | 重新加载成就数据 | 刷新动画 |

**兑换确认弹窗**：
- 背景：--color-bg-overlay
- 弹窗：宽80%，--color-bg-card，--radius-2xl(48rpx)
- 标题："确认兑换？"
- 内容：皮肤预览 + "消耗N颗星星"
- 按钮1："确认兑换"——主按钮，--gradient-warm
- 按钮2："再想想"——次级文字按钮

**兑换成功弹窗**：
- 全屏彩带飘落动画
- 皮肤放大展示
- "兑换成功！"，Display(48rpx)
- "已装备到字宝"，Body(26rpx)
- 按钮："太棒了"——主按钮
- 动效：--duration-celebrate(1200ms)

### 7.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 星星总数卡片背景 | --gradient-warm | #FF8C42 → #FFD93D |
| 星星总数文字 | --color-text-inverse | #FFFFFF |
| 连胜火焰卡片 | --color-bg-card | #FFFFFF |
| 火焰色 | --color-primary-default → --color-accent-yellow | #FF8C42 → #FFD93D |
| 连胜天数文字 | --color-primary-default | #FF8C42 |
| 勋章墙卡片 | --color-bg-card | #FFFFFF |
| 已解锁勋章图标 | --color-accent-gold | #FFB627 |
| 未解锁勋章图标 | --color-text-disabled | #BFBFBF |
| 已解锁勋章状态 | --color-success | #52C41A |
| 兑换区卡片 | --color-bg-card | #FFFFFF |
| 可兑换皮肤价格 | --color-accent-gold | #FFB627 |
| 已拥有皮肤 | --color-success | #52C41A |
| Tab栏 | 同首页 | - |

### 7.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 星星总数数字 | 页面加载 | 从0滚动到目标 | 1000ms | --ease-out |
| 星星总数进度条 | 页面加载 | 宽度从0→目标% | 800ms | --ease-out |
| 火焰动画 | 持续循环 | Lottie火焰摇曳 | 循环 | - |
| 勋章出现 | 页面加载 | 依次scale(0→1)+弹跳 | 每个间隔100ms | --ease-bounce |
| 已解锁勋章光效 | 持续 | 金色微光闪烁 | 2000ms循环 | ease-in-out |
| 兑换成功彩带 | 确认兑换后 | 全屏彩带飘落 | 2000ms | --ease-in-out |
| 皮肤放大 | 兑换成功 | scale(0→1.2→1.0) | 800ms | --ease-bounce |
| 弹窗出现 | 点击勋章/皮肤 | 从底部滑入 | 400ms | --ease-bounce |
| 页面进入 | onLoad | 从右滑入 | 250ms | --ease-out |

### 7.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 各卡片骨架屏 | getAchievements加载中 |
| **新用户（0星）** | 星星总数0，火焰未点燃"快开始学习吧"，所有勋章未解锁 | 新用户 |
| **正常状态** | 按实际数据展示 | 有学习记录 |
| **连胜中断** | 火焰变暗，"连胜中断了，重新开始吧！" | streak_days=0 |
| **网络错误** | "加载失败" + 重试 | API失败 |

### 7.8 响应式考量

| 屏幕宽度 | 适配策略 |
|----------|----------|
| 宽屏（≥414px） | 勋章/皮肤4列 |
| 标准屏（375-413px） | 勋章/皮肤3列 |
| 窄屏（≤374px） | 勋章/皮肤3列，卡片缩小至160x160rpx |

---

## 8. 家长中心页（packageParent/parent/parent）

### 8.1 页面布局描述

家长端页面，信息密度高于儿童端，进入前需家长验证：

```
┌──────────────────────────────────┐
│         状态栏（系统）            │
├──────────────────────────────────┤
│ [←]      家长中心                │ ← 顶部导航栏（固定）
├──────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐ │
│  │  👦 小明 · 6岁                 │ │ ← 孩子信息卡片
│  │  累计识字 135 字  ·  ⭐ 128    │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  📊 今日学习                  │ │ ← 今日学习卡片
│  │  ┌────┐ ┌────┐ ┌────┐       │ │
│  │  │ 5  │ │12' │ │85% │       │ │
│  │  │新字│ │分钟│ │正确率│      │ │
│  │  └────┘ └────┘ └────┘       │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  📅 本周学习日历              │ │ ← 学习日历
│  │  一  二  三  四  五  六  日   │ │
│  │  ✓   ✓   ✓   ✓   -   -   -   │ │
│  │  3字 5字 2字 4字              │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  ⏱️ 学习时长管理              │ │ ← 时长管理
│  │  每日学习时长                  │ │
│  │  [5] [10] [15✓] [20] 分钟    │ │ ← 四档选择
│  │                                │ │
│  │  休息提醒间隔                  │ │
│  │  [每5分钟] [每10分钟✓]        │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  📝 字表查看                  │ │ ← 字表管理
│  │  已学 135 · 未学 165 · 易错 8 │ │
│  │  [查看完整字表]               │ │
│  │  [薄弱字：大 小 天 太...]     │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  👁️ 护眼模式      [开关 ON]  │ │ ← 护眼模式
│  │  开启后降低蓝光，调暖色调      │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  📄 学习报告                  │ │ ← 详细报告
│  │  查看周报/月报                │ │
│  │  [查看最新报告]               │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  ⚙️ 设置                      │ │ ← 设置入口
│  │  声音/通知/账号               │ │
│  └──────────────────────────────┘ │
│                                    │
├──────────────────────────────────┤
│  [首页]  [地图]  [报告]  [我的]   │ ← 底部Tab栏
└──────────────────────────────────┘
```

### 8.2 家长验证入口

进入家长中心前需要通过验证（Spec AC10）：

**验证方式：算术题**
- 弹窗背景：--color-bg-overlay
- 验证弹窗：宽80%，--color-bg-card，--radius-2xl(48rpx)
- 标题："家长验证"，H2(34rpx)，Bold
- 题目："7 + 6 = ?"，字号H1(40rpx)
- 输入框：宽60%，高80rpx，--radius-sm
- 按钮："确认"——主按钮，--gradient-warm
- 说明："为了防止孩子误入，请完成验证"，Caption(22rpx)
- 验证失败：Toast"答案不正确，请重试"，更换题目
- 动效：从底部弹入，--duration-slow(400ms)

### 8.3 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角 |
| 页面标题 | auto | --color-text-primary | - | - | "家长中心"，H1(40rpx)，Bold |
| 孩子信息卡片 | 宽100%，高120rpx | --color-bg-card | --radius-lg | --shadow-md | 头像+昵称+年龄+统计 |
| 孩子头像 | 64x64rpx | 圆形 | --radius-full | - | 左侧 |
| 孩子昵称 | auto | --color-text-primary | - | - | "小明 · 6岁"，H3(30rpx) |
| 孩子统计 | auto | --color-text-secondary | - | - | "累计识字135字 · ⭐128"，Body(26rpx) |
| 今日学习卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 3个数据块 |
| 数据块 | 3等分 | 透明 | - | - | 数字+标签 |
| 数据块-数字 | auto | --color-primary-default | - | - | Fredoka，Bold，H1(40rpx) |
| 数据块-标签 | auto | --color-text-secondary | - | - | "新字/分钟/正确率"，Caption(22rpx) |
| 学习日历卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 7天日历 |
| 日历-天 | 7等分 | --color-text-secondary | - | - | "一二三四五六日"，Caption(22rpx) |
| 日历-状态 | 7等分 | 已学=--color-success/未学=--color-text-disabled | - | - | ✓或- |
| 日历-字数 | 7等分 | --color-text-primary | - | - | "3字"，Caption(22rpx) |
| 时长管理卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 时长设置 |
| 时长选项 | 4等分，高64rpx | 选中=--color-primary-default/未选=--color-bg-page | --radius-full | - | "5/10/15/20分钟" |
| 时长选项文字 | auto | 选中=#FFFFFF/未选=--color-text-primary | - | - | Body(26rpx) |
| 休息提醒选项 | 2等分，高64rpx | 同上 | --radius-full | - | "每5/10分钟" |
| 字表管理卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 字表统计和入口 |
| 字表统计 | auto | --color-text-secondary | - | - | "已学135·未学165·易错8" |
| 查看字表按钮 | 宽100%，高72rpx | --color-bg-page | --radius-xl | - | "查看完整字表" |
| 薄弱字预览 | auto | --color-text-primary | - | - | "大 小 天 太..." |
| 护眼模式卡片 | 宽100%，高100rpx | --color-bg-card | --radius-lg | --shadow-md | 开关 |
| 护眼开关 | 80x48rpx | 开=--color-secondary-green/关=--color-text-disabled | --radius-full | - | Toggle开关 |
| 报告入口卡片 | 宽100%，高100rpx | --color-bg-card | --radius-lg | --shadow-md | 跳转报告 |
| 设置入口卡片 | 宽100%，高100rpx | --color-bg-card | --radius-lg | --shadow-md | 跳转设置 |
| 底部Tab栏 | 同首页 | 同首页 | 同首页 | 同首页 | "我的"高亮中灰 |

### 8.4 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 用户昵称 | getUserInfo | `user.nickname` | 孩子信息 |
| 用户头像 | getUserInfo | `user.avatar` | 孩子信息 |
| 出生年月 | getUserInfo | `user.birth_date` | 计算年龄 |
| 累计识字量 | getUserInfo | `user.total_learned` | 孩子信息统计 |
| 总星星数 | getUserInfo | `user.total_stars` | 孩子信息统计 |
| 今日新学字数 | getLearnStats | `dailyStats[0].new_chars_learned` | 今日学习 |
| 今日学习时长 | getLearnStats | `dailyStats[0].study_duration_seconds` | 今日学习 |
| 今日正确率 | getLearnStats | `dailyStats[0].accuracy_rate` | 今日学习 |
| 本周日历 | getLearnStats | `dailyStats[]` | 学习日历 |
| 每日时长限制 | getUserInfo | `user.settings.daily_time_limit` | 时长管理 |
| 已学/未学/易错 | getReport | `report.summary` | 字表管理 |
| 薄弱字列表 | getReport | `report.weak_characters[]` | 字表管理 |
| 护眼模式 | getUserInfo | `user.settings.eye_protection` | 护眼开关 |
| 学习报告 | getReport | `report.{period}` | 报告入口 |

### 8.5 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 进入页面 | onShow | 弹出家长验证弹窗（算术题） | 弹窗 |
| 验证通过 | 确认答案 | 关闭弹窗，加载数据 | 弹窗淡出 |
| 验证失败 | 确认答案 | Toast"答案不正确"，更换题目 | Toast |
| 切换时长选项 | tap | 更新每日时长限制 | 选项高亮切换 + 调用updateUser |
| 切换休息提醒 | tap | 更新提醒间隔 | 选项高亮切换 |
| 切换护眼模式 | tap | 开启/关闭护眼模式 | 开关动画 + 页面色调变化 |
| 点击查看字表 | tap | 跳转到字表详情页（可复用字典页） | 页面跳转 |
| 点击薄弱字 | tap | 跳转到识字卡片页复习该字 | 页面跳转 |
| 点击查看报告 | tap | 跳转到学习报告页（家长视角，更详细） | 页面跳转 |
| 点击设置入口 | tap | 跳转到设置页 | 页面跳转 |
| 点击Tab栏 | tap | 切换页面 | Tab高亮 |
| 下拉刷新 | pullDownRefresh | 重新加载数据 | 刷新动画 |

### 8.6 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 卡片背景 | --color-bg-card | #FFFFFF |
| 数据数字 | --color-primary-default | #FF8C42 |
| 日历已学标记 | --color-success | #52C41A |
| 日历未学标记 | --color-text-disabled | #BFBFBF |
| 时长选中 | --color-primary-default | #FF8C42 |
| 护眼开关-开 | --color-secondary-green | #95E1A3 |
| 护眼开关-关 | --color-text-disabled | #BFBFBF |
| 二级文字 | --color-text-secondary | #8A8A8A |
| 验证弹窗背景 | --color-bg-card | #FFFFFF |
| Tab栏-我的高亮 | --color-text-secondary | #8A8A8A |

> **设计说明**：家长中心整体风格比儿童端更简洁、信息密度更高，但保持品牌一致性。色调以中性灰+暖橙强调为主，减少装饰性插画，增加数据展示。

### 8.7 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| 验证弹窗 | 进入页面 | 从底部弹入 | 400ms | --ease-bounce |
| 数据数字 | 数据加载完成 | 从0滚动到目标 | 800ms | --ease-out |
| 时长选项切换 | tap | 高亮色过渡 | 150ms | --ease-out |
| 护眼开关 | tap | 滑块滑动+颜色过渡 | 250ms | --ease-in-out |
| 卡片出现 | 滚动进入视口 | 淡入+上移 | 250ms | --ease-out |
| 页面进入 | onLoad | 从右滑入 | 250ms | --ease-out |

### 8.8 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **验证中** | 验证弹窗显示，页面背景模糊 | 进入页面时 |
| **验证失败** | Toast"答案不正确"，弹窗更换题目 | 答错 |
| **加载中** | 各卡片骨架屏 | 数据加载中 |
| **今日未学习** | 今日学习卡片显示"今天还没有学习哦" | dailyStats为空 |
| **本周未学习** | 日历全部显示-，"本周还没有学习记录" | 新用户 |
| **网络错误** | "加载失败" + 重试 | API失败 |

### 8.9 响应式考量

| 屏幕高度 | 适配策略 |
|----------|----------|
| 高屏（≥812px） | 卡片间距增大，数据块字号增大 |
| 标准屏（667-811px） | 按默认尺寸 |
| 低屏（≤666px） | 卡片间距压缩，数据块字号减小至H2(34rpx) |
| 横屏 | 不支持 |

---

## 9. 设置页（packageParent/settings/settings）

### 9.1 页面布局描述

```
┌──────────────────────────────────┐
│         状态栏（系统）            │
├──────────────────────────────────┤
│ [←]      设置                    │ ← 顶部导航栏（固定）
├──────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🔊 声音设置                  │ │ ← 声音设置卡片
│  │                              │ │
│  │  音效            [开关 ON]   │ │
│  │  背景音乐        [开关 ON]   │ │
│  │  音量            ━━━●━━━ 60% │ │
│  │  自动播放发音    [开关 ON]   │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🔔 通知设置                  │ │ ← 通知设置卡片
│  │                              │ │
│  │  学习提醒        [开关 ON]   │ │
│  │  提醒时间        19:00 >     │ │
│  │  复习提醒        [开关 ON]   │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  👤 账号管理                  │ │ ← 账号管理卡片
│  │                              │ │
│  │  头像            [当前头像] > │ │
│  │  昵称            小明 >       │ │
│  │  出生日期        2020-03-15 > │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  ℹ️ 关于                      │ │ ← 关于卡片
│  │                              │ │
│  │  版本号          v1.0.0      │ │
│  │  用户协议                    > │ │
│  │  隐私政策                    > │ │
│  │  联系我们                    > │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  🚪 退出登录                  │ │ ← 退出按钮
│  └──────────────────────────────┘ │
│                                    │
└──────────────────────────────────┘
```

### 9.2 组件清单

| 组件名称 | 尺寸 | 颜色 | 圆角 | 阴影 | 说明 |
|----------|------|------|------|------|------|
| 返回按钮 | 64x64rpx | --color-text-primary | --radius-full | - | 左上角 |
| 页面标题 | auto | --color-text-primary | - | - | "设置"，H1(40rpx)，Bold |
| 设置卡片 | 宽100% | --color-bg-card | --radius-lg | --shadow-md | 分组卡片 |
| 卡片标题 | auto | --color-text-primary | - | - | "声音设置/通知设置/..."，H3(30rpx) |
| 设置项-标签 | auto | --color-text-primary | - | - | "音效/背景音乐/音量..."，Body(26rpx) |
| 设置项-值 | auto | --color-text-secondary | - | - | "小明/v1.0.0/19:00"，Body(26rpx) |
| 设置项-箭头 | 32x32rpx | --color-text-secondary | - | - | 右箭头 |
| Toggle开关 | 80x48rpx | 开=--color-secondary-green/关=--color-text-disabled | --radius-full | - | 开关组件 |
| 音量滑块 | 宽50%，高48rpx | 轨道#FFE8D1，滑块--color-primary-default | --radius-full | --shadow-sm | 可拖动滑块 |
| 头像预览 | 48x48rpx | 圆形 | --radius-full | - | 账号管理中当前头像 |
| 退出登录按钮 | 宽100%，高80rpx | 背景--color-bg-card，文字--color-error | --radius-xl | --shadow-sm | 红色文字按钮 |
| 分割线 | 宽100%，1rpx | --color-border-light | - | - | 设置项之间分割 |

### 9.3 数据绑定

| 数据字段 | 来源API | 字段路径 | 用途 |
|----------|---------|----------|------|
| 音效开关 | getUserInfo | `user.settings.sound_enabled` | 声音设置 |
| 背景音乐开关 | getUserInfo | `user.settings.bgm_enabled` | 声音设置 |
| 音量 | getUserInfo | `user.settings.volume` | 音量滑块 |
| 自动播放 | getUserInfo | `user.settings.auto_play_audio` | 声音设置 |
| 学习提醒开关 | getUserInfo | `user.settings.study_reminder` | 通知设置 |
| 提醒时间 | getUserInfo | `user.settings.reminder_time` | 通知设置 |
| 复习提醒开关 | getUserInfo | `user.settings.review_reminder` | 通知设置 |
| 昵称 | getUserInfo | `user.nickname` | 账号管理 |
| 头像 | getUserInfo | `user.avatar` | 账号管理 |
| 出生日期 | getUserInfo | `user.birth_date` | 账号管理 |
| 版本号 | 本地 | `app.version` | 关于 |

### 9.4 交互细节

| 交互 | 触发方式 | 效果 | 反馈 |
|------|----------|------|------|
| 切换Toggle | tap | 开关切换，调用updateUser保存 | 开关动画 + 触觉反馈 |
| 拖动音量滑块 | touchmove | 实时调整音量 | 滑块跟随手指 |
| 点击提醒时间 | tap | 弹出时间选择器 | 系统时间选择器 |
| 点击头像 | tap | 弹出头像选择/拍照 | 操作菜单 |
| 点击昵称 | tap | 弹出输入框编辑昵称 | 编辑弹窗 |
| 点击出生日期 | tap | 弹出日期选择器 | 系统日期选择器 |
| 点击用户协议 | tap | 跳转到协议页面 | 页面跳转 |
| 点击隐私政策 | tap | 跳转到隐私政策页面 | 页面跳转 |
| 点击联系我们 | tap | 弹出联系方式 | 弹窗 |
| 点击退出登录 | tap | 弹出确认弹窗"确定退出登录吗？" | 确认弹窗 |
| 确认退出 | tap（弹窗内） | 清除登录状态，返回首页 | 跳转 |
| 点击返回 | tap | 返回上一页 | 页面返回 |

### 9.5 配色应用

| 元素 | 颜色Token | 色值 |
|------|-----------|------|
| 页面背景 | --color-bg-page | #FFF9F0 |
| 卡片背景 | --color-bg-card | #FFFFFF |
| 卡片标题 | --color-text-primary | #3D3D3D |
| 设置项标签 | --color-text-primary | #3D3D3D |
| 设置项值 | --color-text-secondary | #8A8A8A |
| 箭头 | --color-text-secondary | #8A8A8A |
| Toggle-开 | --color-secondary-green | #95E1A3 |
| Toggle-关 | --color-text-disabled | #BFBFBF |
| 音量轨道 | --color-border-default | #FFE8D1 |
| 音量滑块 | --color-primary-default | #FF8C42 |
| 退出登录文字 | --color-error | #FF7875 |
| 分割线 | --color-border-light | #FFF0E0 |

### 9.6 动效说明

| 动效 | 触发时机 | 类型 | 时长 | 缓动 |
|------|----------|------|------|------|
| Toggle切换 | tap | 滑块滑动+颜色过渡 | 250ms | --ease-in-out |
| 音量滑块 | touchmove | 滑块跟随手指 | 0ms | - |
| 卡片出现 | 滚动进入视口 | 淡入+上移 | 250ms | --ease-out |
| 页面进入 | onLoad | 从右滑入 | 250ms | --ease-out |
| 退出确认弹窗 | 点击退出 | 从底部弹入 | 400ms | --ease-bounce |

### 9.7 状态变体

| 状态 | 展示内容 | 说明 |
|------|----------|------|
| **加载中** | 设置项显示骨架屏 | getUserInfo加载中 |
| **正常状态** | 显示当前设置值 | 默认 |
| **保存中** | Toggle切换后显示"保存中..."微Loading | 调用updateUser时 |
| **保存成功** | 微Toast"已保存" | updateUser成功 |
| **保存失败** | Toast"保存失败，请重试"，Toggle回退 | updateUser失败 |
| **网络错误** | "加载失败" + 重试 | getUserInfo失败 |

### 9.8 响应式考量

| 屏幕高度 | 适配策略 |
|----------|----------|
| 高屏（≥812px） | 卡片间距增大 |
| 标准屏（667-811px） | 按默认尺寸 |
| 低屏（≤666px） | 卡片间距压缩，设置项高度减至72rpx |
| 横屏 | 不支持 |

---

## 附录：设计提示词使用指南

### 对开发者的说明

1. **所有尺寸单位为 rpx**：微信小程序自适应单位，设计稿以750rpx宽为基准
2. **颜色Token**：建议在 app.wxss 中定义 CSS 变量，全局引用
3. **字体加载**：阿里系列字体需通过 `@font-face` 网络加载或使用小程序字体加载 API
4. **图片资源**：所有图片/插画使用 SVG 优先，PNG 备选，存放于云存储
5. **动画实现**：优先使用 CSS animation/transition，复杂动画使用小程序 Animation API 或 Lottie
6. **组件复用**：底部Tab栏、返回按钮、进度条、卡片等通用组件应封装为自定义组件
7. **触摸区域**：所有可点击元素严格遵循最小触摸区域规范（≥88x88rpx）
8. **防误触**：按钮间距≥24rpx，防连续点击300ms间隔
9. **无障碍**：所有交互元素添加 aria-label，图片添加 alt 文本
10. **性能**：图片懒加载，列表虚拟滚动，动画使用 transform/opacity 避免触发重排
