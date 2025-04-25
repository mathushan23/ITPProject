const Workout = require('../models/TaskModel');
const Snapshot = require('../models/SnapshotModel');
const mongoose = require('mongoose');
const QRCode = require('qrcode'); // QR code generation library

// Get all workouts
const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    res.status(200).json(workouts);
};

// Get a single workout
const getWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
    }

    const workout = await Workout.findById(id);

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};

// Create a new workout
const createWorkout = async (req, res) => {
    const { title, description, price, quantity } = req.body;

    let emptyFields = [];

    if (!title) {
        emptyFields.push('title');
    }
    if (!description) {
        emptyFields.push('description');
    }
    if (!price) {
        emptyFields.push('price');
    }
    if (!quantity) {
        emptyFields.push('quantity');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    // Generate barcode and QR code for the product
    const barcode = generateBarcode();
    const qrCode = await generateQRCode(barcode);

    // Add document to DB
    try {
        const workout = await Workout.create({
            title,
            description,
            price,
            quantity,
            barcode,
            qrCode, // Add QR code to the workout
        });
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a workout
const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
    }

    const workout = await Workout.findByIdAndDelete({ _id: id });

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};

// Update a workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
    }

    const workout = await Workout.findByIdAndUpdate({ _id: id }, { ...req.body });

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};

// Purchase a product
const purchaseProduct = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        const workout = await Workout.findById(id);

        if (!workout) {
            return res.status(404).json({ error: 'No such product' });
        }

        if (workout.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        workout.quantity -= quantity;

        await workout.save();

        const snapshot = new Snapshot({
            date: new Date().toISOString().split('T')[0],
            productId: workout._id,
            productTitle: workout.title,
            quantity: quantity,
            price: workout.price,
        });

        await snapshot.save();

        res.status(200).json({
            message: 'Purchase successful',
            updatedStock: workout.quantity,
            snapshot: snapshot,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getSalesReportByDate = async (req, res) => {
    const { date } = req.params;

    try {
        // Aggregate sales data for the specified date
        const salesReport = await Snapshot.aggregate([
            {
                $match: {
                    date: date, // Match snapshots for the specific date
                },
            },
            {
                $group: {
                    _id: '$productId', // Group by product
                    totalQuantitySold: { $sum: '$quantity' }, // Sum the sold quantities
                    totalSales: { $sum: { $multiply: ['$quantity', '$price'] } }, // Calculate total sales amount
                },
            },
            {
                $lookup: {
                    from: 'tasks', // Use the 'tasks' collection (your product collection)
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $project: {
                    productTitle: '$productDetails.title',
                    totalQuantitySold: 1,
                    totalSales: 1,
                },
            },
        ]);

        if (!salesReport || salesReport.length === 0) {
            return res.status(404).json({ message: 'No sales data found for this date' });
        }

        res.status(200).json(salesReport);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all product titles
const getAllProducts = async (req, res) => {
    try {
      const products = await Workout.find({}, 'title');
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  };
  
  // Get all-time sales for a specific product
  const getAllTimeSalesForProduct = async (req, res) => {
    const { title } = req.params;
  
    try {
      const snapshots = await ProductSnapshot.find({ productTitle: title });
  
      if (!snapshots || snapshots.length === 0) {
        return res.status(404).json({ message: 'No sales found for this product' });
      }
  
      let totalQuantitySold = 0;
      let totalSales = 0;
  
      snapshots.forEach((snap) => {
        totalQuantitySold += snap.quantity || 0;
        totalSales += (snap.quantity || 0) * (snap.price || 0);
      });
  
      const report = {
        productTitle: title,
        totalQuantitySold,
        totalSales,
      };
  
      res.status(200).json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch product sales report' });
    }
  };

// Generate QR Code for a given barcode
const generateQRCode = async (barcode) => {
    try {
        const qrCode = await QRCode.toDataURL(barcode); // Generates a QR code URL from barcode
        return qrCode;
    } catch (error) {
        throw new Error('Error generating QR code');
    }
};

// Generate a unique barcode (example: PROD-12345)
const generateBarcode = (prefix = 'PROD') => {
    return `${prefix}-${Date.now().toString().slice(-5)}`;
};


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
    generateQRCode,
    generateBarcode,
    getWorkoutByBarcode
};
