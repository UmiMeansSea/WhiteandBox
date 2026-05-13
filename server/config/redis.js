import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis Connected'));

// Connect asynchronously to avoid blocking server startup if Redis is down
redisClient.connect().catch(err => console.error('❌ Redis Initial Connection Failed:', err.message));

export default redisClient;
