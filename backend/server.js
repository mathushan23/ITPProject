require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Models
const ImageDetails = require('./models/imageDetails');

// Routes
const workoutRoutes = require('./routes/workouts');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require("./routes/FeedbackRoutes");
const authRoutes = require('./routes/auth');


const app = express();

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({ origin: 'http://localhost:3000' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// === Multer Configuration ===
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
const upload = multer({ storage });

// === Routes ===
app.use('/api/workouts', workoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

// === Test Route ===
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the app' });
});

// === Image Upload Routes ===
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const newImage = new ImageDetails({
      image: req.file.filename,
      customerName: req.body.customerName
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

// === Notification Schema and Routes ===
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
});
const Notification = mongoose.model("Notification", notificationSchema);

app.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Server Error");
  }
});

app.post("/notifications", async (req, res) => {
  const { title, message } = req.body;
  try {
    const newNotification = new Notification({ title, message });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).send("Server Error");
  }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).send("Notification not found");
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).send("Server Error");
  }
});

// === Connect to MongoDB & Start Server ===
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB & listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
