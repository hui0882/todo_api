# TODO API

一个基于 Gin 框架开发的企业级 RESTful API 服务，提供待办事项管理功能。 

## 项目简介

TODO API 是一个现代化的全栈待办事项管理系统，后端采用 Go 语言开发，使用 Gin 作为 Web 框架，MySQL 作为主数据库，Redis 作为缓存和会话存储。前端采用 React + Vite + Ant Design 构建，提供完整的用户管理、待办事项管理和接口压测功能。项目遵循企业级开发规范，具有清晰的分层架构和完善的认证机制。

## 技术栈

### 核心框架
- **Gin** (v1.11.0) - 高性能 Web 框架
- **GORM** (v1.31.1) - ORM 框架
- **Viper** (v1.21.0) - 配置管理

### 数据存储
- **MySQL** (v1.6.0) - 关系型数据库
- **Redis** (v9.17.3) - 缓存和会话存储

### 工具库
- **bcrypt** - 密码加密
- **lumberjack** (v2.2.1) - 日志轮转

## 项目结构

```
todo_api/
├── config.yaml              # 配置文件
├── main.go                  # 程序入口
├── Makefile                 # Make 命令
│
├── frontend/                # 前端项目（React）
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── utils/          # 工具函数
│   │   └── config/         # 配置文件
│   ├── package.json
│   └── README.md           # 前端文档
│
├── controller/              # 控制器层
│   ├── user_controller.go  # 用户相关接口
│   ├── todo_controller.go  # TODO相关接口
│   └── test_controller.go  # 测试接口
│
├── service/                 # 业务逻辑层
│   ├── user_service.go     # 用户业务逻辑
│   └── todo_service.go     # TODO业务逻辑
│
├── model/                   # 数据模型层
│   ├── user.go             # 用户模型
│   ├── todo.go             # TODO模型
│   ├── dao/                # 数据访问对象
│   │   └── user_dao.go
│   └── req/                # 请求参数模型
│       └── user_req.go
│
├── router/                  # 路由层
│   ├── router.go           # 路由注册
│   ├── userRouter.go       # 用户路由
│   └── todoRouter.go       # TODO路由
│
├── internal/                # 内部包（不对外暴露）
│   ├── app/
│   │   └── app.go          # 应用初始化
│   ├── config/
│   │   ├── config.go       # 配置结构
│   │   └── loader.go       # 配置加载
│   ├── database/
│   │   ├── mysql.go        # MySQL连接
│   │   └── redis.go        # Redis连接
│   ├── logger/
│   │   └── logger.go       # 日志初始化
│   ├── middleware/
│   │   ├── auth.go         # 认证中间件
│   │   ├── recovery.go     # 异常恢复
│   │   ├── request_logger.go # 请求日志
│   │   └── session/
│   │       └── session.go  # Session管理
│   └── constants/
│       └── constants.go    # 常量定义
│
├── response/                # 响应处理
│   ├── response.go         # 统一响应格式
│   └── error_code.go       # 错误码定义
│
├── utils/                   # 工具函数
│   └── hash.go             # 密码哈希工具
│
└── logs/                    # 日志文件目录

```

## 快速开始

### 环境要求

- Go 1.23.0 或更高版本
- MySQL 5.7 或更高版本
- Redis 5.0 或更高版本

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd todo_api
```

2. 安装依赖
```bash
go mod download
```

3. 配置数据库

创建 MySQL 数据库:
```sql
CREATE DATABASE todo_list_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. 配置文件

根据实际环境修改 `config.yaml`:
```yaml
server:
  port: 8080

database:
  host: localhost
  port: 3306
  username: root
  password: your_password
  dbname: todo_list_api
  charset: utf8mb4
  parse_time: true
  loc: Local

redis:
  host: localhost
  port: 6379
  password: ""
  db: 0
  pool_size: 10
  session_prefix: "todo_session:"
  session_max_age: 86400
```

5. 启动服务
```bash
go run main.go
```

服务将在 `http://localhost:8080` 启动。

6. 启动前端（可选）

```bash
cd frontend
npm install
npm run dev
```

前端将在 `http://localhost:3000` 启动。

### 健康检查

```bash
curl http://localhost:8080/health
```

预期响应:
```json
{
  "status": "ok"
}
```

## 前端项目

前端项目位于 `frontend/` 目录，提供以下功能：

- **用户认证**：注册、登录、退出登录
- **待办管理**：创建、编辑、删除、完成待办事项
- **API 配置**：可视化配置所有后端接口地址
- **接口压测**：内置压测工具，支持自定义并发数和请求次数，实时显示性能指标

详细文档请查看 [frontend/README.md](./frontend/README.md)

## API 文档

### 基础信息

- 基础路径: `/api/v1`
- Content-Type: `application/json`
- 认证方式: Cookie-based Session

### 用户接口

#### 1. 用户注册

**接口**: `POST /api/v1/user/register`

**请求参数**:
```json
{
  "username": "user123",
  "password": "password123",
  "email": "user@example.com"  // 可选
}
```

**成功响应**:
```json
{
  "code": 200,
  "msg": "success",
  "data": "注册成功"
}
```

**错误响应**:
```json
{
  "code": 409,
  "msg": "用户名已存在",
  "data": null
}
```

#### 2. 用户登录

**接口**: `POST /api/v1/user/login`

**请求参数**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

**成功响应**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "message": "登录成功",
    "user_id": "1"
  }
}
```

登录成功后会自动设置 `session_id` Cookie，有效期 24 小时。

**错误响应**:
```json
{
  "code": 401,
  "msg": "未登录或登录已过期",
  "data": null
}
```

#### 3. 退出登录

**接口**: `POST /api/v1/user/logout`

**认证**: 需要登录（需要有效的 session_id Cookie）

**成功响应**:
```json
{
  "code": 200,
  "msg": "success",
  "data": "退出登录成功"
}
```

### 认证说明

除以下接口外，所有接口都需要登录认证:
- `/health` - 健康检查
- `/api/v1/user/register` - 用户注册
- `/api/v1/user/login` - 用户登录

认证方式：在请求中携带登录时获得的 `session_id` Cookie。

未认证请求将返回：
```json
{
  "code": 401,
  "msg": "未登录或登录已过期",
  "data": null
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或登录已过期 |
| 403 | 没有权限访问 |
| 404 | 资源不存在 |
| 409 | 用户名已存在 |
| 500 | 服务器内部错误 |
| 501 | 数据库操作失败 |
| 502 | 缓存服务异常 |
| 503 | 会话服务异常 |
| 510 | 密码错误 |

## 开发规范

### 代码风格

- 遵循 Go 官方代码规范
- 使用 gofmt 格式化代码
- 使用有意义的变量和函数命名
- 添加必要的注释

### 分层架构

项目采用经典的 MVC 分层架构：

1. **Controller 层**: 处理 HTTP 请求，参数校验，调用 Service
2. **Service 层**: 业务逻辑处理
3. **DAO 层**: 数据访问，数据库操作
4. **Model 层**: 数据模型定义

### 错误处理

- 使用统一的错误码系统
- 在 Service 层返回业务错误
- 在 Controller 层统一处理错误响应
- 记录必要的错误日志

### 数据库规范

- 使用 GORM 进行数据库操作
- 数据表使用下划线命名法
- 必须设置合适的索引
- 使用事务保证数据一致性

## 配置说明

### 服务器配置

```yaml
server:
  port: 8080  # 服务端口
```

### 数据库配置

```yaml
database:
  host: localhost              # 数据库地址
  port: 3306                   # 数据库端口
  username: root               # 用户名
  password: your_password      # 密码
  dbname: todo_list_api        # 数据库名
  charset: utf8mb4             # 字符集
  parse_time: true             # 是否解析时间
  loc: Local                   # 时区
  max_idle_conns: 10          # 最大空闲连接数
  max_open_conns: 100         # 最大打开连接数
  conn_max_lifetime: 3600     # 连接最大生命周期（秒）
```

### Redis 配置

```yaml
redis:
  host: localhost              # Redis地址
  port: 6379                   # Redis端口
  password: ""                 # Redis密码
  db: 0                        # 数据库编号
  pool_size: 10               # 连接池大小
  session_prefix: "todo_session:"  # Session前缀
  session_max_age: 86400      # Session有效期（秒）
```

## 日志管理

项目使用 lumberjack 进行日志管理，日志文件存储在 `logs/` 目录下。

日志特性：
- 自动按日期切割
- 自动清理过期日志
- 支持日志级别控制
- 记录请求和响应信息

## 安全特性

### 密码安全
- 使用 bcrypt 加密存储密码
- 密码强度验证（可扩展）

### Session 安全
- Session ID 使用加密随机生成
- Session 存储在 Redis 中
- Cookie 设置 HttpOnly 标志
- Session 自动过期机制
- 访问时自动刷新 Session

### 中间件保护
- 全局异常恢复
- 请求日志记录
- 认证中间件拦截未登录请求

## 性能优化

- 使用 Redis 作为 Session 存储，提高访问速度
- 数据库连接池复用
- 合理的索引设计
- 日志异步写入

## 部署建议

### 生产环境配置

1. 修改数据库连接配置
2. 设置强密码
3. 配置防火墙规则
4. 使用 Nginx 作为反向代理
5. 配置 HTTPS
6. 配置日志轮转

### Docker 部署（待完善）

```bash
# 构建镜像
docker build -t todo-api:latest .

# 运行容器
docker run -d -p 8080:8080 \
  -v $(pwd)/config.yaml:/app/config.yaml \
  -v $(pwd)/logs:/app/logs \
  todo-api:latest
```

## 待开发功能

- [ ] TODO 增删改查接口
- [ ] 用户信息管理
- [ ] TODO 分类管理
- [ ] TODO 标签功能
- [ ] 数据导出功能
- [ ] Swagger API 文档
- [ ] 单元测试
- [ ] Docker 支持
- [ ] CI/CD 配置

## 故障排查

### 常见问题

1. **启动失败 - 数据库连接错误**
   - 检查 MySQL 是否启动
   - 检查配置文件中的数据库连接信息
   - 确认数据库已创建

2. **启动失败 - Redis 连接错误**
   - 检查 Redis 是否启动
   - 检查配置文件中的 Redis 连接信息

3. **登录失败 - Session 创建失败**
   - 检查 Redis 服务状态
   - 检查 Redis 配置

4. **接口 401 错误**
   - 检查是否已登录
   - 检查 Cookie 是否正确携带
   - 检查 Session 是否过期

## 贡献指南

欢迎提交 Issue 和 Pull Request。

提交 PR 前请确保：
1. 代码符合项目规范
2. 添加必要的注释
3. 通过所有测试
4. 更新相关文档

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请提交 Issue。

---

**最后更新**: 2026-02-12
