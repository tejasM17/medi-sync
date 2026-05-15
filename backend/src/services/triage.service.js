// backend/src/queues/triage.queue.js
const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const triageQueue = new Queue('triage-queue', { connection });

console.log('✅ BullMQ Queue Initialized');

// Worker to process triage
const triageWorker = new Worker('triage-queue', async (job) => {
  console.log(`🔄 Processing triage for email: ${job.data.emailId}`);
  
  // TODO: Call AI Agents here (Phase 11)
  const result = {
    urgencyLevel: "Urgent",
    urgencyScore: 75,
    summary: "Patient reports severe headache with blurred vision - needs prompt evaluation.",
    recommendations: ["Immediate consultation recommended", "Rule out neurological issues"]
  };

  console.log("✅ Triage Completed:", result);
  return result;
}, { connection });

triageWorker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed successfully`);
});

triageWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

module.exports = { triageQueue };
