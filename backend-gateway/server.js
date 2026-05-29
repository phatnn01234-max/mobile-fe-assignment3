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

// 3. Cơ chế Bảo mật & Chặn truy cập (Blacklist / Route Restriction)
// Mảng chứa các API bị cấm tại Gateway. Bạn có thể BỎ COMMENT (uncomment) dòng tương ứng để kích hoạt chặn API đó.
const blacklist = [
    // --- 1. Chặn API lấy toàn bộ danh sách đơn hàng (GET /api/orders) ---
    // { method: 'GET', path: '/api/orders' },

    // --- 2. Chặn API tìm kiếm đơn hàng (GET /api/orders/search) ---
    // { method: 'GET', path: '/api/orders/search' },

    // --- 3. Chặn API tạo đơn hàng mới (POST /api/orders) ---
    // { method: 'POST', path: '/api/orders' },

    // --- 4. Chặn API cập nhật đơn hàng (PUT /api/orders/:id) ---
    // { method: 'PUT', path: '/api/orders/:id' },

    // --- 5. Chặn API xoá đơn hàng (DELETE /api/orders/:id) ---
    // { method: 'DELETE', path: '/api/orders/:id' },
];

// Middleware kiểm tra xem request có nằm trong danh sách đen không
const checkBlacklist = (req, res, next) => {
    const requestPath = req.originalUrl.split('?')[0];
    const requestMethod = req.method;

    const isBlocked = blacklist.some(route => {
        const methodMatch = route.method === '*' || route.method.toUpperCase() === requestMethod.toUpperCase();
        
        let pathMatch = false;
        if (route.path instanceof RegExp) {
            pathMatch = route.path.test(requestPath);
        } else if (route.path.includes('/:id')) {
            // Thay thế /:id bằng định dạng regex động cho khớp với các số ID (vd: /api/orders/12)
            const base = route.path.replace('/:id', '');
            const regex = new RegExp(`^${base}/\\d+$`);
            pathMatch = regex.test(requestPath);
        } else {
            // Khớp hoàn toàn chính xác đường dẫn (vd: /api/orders hoặc /api/orders/search)
            pathMatch = requestPath === route.path;
        }
        return methodMatch && pathMatch;
    });

    if (isBlocked) {
        console.warn(`[API Gateway] Request bị chặn: ${requestMethod} ${requestPath}`);
        return res.status(403).json({ 
            message: `Từ chối truy cập! API ${requestMethod} ${requestPath} đã bị chặn bởi API Gateway.` 
        });
    }

    next();
};

// 4. API GATEWAY: Chuyển tiếp (Forward) CHUẨN NHẤT
// Bắt tất cả các request có tiền tố /api, qua kiểm tra Token và Blacklist
app.use('/api', verifyToken, checkBlacklist, createProxyMiddleware({
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