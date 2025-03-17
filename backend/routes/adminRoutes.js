const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// Get all orders (for admin use)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin cancels an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order canceled by admin' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin updates order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
