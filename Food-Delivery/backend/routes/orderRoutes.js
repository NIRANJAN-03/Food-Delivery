const express = require('express');
const router = express.Router();
const { placeOrder, updateOrderStatus } = require('../controllers/orderController');

router.post('/', placeOrder);
router.patch('/:id', updateOrderStatus);

module.exports = router;
