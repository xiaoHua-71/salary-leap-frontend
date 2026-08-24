# 薪跃（salary-leap-frontend）· 前端

这是一个基于 Vue 3 的前端应用，为程序员提供技术挑战和薪资评估的平台。

## 功能特性

- 🚀 **AI 智能生成关卡**：根据用户薪资水平动态生成技术挑战
- 📊 **薪资评估系统**：基于答题表现评估技术水平
- 🎯 **拖拽答题**：支持拖拽操作的交互式答题体验
- 📈 **历史记录**：完整的挑战历史和成长轨迹
- 💼 **投递建议**：基于技术水平提供职位投递建议
- 📱 **响应式设计**：支持多种设备访问

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理库
- **Element Plus** - Vue 3 组件库
- **Axios** - HTTP 客户端
- **Vite** - 前端构建工具

## 项目结构

```
src/
├── api/                # API 请求模块
│   ├── user.js        # 用户相关接口
│   ├── level.js       # 关卡相关接口
│   └── userLevel.js   # 用户关卡相关接口
├── components/         # 公共组件
├── router/            # 路由配置
├── stores/            # 状态管理
│   └── user.js        # 用户状态
├── utils/             # 工具函数
│   └── request.js     # 请求封装
├── views/             # 页面组件
│   ├── Home.vue       # 首页
│   ├── Login.vue      # 登录页
│   ├── Register.vue   # 注册页
│   ├── Challenge.vue  # 挑战页面
│   ├── History.vue    # 历史记录
│   └── Result.vue     # 结果详情
├── App.vue            # 根组件
└── main.js            # 应用入口
```

## 开发环境要求

- Node.js >= 16
- npm 或 yarn

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 预览构建结果：
```bash
npm run preview
```

## API 接口

前端通过以下接口与后端交互：

### 用户接口
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `POST /api/user/logout` - 用户注销
- `GET /api/user/current` - 获取当前用户

### 关卡接口
- `POST /api/level/generate` - 生成关卡
- `GET /api/level/{id}` - 获取关卡详情

### 用户关卡接口
- `POST /api/user-level/submit` - 提交答案
- `GET /api/user-level/{id}` - 获取闯关详情
- `GET /api/user-level/history` - 获取闯关历史

## 主要页面说明

### 首页 (Home.vue)
- 展示平台介绍和特色功能
- 用户登录状态显示
- 快速开始挑战入口

### 挑战页面 (Challenge.vue)
- AI 生成技术关卡
- 拖拽式答题交互
- 实时薪资显示
- 关卡难度匹配

### 历史记录 (History.vue)
- 挑战历史列表
- 统计数据展示
- 快速查看结果详情

### 结果页面 (Result.vue)
- 详细的评分结果
- 薪资变化展示
- 技术解析和建议
- 投递公司推荐

## 开发注意事项

1. **薪资数据处理**：所有薪资相关字段保持字符串格式，避免精度丢失
2. **拖拽功能**：使用原生 HTML5 拖拽 API 实现
3. **响应式设计**：确保在不同设备上的良好体验
4. **错误处理**：统一的错误提示和处理机制
5. **路由守卫**：需要登录的页面进行权限验证

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License
