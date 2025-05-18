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

module.exports = router;
