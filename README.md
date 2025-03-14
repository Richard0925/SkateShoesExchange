# SkateSwap - Skateboard Shoes Exchange Platform

SkateSwap是一个专为滑板爱好者设计的在线交易平台，用户可以在这里交换、购买或出售滑板鞋。

## 项目特点

- 现代化UI设计，响应式布局，适配多种设备
- 用户认证与个人资料管理
- 按品牌、尺码、状况和位置进行高级搜索和过滤
- 详细的商品展示，包括多图展示、状况评级和细节描述
- 用户评级系统和评论功能
- 直接消息系统，方便买卖双方沟通
- 支持左脚、右脚或成对滑板鞋的交易

## 技术栈

- **前端**: React, Vite, TailwindCSS
- **后端**: Node.js, Express
- **数据库**: MySQL
- **部署**: Docker, Nginx

## 开发环境设置

### 先决条件

- Node.js (v18+)
- Docker和Docker Compose
- Git

### 安装与运行

1. 克隆仓库
   ```bash
   git clone https://github.com/Richard0925/SkateShoesExchange.git
   cd SkateShoesExchange
   ```

2. 使用Docker Compose启动项目
   ```bash
   docker-compose up -d
   ```

3. 访问应用
   - 前端: http://localhost:80
   - 后端API: http://localhost:3000

## 项目结构

```
/
├── backend/             # 后端API服务
├── public/              # 静态资源文件
├── src/                 # 前端源代码
│   ├── components/      # React组件
│   ├── contexts/        # React上下文
│   ├── pages/           # 页面组件
│   ├── styles/          # 样式文件
│   └── utils/           # 工具函数
├── docker-compose.yml   # Docker配置
└── README.md            # 项目说明
```

## 许可

MIT许可证
