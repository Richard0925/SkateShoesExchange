import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import crypto from 'crypto';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载.env文件
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// 创建SHA-256哈希
function createHash(password) {
    return crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');
}

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

// 示例用户数据
const sampleUsers = [
    {
        id: crypto.randomBytes(16).toString('hex'),
        username: 'skater1',
        email: 'skater1@example.com',
        password: 'password123',
        location: '北京',
        preferredFoot: 'regular',
        shoeSize: '42'
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        username: 'skater2',
        email: 'skater2@example.com',
        password: 'password123',
        location: '上海',
        preferredFoot: 'goofy',
        shoeSize: '43'
    },
    {
        id: crypto.randomBytes(16).toString('hex'),
        username: 'skater3',
        email: 'skater3@example.com',
        password: 'password123',
        location: '广州',
        preferredFoot: 'regular',
        shoeSize: '41'
    }
];

// 加载示例数据
async function loadSampleData() {
    try {
        // 测试连接
        await sequelize.authenticate();
        console.log('数据库连接成功');

        // 获取现有品牌
        async function getBrandId(brandName) {
            const [brands] = await sequelize.query(
                `SELECT id FROM brands WHERE name = ?`,
                {
                    replacements: [brandName],
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!brands || brands.length === 0) {
                throw new Error(`品牌 ${brandName} 不存在`);
            }

            console.log(`找到品牌 ${brandName} 的ID: ${brands.id}`);
            return brands.id;
        }

        // 获取现有尺码
        async function getSizeId(sizeValue) {
            const [sizes] = await sequelize.query(
                `SELECT id FROM shoe_sizes WHERE size_us = ?`,
                {
                    replacements: [sizeValue],
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!sizes || sizes.length === 0) {
                throw new Error(`尺码 ${sizeValue} 不存在`);
            }

            console.log(`找到尺码 ${sizeValue} 的ID: ${sizes.id}`);
            return sizes.id;
        }

        // 获取现有状况类型
        async function getConditionId(conditionName) {
            const [conditions] = await sequelize.query(
                `SELECT id FROM condition_types WHERE name = ?`,
                {
                    replacements: [conditionName],
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!conditions || conditions.length === 0) {
                throw new Error(`状况类型 ${conditionName} 不存在`);
            }

            console.log(`找到状况类型 ${conditionName} 的ID: ${conditions.id}`);
            return conditions.id;
        }

        // 添加示例用户
        for (const user of sampleUsers) {
            // 检查用户是否已存在
            const [existingUsers] = await sequelize.query(
                `SELECT * FROM users WHERE email = ?`,
                {
                    replacements: [user.email],
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!existingUsers || existingUsers.length === 0) {
                // 插入用户
                await sequelize.query(
                    `INSERT INTO users (id, username, email, password_hash, is_active, django_id, is_staff, is_superuser)
           VALUES (?, ?, ?, ?, TRUE, ?, FALSE, FALSE)`,
                    {
                        replacements: [
                            user.id,
                            user.username,
                            user.email,
                            createHash(user.password),
                            Math.floor(Math.random() * 1000) + 1, // 随机django_id
                        ],
                    }
                );

                // 插入用户资料
                const profileId = crypto.randomBytes(16).toString('hex');
                await sequelize.query(
                    `INSERT INTO user_profiles (id, user_id, location, preferred_foot, shoe_size)
           VALUES (?, ?, ?, ?, ?)`,
                    {
                        replacements: [
                            profileId,
                            user.id,
                            user.location,
                            user.preferredFoot,
                            user.shoeSize,
                        ],
                    }
                );

                console.log(`用户 ${user.username} 已添加`);
            }
        }

        // 添加尺码数据
        const sizeData = [
            { size_us: 7, size_eu: 40 },
            { size_us: 8, size_eu: 41 },
            { size_us: 9, size_eu: 42 },
            { size_us: 10, size_eu: 43 },
            { size_us: 11, size_eu: 44 }
        ];

        for (const size of sizeData) {
            const [existingSizes] = await sequelize.query(
                `SELECT * FROM shoe_sizes WHERE size_us = ?`,
                {
                    replacements: [size.size_us],
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!existingSizes || existingSizes.length === 0) {
                const sizeId = crypto.randomBytes(16).toString('hex');
                await sequelize.query(
                    `INSERT INTO shoe_sizes (id, size_us, size_eu, created_at)
           VALUES (?, ?, ?, NOW())`,
                    {
                        replacements: [sizeId, size.size_us, size.size_eu],
                    }
                );
                console.log(`尺码 US ${size.size_us} / EU ${size.size_eu} 已添加`);
            }
        }

        // 添加状况类型数据
        const conditionData = [
            { name: 'New', description: 'Brand new, never worn' },
            { name: 'Like New', description: 'Worn once or twice, like new condition' },
            { name: 'Good', description: 'Lightly worn, minor signs of wear' },
            { name: 'Fair', description: 'Moderate wear, visible signs of use' },
            { name: 'Poor', description: 'Heavy wear, significant signs of use' }
        ];

        for (const condition of conditionData) {
            const [existingConditions] = await sequelize.query(
                `SELECT * FROM condition_types WHERE name = ?`,
                {
                    replacements: [condition.name],
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!existingConditions || existingConditions.length === 0) {
                const conditionId = crypto.randomBytes(16).toString('hex');
                await sequelize.query(
                    `INSERT INTO condition_types (id, name, description, created_at)
           VALUES (?, ?, ?, NOW())`,
                    {
                        replacements: [conditionId, condition.name, condition.description],
                    }
                );
                console.log(`状况类型 ${condition.name} 已添加`);
            }
        }

        // 获取所有品牌
        const [allBrands] = await sequelize.query(`SELECT id, name FROM brands`);
        console.log('现有品牌:', allBrands);

        // 获取所有尺码
        const [allSizes] = await sequelize.query(`SELECT id, size_us FROM shoe_sizes`);
        console.log('现有尺码:', allSizes);

        // 获取所有状况类型
        const [allConditions] = await sequelize.query(`SELECT id, name FROM condition_types`);
        console.log('现有状况类型:', allConditions);

        // 获取所有用户
        const [allUsers] = await sequelize.query(`SELECT id, username FROM users`);
        console.log('现有用户:', allUsers);

        // 使用第一个可用的品牌、尺码、状况类型和用户
        if (allBrands.length > 0 && allSizes.length > 0 && allConditions.length > 0 && allUsers.length > 0) {
            const brandId = allBrands[0].id;
            const sizeId = allSizes[0].id;
            const conditionId = allConditions[0].id;
            const userId = allUsers[0].id;

            // 添加示例鞋子
            const listing1Id = crypto.randomBytes(16).toString('hex');
            await sequelize.query(
                `INSERT INTO listings (id, title, brand_id, model, size_id, condition_id, preferred_foot, description, location, user_id, price, is_active, view_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
                {
                    replacements: [
                        listing1Id,
                        'Nike SB Dunk Low Pro',
                        brandId,
                        'SB Dunk Low Pro',
                        sizeId,
                        conditionId,
                        'left',
                        '穿过几次的Nike SB Dunk，状态良好，只有轻微的磨损。',
                        '北京',
                        userId,
                        129.99,
                        Math.floor(Math.random() * 100),
                    ],
                }
            );
            console.log(`鞋子 Nike SB Dunk Low Pro 已添加`);

            // 添加图片
            const image1Id = crypto.randomBytes(16).toString('hex');
            await sequelize.query(
                `INSERT INTO listing_images (id, listing_id, image_url, is_primary, sequence, created_at)
       VALUES (?, ?, ?, TRUE, ?, NOW())`,
                {
                    replacements: [
                        image1Id,
                        listing1Id,
                        '/assets/images/shoes/nike-sb-dunk.jpg',
                        0,
                    ],
                }
            );

            // 添加第二个示例鞋子
            const listing2Id = crypto.randomBytes(16).toString('hex');
            await sequelize.query(
                `INSERT INTO listings (id, title, brand_id, model, size_id, condition_id, preferred_foot, description, location, user_id, price, is_active, view_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
                {
                    replacements: [
                        listing2Id,
                        'Adidas Superstar',
                        brandId, // 使用相同的品牌
                        'Superstar',
                        sizeId, // 使用相同的尺码
                        conditionId, // 使用相同的状况
                        'right',
                        'Adidas Superstar经典款，有些磨损但整体状况良好。',
                        '上海',
                        userId, // 使用相同的用户
                        89.99,
                        Math.floor(Math.random() * 100),
                    ],
                }
            );
            console.log(`鞋子 Adidas Superstar 已添加`);

            // 添加图片
            const image2Id = crypto.randomBytes(16).toString('hex');
            await sequelize.query(
                `INSERT INTO listing_images (id, listing_id, image_url, is_primary, sequence, created_at)
       VALUES (?, ?, ?, TRUE, ?, NOW())`,
                {
                    replacements: [
                        image2Id,
                        listing2Id,
                        '/assets/images/shoes/adidas-superstar.jpg',
                        0,
                    ],
                }
            );

            console.log('示例数据加载完成');
        } else {
            console.log('无法添加示例鞋子，因为缺少必要的品牌、尺码、状况类型或用户数据');
        }
    } catch (error) {
        console.error('加载示例数据失败:', error);
    } finally {
        // 关闭连接
        await sequelize.close();
    }
}

// 加载示例数据
loadSampleData(); 