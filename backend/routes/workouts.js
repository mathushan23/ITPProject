const express=require('express')
const{

    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout,
    purchaseProduct
}=require('../controllers/taskController')

const router=express.Router();

router.get('/',getWorkouts)

router.get('/:id',getWorkout)

router.post('/',createWorkout)


router.delete('/:id',deleteWorkout)

router.put('/:id',updateWorkout)

router.post('/:id/purchase', purchaseProduct)


module.exports=router


