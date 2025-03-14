import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
    generateJWT,
    generateEmailVerificationToken,
    generatePasswordResetToken,
    verifyJWT
} from '../utils/token.js';
import {
    sendVerificationEmail,
    sendPasswordResetEmail
} from '../utils/email.js';

const router = express.Router();

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, preferredFoot, shoeSize, location } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: '用户名、邮箱和密码不能为空' });
        }

        // 检查邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: '邮箱格式不正确' });
        }

        // 检查用户名是否已存在
        const [existingUsername] = await req.sequelize.query(
            'SELECT * FROM users WHERE username = ?',
            { replacements: [username] }
        );

        if (existingUsername.length > 0) {
            return res.status(400).json({ error: '用户名已被占用' });
        }

        // 检查邮箱是否已存在
        const [existingEmail] = await req.sequelize.query(
            'SELECT * FROM users WHERE email = ?',
            { replacements: [email] }
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({ error: '邮箱已被注册' });
        }

        // 密码加密
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 生成用户ID
        const userId = uuidv4();

        // 创建用户
        await req.sequelize.query(`
      INSERT INTO users (
        id, username, email, password_hash, is_active, created_at, updated_at
      ) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, {
            replacements: [userId, username, email, hashedPassword, false]
        });

        // 创建用户资料
        const profileId = uuidv4();
        await req.sequelize.query(`
      INSERT INTO user_profiles (
        id, user_id, location, preferred_foot, shoe_size, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, {
            replacements: [profileId, userId, location || null, preferredFoot || null, shoeSize || null]
        });

        // 生成验证令牌
        const verificationToken = generateEmailVerificationToken(userId);

        // 保存验证令牌到数据库
        const tokenId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24小时后过期

        await req.sequelize.query(`
      INSERT INTO email_verifications (
        id, user_id, token, expires_at, created_at
      )
      VALUES (?, ?, ?, ?, NOW())
    `, {
            replacements: [tokenId, userId, verificationToken, expiresAt]
        });

        // 发送验证邮件
        try {
            await sendVerificationEmail(email, username, verificationToken);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // 继续执行，不阻止注册流程
        }

        // 返回用户信息(不包含密码)
        res.status(201).json({
            success: true,
            message: '注册成功！请检查您的邮箱完成验证',
            user: {
                id: userId,
                username,
                email,
                isActive: false,
                createdAt: new Date()
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: '注册失败，请稍后再试' });
    }
});

/**
 * 邮箱验证
 * GET /api/auth/verify-email/:token
 */
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // 验证令牌
        const decoded = verifyJWT(token);
        if (!decoded || decoded.type !== 'email_verification') {
            return res.status(400).json({ error: '无效的验证链接' });
        }

        const userId = decoded.userId;

        // 检查令牌是否在数据库中存在
        const [verificationRecord] = await req.sequelize.query(`
      SELECT * FROM email_verifications 
      WHERE user_id = ? AND token = ? AND expires_at > NOW() AND used = FALSE
    `, {
            replacements: [userId, token]
        });

        if (verificationRecord.length === 0) {
            return res.status(400).json({ error: '验证链接已过期或已被使用' });
        }

        // 激活用户
        await req.sequelize.query(`
      UPDATE users SET is_active = TRUE WHERE id = ?
    `, {
            replacements: [userId]
        });

        // 标记验证记录为已使用
        await req.sequelize.query(`
      UPDATE email_verifications SET used = TRUE WHERE user_id = ? AND token = ?
    `, {
            replacements: [userId, token]
        });

        res.json({
            success: true,
            message: '邮箱验证成功！现在您可以登录了'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: '验证失败，请稍后再试' });
    }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: '邮箱和密码不能为空' });
        }

        // 获取用户信息
        const [users] = await req.sequelize.query(`
      SELECT * FROM users WHERE email = ?
    `, {
            replacements: [email]
        });

        if (users.length === 0) {
            return res.status(400).json({ error: '邮箱或密码不正确' });
        }

        const user = users[0];

        // 检查用户是否已激活
        if (!user.is_active) {
            return res.status(400).json({ error: '请先验证您的邮箱' });
        }

        // 验证密码
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: '邮箱或密码不正确' });
        }

        // 生成JWT令牌
        const token = generateJWT({
            userId: user.id,
            username: user.username,
            email: user.email
        });

        // 更新最后登录时间
        await req.sequelize.query(`
      UPDATE users SET last_login = NOW() WHERE id = ?
    `, {
            replacements: [user.id]
        });

        // 返回用户信息和令牌
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isActive: user.is_active,
                lastLogin: new Date()
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '登录失败，请稍后再试' });
    }
});

/**
 * 请求重置密码
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: '邮箱不能为空' });
        }

        // 获取用户信息
        const [users] = await req.sequelize.query(`
      SELECT * FROM users WHERE email = ?
    `, {
            replacements: [email]
        });

        if (users.length === 0) {
            // 为了安全，不透露邮箱是否存在
            return res.json({
                success: true,
                message: '如果邮箱存在，我们已向您发送了密码重置邮件'
            });
        }

        const user = users[0];

        // 生成重置令牌
        const resetToken = generatePasswordResetToken(user.id);

        // 保存重置令牌到数据库
        const tokenId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1小时后过期

        await req.sequelize.query(`
      INSERT INTO password_resets (
        id, user_id, token, expires_at, used, created_at
      )
      VALUES (?, ?, ?, ?, FALSE, NOW())
    `, {
            replacements: [tokenId, user.id, resetToken, expiresAt]
        });

        // 发送重置邮件
        try {
            await sendPasswordResetEmail(email, user.username, resetToken);
        } catch (error) {
            console.error('Failed to send password reset email:', error);
        }

        res.json({
            success: true,
            message: '如果邮箱存在，我们已向您发送了密码重置邮件'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: '处理失败，请稍后再试' });
    }
});

/**
 * 重置密码
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: '令牌和新密码不能为空' });
        }

        // 验证令牌
        const decoded = verifyJWT(token);
        if (!decoded || decoded.type !== 'password_reset') {
            return res.status(400).json({ error: '无效的重置链接' });
        }

        const userId = decoded.userId;

        // 检查令牌是否在数据库中存在
        const [resetRecord] = await req.sequelize.query(`
      SELECT * FROM password_resets 
      WHERE user_id = ? AND token = ? AND expires_at > NOW() AND used = FALSE
    `, {
            replacements: [userId, token]
        });

        if (resetRecord.length === 0) {
            return res.status(400).json({ error: '重置链接已过期或已被使用' });
        }

        // 加密新密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 更新密码
        await req.sequelize.query(`
      UPDATE users SET password_hash = ? WHERE id = ?
    `, {
            replacements: [hashedPassword, userId]
        });

        // 标记重置记录为已使用
        await req.sequelize.query(`
      UPDATE password_resets SET used = TRUE WHERE user_id = ? AND token = ?
    `, {
            replacements: [userId, token]
        });

        res.json({
            success: true,
            message: '密码重置成功！现在您可以使用新密码登录了'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: '重置失败，请稍后再试' });
    }
});

export default router; 