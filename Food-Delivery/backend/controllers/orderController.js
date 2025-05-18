const db = require('../config/db');

exports.placeOrder = async (req, res) => {
  const { customer_name, customer_email, total_price, items } = req.body;

  if (!customer_name || !customer_email || !total_price || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_name, customer_email, total_price, status) VALUES (?, ?, ?, ?)',
      [customer_name, customer_email, total_price, 'preparing']
    );
    const orderId = orderResult.insertId;

    const orderItemsPromises = items.map(item => {
      return conn.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity]
      );
    });

    await Promise.all(orderItemsPromises);
    await conn.commit();

    res.json({ message: 'Your order was placed successfully!', orderId });
  } catch (err) {
    await conn.rollback();
    console.error('Order error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    conn.release();
  }
};

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const validStatuses = ['preparing', 'on-the-way', 'delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
