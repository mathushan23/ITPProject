

const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const PDFDocument = require('pdfkit'); // or another PDF lib
// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/status/:email', async (req, res) => {
  try {
    const orders = await Order.find({ Email: req.params.email });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//-----------------------------------
router.post('/checkout', async (req, res) => {
  try {
   
  
    const {
      customerName ,
      PhoneNumber,
      Address,
      Email,
      products,
      Image,
      TotalAmount,
    } = req.body;

    console.log(Email)
    console.log(products)
  
    
    const newOrder = new Order({
      customerName,
      
      PhoneNumber,
      Address,
      Email,
      products,
      Image,
      TotalAmount,
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    if(savedOrder){
      console.log("Haru SDK")
    }
    res.status(201).json({ message: 'Order created', order: savedOrder });
  } catch (error) {
    console.error('Error saving or updating order:', error);
    res.status(500).json({ message: 'Server error while processing order' });
  }
});


 
// Create a new order
router.post('/', async (req, res) => {
  const { customerName, products,  Image, PhoneNumber, Address, Email, TotalAmount } = req.body;
  
  // Ensure TotalAmount and Image are present
  if (!TotalAmount || !Image) {
    return res.status(400).json({ message: 'TotalAmount and Image are required' });
  }
  
  const order = new Order({
    customerName,
    products,
    
    Image,
    PhoneNumber,
    Address,
    Email,
    TotalAmount
  });
  
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const productsWithAmounts = (req.body.products || []).map(p => ({
    ...p,
    Amount: (Number(p.price || p.Amount || 0) * Number(p.quantity || 1)).toFixed(2),
  }));

  const updateData = {
    customerName: req.body.customerName,
    products: productsWithAmounts,
    Image: req.body.Image,
    PhoneNumber: req.body.PhoneNumber,
    Address: req.body.Address,
    Email: req.body.Email,
    TotalAmount: productsWithAmounts.reduce((sum, item) => sum + Number(item.Amount), 0).toFixed(2),
    status: req.body.status,
    gpsLocation: req.body.gpsLocation,
  };

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(400).json({ message: 'Error updating order', error: err.message });
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



// POST /orders/:id/chat
router.post('/:id/chat', async (req, res) => {
  const { sender, message } = req.body;

  if (!sender || !message) {
    return res.status(400).json({ message: 'Sender and message are required' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.chat.push({ sender, message });
    await order.save();

    res.status(200).json({ message: 'Message sent', chat: order.chat });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Route: GET /api/orders/:id/pdf

router.get('/:id/pdf', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payment-slip-${order._id}.pdf`);
    doc.pipe(res);

    // Title
    doc.fontSize(22).font('Helvetica-Bold').text('Payment Slip', { align: 'center' });
    doc.moveDown(1);

    // Order Info
    doc.fontSize(12).font('Helvetica');
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Customer Name: ${order.customerName}`);
    doc.text(`Phone Number: ${order.PhoneNumber}`);
    doc.text(`Email: ${order.Email}`);
    doc.text(`Address: ${order.Address}`);
    doc.text(`Status: ${order.status}`);
    doc.text(`Total Amount: LKR ${order.TotalAmount.toFixed(2)}`);
    doc.moveDown(1);

    // Product Table
    if (order.products && order.products.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Products:', { underline: true });
      doc.moveDown(0.5);

      // Table headers
      const tableTop = doc.y;
      const itemX = 50;
      const nameX = 90;
      const qtyX = 300;
      const priceX = 400;

      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('No.', itemX, tableTop);
      doc.text('Product Name', nameX, tableTop);
      doc.text('Qty', qtyX, tableTop, { width: 40, align: 'right' });
      doc.text('Price (LKR)', priceX, tableTop, { width: 80, align: 'right' });

      doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      doc.moveDown(1);

      // Product rows
      doc.font('Helvetica').fontSize(12);
      order.products.forEach((item, index) => {
        const rowY = doc.y;
        const productName = item.productName || 'Product';
        const quantity = item.quantity || 1;
        const price = item.Amount || 0;

        doc.text(`${index + 1}`, itemX, rowY);
        doc.text(productName, nameX, rowY);
        doc.text(`${quantity}`, qtyX, rowY, { width: 40, align: 'right' });
        doc.text(`${price.toFixed(2)}`, priceX, rowY, { width: 80, align: 'right' });

        doc.moveDown(0.5);
      });

      doc.moveTo(itemX, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);
    }

    // Total footer
    doc.font('Helvetica-Bold').text(`Total Amount: LKR ${order.TotalAmount.toFixed(2)}`, {
      align: 'right',
    });

    doc.end();
  } catch (err) {
    console.error('❌ PDF generation error:', err);
    res.status(500).send('Server error generating PDF');
  }
});


// GET /orders/:id/chat
router.get('/:id/chat', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id, 'chat');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order.chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// PUT /api/orders/:orderId/chat/:msgId - Update a message (edit or mark as read)
// PUT /api/orders/:orderId/chat/:msgId
// PUT /api/orders/:orderId/chat/:msgId
router.put('/:orderId/chat/:msgId', async (req, res) => {
  const { orderId, msgId } = req.params;
  const { message, read } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const msg = order.chat.id(msgId); // Subdocument lookup
    if (!msg) return res.status(404).json({ message: 'Message not found' });

    if (message !== undefined) msg.message = message;
    if (read !== undefined) msg.read = read;

    await order.save();
    res.json({ message: 'Message updated', msg });
  } catch (err) {
    res.status(500).json({ message: 'Error updating message', error: err.message });
  }
});


// DELETE /api/orders/:orderId/chat/:msgId - Delete a specific message
router.delete('/:orderId/chat/:msgId', async (req, res) => {
  const { orderId, msgId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const originalLength = order.chat.length;
    order.chat = order.chat.filter((msg) => msg._id.toString() !== msgId);

    if (order.chat.length === originalLength) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await order.save();
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});
// DELETE chat message
router.delete('/:orderId/chat/:msgId', async (req, res) => {
  const { orderId, msgId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const initialLength = order.chat.length;
    order.chat = order.chat.filter(msg => msg._id.toString() !== msgId);

    if (order.chat.length === initialLength) {
      return res.status(404).json({ message: 'Chat message not found' });
    }

    await order.save();
    res.json({ message: 'Chat message deleted successfully' });
  } catch (err) {
    console.error('Delete chat error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router; 