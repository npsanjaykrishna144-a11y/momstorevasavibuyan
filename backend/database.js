const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'store.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            imageUrl TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Admin Table (simplified for just mom)
        db.run(`CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL
        )`, (err) => {
            if (!err) {
                // Initialize admin if not exists
                // Default username 'mom', password 'admin123'
                // In a real app, hash the password! For this demo, using plain or pre-hashed
                const bcrypt = require('bcryptjs');
                const defaultHash = bcrypt.hashSync('admin123', 10);
                
                db.get(`SELECT * FROM admin WHERE username = 'mom'`, (err, row) => {
                    if (!row) {
                        db.run(`INSERT INTO admin (username, passwordHash) VALUES (?, ?)`, ['mom', defaultHash]);
                    }
                });
            }
        });
    }
});

module.exports = db;
