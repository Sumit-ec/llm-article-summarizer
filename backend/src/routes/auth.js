/**
 * Authentication Routes
 * 
 * Defines API endpoints for user registration and login functionality.
 * These routes handle user authentication without requiring JWT tokens.
 */

import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /auth/register - Register a new user
router.post('/register', register);

// POST /auth/login - Authenticate user and get JWT token
router.post('/login', login);

export default router; 