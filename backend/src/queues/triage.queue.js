// backend/src/queues/triage.queue.js
const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const triageQueue = new Queue('triage-queue', { 
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  }
});

console.log('✅ BullMQ Triage Queue Initialized');

// Basic Worker (for now)
const triageWorker = new Worker('triage-queue', async (job) => {
  console.log(`🔄 Processing triage job #${job.id} for email: ${job.data.emailId}`);
  
  // Placeholder for AI Agents (will expand in Phase 11)
  const result = {
    urgencyLevel: "Urgent",
    urgencyScore: 78,
    summary: "Patient has severe headache with blurred vision - High priority case.",
    recommendations: ["Immediate medical evaluation recommended", "Rule out serious neurological conditions"],
    processedAt: new Date().toISOString()
  };

  console.log("✅ AI Triage Completed:", result);
  return result;
}, { connection });

triageWorker.on('completed', (job) => {
  console.log(`🎉 Triage Job ${job.id} completed!`);
});

triageWorker.on('failed', (job, err) => {
  console.error(`❌ Triage Job ${job.id} failed:`, err.message);
});

module.exports = { triageQueue };
