const express = require('express');
const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
// at the top of routes/adminRoutes.js
const sendEmail = require('../utils/sendEmail');
const {generateReport} = require('../controllers/adminController'); // path to your controller file
const Order = require('../models/order');
const Admin = require('../models/admin');
const TaskModel = require('../models/TaskModel'); // ✅ Correct

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




/// Update an order status and send email notification
// Helper to calculate total
const calculateTotalAmount = (products) => {
  return products.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const amount = item.Amount || 0;
    return sum + (quantity * amount);
  }, 0);
};

// Update order status and send email
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

    // First, update the status
    await Order.findByIdAndUpdate(id, { status });

    // Then fetch the full order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'Order with the given ID does not exist',
      });
    }

    const products = order.products || [];
    const TotalAmount = calculateTotalAmount(products);

    const productDetails = products.map((product) => `
      <tr>
        <td>${product.productName || 'N/A'}</td>
        <td>${product.quantity || 1}</td>
        <td>
          ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.productName || ''}" style="width: 50px; height: 50px;" />` : 'N/A'}
        </td>
        <td>LKR ${product.Amount?.toFixed(2) || '0.00'}</td>
      </tr>
    `).join('');

    const recipient = order.email || order.Email || order.customerEmail;
    if (recipient) {
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
                <td><strong>LKR ${TotalAmount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br/>Your Company Team</p>
        </div>
      `;

      await sendEmail(recipient, `Order Status Update: ${status}`, emailContent);
    } else {
      console.warn('No recipient email found for order', order._id);
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










// Mock data function
/*const getOrdersByDateRange = (fromDate, toDate) => {
  const allOrders = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'orders.json')));
  return allOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return (!fromDate || new Date(fromDate) <= orderDate) &&
           (!toDate || orderDate <= new Date(toDate));
  });
};

router.get('/api/admin/order-details/:timeframe', (req, res) => {
  const { timeframe } = req.params;
  const { fromDate, toDate } = req.query;

  if (!timeframe || !fromDate || !toDate) {
    console.error('❌ Missing parameters:', { timeframe, fromDate, toDate });
    return res.status(400).json({ message: 'Missing parameters' });
  }

  console.log('📊 Generating dynamic PDF report for:', { timeframe, fromDate, toDate });

  try {
    const orders = getOrdersByDateRange(fromDate, toDate);

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Order Report (${timeframe.toUpperCase()})`, 14, 20);
    doc.setFontSize(10);
    doc.text(`From: ${fromDate} To: ${toDate}`, 14, 28);

    const tableRows = orders.map(order => [
      order._id,
      order.customerName,
      order.status,
      order.amount.toFixed(2),
      new Date(order.createdAt).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 35,
      head: [['Order ID', 'Customer', 'Status', 'Amount (LKR)', 'Date']],
      body: tableRows,
    });

    const pdfBuffer = doc.output('arraybuffer');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Order_Report_${timeframe}.pdf"`,
    });

    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});*/
// Route to download admin report PDF
// Add this route
router.get('/download-report', generateReport);


module.exports = router;