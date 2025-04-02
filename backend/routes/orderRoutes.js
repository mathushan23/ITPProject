

const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { customerName, product, quantity, NIC,image,  PhoneNumber, Address, Email, Amount } = req.body;
  const order = new Order({
    customerName,
    product,
    quantity,
    NIC,
    image,

    PhoneNumber,
    Address,
    Email,
    Amount
  });
  
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing order
router.put('/:id', async (req, res) => {
  const { customerName, product, quantity, NIC,image, PhoneNumber, Address, Email, Amount, status } = req.body;
  try {
    if(!status || !['Pending','Shipped','Completed'].includes(status)){
      return res.status(400).json({message:'Invalid status'});
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.customerName = customerName;
    order.product = product;
    order.quantity = quantity;
    order.NIC = NIC;
    order.image = image;
   
    order.PhoneNumber = PhoneNumber;
    order.Address = Address;
    order.Email = Email;
    order.Amount = Amount;
    order.status = status;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order canceled by Customer' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




module.exports = router;
