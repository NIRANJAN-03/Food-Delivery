const express = require('express');
const router = express.Router(); // ✅ Create Express router
const { getAllRestaurants } = require('../controllers/restaurantController');

// Route for getting restaurant by ID (if needed)
router.get('/:id', getAllRestaurants); // or use '/' if this route fetches all restaurants

module.exports = router; // ✅ Export router
