// models/imageDetails.js (Backend file)

const mongoose = require('mongoose');

const ImageDetailsSchema = new mongoose.Schema({
  image: String,
  customerName: String,
  uploadedAt: { type: Date, default: Date.now }
});

const ImageDetails = mongoose.model('ImageDetails', ImageDetailsSchema);

module.exports = ImageDetails;
