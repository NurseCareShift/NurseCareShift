"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
});
redisClient.on('connect', () => {
    console.log('Redisに接続しました');
});
redisClient.on('error', (err) => {
    console.error('Redis接続エラー:', err);
});
exports.default = redisClient;
