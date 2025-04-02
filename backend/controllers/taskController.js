const Workout=require('../models/TaskModel')
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

        res.status(200).json({
            message: 'Purchase successful',
            updatedStock: workout.quantity
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};






module.exports={

    createWorkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout,
    purchaseProduct
}