// userController.js
const db = require('../config/db');
const bcrypt = require('bcrypt'); // or bcryptjs if you used that

// Register new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch || user.name !== name) {
            return res.status(401).json({ message: 'Invalid email, name, or password' });
        }

        res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
};

// Fetch orders for a user by email
const getUserOrders = async (req, res) => {
    const { email } = req.query;

    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE customer_email = ?', [email]);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch order history' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserOrders
};
