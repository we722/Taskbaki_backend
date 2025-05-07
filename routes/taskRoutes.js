const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetch = require('node-fetch');

// 2Captcha API Key
const API_KEY = process.env.CAPTCHA_API_KEY;

// Solve Captcha using 2Captcha
router.post('/solve-captcha', async (req, res) => {
  const { imageBase64 } = req.body;

  try {
    // Step 1: Submit captcha
    const sendRes = await fetch('http://2captcha.com/in.php', {
      method: 'POST',
      body: new URLSearchParams({
        key: API_KEY,
        method: 'base64',
        body: imageBase64,
        json: 1
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const sendJson = await sendRes.json();
    if (sendJson.status !== 1) {
      return res.status(400).json({ success: false, error: 'Captcha submission failed' });
    }

    const captchaId = sendJson.request;

    // Step 2: Poll result (max 10 tries)
    let solution = '';
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds
      const resultRes = await fetch(`http://2captcha.com/res.php?key=${API_KEY}&action=get&id=${captchaId}&json=1`);
      const resultJson = await resultRes.json();

      if (resultJson.status === 1) {
        solution = resultJson.request;
        break;
      }
    }

    if (solution) {
      return res.json({ success: true, solution });
    } else {
      return res.status(400).json({ success: false, error: 'Captcha not solved in time' });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add points to user
router.post('/add-points', async (req, res) => {
  try {
    const { userId, type, correct } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
