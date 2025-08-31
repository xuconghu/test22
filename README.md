# 云服务器上传测试

这是一个简单的测试项目，用于验证前端到云服务器的数据上传功能。

## 功能

- 📤 测试数据上传到云服务器
- 🌐 支持跨域访问
- 📁 自动保存到服务器的 `/var/www/candy-game/data/` 目录
- ✅ 实时反馈上传状态

## 使用方法

1. 访问 GitHub Pages 页面
2. 在输入框中输入测试数据
3. 点击上传按钮
4. 查看上传结果

## 技术栈

- 前端：HTML + CSS + JavaScript
- 后端：Node.js + Express
- 部署：GitHub Pages + 阿里云服务器

## API 端点

- **上传接口**: `http://106.15.184.68/api/upload-json`
- **方法**: POST
- **数据格式**: FormData (包含 JSON 文件)

## 服务器配置

服务器需要配置 CORS 以允许 GitHub Pages 的跨域访问：

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://你的用户名.github.io',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
```
