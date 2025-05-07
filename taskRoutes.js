const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Submit CAPTCHA Task and Add Point
router.post("/submit-task", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.points += 1;
    await user.save();

    res.status(200).json({ success: true, message: "Point added successfully.", points: user.points });
  } catch (err) {
    console.error("Task submission error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
