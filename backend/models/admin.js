const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },  // Linking to Order schema
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  NIC: { type: String, required: true },  // Changed to String for flexibility
  Address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  action: { type: String, required: true },  // Action like "Cancel", "Update Status"
  adminName: { type: String, required: true },  // You might dynamically set this from authenticated session
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Admin', adminSchema);
