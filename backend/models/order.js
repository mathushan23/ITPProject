const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  product: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  NIC: { 
    type: String, 
    required: true 
  },
  AccountNumber: { 
    type: String, 
    required: true 
  },

  PhoneNumber: { 
    type: String, 
    required: true,
    match: /^[0-9]{10}$/,  // Assuming phone numbers are numeric and 10 digits long. Adjust the regex as needed
  },
  Address: {
    type: String,
    required: [true, 'Address is required'] // Address is now required
  },
  Email: { 
    type: String, 
    required: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/  // Email regex validation
  },
  Amount: { 
    type: Number, 
    required: true 
  },
  

  status: { 
    type: String, 
    default: 'Pending' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
