# Spec - 识字冒险岛 v1.0.0

> 生成日期：2026-07-12
> 基于：PRD v1.0 + 架构文档 v1.0 + UIUX 文档 v1.0
> 状态：已确认（用户确认 + 语音方案调整）

---

## 1. 产品定义

| 维度 | 内容 |
|------|------|
| **一句话描述** | 一款面向5-7岁幼小衔接儿童的微信小程序识字闯关游戏，以高频常用汉字为内容核心，用图文卡片+冒险闯关玩法让孩子在趣味中识字，用科学复习机制和透明家长面板让家长放心 |
| **目标用户** | 主要使用者：5-7岁幼小衔接阶段儿童；决策者/付费者：25-40岁家长（以妈妈为主） |
| **核心问题** | 幼小衔接识字断层、现有产品游戏沉迷、收费不透明、学习效果不可见 |
| **产品代号** | 识字冒险岛 |
| **商业模式** | 免费50字 + 一次性买断¥68-98，永不自动续费 |

---

## 2. MVP 范围（锁定——不在此列表的功能一律不做）

### 2.1 P0 功能清单

| ID | 功能名称 | 验收标准摘要 | RICE 评分 |
|----|----------|-------------|-----------|
| F01 | 闯关冒险模式 | 岛屿地图≥10关/章，每关学3-5新字，5步流程（认→图→读→写→测），通过率≥80%解锁下一关，进度云端保存 | 4.50 |
| F02 | 图文卡片识字 | 每字含象形动画+实物图片+标准发音（预录制音频）+拼音标注+2-3词组，动画≤5秒，点击可重复发音 | 5.63 |
| F03 | 语音跟读练习 | 播放标准发音→孩子跟读→录音回放→吉祥物鼓励反馈，首次需授权麦克风，未授权可跳过，单字等待≤5秒 | 4.00 |
| F04 | 笔顺动画演示 | 逐笔展示标准笔顺，每笔不同颜色高亮，动画后可手指描摹（大致轨迹匹配），可跳过 | 6.00 |
| F05 | 科学复习系统 | 遗忘曲线间隔（1/2/4/7/15天），3种复习形式（认读/听音辨字/选词填空），每日≤10字≤3分钟，进入时优先弹出 | 4.00 |
| F06 | 关卡测验 | 4-6题覆盖本关全部新字，3种题型（看字选图/听音选字/看图选字），正确率≥80%通过，错题自动加入复习队列 | 6.00 |
| F07 | 家长面板 | 今日学习字数/累计识字量/掌握率/本周日历，字表查看（每字状态），薄弱字标记，时长设置，算术验证防误入 | 5.63 |
| F08 | 成就激励系统 | 每关3星评价，里程碑徽章（50/100/200/300/500字），每50字解锁角色皮肤，虚拟宠物成长，成就墙展示 | 4.50 |
| F09 | 学习时长管控 | 家长设5/10/15/20分钟四档（默认15），仅计实际学习时间，到时软锁定新内容仅允许复习，次日0点重置，防绕过 | 9.00 |

### 2.2 明确不做的功能（Won't Have）

| 功能 | 不做原因 |
|------|----------|
| 独立APP | MVP聚焦微信小程序，降低获客成本和使用门槛 |
| AI学伴/聊天机器人 | 5-7岁儿童文字交互能力有限，投入产出比低 |
| AR互动 | 技术复杂度高，小程序AR能力有限 |
| 广告变现 | 儿童产品加广告严重影响体验和家长信任 |
| 社交功能（社区/广场） | 儿童在线社交有安全风险和合规要求 |
| 全学科拓展（数学/英语/拼音系统教学） | MVP聚焦识字单一场景做深做透 |
| UGC内容创作 | 内容质量不可控，审核成本高 |
| 实时视频/直播课 | 与轻量小程序游戏定位冲突 |
| 拼音系统教学 | 拼音是小学一年级系统学习内容，MVP仅展示拼音标注 |
| 写字板/硬件配套 | 增加硬件供应链复杂度，用屏幕书空替代 |
| 语音识别评测 | 需第三方付费API，MVP用跟读练习替代 |
| 实时多人对战 | 云开发不原生支持WebSocket长连接 |
| 手写汉字识别 | 端侧OCR能力有限，用笔顺动画替代 |

### 2.3 P1 功能（MVP发布后快速迭代）

| ID | 功能名称 | 说明 |
|----|----------|------|
| F10 | 自定义生字本 | 家长手动添加生字，系统自动生成识字卡片 |
| F11 | 分级阅读绘本 | 学完一定字数后解锁仅用已学字编写的绘本 |
| F12 | 亲子挑战模式 | 家长与孩子轮流出题/答题的PK模式 |
| F13 | 多子女账号 | 同一家长账号下多个孩子档案 |
| F14 | 学习报告周报 | 每周自动推送学习报告到微信服务通知 |
| F15 | 错字本 | 自动记录测验答错的字，定期推送强化 |

---

## 3. 技术架构（锁定）

| 维度 | 选型 |
|------|------|
| **前端框架** | 微信小程序原生开发（WXML + WXSS + JS） |
| **后端方案** | 微信云开发（CloudBase）— 云函数 + 云数据库 + 云存储 |
| **数据库** | 云数据库（MongoDB 文档型） |
| **文件存储** | 云存储（CDN加速） |
| **语音方案** | 预录制音频为主（免费TTS工具批量生成，存入云存储）；同声传译插件为可选（企业主体时启用） |
| **认证方案** | wx.login() + 云函数获取 openid（静默登录） |
| **小程序主体** | 个人主体（MVP阶段）；同声传译插件仅企业主体可用，非必需 |
| **基础库版本** | ≥2.14.0 |
| **渲染引擎** | WebView渲染（MVP阶段），待Skyline成熟后切换 |

---

## 4. API 端点清单（锁定——开发时以此为唯一依据）

所有 API 通过 `wx.cloud.callFunction()` 调用云函数。

### 4.1 认证相关

| API名称 | 云函数 | 入参 | 出参 | 说明 |
|---------|-------|------|------|------|
| 用户登录 | `login` | 无（自动获取openid） | `{ userId, isNewUser }` | 静默登录，首次自动创建用户记录 |
| 更新用户信息 | `updateUser` | `{ nickname, avatar, birthDate }` | `{ success }` | 更新用户资料 |
| 获取用户信息 | `getUserInfo` | 无 | `{ user }` | 获取当前用户完整信息 |

### 4.2 关卡与学习

| API名称 | 云函数 | 入参 | 出参 | 说明 |
|---------|-------|------|------|------|
| 获取章节列表 | `getChapters` | 无 | `{ chapters: [...] }` | 获取所有章节及解锁状态 |
| 获取关卡列表 | `getLevels` | `{ chapterId }` | `{ levels: [...] }` | 获取指定章节的关卡列表 |
| 获取关卡详情 | `getLevelDetail` | `{ levelId }` | `{ level, characters: [...] }` | 获取关卡含汉字数据 |
| 提交关卡进度 | `submitProgress` | `{ levelId, stars, score, wrongAnswers, duration }` | `{ success, unlockedLevels, newAchievements }` | 提交闯关结果 |
| 获取学习进度 | `getProgress` | `{ chapterId? }` | `{ progress: [...], summary }` | 获取用户进度概览 |

### 4.3 字卡与复习

| API名称 | 云函数 | 入参 | 出参 | 说明 |
|---------|-------|------|------|------|
| 获取字卡数据 | `getCharacters` | `{ characterIds }` | `{ characters: [...] }` | 批量获取汉字数据 |
| 获取复习列表 | `getReviewList` | `{ count? }` | `{ characters: [...] }` | 基于遗忘曲线推荐复习汉字 |
| 记录学习行为 | `logLearnAction` | `{ characterId, action, result, context }` | `{ success }` | 记录单次学习行为 |

### 4.4 成就与统计

| API名称 | 云函数 | 入参 | 出参 | 说明 |
|---------|-------|------|------|------|
| 获取成就列表 | `getAchievements` | 无 | `{ achievements: [...], unlocked: [...] }` | 获取所有成就及解锁状态 |
| 获取学习统计 | `getLearnStats` | `{ dateRange? }` | `{ dailyStats, summary }` | 获取学习统计数据 |
| 获取学习报告 | `getReport` | `{ period }` | `{ report }` | 生成周/月学习报告 |

### 4.5 数据同步

| API名称 | 云函数 | 入参 | 出参 | 说明 |
|---------|-------|------|------|------|
| 数据同步 | `syncData` | `{ mode, progressData? / lastSyncTime? }` | `{ success, conflicts? / progressData }` | 离线数据上传/下载 |

### 4.6 音频管理

| API名称 | 云函数 | 入参 | 出参 | 说明 |
|---------|-------|------|------|------|
| 获取音频fileID | `getAudioUrl` | `{ characterIds }` | `{ audioMap: { charId: fileID } }` | 批量获取汉字音频地址 |

---

## 5. 数据库表清单（锁定）

| 表名 | 核心字段 | 索引 | 权限 |
|------|----------|------|------|
| `users` | _openid, nickname, avatar, birth_date, total_stars, total_learned, current_chapter, current_level, settings(sound_enabled, auto_play_audio, daily_time_limit) | _openid 唯一 | 仅创建者读写 |
| `characters` | _id, char, pinyin, stroke_count, radical, frequency_rank, chapter_id, level_id, order, image_fileid, audio_fileid, words[], example_sentence, difficulty | chapter_id+level_id 复合, frequency_rank 单字段 | 所有人可读 |
| `levels` | _id, chapter_id, level_number, title, type, character_ids[], game_types[], pass_threshold, stars_threshold[], unlock_condition | chapter_id+level_number 复合 | 所有人可读 |
| `chapters` | _id, chapter_number, title, description, icon, level_count, character_count, unlock_condition, order | — | 所有人可读 |
| `progress` | _openid, level_id, chapter_id, status, stars, score, attempts, first_pass_at, last_play_at, duration_seconds, wrong_answers[] | _openid+level_id 复合, _openid+chapter_id 复合 | 仅创建者读写 |
| `learn_logs` | _openid, character_id, char, action(learn/review/quiz_correct/quiz_wrong), level_id, timestamp, result, context | _openid+timestamp 复合, _openid+character_id 复合 | 仅创建者读写 |
| `achievements` | _id, code, title, description, icon, icon_fileid, type, threshold, reward_stars | — | 所有人可读 |
| `user_achievements` | _openid, achievement_id, unlocked_at, reward_claimed | _openid+achievement_id 唯一 | 仅创建者读写 |
| `daily_stats` | _openid, date, new_chars_learned, reviewed_chars, levels_completed, total_stars_earned, study_duration_seconds, accuracy_rate | _openid+date 复合 | 仅创建者读写 |

---

## 6. 页面清单（锁定）

| 页面 | 路由 | 分包 | 核心组件 | 对应 API | 设计 Token 主题 |
|------|------|------|----------|----------|-----------------|
| 首页 | `pages/home/home` | 主包 | 吉祥物迎接、继续学习按钮、今日目标卡片、底部Tab栏 | getUserInfo, getProgress | 暖橙主色 |
| 关卡地图页 | `pages/game/game` | 主包 | 冒险地图背景、关卡节点、章节标题、进度展示 | getChapters, getLevels | 暖橙+嫩芽绿 |
| 识字卡片页 | `packageLearn/card/card` | packageLearn | 汉字大字展示、拼音标注、配图、例词、听发音/跟读/下一字按钮 | getCharacters, getAudioUrl | 暖橙+薄荷蓝 |
| 复习页 | `packageLearn/review/review` | packageLearn | 题目区、选项卡片、反馈区、进度条 | getReviewList, logLearnAction | 薄荷蓝主色 |
| 字典浏览页 | `packageLearn/dictionary/dictionary` | packageLearn | 汉字列表、搜索、筛选 | getCharacters | 暖奶白背景 |
| 学习报告页 | `packageAchieve/report/report` | packageAchieve | 学习概览、曲线图、进度环、成长花园、薄弱字列表 | getLearnStats, getReport | 嫩芽绿主色 |
| 成就墙页 | `packageAchieve/achievements/achievements` | packageAchieve | 星星总数、勋章墙、连胜火焰、兑换区 | getAchievements | 明黄+金黄 |
| 家长中心页 | `packageParent/parent/parent` | packageParent | 学习统计、时长管理、内容管理、护眼模式 | getLearnStats, getReport, updateUser | 中灰简洁风 |
| 设置页 | `packageParent/settings/settings` | packageParent | 声音设置、通知设置、账号管理、关于 | updateUser, getUserInfo | 中灰简洁风 |

### 底部 Tab 栏

| Tab | 页面 | 图标 |
|-----|------|------|
| 首页 | pages/home/home | 圆角房屋（暖橙） |
| 地图 | pages/game/game | 圆角地图标记（薄荷蓝） |
| 报告 | packageAchieve/report/report | 圆角图表（嫩芽绿） |
| 我的 | packageParent/parent/parent | 圆角人物（中灰） |

---

## 7. 设计 Token（锁定）

### 7.1 颜色

| Token | 色值 | 用途 |
|-------|------|------|
| --color-primary-default | `#FF8C42` | 主按钮、品牌色、关卡入口 |
| --color-primary-light | `#FFB37C` | 按钮 pressed 态、卡片背景 |
| --color-primary-dark | `#E6731C` | 按钮按下态、文字强调 |
| --color-secondary-mint | `#4ECDC4` | 次级按钮、信息卡片 |
| --color-secondary-green | `#95E1A3` | 进度条、完成状态 |
| --color-accent-yellow | `#FFD93D` | 关键引导、高亮提示、星星 |
| --color-accent-gold | `#FFB627` | 奖杯、勋章 |
| --color-bg-page | `#FFF9F0` | 全局页面背景 |
| --color-bg-card | `#FFFFFF` | 内容卡片背景 |
| --color-text-primary | `#3D3D3D` | 标题、正文 |
| --color-text-secondary | `#8A8A8A` | 辅助说明 |
| --color-error | `#FF7875` | 答错反馈（柔和） |
| --color-success | `#52C41A` | 答对反馈 |
| --gradient-warm | `#FF8C42 → #FFD93D` | 奖励弹窗、过关庆祝 |

### 7.2 字体

| Token | 字体 | 用途 |
|-------|------|------|
| --font-family-display | 阿里妈妈方圆体 | 页面大标题、关卡名称、奖励弹窗 |
| --font-family-body | 阿里巴巴普惠体 | 汉字卡片、正文、按钮文字 |
| --font-family-handwriting | 阿里妈妈东方大楷 | 笔顺演示、字源讲解、书写范本 |
| --font-family-en-display | Fredoka | 英文标题、数字徽章 |
| --font-family-en-body | Nunito | 英文内容、数字 |

### 7.3 字号

| Token | 字号 | 用途 |
|-------|------|------|
| Display | 48rpx | 奖励弹窗大标题 |
| H1 | 40rpx | 页面主标题 |
| H2 | 34rpx | 区块标题 |
| H3 | 30rpx | 卡片标题 |
| Body-L | 28rpx | 汉字卡片教学核心 |
| Body | 26rpx | 正文（最小） |
| Caption | 22rpx | 辅助说明 |
| 汉字展示 | ≥120rpx | 识字卡片中央大字 |

### 7.4 间距/圆角/阴影

| Token 类型 | 关键值 |
|------------|--------|
| 间距基础单位 | 4rpx |
| 防误触最小间距 | 24rpx (--space-lg) |
| 页面水平边距 | 32rpx |
| 主按钮高度 | 96rpx |
| 卡片圆角 | 16rpx (--radius-md) |
| 按钮圆角 | 32rpx (--radius-xl) |
| 卡片阴影 | 0 4rpx 16rpx rgba(0,0,0,0.08) |

### 7.5 动效

| Token | 时长 | 用途 |
|-------|------|------|
| --duration-instant | 100ms | 按钮按下 |
| --duration-fast | 150ms | 颜色变化 |
| --duration-normal | 250ms | 页面转场 |
| --duration-slow | 400ms | 弹窗出现 |
| --duration-celebrate | 1200ms | 过关庆祝 |
| --ease-bounce | cubic-bezier(0.68,-0.55,0.265,1.55) | 弹跳效果 |

### 7.6 触摸区域

| 元素 | 最小尺寸 | 推荐尺寸 |
|------|----------|----------|
| 主操作按钮 | 88×88rpx | 96×96rpx |
| 次级按钮 | 72×72rpx | 80×80rpx |
| 选项卡片 | 120×120rpx | 140×140rpx |
| 功能图标 | 48×48rpx | 64×64rpx |

### 7.7 设计对标

- **主对标品牌**：洪恩识字（UI布局+分级体系）+ 叫叫识字（IP角色+激励机制）
- **设计语言**：2D扁平卡通 + 温暖糖果色系
- **吉祥物**：字宝（小狐狸/小熊猫，头身比1:1.5，探险帽配件）
- **图标库**：iconfont（阿里）+ Phosphor Icons + 自绘核心图标

---

## 8. 验收标准（锁定——QA 测试时以此为唯一依据）

| 编号 | 功能 | Given | When | Then |
|------|------|-------|------|------|
| AC01 | 闯关冒险 | 用户进入已解锁关卡 | 完成认→图→读→写→测5步 | 测验通过率≥80%解锁下一关，进度保存到云端 |
| AC02 | 图文卡片 | 用户查看汉字卡片 | 点击汉字/图片/词组 | 播放对应发音，图片可放大，动画≤5秒 |
| AC03 | 语音跟读 | 用户点击跟读按钮 | 授权麦克风后跟读 | 录音完成可回放，吉祥物给予鼓励反馈 |
| AC04 | 语音跟读 | 用户未授权麦克风 | 点击跟读按钮 | 提示授权，拒绝后可跳过不影响流程 |
| AC05 | 笔顺动画 | 用户查看笔顺演示 | 动画播放完毕 | 可手指描摹，系统检测大致轨迹，可跳过 |
| AC06 | 科学复习 | 用户次日打开小程序 | 有待复习字时 | 自动弹出复习任务，每日≤10字≤3分钟 |
| AC07 | 关卡测验 | 用户完成关卡测验 | 提交测验结果 | 正确率≥80%通过，<80%需重学；错题加入复习队列 |
| AC08 | 家长面板 | 家长通过算术验证进入面板 | 查看学习数据 | 显示已学字数/掌握率/薄弱字/学习日历 |
| AC09 | 时长管控 | 家长设置每日15分钟 | 孩子学习满15分钟 | 弹出提醒，新内容锁定，仅允许复习 |
| AC10 | 时长管控 | 孩子尝试修改时长设置 | 点击设置入口 | 需要家长验证（算术题），孩子无法自行修改 |
| AC11 | 成就系统 | 用户累计学习50字 | 达到里程碑 | 解锁对应徽章和角色皮肤，成就墙展示 |
| AC12 | 离线使用 | 用户无网络时打开小程序 | 进入已缓存关卡 | 可学习本地缓存内容，进度离线记录，联网后同步 |
| AC13 | 数据同步 | 用户联网后 | 离线学习记录上传 | 进度同步到云端，无数据丢失 |
| AC14 | 免费试用 | 新用户注册 | 学习前50字 | 完全免费，全部功能可用 |
| AC15 | 付费解锁 | 用户学完50字后 | 尝试学习第51字 | 提示一次性买断，明码标价，无自动续费 |

---

## 9. 边界与约束

### 9.1 技术约束

| 约束 | 限制 | 应对 |
|------|------|------|
| 主包体积 | ≤2MB | 核心代码+首屏资源放主包，其余分包 |
| 总包体积 | ≤20MB | 图片/音频放云存储，本地仅文字数据 |
| 云函数内存 | ≤256MB/次 | 复杂统计分批处理 |
| 云函数并发 | 基础版20 | MVP阶段足够 |
| 数据库连接数 | 基础版20 | 前端不直连DB，走云函数中转 |
| 数据库读 | 5万次/天 | 关键数据本地缓存 |
| 数据库写 | 3万次/天 | 进度批量提交 |
| 云存储 | 5GB | 300-500字音频+图片约1-2GB |
| 小程序主体 | 个人主体 | 预录制音频方案，不依赖同声传译插件 |

### 9.2 性能目标

| 指标 | 目标值 |
|------|--------|
| 冷启动 | <1.5s |
| 页面切换 | <300ms |
| 字卡点击响应 | <100ms |
| 音频播放延迟（缓存命中） | <500ms |
| 音频播放延迟（首次加载） | <1s |
| 闯关加载 | <1s |
| 动画帧率 | ≥50fps |
| 云函数响应 | <800ms |

### 9.3 设计约束

- 正文字号≥26rpx，教学核心字号≥28rpx
- 按钮触摸区域≥88×88rpx，间距≥24rpx
- 圆角≥8rpx，无尖锐直角
- 错误反馈使用柔红色+鼓励语言
- 无闪烁动效（防光敏反应）
- 操作反馈≤500ms
- 文字对比度≥4.5:1（WCAG AA）
- 导航层级≤2级

---

## 10. 变更记录

| 日期 | 变更内容 | 原因 | 影响范围 |
|------|----------|------|----------|
| 2026-07-12 | F03从"语音跟读评测"降级为"语音跟读练习" | 微信小程序端侧无法做语音评测，需第三方付费API | F03功能、AC03/AC04验收标准 |
| 2026-07-12 | 语音方案从"同声传译插件"改为"预录制音频" | 用户暂不具备企业主体，同声传译插件不支持个人主体 | 技术架构第3节、API 4.6节 |
| 2026-07-12 | 家长中心从pages/profile/调整为独立分包packageParent/ | 家长中心功能较重，需与儿童端隔离 | 页面清单第6节 |

---

> **Spec 状态：已锁定**
> 此文档为开发团队的唯一依据。开发过程中不新增 Spec 以外的功能——新增需求走变更流程。
> 小改（增加字段、调整文案）→ 更新变更记录 → 继续开发
> 大改（新增功能、改核心流程）→ 回到 Phase 0 重新走需求澄清
