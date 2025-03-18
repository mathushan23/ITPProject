
require('dotenv').config()


const express=require('express')

const workoutRoutes=require('./routes/workouts')

const app=express();

const mongoose=require('mongoose');

app.use(express.json())


app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})


app.use('/api/workouts',workoutRoutes)

app.get('/',(req,res)=>{

    res.json({mssg:'Welcome to the app'})
})



mongoose.connect(process.env.MONGO_URL).then(()=>{


 app.listen(process.env.PORT,()=>{
    console.log('DB coneected successfully and listening the port',process.env.PORT)
    })
   

}).catch((error)=>console.log(error));





