import express from 'express';
import User from '../models/User.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';
const router = express.Router();

router.use(authenticateJWT, requireRole('admin'));

router.get('/', async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

export default router; 