import IORedis from 'ioredis';
import { Worker } from 'bullmq';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Email worker
const emailWorker = new Worker(
  'emails',
  async (job) => {
    console.log(`Processing email job ${job.id}:`, job.name);
    // TODO: Implement email sending via SMTP
  },
  { connection },
);

// Search index worker (rebuild search_terms for Arabic normalisation)
const searchWorker = new Worker(
  'search-index',
  async (job) => {
    console.log(`Processing search index job ${job.id}:`, job.name);
    // TODO: Update business search_terms using buildSearchTerms()
  },
  { connection },
);

emailWorker.on('completed', (job) => console.log(`Email job ${job.id} completed`));
emailWorker.on('failed', (job, err) => console.error(`Email job ${job?.id} failed:`, err));
searchWorker.on('completed', (job) => console.log(`Search index job ${job.id} completed`));
searchWorker.on('failed', (job, err) => console.error(`Search index job ${job?.id} failed:`, err));

console.log('🔧 UEVIO Worker started');
