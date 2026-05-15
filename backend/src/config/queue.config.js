// backend/src/config/queue.config.js
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

const triageQueue = new Queue('triage-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
});

module.exports = { triageQueue, redisConnection };
