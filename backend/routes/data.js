import express from 'express';
import { getCache, setCache } from '../utils/cache.js';

export const dataRouter = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

function generateRandomData() {
  return {
    id: Math.random().toString(36).substr(2, 9),
    value: Math.floor(Math.random() * 100),
    timestamp: new Date().toISOString()
  };
}

dataRouter.get('/', isAuthenticated, async (req, res) => {
  try {
    // Try to get data from cache
    const cacheKey = `data-${req.session.userId}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Generate new data if cache miss or expired
    const newData = generateRandomData();
    
    // Store in cache
    await setCache(cacheKey, newData);
    
    res.json(newData);
  } catch (error) {
    console.error('Data route error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});