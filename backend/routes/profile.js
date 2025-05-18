import express from 'express';
import { db } from '../models/database.js';

export const profileRouter = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

profileRouter.get('/', isAuthenticated, (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
    const user = stmt.get(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});