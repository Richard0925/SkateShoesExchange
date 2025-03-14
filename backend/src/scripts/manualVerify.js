// 手动激活用户的脚本
import { Sequelize } from 'sequelize';

// 直接使用数据库连接URL
const sequelize = new Sequelize('mysql://root:b6fmvf9k@usw.sealos.io:49708/react_template');

async function manuallyActivateUser() {
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
        console.log(`当前激活状态: ${user.is_active ? '已激活' : '未激活'}`);

        // 手动激活用户
        await sequelize.query(`
      UPDATE users
      SET is_active = TRUE
      WHERE id = ?
    `, {
            replacements: [user.id]
        });

        // 验证用户是否已激活
        const [updatedUsers] = await sequelize.query(`
      SELECT * FROM users
      WHERE id = ?
    `, {
            replacements: [user.id]
        });

        if (updatedUsers.length > 0) {
            const updatedUser = updatedUsers[0];
            console.log('\n用户已成功激活:');
            console.log(`用户名: ${updatedUser.username}`);
            console.log(`邮箱: ${updatedUser.email}`);
            console.log(`激活状态: ${updatedUser.is_active ? '已激活' : '未激活'}`);
        }

        await sequelize.close();
    } catch (error) {
        console.error('激活用户出错:', error);
    }
}

manuallyActivateUser(); 