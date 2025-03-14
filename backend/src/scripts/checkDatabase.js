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

// 检查数据库表结构
async function checkDatabase() {
    try {
        // 测试连接
        await sequelize.authenticate();
        console.log('数据库连接成功');

        // 检查有哪些表
        const [tables] = await sequelize.query("SHOW TABLES");
        console.log('数据库表列表:');
        console.log(tables);

        // 检查listings表的结构
        try {
            const [columns] = await sequelize.query("DESCRIBE listings");
            console.log('\nlistings表结构:');
            console.log(columns);
        } catch (error) {
            console.log('\nlistings表不存在或其他错误:', error.message);
        }

        // 检查users表的结构
        try {
            const [columns] = await sequelize.query("DESCRIBE users");
            console.log('\nusers表结构:');
            console.log(columns);
        } catch (error) {
            console.log('\nusers表不存在或其他错误:', error.message);
        }

        // 检查brands表的结构
        try {
            const [columns] = await sequelize.query("DESCRIBE brands");
            console.log('\nbrands表结构:');
            console.log(columns);
        } catch (error) {
            console.log('\nbrands表不存在或其他错误:', error.message);
        }

        // 检查shoe_sizes表的结构
        try {
            const [columns] = await sequelize.query("DESCRIBE shoe_sizes");
            console.log('\nshoe_sizes表结构:');
            console.log(columns);
        } catch (error) {
            console.log('\nshoe_sizes表不存在或其他错误:', error.message);
        }

        // 检查condition_types表的结构
        try {
            const [columns] = await sequelize.query("DESCRIBE condition_types");
            console.log('\ncondition_types表结构:');
            console.log(columns);
        } catch (error) {
            console.log('\ncondition_types表不存在或其他错误:', error.message);
        }

        // 检查listing_images表的结构
        try {
            const [columns] = await sequelize.query("DESCRIBE listing_images");
            console.log('\nlisting_images表结构:');
            console.log(columns);
        } catch (error) {
            console.log('\nlisting_images表不存在或其他错误:', error.message);
        }

    } catch (error) {
        console.error('检查数据库失败:', error);
    } finally {
        // 关闭连接
        await sequelize.close();
    }
}

// 执行检查
checkDatabase(); 