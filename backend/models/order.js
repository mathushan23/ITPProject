const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName:{ 
    type:String,},
  product:{ type: String,
  
  },
  quantity:{ type: Number, 
    
  },
  NIC : { type: String,
   
  },
  AccountNumber:{type: String,
    
  },
  Amount:{type: String,
   
  },
  PhoneNumber:{type:String,
    
  },
  Address:{type:String,
   
  },
  Email:{type:String,
   
  },
  Amount:{type:Number,},


  status: { type: String, default: 'Pending' },

},
{ timestamps: true }

);

module.exports = mongoose.model('Order', orderSchema);
