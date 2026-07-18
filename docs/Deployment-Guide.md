# 识字冒险岛 - 部署指南

> 版本：v1.0.0
> 日期：2026-07-12
> 适用主体：个人主体微信小程序

---

## 1. 环境准备

### 1.1 必备工具

| 工具 | 版本要求 | 下载地址 |
|------|----------|----------|
| 微信开发者工具 | 最新稳定版 | https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html |
| Node.js | ≥ 14.x | https://nodejs.org/ |
| npm | ≥ 6.x | 随 Node.js 安装 |

### 1.2 账号准备

1. 注册微信小程序账号（个人主体即可）
   - https://mp.weixin.qq.com/wxopen/waregister
2. 获取 AppID（在「开发管理 → 开发设置」中查看）
3. 开通云开发
   - 在微信开发者工具中打开项目
   - 点击工具栏「云开发」按钮
   - 创建云开发环境（选择基础版，免费额度足够 MVP）

---

## 2. 项目配置

### 2.1 导入项目

1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录：选择 `/Users/haibo/WorkBuddy/儿童识字游戏/`
4. AppID：填入你的小程序 AppID
5. 点击「导入」

### 2.2 替换配置

#### 替换 AppID

文件：`project.config.json`

```json
{
  "appid": "你的AppID"  // 替换 wx0000000000000000
}
```

#### 替换云开发环境 ID

文件：`miniprogram/app.js`（第58行）

```javascript
wx.cloud.init({
  env: '你的云开发环境ID',  // 替换 shizi-island-prod
  traceUser: true
})
```

### 2.3 安装依赖

云函数依赖 `wx-server-sdk`，需要为每个云函数安装：

```bash
# 进入每个云函数目录安装依赖
cd cloudfunctions/login && npm install && cd ../..
cd cloudfunctions/updateUser && npm install && cd ../..
cd cloudfunctions/getUserInfo && npm install && cd ../..
cd cloudfunctions/getChapters && npm install && cd ../..
cd cloudfunctions/getLevels && npm install && cd ../..
cd cloudfunctions/getLevelDetail && npm install && cd ../..
cd cloudfunctions/submitProgress && npm install && cd ../..
cd cloudfunctions/getProgress && npm install && cd ../..
cd cloudfunctions/getCharacters && npm install && cd ../..
cd cloudfunctions/getReviewList && npm install && cd ../..
cd cloudfunctions/logLearnAction && npm install && cd ../..
cd cloudfunctions/getAchievements && npm install && cd ../..
cd cloudfunctions/getLearnStats && npm install && cd ../..
cd cloudfunctions/getReport && npm install && cd ../..
cd cloudfunctions/syncData && npm install && cd ../..
cd cloudfunctions/getAudioUrl && npm install && cd ../..
cd cloudfunctions/initData && npm install && cd ../..
```

或者在微信开发者工具中右键每个云函数文件夹 → 「在终端中打开」→ `npm install`

---

## 3. 云函数部署

### 3.1 部署全部云函数

在微信开发者工具中：

1. 右键 `cloudfunctions/` 目录下每个云函数文件夹
2. 选择「上传并部署：云端安装依赖」
3. 等待部署完成（每个约30秒）

**需要部署的云函数列表（17个）：**

| 序号 | 云函数名 | 功能 |
|------|----------|------|
| 1 | login | 用户登录 |
| 2 | updateUser | 更新用户信息 |
| 3 | getUserInfo | 获取用户信息 |
| 4 | getChapters | 获取章节列表 |
| 5 | getLevels | 获取关卡列表 |
| 6 | getLevelDetail | 获取关卡详情 |
| 7 | submitProgress | 提交闯关进度 |
| 8 | getProgress | 获取学习进度 |
| 9 | getCharacters | 获取汉字数据 |
| 10 | getReviewList | 获取复习列表 |
| 11 | logLearnAction | 记录学习行为 |
| 12 | getAchievements | 获取成就列表 |
| 13 | getLearnStats | 获取学习统计 |
| 14 | getReport | 生成学习报告 |
| 15 | syncData | 数据同步 |
| 16 | getAudioUrl | 获取音频地址 |
| 17 | initData | 数据初始化（仅运行一次） |

### 3.2 配置云函数权限

在云开发控制台 → 「设置」→ 「全局设置」中：
- 确保云函数已获取 `openid` 权限
- 确保 `wx-server-sdk` 版本 ≥ 2.6.3

---

## 4. 数据库初始化

### 4.1 创建数据库集合

在云开发控制台 → 「数据库」中创建以下 9 个集合：

| 序号 | 集合名 | 用途 | 权限设置 |
|------|--------|------|----------|
| 1 | users | 用户信息 | 仅创建者可读写 |
| 2 | chapters | 章节数据 | 所有用户可读 |
| 3 | levels | 关卡数据 | 所有用户可读 |
| 4 | characters | 汉字数据 | 所有用户可读 |
| 5 | progress | 学习进度 | 仅创建者可读写 |
| 6 | learn_logs | 学习日志 | 仅创建者可读写 |
| 7 | daily_stats | 每日统计 | 仅创建者可读写 |
| 8 | achievements | 成就模板 | 所有用户可读 |
| 9 | user_achievements | 用户成就 | 仅创建者可读写 |

### 4.2 设置集合权限

在云开发控制台 → 「数据库」→ 选择集合 → 「权限设置」：
- `users` / `progress` / `learn_logs` / `daily_stats` / `user_achievements`：设为「仅创建者可读写」
- `chapters` / `levels` / `characters` / `achievements`：设为「所有用户可读，仅创建者可写」

### 4.3 运行数据初始化

1. 在微信开发者工具中
2. 右键 `cloudfunctions/initData` → 「上传并部署：云端安装依赖」
3. 部署完成后，右键 → 「云函数本地调试」或在控制台手动触发
4. 检查日志确认初始化成功：
   - 5个章节创建完成
   - 25个关卡创建完成
   - 50个汉字创建完成
   - 10个成就模板创建完成

---

## 5. 资源上传

### 5.1 Tab 栏图标

需要准备 8 个 PNG 图标文件（81×81px）：

| 文件名 | 用途 |
|--------|------|
| `images/tab-home.png` | 首页图标（灰色） |
| `images/tab-home-active.png` | 首页图标（暖橙） |
| `images/tab-map.png` | 地图图标（灰色） |
| `images/tab-map-active.png` | 地图图标（薄荷蓝） |
| `images/tab-report.png` | 报告图标（灰色） |
| `images/tab-report-active.png` | 报告图标（嫩芽绿） |
| `images/tab-profile.png` | 我的图标（灰色） |
| `images/tab-profile-active.png` | 我的图标（暖橙） |

放置到 `miniprogram/images/` 目录下。

### 5.2 汉字音频文件

使用 edge-tts 批量生成汉字发音音频：

```bash
# 安装 edge-tts
pip install edge-tts

# 批量生成（示例）
edge-tts --voice zh-CN-XiaoxiaoNeural --text "一" --write-media audio/char_1.mp3
edge-tts --voice zh-CN-XiaoxiaoNeural --text "二" --write-media audio/char_2.mp3
# ... 对每个汉字重复
```

生成后上传到云存储 `audio/` 目录，并将文件 ID 更新到 `characters` 集合的 `audio_fileid` 字段。

### 5.3 汉字图片

为每个汉字准备配图（建议 400×400px PNG），上传到云存储 `images/characters/` 目录，将文件 ID 更新到 `characters` 集合的 `image_fileid` 字段。

### 5.4 音效文件

| 文件 | 用途 | 建议时长 |
|------|------|----------|
| `correct.mp3` | 答对音效 | 0.5s |
| `wrong.mp3` | 答错音效 | 0.5s |
| `click.mp3` | 点击音效 | 0.2s |
| `celebrate.mp3` | 庆祝音效 | 1-2s |

放置到 `miniprogram/audio/` 目录下。

---

## 6. 测试验证

### 6.1 部署验证清单

部署完成后，按以下清单逐项验证：

- [ ] 小程序能正常打开，无报错
- [ ] 首次打开自动静默登录，创建用户记录
- [ ] 首页显示吉祥物和继续学习按钮
- [ ] 关卡地图页显示5个章节和25个关卡
- [ ] 点击关卡进入识字卡片页
- [ ] 汉字卡片显示汉字、拼音、例词
- [ ] 点击汉字播放发音音频
- [   ] 跟读功能正常（需授权麦克风）
- [ ] 滑动切换到下一个字
- [ ] 完成卡片学习后跳转测验
- [ ] 测验答题正确率计算正确
- [ ] 测验通过后解锁下一关
- [ ] 复习页显示遗忘曲线推荐内容
- [ ] 报告页显示学习统计和曲线图
- [ ] 成就墙显示徽章和进度
- [ ] 家长中心算术验证生效
- [ ] 家长中心显示学习数据
- [ ] 设置页可修改声音/通知设置
- [ ] 时长限制到达后弹出提醒

### 6.2 云函数健康检查

在云开发控制台 → 「云函数」中检查：
- 所有17个云函数状态为「已部署」
- 触发 `login` 函数，返回 `{ success: true, data: { userId, isNewUser } }`
- 触发 `getChapters` 函数，返回5个章节数据
- 触发 `initData` 函数，确认数据初始化成功

---

## 7. 发布流程

### 7.1 提交审核

1. 在微信开发者工具中点击「上传」
2. 填写版本号 `1.0.0` 和项目备注
3. 登录微信公众平台 → 「管理」→ 「版本管理」
4. 在「开发版本」中找到刚上传的版本
5. 点击「提交审核」
6. 填写审核信息：
   - 服务类目：教育 → 在线教育
   - 功能页面：首页
   - 其他信息按实际填写

### 7.2 审核注意事项

- 个人主体小程序不支持「社交」类目，本项目无需社交功能
- 确保无诱导分享、无虚拟支付（iOS）
- 儿童教育类小程序需确保内容健康
- 审核周期通常1-3个工作日

### 7.3 发布上线

审核通过后：
1. 在「版本管理」中点击「发布」
2. 设置可选的按比例发布（建议先10%灰度）
3. 确认发布

---

## 8. 常见问题

### Q: 云函数报错 `module 'wx-server-sdk' not found`
A: 右键云函数 → 「在终端中打开」→ 运行 `npm install wx-server-sdk`

### Q: 数据库查询返回空
A: 检查：1) 集合权限设置；2) initData 是否运行成功；3) 云函数是否使用 `cloud.DYNAMIC_CURRENT_ENV`

### Q: 音频无法播放
A: 检查：1) `audio_fileid` 是否已更新到数据库；2) 云存储文件是否存在；3) 音频格式是否为 MP3

### Q: Tab 栏图标不显示
A: 检查 `miniprogram/images/` 目录下是否有8个 PNG 文件，文件名与 `app.json` 中一致

### Q: 云开发环境 ID 在哪里找
A: 微信开发者工具 → 云开发控制台 → 设置 → 环境ID

---

## 9. 文件清单

### 项目文件统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 前端页面 | 9 | 每页4文件（js/json/wxml/wxss） |
| 前端组件 | 5 | 每组件4文件 |
| 前端工具 | 5 | cloud/audio/storage/auth/progress |
| 前端数据 | 1 | characters.json（55个汉字） |
| 前端配置 | 4 | app.js/json/wxss + sitemap.json |
| 云函数 | 17 | 16业务函数 + 1初始化函数 |
| 共享模块 | 3 | db.js/utils.js/forgettingCurve.js |
| 文档 | 7 | PRD/Architecture/UIUX/Spec/Design-Prompts/Integration-Check/Deployment-Guide |
| **总计** | **~130** | |

---

> 部署过程中遇到问题，参考第8节常见问题或检查云开发控制台日志。
