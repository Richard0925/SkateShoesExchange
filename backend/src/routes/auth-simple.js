import express from 'express';
import crypto from 'crypto'; // 使用Node.js内置的crypto模块代替bcryptjs

const router = express.Router();

// 简单的内存存储，用于演示
const users = [];
const tokens = {};

// 简单的哈希函数代替bcryptjs
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// 简单的token生成函数
const generateToken = (data) => {
    const token = crypto.randomBytes(64).toString('hex');
    tokens[token] = {
        data,
        createdAt: new Date()
    };
    return token;
};

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, preferredFoot, shoeSize, location } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email and password are required' });
        }

        // 检查邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // 检查用户名和邮箱是否已存在
        if (users.some(user => user.username === username)) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        if (users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // 生成用户ID和密码哈希
        const userId = crypto.randomBytes(16).toString('hex');
        const hashedPassword = hashPassword(password);

        // 创建新用户 - 直接设置为活跃状态，无需邮箱验证
        const newUser = {
            id: userId,
            username,
            email,
            passwordHash: hashedPassword,
            isActive: true, // 直接设为true，无需邮箱验证
            profile: {
                location,
                preferredFoot,
                shoeSize
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // 保存用户
        users.push(newUser);

        // 返回用户信息(不包含密码)
        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            user: {
                id: userId,
                username,
                email,
                preferredFoot,
                shoeSize,
                location,
                isActive: true,
                createdAt: new Date()
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed, please try again later' });
    }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // 获取用户信息
        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // 验证密码
        const hashedPassword = hashPassword(password);
        if (hashedPassword !== user.passwordHash) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // 生成JWT令牌
        const token = generateToken({
            userId: user.id,
            username: user.username,
            email: user.email
        });

        // 更新最后登录时间
        user.lastLogin = new Date();

        // 返回用户信息和令牌
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                preferredFoot: user.profile.preferredFoot,
                shoeSize: user.profile.shoeSize,
                location: user.profile.location,
                isActive: user.isActive,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed, please try again later' });
    }
});

// 暴露用户列表接口，仅用于测试
router.get('/users', (req, res) => {
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    res.json(safeUsers);
});

export default router; 