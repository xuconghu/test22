/**
 * 云服务器 CORS 配置
 * 支持 GitHub Pages 跨域访问
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// 1. CORS 配置 - 支持 GitHub Pages
app.use(cors({
    origin: 'https://xuconghu.github.io', // 替换为你的 GitHub Pages 域名
    methods: ['POST', 'GET', 'OPTIONS'], // 允许前端发送的请求方法
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false // GitHub Pages 通常不需要凭据
}));

// 2. 基础中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. 创建数据存储目录
const dataDir = '/var/www/candy-game/data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`📁 创建数据目录: ${dataDir}`);
}

// 4. 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dataDir);
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const randomId = Math.random().toString(36).substr(2, 9);
        const filename = `${timestamp}_${randomId}_${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB 限制
    }
});

// 5. 健康检查接口
app.get('/api/health', (req, res) => {
    console.log('🔍 健康检查请求来自:', req.get('origin') || req.ip);
    
    res.json({
        status: 'healthy',
        message: '服务器运行正常',
        timestamp: new Date().toISOString(),
        server: 'candy-game-server',
        version: '1.0.0'
    });
});

// 6. JSON 文件上传接口
app.post('/api/upload-json', upload.single('jsonFile'), (req, res) => {
    try {
        console.log('📤 收到 JSON 文件上传请求');
        console.log('🌐 请求来源:', req.get('origin') || req.ip);
        console.log('📋 请求体:', req.body);
        console.log('📁 上传文件:', req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: '没有收到文件'
            });
        }

        // 记录上传信息
        const uploadInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadTime: new Date().toISOString(),
            userName: req.body.userName || '未知用户',
            userGender: req.body.userGender || '',
            userId: req.body.userId || '',
            fileType: req.body.fileType || 'unknown',
            totalEvents: parseInt(req.body.totalEvents) || 0
        };

        console.log('✅ 文件上传成功:', uploadInfo);

        // 返回成功响应
        res.json({
            success: true,
            message: '文件上传成功',
            data: uploadInfo
        });

    } catch (error) {
        console.error('❌ 文件上传失败:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 7. CSV 文件上传接口（兼容性）
app.post('/api/upload-csv', upload.single('csvFile'), (req, res) => {
    try {
        console.log('📤 收到 CSV 文件上传请求');
        console.log('🌐 请求来源:', req.get('origin') || req.ip);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: '没有收到文件'
            });
        }

        const uploadInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadTime: new Date().toISOString(),
            userName: req.body.userName || '未知用户'
        };

        console.log('✅ CSV 文件上传成功:', uploadInfo);

        res.json({
            success: true,
            message: 'CSV 文件上传成功',
            data: uploadInfo
        });

    } catch (error) {
        console.error('❌ CSV 文件上传失败:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 8. 错误处理中间件
app.use((error, req, res, next) => {
    console.error('🚨 服务器错误:', error);
    res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: error.message
    });
});

// 9. 404 处理
app.use('*', (req, res) => {
    console.log('❓ 未找到路径:', req.originalUrl);
    res.status(404).json({
        success: false,
        error: '接口不存在',
        path: req.originalUrl
    });
});

// 10. 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 服务器启动成功!');
    console.log(`📍 监听地址: http://0.0.0.0:${PORT}`);
    console.log(`📁 数据目录: ${dataDir}`);
    console.log(`🌐 允许跨域: https://xuconghu.github.io`);
    console.log('⏰ 启动时间:', new Date().toISOString());
});

// 11. 优雅关闭
process.on('SIGTERM', () => {
    console.log('📴 收到 SIGTERM 信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 收到 SIGINT 信号，正在关闭服务器...');
    process.exit(0);
});

module.exports = app;
