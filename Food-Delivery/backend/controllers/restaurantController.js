const db = require('../config/db');

exports.getRestaurants = (req, res) => {
    const location = req.query.location;

    let sql = 'SELECT * FROM restaurants';
    const params = [];

    if (location) {
        sql += ' WHERE location = ?';
        params.push(location);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch restaurants' });
        res.json(results);
    });
};
