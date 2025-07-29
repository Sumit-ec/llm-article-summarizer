/**
 * Article Controller
 * 
 * Handles all article-related operations including CRUD operations,
 * pagination, and AI-powered summarization functionality.
 */

import Article from '../models/Article.js';
import User from '../models/User.js';
import { summarizeWithLLM } from '../services/llm.js';

/**
 * Create a new article
 * @param {Object} req - Express request object with article data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created article
 */
export const createArticle = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Create article with current user as creator
    const article = await Article.create({
      title,
      content,
      tags,
      createdBy: req.user.id,
    });
    
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to create article', 
      error: err.message 
    });
  }
};

/**
 * Get paginated list of articles
 * @param {Object} req - Express request object with pagination params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with articles and pagination info
 */
export const getArticles = async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch articles with user information and pagination
    const articles = await Article.find()
      .populate('createdBy', 'username') // Include creator's username
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Calculate pagination metadata
    const total = await Article.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch articles', 
      error: err.message 
    });
  }
};

/**
 * Get a single article by ID
 * @param {Object} req - Express request object with article ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with article data
 */
export const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('createdBy', 'username');
      
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch article', 
      error: err.message 
    });
  }
};

/**
 * Update an existing article (admin or owner only)
 * @param {Object} req - Express request object with article data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated article
 */
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check permissions: admin can edit any article, users can only edit their own
    if (req.user.role !== 'admin' && article.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    // Update article fields if provided
    const { title, content, tags } = req.body;
    if (title) article.title = title;
    if (content) article.content = content;
    if (tags) article.tags = tags;
    
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to update article', 
      error: err.message 
    });
  }
};

/**
 * Delete an article (admin only)
 * @param {Object} req - Express request object with article ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 */
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    await article.deleteOne();
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to delete article', 
      error: err.message 
    });
  }
};

/**
 * Generate AI summary for an article
 * @param {Object} req - Express request object with article ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with generated summary
 */
export const summarizeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Generate summary using AI service
    const summary = await summarizeWithLLM(
      article.content, 
      process.env.LLM_PROVIDER
    );
    
    // Save summary to article
    article.summary = summary;
    await article.save();
    
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to generate summary', 
      error: err.message 
    });
  }
}; 