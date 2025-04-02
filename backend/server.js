const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('./models/order');
const ImageDetails = require('./models/imageDetails');


dotenv.config();

const app = express();


app.use(express.json()); 
app.use(cors()); 
app.use(express.static('public')); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
   
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage }); 


const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes); 


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const newImage = new ImageDetails({
      image: req.file.filename  
    });

    await newImage.save();

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/get-image', async (req, res) => {
  try {
    const images = await ImageDetails.find();
    res.status(200).json({ data: images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
