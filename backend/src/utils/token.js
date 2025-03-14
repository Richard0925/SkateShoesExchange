import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// 从环境变量获取JWT密钥，如果不存在则使用默认值
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * 生成JWT认证令牌
 * @param {Object} payload - 要嵌入到令牌中的数据
 * @param {string} expiresIn - 过期时间，默认为7天
 * @returns {string} JWT令牌
 */
export function generateJWT(payload, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * 验证JWT令牌
 * @param {string} token - 要验证的JWT令牌
 * @returns {Object|null} 解码后的数据，如果验证失败则返回null
 */
export function verifyJWT(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('JWT验证失败:', error.message);
        return null;
    }
}

/**
 * 生成邮箱验证令牌
 * @param {string} userId - 用户ID
 * @returns {string} 邮箱验证令牌
 */
export function generateEmailVerificationToken(userId) {
    const payload = {
        userId,
        type: 'email_verification',
        tokenId: uuidv4()  // 添加唯一标识符以防止令牌重用
    };

    // 邮箱验证令牌24小时有效
    return generateJWT(payload, '24h');
}

/**
 * 生成密码重置令牌
 * @param {string} userId - 用户ID
 * @returns {string} 密码重置令牌
 */
export function generatePasswordResetToken(userId) {
    const payload = {
        userId,
        type: 'password_reset',
        tokenId: uuidv4()  // 添加唯一标识符以防止令牌重用
    };

    // 密码重置令牌1小时有效
    return generateJWT(payload, '1h');
} 