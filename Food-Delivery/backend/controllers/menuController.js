const db = require('../config/db');

exports.getMenu = (req, res) => {
    const restaurantId = req.query.restaurant_id;

    if (!restaurantId) {
        return res.status(400).json({ error: 'Missing restaurant_id' });
    }

    const sql = 'SELECT * FROM menu WHERE restaurant_id = ?';
    db.query(sql, [restaurantId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch menu' });
        res.json(results);
    });
};
