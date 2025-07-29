/**
 * Article Model
 * 
 * Defines the Article schema for MongoDB with content management fields
 * including title, content, tags, AI-generated summary, and creator reference.
 */

import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  tags: [{ 
    type: String 
  }],
  summary: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { 
  timestamps: true // Automatically add createdAt and updatedAt fields
});

export default mongoose.model('Article', articleSchema); 