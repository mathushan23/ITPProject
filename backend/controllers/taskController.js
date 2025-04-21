const Workout=require('../models/TaskModel')
const Snapshot =require('../models/SnapshotModel')

const mongoose=require('mongoose')


//get all workout

const getWorkouts=async(req,res)=>{
    // we need all data so thats why we put empty parameter in FIND
    const workouts=await Workout.find({}).sort({createdAt:-1})

    res.status(200).json(workouts)
}

//get a single workout

const getWorkout=async(req,res)=>{

    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){

      return  res.status(404).json({error:'No such workout'})

    }

    const workout=await Workout.findById(id)

    if(!workout){
        return res.status(404).json({error:'No such workout'})
    }
 
    res.status(200).json(workout)


}


//create a new workout

const createWorkout=async(req,res)=>{

    
    const{title,description,price,quantity}=req.body


    let emptyFields=[]

    if(!title){
        emptyFields.push('title')
    }

    if(!description){
        emptyFields.push('description')
    }

    if(!price){
        emptyFields.push('price')
    }

    if(!quantity){
        emptyFields.push('quantity')
    }

    if(emptyFields.length>0){
        return res.status(400).json({error:'Please fill in all the fields',emptyFields})
    }

    //add doc to db

    try{
            const workout=await Workout.create({title,description,price,quantity})
            res.status(200).json(workout)

    }catch(error){

        res.status(400).json({error:error.message})
    }

}

//delete a workout

const deleteWorkout=async(req,res)=>{

    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){

        return  res.status(404).json({error:'No such workout'})
  
      }
  
      const workout=await Workout.findByIdAndDelete({_id:id})
  
      if(!workout){
          return res.status(404).json({error:'No such workout'})
      }
   
      res.status(200).json(workout)
  

}


//update a workout

const updateWorkout=async(req,res)=>{

    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){

        return  res.status(404).json({error:'No such workout'})
  
      }   
    
 const workout=await Workout.findByIdAndUpdate({_id:id},{

    ...req.body
    })

    
    if(!workout){
        return res.status(404).json({error:'No such workout'})
    }
 
    res.status(200).json(workout)

}


const purchaseProduct = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // Check if quantity is provided and is a positive number
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        const workout = await Workout.findById(id);

        if (!workout) {
            return res.status(404).json({ error: 'No such product' });
        }

        // Check if there is enough stock available
        if (workout.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Deduct the purchased quantity from stock
        workout.quantity -= quantity;

        // Save the updated workout
        await workout.save();

        // Create snapshot for sales tracking
        const snapshot = new Snapshot({
            date: new Date().toISOString().split('T')[0], // Get the current date in "YYYY-MM-DD" format
            productId: workout._id,
            productTitle: workout.title,
            quantity: quantity,
            price: workout.price,
        });

        // Save the snapshot to track the sale
        await snapshot.save();

        res.status(200).json({
            message: 'Purchase successful',
            updatedStock: workout.quantity,
            snapshot: snapshot, // Include snapshot details in response
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
  




module.exports={

    createWorkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout,
    purchaseProduct,
    getSalesReportByDate,
    getAllTimeSalesForProduct,
    getAllProducts
}