FROM node:18-alpine

WORKDIR /app

# 安装MySQL依赖
RUN apk add --no-cache mysql-client

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖
RUN npm install
# 确保关键依赖安装成功
RUN npm install bcryptjs jsonwebtoken uuid nodemailer express sequelize mysql2 cors dotenv body-parser

# 复制源代码
COPY . .

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV NODE_ENV=production

# 启动应用
CMD ["npm", "start"] 