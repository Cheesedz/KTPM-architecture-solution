const Redis = require("ioredis");

// Use the container name (or hostname if using Kubernetes/Docker Swarm)
const redis = new Redis({
  host: "localhost", // Replace with "localhost" if running without Docker
  port: 6379,
});

const getCachedImage = async (cacheKey) => {
  const data = await redis.get(cacheKey);
  if (data) {
    console.log(`Cache hit for ${cacheKey}`);
    return data; // Convert back to binary
  }
  console.log(`Cache miss for ${cacheKey}`);
  return null;
};

const setCachedImage = async (cacheKey, imageBuffer, ttl = 3600) => {
  const base64Image = imageBuffer.toString("base64");
  await redis.set(cacheKey, base64Image, "EX", ttl); // Expire after 1 hour
  console.log(`Image cached with key ${cacheKey}`);
};

module.exports = { redis, setCachedImage, getCachedImage };
