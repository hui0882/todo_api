# TODO 前端项目

基于 React + Vite + Ant Design 构建的 TODO 管理系统前端。

## 功能特性

### 核心功能
- ✅ 用户注册和登录
- ✅ 待办事项的增删改查
- ✅ 待办事项完成状态切换
- ✅ 用户会话管理（基于 Cookie）
- ✅ 退出登录

### 高级功能
- 🔧 **API 配置管理**：可视化配置所有 API 接口地址
- ⚡ **接口压测工具**：内置压测功能，支持自定义并发数和请求次数
- 📊 **实时监控图表**：压测过程中实时显示响应时间和成功率
- 📈 **详细统计信息**：包括 P50/P90/P95/P99 响应时间、状态码分布等

## 技术栈

- **React 18** - 前端框架
- **Vite** - 构建工具
- **React Router v6** - 路由管理
- **Ant Design 5** - UI 组件库
- **Axios** - HTTP 请求
- **Recharts** - 图表库
- **Tailwind CSS** - CSS 框架

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

前端将在 `http://localhost:3000` 启动。

### 生产构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
frontend/
├── src/
│   ├── components/          # 组件
│   │   └── ProtectedRoute.jsx   # 路由保护
│   ├── pages/              # 页面
│   │   ├── LoginPage.jsx       # 登录/注册页
│   │   ├── TodoPage.jsx        # 待办事项页
│   │   ├── SettingsPage.jsx    # API配置页
│   │   └── StressTestPage.jsx  # 压测页
│   ├── contexts/           # 上下文
│   │   └── AuthContext.jsx     # 认证上下文
│   ├── config/             # 配置
│   │   └── api.js             # API配置管理
│   ├── utils/              # 工具函数
│   │   ├── request.js         # Axios封装
│   │   └── api.js             # API接口定义
│   ├── App.jsx             # 根组件
│   ├── main.jsx            # 入口文件
│   └── index.css           # 全局样式
├── index.html              # HTML模板
├── vite.config.js          # Vite配置
├── tailwind.config.js      # Tailwind配置
└── package.json            # 依赖配置
```

## 功能说明

### 1. 用户认证

#### 登录页面
- 支持登录和注册切换
- 表单验证
- 登录成功后自动跳转到待办列表

#### 会话管理
- 使用 Cookie 存储会话 ID
- 自动携带 Cookie 发送请求
- 登录状态持久化到 localStorage

### 2. 待办事项管理

#### 待办列表
- 显示所有待办事项
- 支持勾选完成状态
- 已完成项目会显示删除线和标签

#### 创建/编辑待办
- 弹窗表单
- 标题必填，描述可选
- 支持设置完成状态

#### 删除待办
- 二次确认弹窗
- 删除后自动刷新列表

### 3. API 配置管理

**重要特性：无需登录即可使用，可在登录前配置好后端地址。**

#### 访问方式
- **登录前**：在登录页面点击右上角"API 配置"按钮
- **登录后**：在主页点击右上角"设置"按钮

#### 配置功能
- **服务器地址**：配置后端 API 基础地址
- **接口路径**：配置所有接口的路径
- **路径参数**：支持 `:id` 格式的动态参数
- **连接测试**：测试后端连接状态
- **配置持久化**：保存到 localStorage
- **重置功能**：一键恢复默认配置

#### 可配置接口
- 用户接口：注册、登录、退出登录
- 待办接口：获取列表、创建、更新、删除
- 其他接口：健康检查

### 4. 接口压测工具

#### 压测配置
- **服务器地址**：目标服务器地址
- **请求方法**：GET/POST/PUT/DELETE
- **接口路径**：目标接口路径
- **请求体**：JSON 格式的请求数据
- **总请求数**：压测总请求次数
- **并发数**：同时发送的请求数量

#### 快速场景
- 预置常用接口配置
- 一键加载测试场景

#### 实时监控
- 压测进度条
- 实时图表显示：
  - 平均响应时间
  - 成功率变化

#### 统计结果
- **基础统计**
  - 总请求数
  - 成功/失败次数
  - 成功率
  - 平均响应时间
  - 最小/最大响应时间

- **百分位统计**
  - P50（中位数）
  - P90（90%请求的响应时间）
  - P95（95%请求的响应时间）
  - P99（99%请求的响应时间）

- **状态码分布**
  - 各状态码出现次数
  - 占比统计

## API 接口说明

### 默认配置

```javascript
{
  baseURL: 'http://localhost:8080',
  endpoints: {
    register: '/api/v1/user/register',
    login: '/api/v1/user/login',
    logout: '/api/v1/user/logout',
    getTodos: '/api/v1/todos',
    createTodo: '/api/v1/todos',
    updateTodo: '/api/v1/todos/:id',
    deleteTodo: '/api/v1/todos/:id',
    health: '/health'
  }
}
```

### 修改配置

1. 进入"设置"页面
2. 修改对应的接口地址
3. 点击"保存配置"
4. 使用"测试连接"验证配置

## 响应格式

前端期望后端返回以下格式的 JSON：

### 成功响应
```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

### 失败响应
```json
{
  "code": 400,
  "msg": "错误信息",
  "data": null
}
```

## 错误处理

### 请求拦截器
- 自动添加 Cookie
- 动态设置 baseURL

### 响应拦截器
- 统一处理业务错误
- HTTP 错误自动提示
- 401 错误自动跳转登录页

## 使用指南

### 首次使用

1. 启动后端服务（默认 `http://localhost:8080`）
2. 启动前端项目 `npm run dev`
3. 访问 `http://localhost:3000`
4. （可选）如果后端地址不是默认地址，先点击"API 配置"进行配置
5. 注册新用户
6. 登录系统

### 配置自定义后端

**推荐方式：登录前配置**
1. 在登录页面点击右上角"API 配置"按钮
2. 修改"服务器地址"为你的后端地址
3. 根据实际情况修改各接口路径
4. 点击"测试连接"验证
5. 保存配置
6. 点击"去登录"返回登录页面

**或者：登录后配置**
1. 登录后点击右上角"设置"按钮
2. 进行相同的配置操作

### 使用压测功能

1. 点击"压测"按钮
2. 配置压测参数：
   - 服务器地址
   - 接口路径
   - 请求方法和数据
   - 并发数和总请求数
3. 点击"开始压测"
4. 查看实时监控和统计结果

**注意事项：**
- 压测会对服务器产生较大负载
- 建议在测试环境使用
- 避免在生产环境进行压测
- 合理设置并发数，避免过度压测

## 常见问题

### 1. 登录后立即被退出

检查后端是否正确设置了 Cookie，特别是：
- Cookie 的 Domain 和 Path
- HttpOnly 标志
- Session 有效期

### 2. 请求失败提示网络错误

- 检查后端服务是否启动
- 检查 API 配置中的服务器地址
- 检查浏览器控制台的具体错误信息
- 确认后端是否配置了 CORS

### 3. 压测结果不准确

- 浏览器环境的限制可能影响性能
- 建议使用专业压测工具（如 JMeter、wrk）进行生产环境压测
- 本工具主要用于快速验证和简单压测

### 4. 修改 API 配置后不生效

- 刷新页面
- 清除浏览器缓存
- 检查 localStorage 中的配置

## 开发说明

### 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在 `src/App.jsx` 中添加路由
3. 根据需要添加路由保护

### 添加新 API 接口

1. 在 `src/config/api.js` 中添加 endpoint 配置
2. 在 `src/utils/api.js` 中添加接口函数
3. 在组件中调用

### 自定义样式

- 使用 Ant Design 组件的 className 属性
- 结合 Tailwind CSS 工具类
- 修改 `src/index.css` 全局样式

## 部署

### 使用 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 使用 Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 性能优化

- 使用 React.memo 优化组件渲染
- 路由懒加载
- 图片懒加载
- 合理使用 useMemo 和 useCallback
- 生产构建启用压缩和混淆

## 待完善功能

- [ ] TODO 分类和标签
- [ ] TODO 优先级
- [ ] TODO 截止日期
- [ ] 数据导出功能
- [ ] 暗黑模式
- [ ] 多语言支持
- [ ] 移动端适配优化
- [ ] PWA 支持
- [ ] 单元测试
- [ ] E2E 测试

## 许可证

MIT License

---

**最后更新**: 2026-02-12
