const mongoose = require('mongoose');

// Custom date formatting function (optional)
const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return new Date(date).toLocaleString('en-US', options);
};

const adminSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } , 
  imageDetailsId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageDetails', required: true }, 
 
  action: { type: String, required: true },  
  adminName: { type: String, required: true },  
  actionTime: { 
    type: Date,
    default: Date.now,  
  },
  formattedActionTime: { 
    type: String,
    default: function () {
      return formatDate(this.actionTime); 
    }
  }
}, {
  timestamps: true,  
});

module.exports = mongoose.model('Admin', adminSchema);
