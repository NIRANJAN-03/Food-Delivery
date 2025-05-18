//backend/controllers/userController
const db = require('../config/db'); // assuming you have db connection
const jwt = require('jsonwebtoken');

// Register function
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error registering user', error: err });
    res.status(201).json({ message: 'User registered successfully' });
  });
};

// Login function
exports.loginUser = (req, res) => {
  const { name, email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE name = ? AND email = ? AND password = ?';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    // ✅ Only send one correct response
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
};

