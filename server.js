const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String,
  points: { type: Number, default: 0 }
}));

// Root Route
app.get('/', (req, res) => {
  res.send('Taskbaki backend is live');
});

// Register Route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });
  const user = new User({ email, password });
  await user.save();
  res.status(200).json({ message: "Registered successfully" });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  res.status(200).json({ message: "Login success", user });
});

// Add Point
app.post('/add-point', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  user.points += 1;
  await user.save();
  res.status(200).json({ message: "Point added", points: user.points });
});

// Get User Points
app.get('/points/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ points: user.points });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
