const express = require('express');
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout,
    purchaseProduct,
    getSalesReportByDate, 
    getAllProducts,
    getAllTimeSalesForProduct,
    getWorkoutByBarcode  // Import the sales report function
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.post('/', createWorkout);
router.delete('/:id', deleteWorkout);
router.put('/:id', updateWorkout);
router.post('/:id/purchase', purchaseProduct);

// Sales report route by date
router.get('/salesreport/:date', getSalesReportByDate); // Add this line to fetch sales report

// GET all product titles
router.get('/products', getAllProducts);

// GET all-time sales of a product by title
router.get('/salesreport/product/:title',getAllTimeSalesForProduct);

router.get('/workout/barcode/:barcode', getWorkoutByBarcode);


module.exports = router;
