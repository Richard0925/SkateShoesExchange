import express from 'express';
import crypto from 'crypto';
import { verifyJWT } from '../utils/token.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 获取所有列表
router.get('/', async (req, res) => {
    try {
        const sequelize = req.sequelize;

        // 构建查询条件
        const whereConditions = [];
        const queryParams = [];

        // 处理品牌
        if (req.query.brand) {
            whereConditions.push('brand = ?');
            queryParams.push(req.query.brand);
        }

        // 处理尺寸
        if (req.query.size) {
            whereConditions.push('size = ?');
            queryParams.push(req.query.size);
        }

        // 处理首选脚
        if (req.query.preferredFoot) {
            whereConditions.push('preferred_foot = ?');
            queryParams.push(req.query.preferredFoot);
        }

        // 处理状况
        if (req.query.condition) {
            whereConditions.push('shoe_condition <= ?');
            queryParams.push(req.query.condition);
        }

        // 处理位置
        if (req.query.location) {
            whereConditions.push('location = ?');
            queryParams.push(req.query.location);
        }

        // 处理搜索查询
        if (req.query.query) {
            whereConditions.push('(title LIKE ? OR brand LIKE ? OR model LIKE ?)');
            const searchTerm = `%${req.query.query}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        // 构建WHERE子句
        const whereClause = whereConditions.length > 0
            ? 'WHERE ' + whereConditions.join(' AND ')
            : '';

        // 构建排序
        let orderClause = 'ORDER BY l.created_at DESC'; // 默认按最新排序

        if (req.query.sortBy) {
            switch (req.query.sortBy) {
                case 'oldest':
                    orderClause = 'ORDER BY l.created_at ASC';
                    break;
                case 'a-z':
                    orderClause = 'ORDER BY l.brand ASC, l.model ASC';
                    break;
                case 'z-a':
                    orderClause = 'ORDER BY l.brand DESC, l.model DESC';
                    break;
                case 'condition-high':
                    orderClause = 'ORDER BY l.shoe_condition DESC';
                    break;
                case 'condition-low':
                    orderClause = 'ORDER BY l.shoe_condition ASC';
                    break;
            }
        }

        // 执行查询
        const [listings] = await sequelize.query(
            `SELECT l.*, 
        u.username as author_username,
        (SELECT GROUP_CONCAT(li.image_url) FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.position) as image_urls
      FROM listings l
      JOIN users u ON l.user_id = u.id
      ${whereClause}
      ${orderClause}`,
            {
                replacements: queryParams
            }
        );

        // 转换结果为前端预期格式
        const formattedListings = listings.map(listing => ({
            id: listing.id,
            title: listing.title,
            brand: listing.brand,
            model: listing.model,
            size: listing.size,
            condition: listing.shoe_condition,
            preferredFoot: listing.preferred_foot,
            description: listing.description,
            location: listing.location,
            imageUrls: listing.image_urls ? listing.image_urls.split(',') : ['/assets/images/placeholder.txt'],
            createdAt: listing.created_at,
            author: {
                username: listing.author_username
            }
        }));

        res.json({ listings: formattedListings });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// 获取单个列表
router.get('/:id', async (req, res) => {
    try {
        const sequelize = req.sequelize;
        const listingId = req.params.id;

        // 获取列表
        const [listings] = await sequelize.query(
            `SELECT l.*, 
        u.username as author_username,
        up.location as author_location,
        (SELECT GROUP_CONCAT(li.image_url) FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.position) as image_urls
      FROM listings l
      JOIN users u ON l.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE l.id = ?`,
            {
                replacements: [listingId]
            }
        );

        if (listings.length === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        const listing = listings[0];

        // 转换为前端预期格式
        const formattedListing = {
            id: listing.id,
            title: listing.title,
            brand: listing.brand,
            model: listing.model,
            size: listing.size,
            condition: listing.shoe_condition,
            preferredFoot: listing.preferred_foot,
            description: listing.description,
            location: listing.location,
            imageUrls: listing.image_urls ? listing.image_urls.split(',') : ['/assets/images/placeholder.txt'],
            createdAt: listing.created_at,
            author: {
                username: listing.author_username,
                location: listing.author_location
            }
        };

        res.json(formattedListing);
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Failed to fetch listing details' });
    }
});

// 创建新列表
router.post('/', async (req, res) => {
    try {
        // Get the token from the request header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Not authorized, no token' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = verifyJWT(token);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: 'Not authorized, invalid token' });
        }

        const userId = decoded.userId;

        // Get the listing data from the request body
        const { title, description, price, size, condition, brand } = req.body;

        // Validate required fields
        if (!title || !price || !size || !condition || !brand) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Create a new listing
        const listingId = uuidv4();

        await req.sequelize.query(`
            INSERT INTO listings (
                id, user_id, title, description, price, size, condition, brand, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, {
            replacements: [
                listingId,
                userId,
                title,
                description || null,
                price,
                size,
                condition,
                brand
            ]
        });

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Listing created successfully',
            listingId
        });

    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// 更新列表
router.put('/:id', async (req, res) => {
    try {
        const sequelize = req.sequelize;
        const listingId = req.params.id;
        const {
            title,
            brand,
            model,
            size,
            condition,
            preferredFoot,
            description,
            location,
            imageUrls
        } = req.body;

        // 验证用户身份和所有权 - 通常会通过中间件和JWT检查
        const userId = 'test-user-id'; // 在实际项目中，会从认证中获取

        // 验证列表存在并属于当前用户
        const [listings] = await sequelize.query(
            `SELECT * FROM listings WHERE id = ? AND user_id = ?`,
            {
                replacements: [listingId, userId]
            }
        );

        if (listings.length === 0) {
            return res.status(404).json({ error: 'Listing not found or not owned by user' });
        }

        // 更新列表
        await sequelize.query(
            `UPDATE listings SET
        title = ?,
        brand = ?,
        model = ?,
        size = ?,
        shoe_condition = ?,
        preferred_foot = ?,
        description = ?,
        location = ?,
        updated_at = NOW()
       WHERE id = ?`,
            {
                replacements: [
                    title,
                    brand,
                    model,
                    size,
                    condition,
                    preferredFoot,
                    description,
                    location,
                    listingId
                ]
            }
        );

        // 如果提供了新图片，则更新图片
        if (imageUrls && imageUrls.length > 0) {
            // 删除旧图片
            await sequelize.query(
                `DELETE FROM listing_images WHERE listing_id = ?`,
                {
                    replacements: [listingId]
                }
            );

            // 添加新图片
            for (let i = 0; i < imageUrls.length; i++) {
                const imageId = crypto.randomBytes(16).toString('hex');
                await sequelize.query(
                    `INSERT INTO listing_images (id, listing_id, image_url, position, created_at)
           VALUES (?, ?, ?, ?, NOW())`,
                    {
                        replacements: [
                            imageId,
                            listingId,
                            imageUrls[i],
                            i
                        ]
                    }
                );
            }
        }

        // 获取用户信息
        const [users] = await sequelize.query(
            `SELECT username FROM users WHERE id = ?`,
            {
                replacements: [userId]
            }
        );

        const username = users.length > 0 ? users[0].username : 'unknown';

        // 返回更新后的列表
        const updatedListing = {
            id: listingId,
            title,
            brand,
            model,
            size,
            condition: condition,
            preferredFoot,
            description,
            location,
            imageUrls: imageUrls || [],
            updatedAt: new Date().toISOString(),
            author: {
                username
            }
        };

        res.json(updatedListing);
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing' });
    }
});

// 删除列表
router.delete('/:id', async (req, res) => {
    try {
        const sequelize = req.sequelize;
        const listingId = req.params.id;

        // 验证用户身份和所有权 - 通常会通过中间件和JWT检查
        const userId = 'test-user-id'; // 在实际项目中，会从认证中获取

        // 验证列表存在并属于当前用户
        const [listings] = await sequelize.query(
            `SELECT * FROM listings WHERE id = ? AND user_id = ?`,
            {
                replacements: [listingId, userId]
            }
        );

        if (listings.length === 0) {
            return res.status(404).json({ error: 'Listing not found or not owned by user' });
        }

        // 删除列表 (级联删除会自动删除关联的图片)
        await sequelize.query(
            `DELETE FROM listings WHERE id = ?`,
            {
                replacements: [listingId]
            }
        );

        res.json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});

// 获取用户列表
router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Get user ID
        const [users] = await req.sequelize.query(`
            SELECT id FROM users WHERE username = ?
        `, {
            replacements: [username]
        });

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = users[0].id;

        // 简化查询，只使用基本字段
        const [listings] = await req.sequelize.query(`
            SELECT * FROM listings WHERE user_id = ?
        `, {
            replacements: [userId]
        });

        // 返回空列表，因为用户可能还没有任何列表
        res.status(200).json({
            success: true,
            listings: listings || []
        });

    } catch (error) {
        console.error('Get user listings error:', error);
        res.status(500).json({ error: 'Failed to retrieve user listings' });
    }
});

/**
 * Get Listings Table Structure (Temporary)
 * GET /api/listings/table-structure
 */
router.get('/table-structure', async (req, res) => {
    try {
        // 获取表结构
        const [columns] = await req.sequelize.query(`
            DESCRIBE listings
        `);

        // 返回表结构
        res.status(200).json({
            success: true,
            columns
        });

    } catch (error) {
        console.error('Get table structure error:', error);
        res.status(500).json({ error: 'Failed to retrieve table structure' });
    }
});

export default router; 