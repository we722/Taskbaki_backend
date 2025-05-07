require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware (যদি দরকার হয়)
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Example route
app.get('/', (req, res) => {
  res.send('Taskbaki backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
