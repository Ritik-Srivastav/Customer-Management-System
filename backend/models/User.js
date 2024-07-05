const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phonenumber: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
