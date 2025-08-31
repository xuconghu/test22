# 部署指南

## 1. GitHub Pages 设置

### 启用 GitHub Pages
1. 进入 GitHub 仓库 `https://github.com/xuconghu/test22`
2. 点击 **Settings** 标签
3. 滚动到 **Pages** 部分
4. 在 **Source** 下选择 **Deploy from a branch**
5. 选择 **master** 分支
6. 点击 **Save**

### 访问地址
- GitHub Pages 地址: `https://xuconghu.github.io/test22/`

## 2. 云服务器配置

### 上传服务器代码
```bash
# 1. 连接到云服务器
ssh -i "你的密钥.pem" root@106.15.184.68

# 2. 创建项目目录
mkdir -p /var/www/candy-game-server
cd /var/www/candy-game-server

# 3. 上传 server-cors-config.js 文件
# (使用 scp 或直接复制粘贴内容)

# 4. 安装依赖
npm init -y
npm install express cors multer

# 5. 创建数据目录
mkdir -p /var/www/candy-game/data
chmod 755 /var/www/candy-game/data
```

### 启动服务器
```bash
# 方法1: 直接启动
node server-cors-config.js

# 方法2: 使用 PM2 (推荐)
npm install -g pm2
pm2 start server-cors-config.js --name "candy-game-server"
pm2 save
pm2 startup
```

### 防火墙配置
```bash
# 确保端口 80 开放
ufw allow 80
ufw status
```

## 3. 测试流程

### 本地测试
1. 访问: `http://localhost:8080` (本地开发服务器)
2. 点击 "🔍 测试服务器连接"
3. 输入测试数据 "123"
4. 点击上传

### GitHub Pages 测试
1. 访问: `https://xuconghu.github.io/test22/`
2. 执行相同的测试步骤

## 4. 代码说明

### CORS 配置
```javascript
app.use(cors({
    origin: 'https://xuconghu.github.io', // GitHub Pages 域名
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));
```

### API 端点
- **健康检查**: `GET /api/health`
- **JSON 上传**: `POST /api/upload-json`
- **CSV 上传**: `POST /api/upload-csv`

### 文件存储
- 存储路径: `/var/www/candy-game/data/`
- 文件命名: `时间戳_随机ID_原文件名`
- 大小限制: 10MB

## 5. 故障排除

### 常见问题
1. **CORS 错误**: 检查服务器 origin 配置
2. **连接超时**: 检查防火墙和服务器状态
3. **文件上传失败**: 检查目录权限和磁盘空间

### 日志查看
```bash
# PM2 日志
pm2 logs candy-game-server

# 系统日志
tail -f /var/log/syslog
```
