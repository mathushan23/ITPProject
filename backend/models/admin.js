const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  orderId: mongoose.Schema.Types.ObjectId,
  CustomerName:String,
  Product:String,
  quanity:Number,
  NIC:Number,
  Address:String,
  PhoneNumber:String,
  Email:String,
  action: String,  // Action like "Cancel", "Update Status"
  adminName: String,
});

module.exports = mongoose.model('Admin', adminSchema);
