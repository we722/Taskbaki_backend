const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Dashboard route: GET /dashboard/:userId
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const takaPerPoint = 0.0267; // আপনি চাইলে এটি .env থেকেও নিতে পারেন
    const taka = (user.points || 0) * takaPerPoint;

    res.json({
      email: user.email,
      points: user.points || 0,
      taka: taka.toFixed(2),
      correct2Captcha: user.correct2Captcha || 0,
      wrong2Captcha: user.wrong2Captcha || 0,
      correctReCaptcha: user.correctReCaptcha || 0,
      wrongReCaptcha: user.wrongReCaptcha || 0
    });

  } catch (err) {
    res.status(500).json({ message: 'Dashboard fetch error', error: err.message });
  }
});

module.exports = router;
