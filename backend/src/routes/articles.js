/**
 * Article Routes
 * 
 * Defines API endpoints for article CRUD operations and AI summarization.
 * All routes require JWT authentication, with some requiring admin role.
 */

import express from 'express';
import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  summarizeArticle,
} from '../controllers/articleController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply JWT authentication to all article routes
router.use(authenticateJWT);

// POST /articles - Create a new article
router.post('/', createArticle);

// GET /articles - Get paginated list of articles
router.get('/', getArticles);

// GET /articles/:id - Get a specific article by ID
router.get('/:id', getArticle);

// PUT /articles/:id - Update an article (admin or owner only)
router.put('/:id', updateArticle);

// DELETE /articles/:id - Delete an article (admin only)
router.delete('/:id', requireRole('admin'), deleteArticle);

// POST /articles/:id/summarize - Generate AI summary for an article
router.post('/:id/summarize', summarizeArticle);

export default router; 