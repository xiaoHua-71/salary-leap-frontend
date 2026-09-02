# 薪跃 Salary Leap

<p align="center">
  <strong>用技术挑战，量化你的下一次薪资跃迁。</strong>
</p>

<p align="center">
  基于 Vue 3 的 AI 技术挑战与薪资成长平台前端，帮助程序员通过真实场景题检验能力、获得反馈，并追踪自己的成长轨迹。
</p>

<p align="center">
  <a href="https://github.com/xiaoHua-71/salary-leap-frontend/stargazers"><img src="https://img.shields.io/github/stars/xiaoHua-71/salary-leap-frontend?style=flat-square&color=f5b942" alt="GitHub stars"></a>
  <a href="https://github.com/xiaoHua-71/salary-leap-frontend/network/members"><img src="https://img.shields.io/github/forks/xiaoHua-71/salary-leap-frontend?style=flat-square" alt="GitHub forks"></a>
  <a href="https://github.com/xiaoHua-71/salary-leap-frontend/issues"><img src="https://img.shields.io/github/issues/xiaoHua-71/salary-leap-frontend?style=flat-square" alt="GitHub issues"></a>
  <img src="https://img.shields.io/badge/Vue.js-3-42b883?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License">
</p>

![薪跃首页预览](src/assets/banner.png)

## 为什么是薪跃？

薪资不应该只是一个结果数字。薪跃把技术能力拆解成可操作的挑战：系统根据用户当前薪资生成匹配的技术关卡，用户完成答题后获得评分、薪资变化、技术解析和岗位建议。

```mermaid
flowchart LR
    A[注册 / 登录] --> B[填写当前薪资]
    B --> C[AI 生成技术挑战]
    C --> D[完成交互式答题]
    D --> E[评分与薪资变化]
    E --> F[查看解析 / 岗位建议]
    F --> G[历史记录与持续挑战]
```

## 核心功能

| 功能 | 说明 |
| --- | --- |
| AI 个性化关卡 | 按当前薪资水平生成匹配的技术场景挑战，并展示目标薪资 |
| 交互式答题 | 支持拖拽排序等交互方式，完成技术方案选择 |
| 即时成长反馈 | 展示得分、薪资增幅、标准答案、技术原因和练习建议 |
| 热门关卡 | 浏览热门技术挑战，按方向筛选并快速开始 |
| 成长历史 | 回顾每次挑战的得分、薪资变化与完成时间 |
| 薪资排行榜 | 查看平台用户的薪资排名与成长结果 |
| 管理后台 | 管理关卡内容、难度、目标薪资、精选状态和优先级 |
| 权限与响应式体验 | 登录路由守卫、管理员权限控制，适配桌面与移动端 |

## 技术栈

- **Vue 3** + **Vite**：现代化前端开发与构建
- **Vue Router**：页面路由与登录权限守卫
- **Pinia**：用户登录态及薪资状态管理
- **Element Plus**：业务组件与交互界面
- **Axios**：统一 API 请求、Cookie/Session 携带与错误处理
- **ByteMD** + **Mermaid**：渲染技术解析与流程图内容

## 快速开始

### 环境要求

- Node.js 16+
- npm 8+
- 可用的薪跃后端服务，并监听 `http://localhost:8101`

### 安装与启动

```bash
git clone https://github.com/xiaoHua-71/salary-leap-frontend.git
cd salary-leap-frontend
npm install
npm run dev
```

启动后访问 <http://localhost:3001>。

Windows 用户也可以运行：

```bat
start.bat
```

macOS / Linux 用户可以运行：

```bash
chmod +x start.sh
./start.sh
```

开发环境中的 `/api` 请求由 Vite 代理到 `http://localhost:8101`，登录态使用 Cookie/Session，并通过 `withCredentials` 携带。

## 常用命令

```bash
npm run dev       # 启动开发服务器，默认端口 3001
npm run build     # 构建生产版本到 dist/
npm run preview   # 本地预览生产构建结果
```

## 项目结构

```text
src/
├── api/                  # 用户、关卡、记录、排行榜、管理端 API
├── assets/               # 图片等静态资源
├── components/           # GlobalNavbar、GlobalFooter 等公共组件
├── router/               # 路由配置与权限守卫
├── stores/               # Pinia 状态管理
├── utils/                # Axios 请求封装
├── views/                # Home、Challenge、History、Result、Admin 等页面
├── App.vue
└── main.js
```

## 页面与路由

| 路径 | 页面 | 权限 |
| --- | --- | --- |
| `/home` | 首页 | 公开 |
| `/login` | 登录 | 公开 |
| `/register` | 注册 | 公开 |
| `/challenge` | 技术挑战 | 需登录 |
| `/history` | 挑战历史 | 需登录 |
| `/result/:id` | 挑战结果 | 需登录 |
| `/admin` | 关卡管理 | 管理员 |

## 后端联调

前端默认使用 `/api` 作为请求前缀，主要依赖以下后端能力：

- 用户注册、登录、退出与当前用户查询
- AI 关卡生成、热门关卡与关卡详情
- 答案提交、挑战结果与历史记录
- 薪资排行榜
- 管理员关卡增删改、精选和优先级管理

完整的接口字段、响应格式和部署方式请查看：

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)

后端服务未启动时，页面仍可访问，但登录、关卡生成和提交等数据功能无法正常使用。

## 生产部署

```bash
npm run build
```

将 `dist/` 部署到 Nginx、Apache 或其他静态文件服务器，并配置 Vue Router history fallback。生产环境需要将 `/api` 代理到实际后端服务；具体配置示例见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 参与贡献

欢迎提交 Issue 和 Pull Request：

1. Fork 本仓库并创建功能分支。
2. 保持改动聚焦，补充必要的说明。
3. 提交前运行 `npm run build`，确认生产构建通过。
4. 在 Pull Request 中描述背景、改动和验证方式。

## License

本项目采用 MIT License。

## 关键词

`Vue 3` `Vite` `AI` `技术挑战` `程序员成长` `薪资评估` `职业发展` `Element Plus` `Pinia`
