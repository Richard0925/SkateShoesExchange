// 获取完整的验证令牌脚本
import { Sequelize } from 'sequelize';

// 直接使用数据库连接URL
const sequelize = new Sequelize('mysql://root:b6fmvf9k@usw.sealos.io:49708/react_template');

async function getVerificationToken() {
    try {
        // 连接到数据库
        await sequelize.authenticate();
        console.log('数据库连接成功');

        // 直接从数据库中获取令牌
        const [results] = await sequelize.query(`
      SELECT ev.*, u.username, u.email, u.is_active 
      FROM email_verifications ev
      JOIN users u ON ev.user_id = u.id
      WHERE u.username = 'richard_junming'
      ORDER BY ev.created_at DESC
      LIMIT 1
    `);

        if (results.length === 0) {
            console.log('未找到验证令牌');
            return;
        }

        const tokenRecord = results[0];

        // 输出完整令牌，不会被终端输出截断
        console.log('用户信息:');
        console.log(`用户名: ${tokenRecord.username}`);
        console.log(`邮箱: ${tokenRecord.email}`);
        console.log(`是否激活: ${tokenRecord.is_active ? '是' : '否'}`);
        console.log('\n验证令牌:');

        // 将验证令牌保存到变量中
        const token = tokenRecord.token;

        // 通过JSON格式输出，避免被截断
        console.log(JSON.stringify({ token }, null, 2));

        // 构建验证URL
        console.log('\n验证链接:');
        console.log(`http://localhost:3000/api/auth/verify-email/${token}`);

        await sequelize.close();
    } catch (error) {
        console.error('查询数据库出错:', error);
    }
}

getVerificationToken(); 