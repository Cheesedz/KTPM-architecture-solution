const Bull = require('bull');
const { Redis } = require('ioredis');


const redis = new Redis();

// Create Redis connection and Bull queues
const ocrQueue = new Bull('ocr', { redis: { host: '127.0.0.1', port: 6379 } });
const translateQueue = new Bull('translate', { redis: { host: '127.0.0.1', port: 6379 } });
const pdfQueue = new Bull('translate', { redis: { host: '127.0.0.1', port: 6379 } });

module.exports = { ocrQueue, translateQueue, pdfQueue, redis }