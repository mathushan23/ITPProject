const express = require('express');
const Order = require('../models/order'); // Ensure your Order model is correctly imported
const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
  try {
    const { customerName, product, quantity, NIC, AccountNumber, PhoneNumber,Address, Email, Amount } = req.body;

    // Validate required fields
//if (!customerName || !product || !quantity || !NIC || !AccountNumber ||  !Address || !Email || !Amount) {
      //return res.status(400).json({ message: 'All fields are required' });
   // }

    const order = new Order({ customerName, product, quantity, NIC, AccountNumber, PhoneNumber,Address, Email, Amount });
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

// Cancel Order (Soft Delete: Change status to 'Canceled')
router.delete('/:id', async (req, res) => {
  try {
    // Find the order by ID
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Soft delete: update the status to 'Canceled'
    order.status = 'Canceled';
    await order.save();

    res.json({ message: 'Order canceled', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Order Status (PUT request to /api/orders/:id)
router.put('/:id', async (req, res) => {
  const { status } = req.body;

  try {
    if (!status || !['Pending', 'Shipped', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
