import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// 使用完整版的认证路由（带邮箱验证）
import authRoutes from './routes/auth.js';
import listingsRoutes from './routes/listings.js';
import usersRoutes from './routes/users.js';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 配置中间件
// 详细的 CORS 配置
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 数据库连接配置
let sequelize;

// 如果存在DATABASE_URL环境变量，优先使用
if (process.env.DATABASE_URL) {
  console.log('使用DATABASE_URL连接数据库:', process.env.DATABASE_URL);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // 否则使用单独的配置参数
  sequelize = new Sequelize(
    process.env.DB_NAME || 'react_template',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'b6fmvf9k',
    {
      host: process.env.DB_HOST || 'usw.sealos.io',
      port: process.env.DB_PORT || 49708,
      dialect: 'mysql',
      logging: console.log,
      dialectOptions: {
        connectTimeout: 60000
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// 将Sequelize实例添加到请求对象
app.use((req, res, next) => {
  req.sequelize = sequelize;
  next();
});

// 测试数据库连接
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 初始化必要的表
    await createTables();
  } catch (error) {
    console.error('数据库连接失败:', error);
    console.log('继续启动应用，但数据库功能可能不可用');
  }
}

// 创建必要的数据库表
async function createTables() {
  try {
    // 创建users表
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        last_login DATETIME,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
      )
    `);

    // 创建user_profiles表
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        location VARCHAR(100),
        preferred_foot VARCHAR(20),
        shoe_size VARCHAR(10),
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建email_verifications表
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建password_resets表
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建listings表
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        brand VARCHAR(50) NOT NULL,
        model VARCHAR(100) NOT NULL,
        size VARCHAR(10) NOT NULL,
        shoe_condition TINYINT NOT NULL,
        preferred_foot VARCHAR(20),
        description TEXT,
        location VARCHAR(100),
        user_id VARCHAR(36) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建listing_images表
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS listing_images (
        id VARCHAR(36) PRIMARY KEY,
        listing_id VARCHAR(36) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        position INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
      )
    `);

    console.log('数据库表创建成功');
  } catch (error) {
    console.error('创建数据库表失败:', error);
  }
}

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/users', usersRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Skateboard Shoe Exchange API' });
});

// 启动服务器
app.listen(PORT, async () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);

  // 测试数据库连接
  await testDbConnection();
});

export default app; 