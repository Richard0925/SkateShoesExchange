// 获取最新验证令牌的脚本
import { Sequelize } from 'sequelize';

// 直接使用数据库连接URL
const sequelize = new Sequelize('mysql://root:b6fmvf9k@usw.sealos.io:49708/react_template');

async function getLatestVerificationToken() {
    try {
        // 连接到数据库
        await sequelize.authenticate();
        console.log('成功连接到数据库: react_template');

        // 获取最新的验证令牌
        const [tokens] = await sequelize.query(`
      SELECT * FROM email_verifications 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

        if (tokens.length === 0) {
            console.log('未找到验证令牌');
        } else {
            const token = tokens[0];
            console.log('最新验证令牌:');
            console.log(`Token: ${token.token}`);
            console.log(`用户ID: ${token.user_id}`);
            console.log(`过期时间: ${token.expires_at}`);
            console.log(`验证链接: http://localhost:3000/api/auth/verify-email/${token.token}`);
        }

        // 查找相关用户
        if (tokens.length > 0) {
            const [users] = await sequelize.query(`
        SELECT * FROM users WHERE id = ?
      `, {
                replacements: [tokens[0].user_id]
            });

            if (users.length > 0) {
                const user = users[0];
                console.log('\n相关用户信息:');
                console.log(`用户名: ${user.username}`);
                console.log(`邮箱: ${user.email}`);
                console.log(`是否激活: ${user.is_active ? '是' : '否'}`);
            }
        }

        await sequelize.close();
    } catch (error) {
        console.error('查询数据库出错:', error);
    }
}

// 获取最新的验证令牌
getLatestVerificationToken(); 