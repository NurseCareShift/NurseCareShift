import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Redisクライアントの作成
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD || undefined,
});

// Redis接続処理
redisClient.on('error', (err) => console.error('Redis接続エラー:', err));
redisClient.on('connect', () => console.log('Redisに接続しました'));
redisClient.on('reconnecting', () => console.log('Redisに再接続中'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis接続が確立されました');
  } catch (error) {
    console.error('Redis接続に失敗しました:', error);
  }
};

export default redisClient;
