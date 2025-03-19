const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
