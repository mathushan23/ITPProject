const express = require('express');
const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
// at the top of routes/adminRoutes.js
const sendEmail = require('../utils/sendEmail');

const Order = require('../models/order');
const Admin = require('../models/admin');

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('GET /api/admin error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Record an admin action
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
      timestamp: new Date(),
    });

    const savedAdminAction = await newAdminAction.save();
    res.status(201).json(savedAdminAction);
  } catch (err) {
    console.error('POST /api/admin error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel (soft-delete) an order by updating its status
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }

    const canceledOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'Canceled' },
      { new: true }
    );

    if (!canceledOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order canceled by admin', order: canceledOrder });
  } catch (error) {
    console.error('DELETE /api/admin/:id error:', error);
    res.status(500).json({ message: error.message });
  }
});



// Define the function to calculate total amount
const calculateTotalAmount = (products) => {
  return products.reduce((totalAmount, product) => {
    const productAmount = (product.price || 0) * (product.quantity || 0); // Price * Quantity
    return totalAmount + productAmount; // Add the current product's amount to the total
  }, 0);
};

// Update an order status and send email notification
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'Order with the given ID does not exist',
      });
    }

    // Generate HTML table rows for products

    const totalAmount = calculateTotalAmount(order.products || []);
    const productDetails = (order.products || []).map((product) => `
      <tr>
        <td>${product.productName || 'N/A'}</td>
        <td>${product.quantity}</td>
        <td><img src="${product.imageUrl || ''}" alt="${product.productName || ''}" style="width: 50px; height: 50px;" /></td>
        <td>$${product.Amount?.toFixed(2) || '0.00'}</td>
      </tr>
     
    `).join('');

    // Determine recipient email field
    const recipient = order.email || order.Email || order.customerEmail;
    if (!recipient) {
      console.error('PUT /api/admin/:id error: No recipient email for order', id);
    } else {
      // Email HTML content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Order Status Updated</h2>
          <p>Dear <strong>${order.customerName || 'Customer'}</strong>,</p>
          <p>Your order status has been updated to: <strong style="color: green;">${status}</strong>.</p>
          <p>Here is a summary of your order:</p>
          <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Image</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${productDetails}
            </tbody>
            <tfoot>
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
          <td><strong>$${totalAmount.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
          </table>
          <tr>
                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>$${totalAmount.toFixed(2)}</strong></td>
              </tr>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br/>Your Company Team</p>
        </div>
      `;

      await sendEmail(recipient, `Order Status Update: ${status}`, emailContent);
    }

    res.json({
      message: 'Order status updated successfully.',
      order,
    });
  } catch (error) {
    console.error('PUT /api/admin/:id error:', error);
    res.status(500).json({
      error: 'Failed to update order status',
      message: error.message,
    });
  }
});

module.exports = router;