import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
});

redisClient.on('connect', () => {
  console.log('Redisに接続しました');
});

redisClient.on('error', (err) => {
  console.error('Redis接続エラー:', err);
});

export default redisClient;
