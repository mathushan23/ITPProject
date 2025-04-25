const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  barcode: { type: String, required: true, unique: true },
  qrCode: { type: String } // base64 QR
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
