// models/imageDetails.js (Backend file)

const mongoose = require('mongoose');

const ImageDetailsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true, // The filename of the uploaded image
  }
});

const ImageDetails = mongoose.model('ImageDetails', ImageDetailsSchema);

module.exports = ImageDetails;
