const nodemailer = require('nodemailer');
const Otp = require('../models/otpModel');
const crypto = require('crypto');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    await Otp.findOneAndDelete({ email }); // remove previous OTPs

    const newOtp = new Otp({ email, otp, expiresAt });
    await newOtp.save();

    // Configure mail
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'youremail@gmail.com', // replace with your email
        pass: 'yourpassword'         // replace with your app password
      }
    });

    const mailOptions = {
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const record = await Otp.findOne({ email });

    if (!record) return res.status(400).json({ error: 'No OTP found for this email' });
    if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ error: 'OTP has expired' });

    await Otp.deleteOne({ email }); // Remove OTP after successful verification
    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

module.exports = { sendOTP, verifyOTP };
