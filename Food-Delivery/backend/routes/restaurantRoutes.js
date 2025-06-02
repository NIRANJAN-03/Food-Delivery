// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const { getAllRestaurants, getRestaurantsByLocation } = require('../controllers/restaurantController');

// GET /api/restaurants
router.get('/', (req, res) => {
    const location = req.query.location;
    if (location) {
        getRestaurantsByLocation(location, res);
    } else {
        getAllRestaurants(res);
    }
});
// GET /api/restaurants/search?item=burger
router.get('/search', async (req, res) => {
    const { item } = req.query;

    if (!item) {
        return res.status(400).json({ error: 'Item name is required' });
    }

    const query = `
        SELECT DISTINCT r.*
        FROM restaurants r
        JOIN menu_items m ON r.id = m.restaurant_id
        WHERE LOWER(m.name) LIKE ?
    `;

    try {
        const [rows] = await db.execute(query, [`%${item.toLowerCase()}%`]);
        res.json(rows);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
