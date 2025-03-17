const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const taskRoutes = require("./routes/taskRoute");
const cors = require('cors');


//Middleware
app.use((req,res,next) => {
    console.log("path" + req.path +"method" + req.method);
    next();
})

app.use(express.json());

app.use(cors());

//app.get("/", (req, res) => {
   //  res.send("Hello World, THIRISHNAVI PUSHPARAJAH");
//});


//DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
        console.log("DB connected Successfully and listening to " + process.env.PORT);
    });
  })
  //.catch((error) => console.log(error));
  .catch((error) => {
    console.error("DB connection error:", error.message);
  });

app.use("/api/tasks", taskRoutes);
    


