const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// Chìa khóa bí mật
const SECRET_KEY = "phat_assignment3_secret_key";

// 1. API Cấp quyền (Login)
app.post('/login', express.json(), (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'shipper' && password === '123456') {
        const token = jwt.sign({ username, role: 'shipper' }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Đăng nhập thành công", token: token });
    } else {
        res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }
});

// 2. Middleware Xác thực (Bảo vệ)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: "Từ chối truy cập. Vui lòng cung cấp Token!" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        req.user = decoded;
        next();
    });
};

// 3. API GATEWAY: Chuyển tiếp (Forward) CHUẨN NHẤT
// Bắt tất cả các request có tiền tố /api
app.use('/api', verifyToken, createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '' // Lệnh này sẽ cắt chữ /api đi. 
                    // Ví dụ: /api/orders sẽ tự động biến thành /orders trước khi sang 3001
    }
}));

// Chạy Gateway
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway đang chạy tại http://localhost:${PORT}`);
});