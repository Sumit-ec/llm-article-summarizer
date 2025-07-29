/**
 * Authentication Controller
 * 
 * Handles user registration and login functionality with password hashing
 * and JWT token generation for secure authentication.
 */

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success/error message
 */
export const register = async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    // Check if username already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Hash password for security
    const hashed = await bcrypt.hash(password, 10);
    
    // Validate and set role (only allow 'user' or 'admin', default to 'user')
    const safeRole = role === 'admin' ? 'admin' : 'user';
    
    // Create new user
    const user = await User.create({ 
      username, 
      password: hashed, 
      role: safeRole 
    });
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: err.message 
    });
  }
};

/**
 * Authenticate user and generate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with token and user data
 */
export const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token with user data
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        username: user.username 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    // Return token and user info (without password)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: err.message 
    });
  }
}; 