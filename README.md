# 识字冒险岛

> 面向5-7岁幼小衔接儿童的微信小程序识字闯关游戏

## 快速开始

1. 打开微信开发者工具
2. 导入项目目录
3. 替换 `project.config.json` 中的 AppID
4. 替换 `app.js` 中的云开发环境 ID
5. 部署云函数 + 初始化数据
6. 详细步骤见 `docs/Deployment-Guide.md`

## 项目结构

```
儿童识字游戏/
├── miniprogram/          # 前端代码
│   ├── pages/            # 主包页面（首页、关卡地图）
│   ├── packageLearn/     # 学习分包（卡片、复习、字典）
│   ├── packageAchieve/   # 成就分包（报告、成就墙）
│   ├── packageParent/    # 家长分包（家长中心、设置）
│   ├── components/       # 5个公共组件
│   ├── utils/            # 5个工具函数
│   └── data/             # 本地汉字数据
├── cloudfunctions/       # 云函数
│   ├── shared/           # 共享模块（db/utils/forgettingCurve）
│   ├── login/            # ...16个业务云函数
│   └── initData/         # 数据初始化脚本
└── docs/                 # 项目文档
```

## 技术栈

- 微信小程序原生开发（WXML + WXSS + JS）
- 微信云开发（云函数 + 云数据库 + 云存储）
- 个人主体完全支持

## 文档

| 文档 | 说明 |
|------|------|
| `docs/PRD.md` | 产品需求文档 |
| `docs/Architecture.md` | 技术架构文档 |
| `docs/UIUX.md` | UIUX设计文档 |
| `docs/Spec.md` | 规格契约（开发依据） |
| `docs/Deployment-Guide.md` | 部署指南 |
| `docs/Integration-Check.md` | 联调检查报告 |
