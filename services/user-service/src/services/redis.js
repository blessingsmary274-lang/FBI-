const redis = require('redis');

let redisClient;

const connectRedis = async () => {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
};

const getFromCache = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

const setInCache = async (key, value, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, value);
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

module.exports = { connectRedis, getFromCache, setInCache };
