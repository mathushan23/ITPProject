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
    required: true,
    min: [1, 'Quantity must be at least 1'], 
    max: [1000, 'Quantity cannot exceed 1000'], 
    validate: {
      validator: function(value) {
        return Number.isInteger(value); 
      },
      message: 'Quantity must be an integer.'
    }
  },
  NIC: { 
    type: Number, 
    required: true,
    match: /^[0-9]{12}$/,  // Regex for 9 digits NIC number (adjust as necessary)
    message: 'NIC must be a 12-digit number.',  // Custom error message
  },
 
  PhoneNumber: { 
    type: String, 
    required: true,
    match: /^[0-9]{10}$/, 
  },
  Address: {
    type: String,
    required: [true, 'Address is required'], 
    minlength: 10,  
  },
  Email: { 
    type: String, 
    required: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  
  },
  Amount: { 
    type: Number, 
    required: true,
    min: 1, 
  },
  

  status: { 
    type: String, 
    default: 'Pending' 
  },
}, { timestamps: true });

module.exports =  mongoose.model('Order', orderSchema);
