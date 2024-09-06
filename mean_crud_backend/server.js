const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 8341;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));