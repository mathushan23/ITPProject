const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout,
    purchaseProduct,
    getSalesReportByDate,
    getAllProducts,
    getWorkoutByBarcode,
    loginuser,
    signupuser, 
    updateuserpw, 
    displayuser , 
    deleteuser , 
    displaydeletuser , 
    addAdmin ,
    displayadmin , 
    deleteaccount , 
    updateprofile,
    updateInventory,
    getSalesReportByProduct,

} = require('../controllers/taskController');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
//Sales report by date (manual + online)
router.get('/salesreport/:date', getSalesReportByDate);

// Sales report by product title (manual + online)
router.get('/salesreport/:date', getSalesReportByDate);
router.get('/products', getAllProducts);
router.get('/salesreport/product/:title', getSalesReportByProduct);
router.get('/barcode/:barcode', getWorkoutByBarcode);

// Your user routes
router.get('/studentdetails', displayuser);
router.get('/deletuserdeatiles', displaydeletuser);

// Authentication routes
router.post('/login', loginuser);
router.post('/register', signupuser);
router.post('/forgotpassword', updateuserpw);
router.post('/deleteuser', deleteuser);
router.post('/deleteaccount', deleteaccount);
router.post('/addAdmin', addAdmin);
router.get('/displayadmin', displayadmin);
router.post('/updateprofile', updateprofile);

// Workout routes
router.get('/', getWorkouts);
router.get('/:id', getWorkout);   // <<<< 🛑 THIS should come LAST
router.post('/', upload.single('image'), createWorkout);
router.post('/:id/purchase', purchaseProduct);
router.put('/:id', upload.single('image'), updateWorkout);
router.delete('/:id', deleteWorkout);


//router.put('/:id/update-quantity', updateProductQuantity);
router.put('/products/update-quantity', updateInventory);
module.exports = router;