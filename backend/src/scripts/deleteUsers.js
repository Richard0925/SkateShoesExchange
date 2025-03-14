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

// 删除用户数据
async function deleteUsers() {
    try {
        // 测试连接
        await sequelize.authenticate();
        console.log('数据库连接成功');

        // 获取用户数量
        const [userCount] = await sequelize.query(`SELECT COUNT(*) as count FROM users`);
        console.log(`删除前用户数量: ${userCount[0].count}`);

        // 删除相关表中的数据
        // 注意: 由于外键约束，需要按特定顺序删除

        // 1. 首先删除可能依赖于用户的表数据
        // 删除密码重置记录
        try {
            await sequelize.query(`DELETE FROM password_resets`);
            console.log('密码重置记录已删除');
        } catch (error) {
            console.log('删除密码重置记录时出错或表不存在:', error.message);
        }

        // 删除邮箱验证记录
        try {
            await sequelize.query(`DELETE FROM email_verifications`);
            console.log('邮箱验证记录已删除');
        } catch (error) {
            console.log('删除邮箱验证记录时出错或表不存在:', error.message);
        }

        // 删除会话记录
        try {
            await sequelize.query(`DELETE FROM sessions`);
            console.log('会话记录已删除');
        } catch (error) {
            console.log('删除会话记录时出错或表不存在:', error.message);
        }

        // 2. 删除listings相关数据
        // 删除listing_images
        try {
            await sequelize.query(`DELETE FROM listing_images`);
            console.log('商品图片记录已删除');
        } catch (error) {
            console.log('删除商品图片记录时出错或表不存在:', error.message);
        }

        // 删除listings
        try {
            await sequelize.query(`DELETE FROM listings`);
            console.log('商品列表记录已删除');
        } catch (error) {
            console.log('删除商品列表记录时出错或表不存在:', error.message);
        }

        // 3. 删除conversations相关数据
        // 删除messages
        try {
            await sequelize.query(`DELETE FROM messages`);
            console.log('消息记录已删除');
        } catch (error) {
            console.log('删除消息记录时出错或表不存在:', error.message);
        }

        // 删除conversation_participants
        try {
            await sequelize.query(`DELETE FROM conversation_participants`);
            console.log('会话参与者记录已删除');
        } catch (error) {
            console.log('删除会话参与者记录时出错或表不存在:', error.message);
        }

        // 删除conversations
        try {
            await sequelize.query(`DELETE FROM conversations`);
            console.log('会话记录已删除');
        } catch (error) {
            console.log('删除会话记录时出错或表不存在:', error.message);
        }

        // 4. 删除exchange相关数据
        // 删除exchange_history
        try {
            await sequelize.query(`DELETE FROM exchange_history`);
            console.log('交换历史记录已删除');
        } catch (error) {
            console.log('删除交换历史记录时出错或表不存在:', error.message);
        }

        // 删除exchange_requests
        try {
            await sequelize.query(`DELETE FROM exchange_requests`);
            console.log('交换请求记录已删除');
        } catch (error) {
            console.log('删除交换请求记录时出错或表不存在:', error.message);
        }

        // 5. 删除user_profiles
        try {
            await sequelize.query(`DELETE FROM user_profiles`);
            console.log('用户资料已删除');
        } catch (error) {
            console.log('删除用户资料时出错或表不存在:', error.message);
        }

        // 6. 最后删除users表数据
        await sequelize.query(`DELETE FROM users`);
        console.log('用户记录已删除');

        // 确认删除结果
        const [newUserCount] = await sequelize.query(`SELECT COUNT(*) as count FROM users`);
        console.log(`删除后用户数量: ${newUserCount[0].count}`);

        console.log('所有用户数据删除完成');
    } catch (error) {
        console.error('删除用户数据失败:', error);
    } finally {
        // 关闭连接
        await sequelize.close();
    }
}

// 执行删除操作
deleteUsers(); 