const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const sendVerificationEmail = require('./mailer'); // Import the mailer
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const twilio = require('twilio');
const app = express();
const PORT = process.env.PORT || 5000;
const verifyToken = require('./middleware');
const cors = require('cors');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);


// Use CORS middleware
app.use(cors());

// Middleware
app.use(express.json()); // Body parser middleware

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}


// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Register Route
app.post('/register', async (req, res) => {
  const { username, email, phonenumber, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create verification token
    const token = crypto.randomBytes(20).toString('hex');

    // Create new user
    user = new User({
      username,
      email,
      phonenumber,
      password,
      verificationToken: token,
      isVerified: false
    });

    await user.save();

    // Send verification email
    sendVerificationEmail(email, token);

    res.status(200).json({msg:"User Registered Successfully"});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Email Verification Route
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send('Email verified successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Login Route (Email and Password)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email' });
    }

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.status(200).json({ msg: 'Login successful', jwtToken , user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


async function sendOTP(phonenumber, otp) {
  try {
    await client.messages.create({
      body: `Your OTP code is ${otp}`,
      to: phonenumber,  // Text this number
      from: process.env.TWILIO_PHONE_NUMBER // From a valid Twilio number
    });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    throw new Error('Error sending OTP');
  }
}

//Login route using pnone number and otp
app.post('/generate-otp',async (req, res) => {
  const { phonenumber } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ phonenumber });

    // // If the user doesn't exist, create a new one
    // if (!user) {
    //   user = new User({ phonenumber });
    // }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 300000; // OTP valid for 5 minutes
    await user.save();

    // Send OTP
    await sendOTP(phonenumber, otp);

    res.status(200).json({ msg: 'OTP sent to your phone number' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Validate OTP Route
app.post('/validate-otp', async (req, res) => {
  const { phonenumber, otp } = req.body;

  try {
    const user = await User.findOne({ phonenumber });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Clear the OTP from the user's record after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.status(200).json({ msg: 'OTP verified successfully', jwtToken ,user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Update user details
app.put('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { username, email, phonenumber, password } = req.body;

  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { username, email, phonenumber, password },
          { new: true }
      );

      res.json(updatedUser);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Delete user
app.delete('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      await User.findByIdAndDelete(userId);
      res.json({ message: 'User deleted' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
