const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  productTitle: { type: String },
  quantity: { type: Number },
  price: { type: Number }
}, { timestamps: true });

const Snapshot = mongoose.model('Snapshot', snapshotSchema);

module.exports = Snapshot;
