const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  balanceINR: { type: Number, default: 0 } // নতুন ফিল্ড INR ব্যালেন্সের জন্য
});

module.exports = mongoose.model("User", userSchema);
