/**
 * User Model
 * 
 * Defines the User schema for MongoDB with authentication fields
 * including username, password (hashed), and role-based access control.
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

export default mongoose.model('User', userSchema); 