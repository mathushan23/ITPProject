const Workout = require('../models/TaskModel');
const Snapshot = require('../models/SnapshotModel');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const Task = require('../models/TaskModel');
const bcrypt = require('bcryptjs');
const { UserModel, DeletedUserModel ,AdminUserModel } = require('../models/usertable')
const nodemailer = require('nodemailer');
require('dotenv').config();
const Order = require('../models/order');
const ProductSnapshot = require('../models/SnapshotModel');



// Configure upload directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Save image to server and return path
const saveImage = (file) => {
    if (!file) return '';
    
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${filename}`;
};

// Delete image from server
const deleteImage = (imageUrl) => {
    if (!imageUrl) return;
    
    const filename = path.basename(imageUrl);
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Get all workouts
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({}).sort({ createdAt: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single workout
const getWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID' });
    }

    try {
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({ error: 'No such workout' });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new workout
//THIRISHNAVI CREATE THE PRODUCT 
const createWorkout = async (req, res) => {
    const { title, description, price, quantity } = req.body;
    const file = req.file;
  
    let emptyFields = [];
  
    if (!title) emptyFields.push('title');
    if (!description) emptyFields.push('description');
    if (!price) emptyFields.push('price');
    if (!quantity) emptyFields.push('quantity');
  
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }
  
    try {
      const barcode = generateBarcode();  // Generate barcode
      const qrCode = await generateQRCode(barcode);  // Generate QR code
      const imageUrl = saveImage(file);  // Save image to disk and get the URL
  
      const workout = await Workout.create({
        title,
        description,
        price,
        quantity,
        barcode,
        qrCode,
        imageUrl
      });
  
      // Email logic
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: "8b78db001@smtp-brevo.com",
          pass: "xsmtpsib-790743c9902be2aac2b088fe176e85483ed0e8822a1f5652c16d871d6371439e-fhsgVxYQE50JkNwA"
        }
      });
  
      const mailOptions = {
        from: `"thayaparanvithu@gmail.com"`,
        to: "thirishnavipushparajah3148@gmail.com",
        subject: "New Item Added to Your Store",
        html: `
          <h3>✅ New Product Added</h3>
          <p><strong>Product Name:</strong> ${title}</p>
          <p><strong>Initial Quantity:</strong> ${quantity}</p>
          <p>You have successfully added this new item to your store.</p>
        `
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("📤 Email sent:", info.messageId);
  
      res.status(201).json(workout);
    } catch (error) {
      console.error("Error creating workout or sending email:", error);
      res.status(400).json({ error: error.message });
    }
  };
// Delete a workout
const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID' });
    }

    try {
        const workout = await Workout.findByIdAndDelete(id);
        if (!workout) {
            return res.status(404).json({ error: 'No such workout' });
        }
        
        // Delete associated image
        deleteImage(workout.imageUrl);
        
        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID' });
    }

    try {
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({ error: 'No such workout' });
        }

        let updateData = { ...req.body };
        
        if (file) {
            // Delete old image if exists
            deleteImage(workout.imageUrl);
            // Save new image
            updateData.imageUrl = saveImage(file);
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Purchase a product
const purchaseProduct = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID' });
    }

    try {
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (workout.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        workout.quantity -= quantity;
        await workout.save();

        const snapshot = await Snapshot.create({
            date: new Date().toISOString().split('T')[0],
            productId: workout._id,
            productTitle: workout.title,
            quantity,
            price: workout.price,
        });

        res.status(200).json({
            message: 'Purchase successful',
            updatedStock: workout.quantity,
            snapshot,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Sales report by date
const getSalesReportByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    // Fetch manual snapshots
    const snapshots = await ProductSnapshot.find({
      createdAt: { $gte: startDate, $lt: endDate }
    });

    // Fetch online orders
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lt: endDate }
    });

    const salesMap = new Map();

    // Add snapshot sales
    snapshots.forEach(item => {
      const key = item.productTitle;
      if (!key) return;
      const existing = salesMap.get(key) || { productTitle: key, totalQuantitySold: 0, totalSales: 0 };
      existing.totalQuantitySold += item.quantity || 0;
      existing.totalSales += (item.quantity || 0) * (item.price || 0);
      salesMap.set(key, existing);
    });

    // Add online order sales
    orders.forEach(order => {
      order.products.forEach(prod => {
        const key = prod.productName;
        if (!key) return;
        const existing = salesMap.get(key) || { productTitle: key, totalQuantitySold: 0, totalSales: 0 };
        existing.totalQuantitySold += prod.quantity || 0;
        existing.totalSales += prod.Amount || 0;
        salesMap.set(key, existing);
      });
    });

    res.status(200).json(Array.from(salesMap.values()));
  } catch (err) {
    console.error('Error generating sales report:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all products (only title)
const getAllProducts = async (req, res) => {
    try {
        const products = await Workout.find({}, 'title');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// All-time sales report for a single product
const getAllTimeSalesForProduct = async (req, res) => {
    const { title } = req.params;

    try {
        const snapshots = await Snapshot.find({ productTitle: title });

        if (!snapshots.length) {
            return res.status(404).json({ message: 'No sales found for this product' });
        }

        let totalQuantitySold = 0;
        let totalSales = 0;

        snapshots.forEach((snap) => {
            totalQuantitySold += snap.quantity;
            totalSales += snap.quantity * snap.price;
        });

        res.status(200).json({
            productTitle: title,
            totalQuantitySold,
            totalSales,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getSalesReportByProduct = async (req, res) => {
  try {
    const { title } = req.params;

    let totalQuantitySold = 0;
    let totalSales = 0;

    // Manual
    const snapshots = await ProductSnapshot.find({ 'items.title': title });
    snapshots.forEach(snap => {
      snap.items.forEach(item => {
        if (item.title === title) {
          totalQuantitySold += item.quantitySold;
          totalSales += item.quantitySold * item.price;
        }
      });
    });

    // Online
    const orders = await Order.find({ 'products.productName': title });
    orders.forEach(order => {
      order.products.forEach(prod => {
        if (prod.productName === title) {
          totalQuantitySold += prod.quantity;
          totalSales += prod.Amount;
        }
      });
    });

    res.status(200).json({
      productTitle: title,
      totalQuantitySold,
      totalSales
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching product sales' });
  }
};

// Generate a QR Code
const generateQRCode = async (barcode) => {
    try {
        const qrCode = await QRCode.toDataURL(barcode);
        return qrCode;
    } catch (error) {
        throw new Error('Error generating QR code');
    }
};

// Generate a Barcode
const generateBarcode = (prefix = 'PROD') => {
    return `${prefix}-${Date.now().toString().slice(-5)}`;
};

// Get a workout by Barcode
const getWorkoutByBarcode = async (req, res) => {
    const { barcode } = req.params;

    try {
        const workout = await Workout.findOne({ barcode });

        if (!workout) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

//--------------- Login details ------------------- //
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); //02

        if (!user) {
            return res.json({ message: "Invalid user" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ message: "Successfullogin" , role: user.role , getuser: user});
        }
        
        else {
            res.json({ message: "Invalidcredentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};

//--------------- Signup details ------------------- //
const signupuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await UserModel.findOne({ email }); //02

        if (!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await UserModel.create({ ...req.body, password: hashedPassword }); 
            res.json({ message: "UserCreated" });
        } else {
            res.json({ message: "EmailAlreadyExists" });
        }
    } catch (err) {
        console.error("Signup error:", err);
        res.status(400).json({ error: "Error creating user. Please try again." });
    }
};

//--------------- Forgot password ------------------- //
const updateuserpw = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); //04

        if (!user) {
            return res.json({ message: "Invalid user" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await UserModel.updateOne({ email }, { $set: { password: hashedPassword } });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};

//---------- Update user profile ------------------//
const updateprofile = async (req, res) => {
    try {
        const { username, address, phone, email } = req.body;

        const updatedUser = await UserModel.findOneAndUpdate({ email },
            { $set: { username, address, phone } },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Updated successfully", newprofile: updatedUser });

    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//--------------- Display user data ------------------- //
const displayuser = async (req, res) => {
    try {
        const users = await UserModel.find(); 
        res.json(users);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
};

const displaydeletuser = async (req, res) => {
    try {
        const users = await DeletedUserModel.find(); //04
        res.json(users);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
};

//-----Deleteuser --------------------//
const deleteuser = async (req, res) => {
    try {
        const { email, reason } = req.body;
    
        const user = await UserModel.findOne({ email });
        
        if (user) {
            await DeletedUserModel.create({ 
                username: user.username, 
                email: user.email,
                phone: user.phone,
                address: user.address,
                reason: reason ,
                removeby:"Admin",
                date: new Date().toISOString().split('T')[0]
            });
    
            const deletedUser = await UserModel.findOneAndDelete({ email });
    
            if (deletedUser) {
                return res.json({ message: 'UserDeleted' });
            } else {
                return res.status(404).json({ message: 'UserNotFound' });
            }
        } else {
            return res.status(404).json({ message: 'UserNotFound' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};


const deleteaccount =  async (req, res) => {
    try {
        const { myemail } = req.body;
    
        const user = await UserModel.findOne({ email:myemail });
    
    
        if (user) {
            await DeletedUserModel.create({ 
                username: user.username, 
                email: user.email,
                phone: user.phone,
                address: user.address,
                reason: "Customer delete account",
                removeby:"Account Owner",
                date: new Date().toISOString().split('T')[0]
            });
    
            const deletedUser = await UserModel.findOneAndDelete({ email:myemail});
    
            if (deletedUser) {
                return res.json({ message: 'UserDeleted' });
            } else {
                return res.status(404).json({ message: 'UserNotFound' });
            }
        } else {
            return res.status(404).json({ message: 'UserNotFound' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};



//----------- Add as Admin --------------//
const addAdmin = async (req, res) => {
    try {
        const { email} = req.body;
        console.log("Email:", email);
    
        const user = await UserModel.findOne({ email });

        console.log("---------- I am in Add as Admin -----------")
    
        if (user) {
            await AdminUserModel.create({ 
                username: user.username, 
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:"Admin",
                date: new Date().toISOString().split('T')[0]
            });
    
            const deletedUser = await UserModel.findOneAndDelete({ email });
    
            if (deletedUser) {
                return res.json({ message: 'UserDeleted' });
            } else {
                return res.status(404).json({ message: 'UserNotFound' });
            }
        } else {
            return res.status(404).json({ message: 'UserNotFound' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const displayadmin = async (req, res) => {
    try {
        const users = await AdminUserModel.find(); //04
        res.json(users);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
};

/*
// Deduct inventory from a product
const deductInventory = async (req, res) => {
  const { productId } = req.params;  // Extract the productId from the URL
  const { quantity } = req.body;  // Extract the quantity to deduct

  try {
    const task = await Task.findById(productId);  // Find product (Task) by ID
    if (!task) {
      return res.status(404).json({ message: 'Task (Product) not found' });  // Handle product not found
    }

    // Deduct the inventory
    task.quantity -= quantity;
    if (task.quantity < 0) {
      return res.status(400).json({ message: 'Not enough inventory' });  // Handle inventory shortage
    }

    await task.save();  // Save the updated task

    return res.status(200).json({ message: 'Inventory updated successfully', task });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({ message: 'Error updating inventory', error: error.message });
  }
};
*/


const updateInventory = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const success = [];
    const failed = [];

    for (const item of products) {
      const title = item.title?.trim();
      const quantity = Number(item.quantity);

      if (!title || isNaN(quantity) || quantity <= 0) {
        failed.push({ title: title || 'Unknown', reason: 'Invalid title or quantity' });
        continue;
      }

      const product = await Task.findOne({ title });

      if (!product) {
        failed.push({ title, reason: 'Product not found' });
        continue;
      }

      product.quantity -= quantity; // reduce quantity (sale)
      await product.save();
      success.push({ title, updatedQuantity: product.quantity });
    }

    if (failed.length > 0) {
      return res.status(207).json({
        message: 'Some products failed to update',
        success,
        failed,
      });
    }

    return res.status(200).json({
      message: 'All product inventories updated successfully',
      success,
    });

  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    createWorkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout,
    purchaseProduct,
    getSalesReportByDate,
    getAllProducts,
    getAllTimeSalesForProduct,
    getWorkoutByBarcode,
    loginuser, 
    signupuser,
    updateuserpw, 
    displayuser , 
    deleteuser , 
    displaydeletuser ,
    addAdmin, 
    displayadmin , 
    deleteaccount , 
    updateprofile,
    saveImage,
    deleteImage,
   
    updateInventory,
    getSalesReportByProduct,
};