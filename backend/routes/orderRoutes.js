const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
  try {
    const { customerName, product, quantity,NIC,AccountNumber,PhoneNumber } = req.body;
    const order = new Order({ customerName, product, quantity,NIC,AccountNumber,PhoneNumber });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders for the customer
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel Order (Only for Customer)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order canceled' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
