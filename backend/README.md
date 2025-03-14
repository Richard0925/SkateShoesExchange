# Skateboard Shoe Exchange - 后端API

这是Skateboard Shoe Exchange平台的后端API服务，提供用户注册、认证、鞋子交易等功能。

## 功能特性

- 用户注册和登录
- 邮箱验证
- 密码重置
- JWT认证
- 用户资料管理
- 鞋子交易功能（待实现）

## 技术栈

- Node.js
- Express
- MySQL (通过Sequelize ORM)
- JWT认证
- Nodemailer (邮件发送)

## 安装和运行

### 前提条件

- Node.js (>=14.0.0)
- MySQL数据库

### 安装依赖

```bash
cd backend
npm install
```

### 配置环境变量

创建一个`.env`文件，参考`.env.example`:

```
# 数据库配置
DB_HOST=localhost
DB_NAME=skatedb
DB_USER=root
DB_PASSWORD=password

# JWT配置
JWT_SECRET=your-secret-key-should-be-changed-in-production

# 邮件配置
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Skateboard Shoe Exchange <no-reply@skateboardshoeexchange.com>

# 应用配置
PORT=4000
BASE_URL=http://localhost:3000
```

### 运行开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:4000 运行。

### 生产环境运行

```bash
npm start
```

## API端点

### 认证

- **POST /api/auth/register** - 用户注册
- **GET /api/auth/verify-email/:token** - 验证邮箱
- **POST /api/auth/login** - 用户登录
- **POST /api/auth/forgot-password** - 请求重置密码
- **POST /api/auth/reset-password** - 重置密码

### 示例请求

#### 注册用户

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "secure_password123",
  "preferredFoot": "左脚",
  "shoeSize": "42",
  "location": "上海"
}
```

#### 登录

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "secure_password123"
}
```

## 开发者注意事项

- 在生产环境中，请确保更改JWT密钥和其他敏感配置。
- 邮件服务需要有效的SMTP配置，如果使用Gmail，需要设置应用专用密码。
- 数据库表会在服务器启动时自动创建，但不会自动迁移。如果修改了表结构，需要手动更新。

## Docker支持

本项目包含Docker配置，可以使用Docker Compose启动:

```bash
docker-compose up
```

此命令会启动API服务器和MySQL数据库。 