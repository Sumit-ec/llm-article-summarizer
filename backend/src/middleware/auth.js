/**
 * Authentication Middleware
 * 
 * Provides JWT token verification and role-based access control
 * for protecting API endpoints and ensuring proper authorization.
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Verify JWT token and attach user data to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and has Bearer format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No valid token provided' });
  }
  
  // Extract token from Authorization header
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token and decode user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware factory for role-based access control
 * @param {string} role - Required role for access
 * @returns {Function} Express middleware function
 */
export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ 
      message: 'Access denied: Insufficient permissions' 
    });
  }
  next();
};

/**
 * Middleware for checking ownership or admin status
 * Allows access if user is admin or owns the resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireOwnerOrAdmin = async (req, res, next) => {
  // Admins have access to all resources
  if (req.user.role === 'admin') {
    return next();
  }
  
  // For article operations: check if user is the owner
  // This is a placeholder - actual ownership check should be done in controllers
  req.isOwner = false;
  next();
}; 