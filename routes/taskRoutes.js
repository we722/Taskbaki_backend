const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetch = require('node-fetch');

// 2Captcha API Key
const API_KEY = process.env.CAPTCHA_API_KEY;

// Solve Captcha using 2Captcha
router.post('/solve-captcha', async (req, res) => {
  const { imageBase64 } = req.body; // Send base64 captcha image from frontend

  try {
    // Step 1: Submit captcha to 2Captcha
    const sendRes = await fetch(`http://2captcha.com/in.php?key=${API_KEY}&method=base64&body=${imageBase64}`);
    const sendText = await sendRes.text();
    const [status, requestId] = sendText.split('|');

    if (status !== 'OK') {
      return res.status(400).json({ success: false, error: 'Failed to submit captcha to 2Captcha' });
    }

    // Step 2: Wait 20 seconds and get result
    setTimeout(async () => {
      const resultRes = await fetch(`http://2captcha.com/res.php?key=${API_KEY}&action=get&id=${requestId}`);
      const resultText = await resultRes.text();

      if (resultText.startsWith('OK|')) {
        const solution = resultText.split('|')[1];
        return res.json({ success: true, solution });
      } else {
        return res.status(400).json({ success: false, error: resultText });
      }
    }, 20000); // Wait 20 seconds

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error while solving captcha' });
  }
});

// Add points to user
router.post('/add-points', async (req, res) => {
  try {
    const { userId, type, correct } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update points
    if (correct) {
      user.points += 1;

      if (type === '2captcha') user.correct2Captcha += 1;
      else if (type === 'recaptcha') user.correctReCaptcha += 1;
    } else {
      if (type === '2captcha') user.wrong2Captcha += 1;
      else if (type === 'recaptcha') user.wrongReCaptcha += 1;
    }

    await user.save();
    res.status(200).json({ message: 'Points updated', points: user.points });
  } catch (err) {
    res.status(500).json({ message: 'Error updating points' });
  }
});

module.exports = router;
