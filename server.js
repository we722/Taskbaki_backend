const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI
mongoose.connect('mongodb+srv://shaminroy681fHO3RufroJ2A14Ac@cluster0.q4gov1w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = 'hT7$GkL9!zW3qF@bXeR1mVuNpA5cYdJ0';

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  points: { type: Number, default: 0 },
  inr: { type: Number, default: 0 },
  referralCode: String,
  referredBy: String
});
const User = mongoose.model('User', userSchema);

// Register API
app.post('/api/register', async (req, res) => {
  const { name, email, password, referredBy } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.json({ error: 'ইমেলটি ইতিমধ্যেই ব্যবহৃত হয়েছে।' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const referralCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  const newUser = new User({ name, email, password: hashedPassword, referralCode, referredBy });
  await newUser.save();

  res.json({ message: 'রেজিস্ট্রেশন সফল হয়েছে!' });
});

// Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ error: 'ইমেল খুঁজে পাওয়া যায়নি।' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ error: 'ভুল পাসওয়ার্ড।' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ token, user });
});

// Solve Captcha API
app.post('/api/solve-captcha', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.json({ error: 'ইউজার খুঁজে পাওয়া যায়নি।' });

  user.points += 10;
  user.inr += 0.1;
  await user.save();

  res.json({ message: 'সফলভাবে পয়েন্ট যোগ হয়েছে!', points: user.points, inr: user.inr });
});

// Withdraw Request API
app.post('/api/withdraw', async (req, res) => {
  const { userId, name, upi, amount } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.json({ error: 'ইউজার খুঁজে পাওয়া যায়নি।' });

  if (user.inr < parseFloat(amount)) {
    return res.json({ error: 'পর্যাপ্ত ব্যালেন্স নেই।' });
  }

  // Withdraw save logic (can be extended)
  user.inr -= parseFloat(amount);
  await user.save();

  res.json({ message: 'উইথড্র অনুরোধ গ্রহণ করা হয়েছে।' });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
