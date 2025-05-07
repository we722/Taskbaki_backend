const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/withdraw', async (req, res) => {
  try {
    const { userId, pointsToWithdraw } = req.body;
    const user = await User.findById(userId);
    if (!user || user.points < pointsToWithdraw) {
      return res.status(400).json({ message: 'Not enough points' });
    }

    user.points -= pointsToWithdraw;
    await user.save();

    const inr = (pointsToWithdraw * 400) / 15000;

    res.status(200).json({ message: 'Withdraw successful', remainingPoints: user.points, amountINR: inr });
  } catch (err) {
    res.status(500).json({ message: 'Withdraw failed' });
  }
});

module.exports = router;
