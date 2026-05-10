const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'moms_super_secret_key_change_in_production';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// 1. Admin Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get(`SELECT * FROM admin WHERE username = ?`, [username], (err, admin) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

        const isValid = bcrypt.compareSync(password, admin.passwordHash);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    });
});

// 2. Get all products (Public)
app.get('/api/products', (req, res) => {
    db.all(`SELECT * FROM products ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 3. Add a product (Admin only)
app.post('/api/products', authenticateToken, upload.single('image'), (req, res) => {
    const { title, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !price || !imageUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
        `INSERT INTO products (title, description, price, imageUrl) VALUES (?, ?, ?, ?)`,
        [title, description, price, imageUrl],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title, description, price, imageUrl });
        }
    );
});

// 4. Delete a product (Admin only)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM products WHERE id = ?`, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted', changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
