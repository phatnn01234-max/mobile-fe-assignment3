const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Ngocphat2909@',     
    database: 'delivery_db'
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối thành công với MySQL (delivery_db)!');
});

// LƯU Ý QUAN TRỌNG: API Search phải đặt TRƯỚC API Details (/:id) để tránh bị nhầm route

// 1. Search: Tìm kiếm đơn hàng theo tên người nhận
// Cách gọi postman: GET http://localhost:3001/orders/search?keyword=Nguyen
app.get('/orders/search', (req, res) => {
    const keyword = req.query.keyword;
    const sql = "SELECT * FROM orders WHERE customerName LIKE ?";
    db.query(sql, [`%${keyword}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. ViewAll: Lấy tất cả đơn hàng
app.get('/orders', (req, res) => {
    const sql = "SELECT * FROM orders";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. Details: Lấy chi tiết 1 đơn hàng
app.get('/orders/:id', (req, res) => {
    const sql = "SELECT * FROM orders WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Không tìm thấy" });
        res.json(result[0]);
    });
});

// 4. Create: Thêm đơn hàng mới
app.post('/orders', (req, res) => {
    const { customerName, address, status, total } = req.body;
    const sql = "INSERT INTO orders (customerName, address, status, total) VALUES (?, ?, ?, ?)";
    db.query(sql, [customerName, address, status || 'Pending', total], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Đã thêm thành công", id: result.insertId });
    });
});

// 5. Update: Cập nhật đơn hàng
app.put('/orders/:id', (req, res) => {
    const { customerName, address, status, total } = req.body;
    const sql = "UPDATE orders SET customerName=?, address=?, status=?, total=? WHERE id=?";
    db.query(sql, [customerName, address, status, total, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Đã cập nhật thành công" });
    });
});

// 6. Delete: Xóa đơn hàng
app.delete('/orders/:id', (req, res) => {
    const sql = "DELETE FROM orders WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Đã xóa thành công" });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Order Service đang chạy tại http://localhost:${PORT}`);
});