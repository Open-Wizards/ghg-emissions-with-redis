/** @format */

import { createClient,RedisClientType } from 'redis';
import logger from '../../utils/pino';
const redisClient: RedisClientType = createClient();

//Simply connect to the redis server
redisClient.connect().then(() => {
  console.log('Redis client connected');
});
redisClient.on('error', (err: any) => {
  console.log(`Something went wrong ${err}`);
});

export default redisClient;

//Keeping it pretty simple here by using the redis client directly.

// Setting the cache
export async function setCache(key: string, value: any) {
  //Storing the data in a List as there are multiple values for a country
  try {
    return await redisClient.lPush(key, JSON.stringify(value));
  } catch (err) {
    throw err;
  }
}

//retrieving the cache
export async function getCache(key: string) {
  try {
    const data = await redisClient.lRange(key, 1, -1);
    return data.map((item: any) => JSON.parse(item));
  } catch (err) {
    throw err;
  }
}