/**
 * Knowledge Hub API Server
 * 
 * This is the main entry point for the Knowledge Hub backend API.
 * It sets up the Express server, connects to MongoDB, and configures
 * all API routes for authentication, articles, and user management.
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import userRoutes from './routes/users.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware configuration
app.use(cors({
  origin: '*',
  credentials: false
})); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Knowledge Hub API running');
});

// API route configuration
app.use('/auth', authRoutes); // Authentication routes (login, register)
app.use('/articles', articleRoutes); // Article management routes
app.use('/users', userRoutes); // User management routes (admin only)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 