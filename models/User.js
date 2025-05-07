const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  points: {
    type: Number,
    default: 0  // Earned points by solving CAPTCHA
  },

  withdrawnPoints: {
    type: Number,
    default: 0  // Total withdrawn points
  },

  correct2Captcha: {
    type: Number,
    default: 0  // Correct answers in 2Captcha
  },

  wrong2Captcha: {
    type: Number,
    default: 0  // Wrong answers in 2Captcha
  },

  correctReCaptcha: {
    type: Number,
    default: 0  // Correct in reCAPTCHA
  },

  wrongReCaptcha: {
    type: Number,
    default: 0  // Wrong in reCAPTCHA
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
