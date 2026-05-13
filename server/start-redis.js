import { RedisMemoryServer } from 'redis-memory-server';

const redisServer = new RedisMemoryServer({
  instance: {
    port: 6379,
  },
});

async function run() {
  try {
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();
    console.log(`✅ Local Redis Memory Server started at redis://${host}:${port}`);
    
    // Keep the process alive
    process.on('SIGINT', async () => {
      await redisServer.stop();
      process.exit();
    });
  } catch (err) {
    console.error('❌ Failed to start Redis Memory Server:', err.message);
  }
}

run();
