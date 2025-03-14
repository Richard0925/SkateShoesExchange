import nodemailer from 'nodemailer';

// 从环境变量获取邮件发送配置
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'your-app-password';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Skateboard Shoe Exchange <no-reply@skateboardshoeexchange.com>';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// 创建邮件发送器
const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

/**
 * 发送邮箱验证邮件
 * @param {string} to - 收件人邮箱
 * @param {string} username - 用户名
 * @param {string} token - 验证令牌
 * @returns {Promise<boolean>} 发送结果
 */
export async function sendVerificationEmail(to, username, token) {
    // 构建验证URL
    const verificationUrl = `${BASE_URL}/verify-email/${token}`;

    // 设置邮件选项
    const mailOptions = {
        from: EMAIL_FROM,
        to,
        subject: '欢迎加入Skateboard Shoe Exchange - 请验证您的邮箱',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">欢迎加入Skateboard Shoe Exchange!</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">您好, ${username}!</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">感谢您注册Skateboard Shoe Exchange。请点击下面的按钮验证您的邮箱地址：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">验证邮箱</a>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">或者，您可以复制并粘贴以下链接到您的浏览器中：</p>
        <p style="font-size: 14px; line-height: 1.5; color: #777; word-break: break-all;">${verificationUrl}</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">此链接将在24小时后过期。</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">如果您没有注册Skateboard Shoe Exchange，请忽略此邮件。</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="font-size: 14px; color: #999; text-align: center;">© ${new Date().getFullYear()} Skateboard Shoe Exchange. 保留所有权利。</p>
      </div>
    `
    };

    try {
        // 发送邮件
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
}

/**
 * 发送密码重置邮件
 * @param {string} to - 收件人邮箱
 * @param {string} username - 用户名
 * @param {string} token - 重置令牌
 * @returns {Promise<boolean>} 发送结果
 */
export async function sendPasswordResetEmail(to, username, token) {
    // 构建重置URL
    const resetUrl = `${BASE_URL}/reset-password/${token}`;

    // 设置邮件选项
    const mailOptions = {
        from: EMAIL_FROM,
        to,
        subject: 'Skateboard Shoe Exchange - 密码重置',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">密码重置请求</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">您好, ${username}!</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">我们收到了重置您Skateboard Shoe Exchange账户密码的请求。请点击下面的按钮设置新密码：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">重置密码</a>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">或者，您可以复制并粘贴以下链接到您的浏览器中：</p>
        <p style="font-size: 14px; line-height: 1.5; color: #777; word-break: break-all;">${resetUrl}</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">此链接将在1小时后过期。</p>
        <p style="font-size: 16px; line-height: 1.5; color: #555;">如果您没有请求重置密码，请忽略此邮件，您的密码将保持不变。</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="font-size: 14px; color: #999; text-align: center;">© ${new Date().getFullYear()} Skateboard Shoe Exchange. 保留所有权利。</p>
      </div>
    `
    };

    try {
        // 发送邮件
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
} 