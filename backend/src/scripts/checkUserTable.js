import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载.env文件
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// 数据库连接
let sequelize;
if (process.env.DATABASE_URL) {
    console.log(`使用DATABASE_URL连接数据库: ${process.env.DATABASE_URL}`);
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
    // 使用单独的配置参数
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

// 检查users表
async function checkUserTable() {
    try {
        // 测试连接
        await sequelize.authenticate();
        console.log('数据库连接成功');

        // 检查users表是否存在
        try {
            const [tables] = await sequelize.query(`SHOW TABLES LIKE 'users'`);
            if (tables.length === 0) {
                console.log('users表不存在');
                return;
            }
            console.log('users表存在');

            // 检查表结构
            const [columns] = await sequelize.query(`DESCRIBE users`);
            console.log('users表结构:');
            columns.forEach(column => {
                console.log(`${column.Field}: ${column.Type} ${column.Null === 'YES' ? '可为空' : '不可为空'} ${column.Key === 'PRI' ? '主键' : ''}`);
            });

            // 查询用户数量
            const [userCount] = await sequelize.query(`SELECT COUNT(*) as count FROM users`);
            console.log(`用户总数: ${userCount[0].count}`);

            // 如果有用户，显示前5个用户
            if (userCount[0].count > 0) {
                const [users] = await sequelize.query(`SELECT id, username, email, is_active, created_at FROM users LIMIT 5`);
                console.log('前5个用户:');
                users.forEach(user => {
                    console.log(`ID: ${user.id}, 用户名: ${user.username}, 邮箱: ${user.email}, 状态: ${user.is_active ? '已激活' : '未激活'}, 创建时间: ${user.created_at}`);
                });
            }
        } catch (error) {
            console.error('查询users表时出错:', error);
        }
    } catch (error) {
        console.error('数据库操作失败:', error);
    } finally {
        // 关闭连接
        await sequelize.close();
    }
}

// 执行检查
checkUserTable(); 