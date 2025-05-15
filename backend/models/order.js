const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task',  // Assuming you have a Product model
      },
      productName: {
        type: String,  
      },
      quantity: { 
        type: Number, 
      },
      Amount: { 
        type: Number, 
      }
    } 
  ],
  
 

  Image: {
    type: String,
    required: false
  },
 
  PhoneNumber: { 
    type: Number, 
    required: true,
  },
  Address: {
    type: String,
    required: [true, 'Address is required'], 
  },
  Email: { 
    type: String, 
    required: true, 
  },
  TotalAmount: {
    type: Number,
    required: false,
  },
  status: { 
    type: String, 
    default: 'Pending' 
  },
  chat: [
    {
      sender: { type: String, enum: ['customer', 'admin'], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports =  mongoose.model('Order', orderSchema);
