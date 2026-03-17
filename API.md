# TODO API 接口文档

## 概述

### Base URL

```
http://localhost:8080
```

### 认证方式

本 API 使用 **Cookie Session** 认证。用户登录成功后，服务端会在响应头中设置 `Set-Cookie`，后续请求需携带该 Cookie（浏览器自动处理，`axios` 请求需配置 `withCredentials: true`）。

### 统一响应格式

所有接口均返回以下 JSON 结构：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

| 字段   | 类型   | 说明               |
|--------|--------|--------------------|
| `code` | int    | 业务状态码，200=成功 |
| `msg`  | string | 提示信息           |
| `data` | any    | 业务数据，失败时为 null |

### 通用错误码

| code | 说明                   |
|------|------------------------|
| 200  | 成功                   |
| 400  | 请求参数错误           |
| 401  | 未登录或登录已过期     |
| 403  | 没有权限访问           |
| 404  | 资源不存在             |
| 409  | 用户名已存在           |
| 4031 | 无权操作此分类         |
| 4032 | 预置分类不可修改或删除 |
| 4041 | 分类不存在             |
| 500  | 服务器内部错误         |
| 501  | 数据库操作失败         |
| 502  | 缓存服务异常           |
| 503  | 会话服务异常           |
| 510  | 密码错误               |

---

## 用户接口

### 注册

**POST** `/api/v1/user/register`

不需要认证。

**请求体（JSON）**

| 参数       | 类型   | 必填 | 说明               |
|------------|--------|------|--------------------|
| `username` | string | ✅   | 用户名，最长 50 字符 |
| `password` | string | ✅   | 密码               |
| `email`    | string | ❌   | 邮箱（可选）       |

**请求示例**

```json
{
  "username": "alice",
  "password": "secret123"
}
```

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "username": "alice",
    "email": null,
    "created_at": "2026-03-17T10:00:00.000Z",
    "updated_at": "2026-03-17T10:00:00.000Z"
  }
}
```

---

### 登录

**POST** `/api/v1/user/login`

不需要认证。登录成功后，服务端在响应头设置 Session Cookie。

**请求体（JSON）**

| 参数       | 类型   | 必填 | 说明   |
|------------|--------|------|--------|
| `username` | string | ✅   | 用户名 |
| `password` | string | ✅   | 密码   |

**请求示例**

```json
{
  "username": "alice",
  "password": "secret123"
}
```

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "username": "alice"
  }
}
```

---

### 退出登录

**POST** `/api/v1/user/logout`

需要认证。

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": "退出成功"
}
```

---

## 分类接口

> 所有分类接口均需认证。

### 获取分类列表

**GET** `/api/v1/categories/list`

返回当前用户可见的所有分类（系统预置 + 用户自建），按 `sort_order` 升序排列。

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "user_id": 0,
      "name": "工作",
      "color": "#1677ff",
      "icon": "LaptopOutlined",
      "sort_order": 1,
      "is_preset": true,
      "created_at": "2026-03-17T10:00:00.000Z",
      "updated_at": "2026-03-17T10:00:00.000Z"
    },
    {
      "id": 6,
      "user_id": 42,
      "name": "个人项目",
      "color": "#722ed1",
      "icon": null,
      "sort_order": 0,
      "is_preset": false,
      "created_at": "2026-03-17T12:00:00.000Z",
      "updated_at": "2026-03-17T12:00:00.000Z"
    }
  ]
}
```

---

### 创建分类

**POST** `/api/v1/categories/create`

创建用户自建分类。

**请求体（JSON）**

| 参数         | 类型   | 必填 | 说明                          |
|--------------|--------|------|-------------------------------|
| `name`       | string | ✅   | 分类名称，最长 50 字符         |
| `color`      | string | ❌   | 颜色十六进制，默认 `#1677ff`  |
| `icon`       | string | ❌   | Ant Design 图标名（可选）      |
| `sort_order` | int    | ❌   | 排序权重，越小越靠前，默认 0   |

**请求示例**

```json
{
  "name": "个人项目",
  "color": "#722ed1"
}
```

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 6,
    "user_id": 42,
    "name": "个人项目",
    "color": "#722ed1",
    "icon": null,
    "sort_order": 0,
    "is_preset": false,
    "created_at": "2026-03-17T12:00:00.000Z",
    "updated_at": "2026-03-17T12:00:00.000Z"
  }
}
```

---

### 更新分类

**PUT** `/api/v1/categories/:id`

更新用户自建分类。系统预置分类（`is_preset=true`）不可修改，返回 4032 错误。

**路径参数**

| 参数 | 类型   | 说明    |
|------|--------|---------|
| `id` | uint64 | 分类 ID |

**请求体（JSON）**（所有字段可选）

| 参数         | 类型   | 说明                         |
|--------------|--------|------------------------------|
| `name`       | string | 分类名称，最长 50 字符        |
| `color`      | string | 颜色十六进制                 |
| `icon`       | string | Ant Design 图标名             |
| `sort_order` | int    | 排序权重                     |

**请求示例**

```json
{
  "name": "副业项目",
  "color": "#eb2f96"
}
```

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": "更新成功"
}
```

**错误示例（预置分类不可改）**

```json
{
  "code": 4032,
  "msg": "预置分类不可修改或删除",
  "data": null
}
```

---

### 删除分类

**DELETE** `/api/v1/categories/:id`

删除用户自建分类。系统预置分类不可删除，返回 4032 错误。删除后，关联该分类的 Todo 的 `category_id` 会被自动置为 `null`（数据库 FK ON DELETE SET NULL）。

**路径参数**

| 参数 | 类型   | 说明    |
|------|--------|---------|
| `id` | uint64 | 分类 ID |

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": "删除成功"
}
```

---

## 待办接口

> 所有待办接口均需认证。用户只能操作自己的待办数据。

### 获取待办列表

**GET** `/api/v1/todos/list`

支持按状态和分类过滤，支持分页。

**Query 参数**

| 参数          | 类型   | 必填 | 说明                                    |
|---------------|--------|------|-----------------------------------------|
| `status`      | int8   | ❌   | 状态过滤：0=未完成，1=已完成；不传返回全部 |
| `category_id` | uint64 | ❌   | 按分类过滤；不传返回全部                 |
| `page`        | int    | ❌   | 页码，默认 1                            |
| `size`        | int    | ❌   | 每页数量，默认 10，最大 100              |

**请求示例**

```
GET /api/v1/todos/list?status=0&page=1&size=20
GET /api/v1/todos/list?category_id=1
```

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 10,
        "user_id": 42,
        "title": "完成项目报告",
        "description": "整理本季度数据",
        "status": 0,
        "priority": 1,
        "due_date": "2026-03-20T18:00:00.000Z",
        "category_id": 1,
        "category": {
          "id": 1,
          "user_id": 0,
          "name": "工作",
          "color": "#1677ff",
          "icon": "LaptopOutlined",
          "sort_order": 1,
          "is_preset": true,
          "created_at": "2026-03-17T10:00:00.000Z",
          "updated_at": "2026-03-17T10:00:00.000Z"
        },
        "created_at": "2026-03-17T09:00:00.000Z",
        "updated_at": "2026-03-17T09:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

---

### 获取待办详情

**GET** `/api/v1/todos/:id`

**路径参数**

| 参数 | 类型   | 说明    |
|------|--------|---------|
| `id` | uint64 | 待办 ID |

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 10,
    "user_id": 42,
    "title": "完成项目报告",
    "description": "整理本季度数据",
    "status": 0,
    "priority": 1,
    "due_date": "2026-03-20T18:00:00.000Z",
    "category_id": 1,
    "created_at": "2026-03-17T09:00:00.000Z",
    "updated_at": "2026-03-17T09:00:00.000Z"
  }
}
```

---

### 创建待办

**POST** `/api/v1/todos/create`

**请求体（JSON）**

| 参数          | 类型      | 必填 | 说明                                    |
|---------------|-----------|------|-----------------------------------------|
| `title`       | string    | ✅   | 待办标题                                |
| `description` | string    | ❌   | 详细描述                                |
| `priority`    | int8      | ❌   | 优先级：0=普通，1=重要，2=紧急；默认 0   |
| `due_date`    | datetime  | ❌   | 截止时间（ISO 8601 格式）               |
| `category_id` | uint64    | ❌   | 所属分类 ID；不传则为未分类             |

**请求示例**

```json
{
  "title": "完成项目报告",
  "description": "整理本季度数据",
  "priority": 1,
  "due_date": "2026-03-20T18:00:00Z",
  "category_id": 1
}
```

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 10,
    "user_id": 42,
    "title": "完成项目报告",
    "description": "整理本季度数据",
    "status": 0,
    "priority": 1,
    "due_date": "2026-03-20T18:00:00.000Z",
    "category_id": 1,
    "created_at": "2026-03-17T09:00:00.000Z",
    "updated_at": "2026-03-17T09:00:00.000Z"
  }
}
```

---

### 更新待办

**PUT** `/api/v1/todos/:id`

所有字段均为可选，仅更新传入的字段。

**路径参数**

| 参数 | 类型   | 说明    |
|------|--------|---------|
| `id` | uint64 | 待办 ID |

**请求体（JSON）**

| 参数          | 类型      | 说明                                    |
|---------------|-----------|-----------------------------------------|
| `title`       | string    | 待办标题                                |
| `description` | string    | 详细描述                                |
| `status`      | int8      | 状态：0=未完成，1=已完成                 |
| `priority`    | int8      | 优先级：0=普通，1=重要，2=紧急           |
| `due_date`    | datetime  | 截止时间（ISO 8601 格式）               |
| `category_id` | uint64    | 所属分类 ID                             |

**请求示例**

```json
{
  "status": 1,
  "category_id": 2
}
```

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": "更新成功"
}
```

---

### 删除待办

**DELETE** `/api/v1/todos/:id`

**路径参数**

| 参数 | 类型   | 说明    |
|------|--------|---------|
| `id` | uint64 | 待办 ID |

**响应示例**

```json
{
  "code": 200,
  "msg": "success",
  "data": "删除成功"
}
```

---

## 工具接口

### 健康检查

**GET** `/health`

不需要认证。用于检查服务是否正常运行。

**响应示例**

```json
{
  "status": "ok"
}
```

---

## 数据模型

### User

| 字段            | 类型     | 说明             |
|-----------------|----------|------------------|
| `id`            | uint64   | 用户唯一 ID      |
| `username`      | string   | 用户名           |
| `email`         | string?  | 邮箱（可选）     |
| `created_at`    | datetime | 账号创建时间     |
| `updated_at`    | datetime | 最后更新时间     |

### Category

| 字段         | 类型     | 说明                                     |
|--------------|----------|------------------------------------------|
| `id`         | uint64   | 分类唯一 ID                              |
| `user_id`    | uint64   | 所属用户 ID（0=系统预置，对所有用户可见） |
| `name`       | string   | 分类名称                                 |
| `color`      | string   | 颜色（十六进制，如 `#1677ff`）           |
| `icon`       | string?  | Ant Design 图标名（可选）                |
| `sort_order` | int      | 排序权重，越小越靠前                     |
| `is_preset`  | bool     | 是否为系统预置（预置分类不可修改/删除）   |
| `created_at` | datetime | 创建时间                                 |
| `updated_at` | datetime | 最后更新时间                             |

### Todo

| 字段          | 类型       | 说明                                    |
|---------------|------------|-----------------------------------------|
| `id`          | uint64     | 待办唯一 ID                             |
| `user_id`     | uint64     | 所属用户 ID                             |
| `title`       | string     | 待办标题                                |
| `description` | string?    | 详细描述（可选）                        |
| `status`      | int8       | 状态：0=未完成，1=已完成                 |
| `priority`    | int8       | 优先级：0=普通，1=重要，2=紧急           |
| `due_date`    | datetime?  | 截止时间（可选）                        |
| `category_id` | uint64?    | 所属分类 ID（null=未分类）              |
| `category`    | Category?  | 关联的分类对象（list 接口会 Preload）   |
| `created_at`  | datetime   | 创建时间                                |
| `updated_at`  | datetime   | 最后更新时间                            |

---

## 系统预置分类

| ID | 名称 | 颜色      | 图标            |
|----|------|-----------|-----------------|
| 1  | 工作 | `#1677ff` | LaptopOutlined  |
| 2  | 学习 | `#52c41a` | ReadOutlined    |
| 3  | 生活 | `#fa8c16` | HomeOutlined    |
| 4  | 健康 | `#eb2f96` | HeartOutlined   |
| 5  | 其他 | `#8c8c8c` | TagOutlined     |
