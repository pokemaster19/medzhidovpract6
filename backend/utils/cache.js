import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '../../cache');
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

export async function getCache(key) {
  try {
    const filePath = join(CACHE_DIR, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const { timestamp, content } = JSON.parse(data);
    
    // Check if cache is still valid (less than 1 minute old)
    if (Date.now() - timestamp < CACHE_DURATION) {
      return content;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function setCache(key, data) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const filePath = join(CACHE_DIR, `${key}.json`);
    const cacheData = {
      timestamp: Date.now(),
      content: data
    };
    await fs.writeFile(filePath, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('Cache write error:', error);
    return false;
  }
}

export async function clearCache(key) {
  try {
    const filePath = join(CACHE_DIR, `${key}.json`);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    return false;
  }
}