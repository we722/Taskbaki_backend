const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/submit-task", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.points += 1;
    await user.save();

    res.json({ success: true, message: "Point added." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;