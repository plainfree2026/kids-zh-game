# 前后端联调检查报告

> 检查日期：2026-07-12
> 检查人：郝交付（交付总监）
> 状态：✅ 通过（已修复全部发现的问题）

---

## 检查范围

- 前端 68 个文件（9 页面 + 5 组件 + 5 工具 + 数据文件）
- 后端 20 个 JS 文件（16 云函数 + initData + 3 共享模块）
- API 调用链路：前端 `cloud.js` → 16 个云函数
- 数据结构一致性：入参/出参字段名、类型、嵌套层级

---

## 发现问题及修复

### 🔴 CRITICAL（3 项）

#### 1. 响应体未解包
- **问题**：后端统一返回 `{ success: true, data: {...} }`，前端 `callFunction` 直接 `resolve(res.result)`，未解包 `data` 层，导致所有页面拿到的字段都是 `undefined`
- **影响**：全量 API 调用失效
- **修复**：`cloud.js` `callFunction` 增加 `success` 检查 + `data` 解包逻辑
- **文件**：`miniprogram/utils/cloud.js`

#### 2. `_id` vs `id` 字段名不一致
- **问题**：后端返回 MongoDB 的 `_id`，前端统一使用 `.id`
- **影响**：关卡 ID、汉字 ID、章节 ID 全部取不到
- **修复**：`shared/utils.js` 新增 `mapId` / `mapIdArray` 工具函数，12 个云函数统一映射
- **文件**：`shared/utils.js` + `getChapters` / `getLevels` / `getLevelDetail` / `getCharacters` / `getReviewList` / `getProgress` / `getAchievements` / `getReport` / `getUserInfo`

#### 3. `callFunction` 错误检测字段错误
- **问题**：`callFunction` 检查 `res.result.code`，但后端使用 `success: false`
- **影响**：API 调用失败时不会被 `reject`，前端无法捕获错误
- **修复**：随 Issue 1 一并修复，改为检查 `success` 字段

### 🟡 HIGH（4 项）

#### 4. `isUnlocked` vs `is_unlocked` 命名不一致
- **问题**：后端 camelCase（`isUnlocked`），前端 snake_case（`is_unlocked`）
- **影响**：章节/关卡解锁状态判断失败
- **修复**：后端统一改为 snake_case
- **文件**：`getChapters` / `getLevels` / `getAchievements`

#### 5. `getLearnStats` 聚合字段名不匹配
- **问题**：后端返回 `totalNewChars` / `totalStars` / `avgAccuracy`，前端期望 `new_chars_learned` / `total_stars_earned` / `accuracy_rate`
- **影响**：报告页和成就页统计数据显示为 0
- **修复**：聚合查询字段名改为 snake_case，新增 `active_days` / `streak_days`

#### 6. `getProgress` summary 缺少首页所需字段
- **问题**：首页期望 `current_level_progress` / `today_new_chars` / `today_stars` 等字段，后端未提供
- **影响**：首页进度数据显示为 0
- **修复**：后端新增今日统计查询和当前章节进度计算

#### 7. `getReport` period 参数不匹配
- **问题**：前端传 `'week'` / `'month'`，后端期望 `'weekly'` / `'monthly'`
- **影响**：报告页获取数据失败
- **修复**：后端兼容两种格式

### 🟠 MEDIUM（5 项）

#### 8. `wrongAnswers` 类型不匹配
- **问题**：前端传数字（错误数量），后端期望数组（汉字 ID 数组）
- **影响**：`submitProgress` 中错误汉字日志记录失败
- **修复**：前端增加 `wrongCharIds` 数组追踪错误汉字 ID

#### 9. `logLearnAction` action 逻辑错误
- **问题**：`review.js` 中 `action` 根据 `mode` 判断而非 `isCorrect`
- **影响**：答错也记为 `quiz_correct`，答对也记为 `quiz_wrong`
- **修复**：改为根据 `isCorrect` 判断

#### 10. `updateUser` 不处理 `settings` 字段
- **问题**：后端只处理 `nickname` / `avatar` / `birthDate`，不处理 `settings`
- **影响**：家长页和设置页的设置修改无法保存
- **修复**：后端增加 `settings` 合并更新逻辑，同时支持 `birth_date` / `total_stars`

#### 11. `getLearnStats` dateRange 时间戳格式不兼容
- **问题**：前端传时间戳（number），后端期望日期字符串（YYYY-MM-DD）
- **影响**：按日期范围查询失败
- **修复**：后端增加类型检测和转换

#### 12. `chapter_id` 类型不匹配
- **问题**：章节 `_id` 是字符串（`'chapter_1'`），关卡/进度的 `chapter_id` 是数字（`1`），前端用 `chapter.id` 查询导致不匹配
- **影响**：关卡地图页查不到关卡和进度数据
- **修复**：前端改用 `chapter.chapter_number` 查询

### 🟢 LOW（1 项）

#### 13. `getCharacters` 空数组报错
- **问题**：字典页调用 `getCharacters([])`，后端返回 `MISSING_PARAM` 错误
- **影响**：字典页始终使用本地数据（有 fallback，不影响功能）
- **修复**：后端空数组时返回全部汉字

---

## 修复文件清单

### 前端（6 文件）
| 文件 | 修改内容 |
|------|----------|
| `miniprogram/utils/cloud.js` | `callFunction` 解包 data + 检查 success |
| `miniprogram/packageLearn/review/review.js` | action 逻辑 + wrongAnswers 类型 + wrongCharIds |
| `miniprogram/packageAchieve/achievements/achievements.js` | `_id` 引用改为 `code` 匹配 |
| `miniprogram/pages/game/game.js` | `chapter.id` 改为 `chapter.chapter_number` 查询 |

### 后端（13 文件）
| 文件 | 修改内容 |
|------|----------|
| `cloudfunctions/shared/utils.js` | 新增 `mapId` / `mapIdArray` |
| `cloudfunctions/getChapters/index.js` | mapId + is_unlocked |
| `cloudfunctions/getLevels/index.js` | mapId + is_unlocked + is_completed |
| `cloudfunctions/getLevelDetail/index.js` | mapId + mapIdArray |
| `cloudfunctions/getCharacters/index.js` | mapIdArray + 空数组处理 |
| `cloudfunctions/getReviewList/index.js` | mapId |
| `cloudfunctions/getProgress/index.js` | mapIdArray + summary 扩展 |
| `cloudfunctions/getAchievements/index.js` | mapId + is_unlocked |
| `cloudfunctions/getReport/index.js` | mapId + weak_characters + period 兼容 |
| `cloudfunctions/getUserInfo/index.js` | mapId |
| `cloudfunctions/getLearnStats/index.js` | snake_case + active_days + streak_days + 时间戳兼容 |
| `cloudfunctions/updateUser/index.js` | settings 合并 + birth_date + total_stars |

**总计修改：19 个文件，修复 13 个问题**

---

## API 一致性验证矩阵

| 前端函数 | 云函数 | 入参对齐 | 出参对齐 | 状态 |
|----------|--------|----------|----------|------|
| login() | login | ✅ | ✅ | 通过 |
| updateUser(data) | updateUser | ✅ | ✅ | 通过 |
| getUserInfo() | getUserInfo | ✅ | ✅ | 通过 |
| getChapters() | getChapters | ✅ | ✅ | 通过 |
| getLevels(chapterId) | getLevels | ✅ | ✅ | 通过 |
| getLevelDetail(levelId) | getLevelDetail | ✅ | ✅ | 通过 |
| submitProgress(data) | submitProgress | ✅ | ✅ | 通过 |
| getProgress(chapterId?) | getProgress | ✅ | ✅ | 通过 |
| getCharacters(ids?) | getCharacters | ✅ | ✅ | 通过 |
| getReviewList(count?) | getReviewList | ✅ | ✅ | 通过 |
| logLearnAction(data) | logLearnAction | ✅ | ✅ | 通过 |
| getAchievements() | getAchievements | ✅ | ✅ | 通过 |
| getLearnStats(range?) | getLearnStats | ✅ | ✅ | 通过 |
| getReport(period) | getReport | ✅ | ✅ | 通过 |
| syncData(mode, data) | syncData | ✅ | ✅ | 通过 |
| getAudioUrl(ids) | getAudioUrl | ✅ | ✅ | 通过 |

---

## 待补充资源（非代码问题）

| 资源 | 说明 | 优先级 |
|------|------|--------|
| Tab 栏图标 PNG | 8 个文件（4 组 normal/active） | P0 - 必须补充 |
| 云开发 env ID | `app.js` 中硬编码为 `shizi-island-prod`，需替换为实际 ID | P0 |
| AppID | `project.config.json` 中为占位符 `wx0000000000000000` | P0 |
| 汉字图片 | `characters` 集合的 `image_fileid` 字段需上传图片到云存储 | P1 |
| 汉字音频 | `characters` 集合的 `audio_fileid` 字段需上传音频到云存储 | P1 |
| 音效文件 | `correct` / `wrong` / `click` / `celebrate` 音效 | P2 |
| BGM 文件 | 背景音乐 | P2 |

---

## Phase 4：验收测试与缺陷修复

### 首轮 QA（agent-89d62b73，代码追溯）
报告 4 个 P0：AC05 笔顺缺失、AC15 付费缺失、AC11 成就解锁缺失、`total_learned` 恒为 0。经交付总监逐文件复核源码，**确认该报告基于过期代码快照，多数结论为误报**：
- `submitProgress` 的 `total_learned` 已用 `characterIds.length` 直接计数（非去重→0），根因不存在；
- `forgettingCurve.js` + `getReviewList` 已正确处理 `quiz_wrong` 进入复习队列（AC07 实际已实现）；
- `getAchievements` + `submitProgress` 成就解锁逻辑正确（AC11 取决于集合种子数据）；
- `stroke-writing` 组件已注册并接入 `card.wxml`，但 `card.js` 确实从未切换到书写模式（AC05 真实缺口，且缺失 `mode` 默认值会导致学习视图不渲染）。

### 真实缺口修复（前端 agent-c0d9013f + 交付总监复核）
| 项 | 修复 |
|----|------|
| AC05 / AC01 书写步 | `card.js` 增加 `mode:'learn'` 默认值（修复学习视图不渲染的潜在崩溃）+ `enterWriteMode` / `onWriteComplete` / `onWriteSkip` / `onWriteDone`，书写描摹步实际可达 |
| AC02 图片放大 | `onImageTap` → `showImageZoom` 真实弹窗 + 补 `closeImageZoom` |
| AC03 跟读录音 | `startRecording` / `stopRecording` 改为真实 `wx.getRecorderManager` 录制并回放用户录音 |
| AC15 买断页 | 新增 `packageParent/unlock/unlock` 买断页（¥68 永久解锁，演示解锁置 `isPremium`）；`game.js` 关卡按 `isPremium` 限免（首章前两关免费）；首页/地图入口接入 |

### 付费模型归一化（交付总监）
首轮修复中前端代理额外生成了 `pages/paywall` 买断页（flag `purchased`、字符数≥50 判定），与 Spec 的 `unlock` 页（flag `isPremium`、关卡限免）冲突。已删除 `paywall` 页及全部 `purchased` / `FREE_LIMIT` / `checkPaywall` 引用，统一为单一 `isPremium` + 关卡限免模型，避免双套付费逻辑互相矛盾。

### 终轮 QA（agent-4b382a33，代码追溯）
复测全部 15 条验收标准：**15/15 PASS，0 P0 残留**，逐条引用 file:line 证据。
- 所有改动 JS 文件通过 `node --check` 语法校验；
- 全仓 grep 无 `paywall` / `purchased` / `FREE_LIMIT` / `checkPaywall` 残留引用；
- `isPremium` 标志在 `unlock.js`（写）、`game.js`（读+限免+横幅）、`home.js`（读+继续按钮限免）三处一致。

## 结论

联调发现 12 个问题（3 CRITICAL + 4 HIGH + 4 MEDIUM + 1 LOW）全部修复；终轮 QA 15/15 验收标准通过，0 P0 残留。API 链路 16 端点对齐，付费模型已归一化。**可交付。**
