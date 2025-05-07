const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/add-points', async (req, res) => {
  try {
    const { userId, type, correct } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // পয়েন্ট বাড়ানো
    if (correct) {
      user.points += 1;

      // ধরুন শুধু 2captcha বা recaptcha হিসাব রাখবেন
      if (type === '2captcha') user.correct2Captcha += 1;
      else if (type === 'recaptcha') user.correctReCaptcha += 1;
    } else {
      if (type === '2captcha') user.wrong2Captcha += 1;
      else if (type === 'recaptcha') user.wrongReCaptcha += 1;
    }

    await user.save();
    res.status(200).json({ message: 'Updated', points: user.points });
  } catch (err) {
    res.status(500).json({ message: 'Error updating points' });
  }
});

module.exports = router;
