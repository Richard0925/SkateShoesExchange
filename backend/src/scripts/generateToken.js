// 为用户生成新的验证令牌
import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// 直接使用数据库连接URL
const sequelize = new Sequelize('mysql://root:b6fmvf9k@usw.sealos.io:49708/react_template');

// 从环境变量或直接设置JWT密钥
const JWT_SECRET = 'skateboardshoeexchange-secret-key';

// 生成邮箱验证令牌
function generateEmailVerificationToken(userId) {
    const payload = {
        userId,
        type: 'email_verification',
        tokenId: uuidv4()
    };

    // 邮箱验证令牌24小时有效
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

async function createNewVerificationToken() {
    try {
        // 连接到数据库
        await sequelize.authenticate();
        console.log('数据库连接成功');

        // 获取用户信息
        const [users] = await sequelize.query(`
      SELECT * FROM users
      WHERE username = 'richard_junming'
    `);

        if (users.length === 0) {
            console.log('未找到用户');
            return;
        }

        const user = users[0];
        console.log('用户信息:');
        console.log(`ID: ${user.id}`);
        console.log(`用户名: ${user.username}`);
        console.log(`邮箱: ${user.email}`);

        // 生成新的验证令牌
        const token = generateEmailVerificationToken(user.id);

        // 计算过期时间（24小时后）
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // 保存到数据库
        const tokenId = uuidv4();
        await sequelize.query(`
      INSERT INTO email_verifications (
        id, user_id, token, expires_at, used, created_at
      )
      VALUES (?, ?, ?, ?, FALSE, NOW())
    `, {
            replacements: [tokenId, user.id, token, expiresAt]
        });

        console.log('\n新验证令牌已生成:');
        console.log(token);

        console.log('\n验证链接:');
        console.log(`http://localhost:3000/api/auth/verify-email/${token}`);

        await sequelize.close();
    } catch (error) {
        console.error('生成令牌出错:', error);
    }
}

createNewVerificationToken(); 