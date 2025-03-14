// 列出所有用户的脚本
import { Sequelize } from 'sequelize';

// 直接使用数据库连接URL
const sequelize = new Sequelize('mysql://root:b6fmvf9k@usw.sealos.io:49708/react_template');

async function listAllUsers() {
    try {
        // 连接到数据库
        await sequelize.authenticate();
        console.log('成功连接到数据库: react_template');

        // 查询所有用户
        const [users] = await sequelize.query('SELECT * FROM users ORDER BY created_at DESC');

        console.log(`\n数据库中共有 ${users.length} 个用户:`);

        if (users.length === 0) {
            console.log('数据库中没有用户');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. ID: ${user.id}`);
                console.log(`   用户名: ${user.username}`);
                console.log(`   邮箱: ${user.email}`);
                console.log(`   创建时间: ${user.created_at}`);
                console.log(`   是否激活: ${user.is_active ? '是' : '否'}`);
                console.log(`   最后登录: ${user.last_login || '从未登录'}`);
                console.log('-----------------------------------');
            });
        }

        await sequelize.close();
    } catch (error) {
        console.error('查询数据库出错:', error);
    }
}

// 列出所有用户
listAllUsers(); 