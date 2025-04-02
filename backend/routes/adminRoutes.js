const express = require('express');

const Order = require('../models/order');
const Admin = require('../models/admin');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { orderId, imageDetailsId, action, adminName } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }

    if (!isValidObjectId(imageDetailsId)) {
      return res.status(400).json({ error: 'Invalid ImageDetails ID' });
    }

    const newAdminAction = new Admin({
      orderId: mongoose.Types.ObjectId(orderId),
      imageDetailsId: mongoose.Types.ObjectId(imageDetailsId),
      action,
      adminName,
    });

    const savedAdminAction = await newAdminAction.save();
    res.status(201).json(savedAdminAction);
  } catch (err) {
    res.status(400).json({ error: err.message });



  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order canceled by admin' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


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
