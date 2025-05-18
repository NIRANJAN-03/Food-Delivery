// controllers/restaurantController.js
const db = require('../config/db'); // Assumes a db connection file using mysql2 or similar

// Get all restaurants
const getAllRestaurants = (res) => {
    const sql = 'SELECT * FROM restaurants';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};

// Optional: Get restaurants by location (requires adding a 'location' column to DB)
const getRestaurantsByLocation = (location, res) => {
    const sql = 'SELECT * FROM restaurants WHERE location LIKE ?';
    db.query(sql, [`%${location}%`], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllRestaurants,
    getRestaurantsByLocation
};
