/** @format */

import { createClient,RedisClientType } from 'redis';
const redisClient:RedisClientType = createClient();

redisClient.connect().then(() => {
  console.log('Redis client connected');
});
redisClient.on('error', (err: any) => {
  console.log(`Something went wrong ${err}`);
});


export default redisClient;

export function setCache(key: string, value: any):Promise<any> {
  return new Promise<any>((resolve, reject) => {
    redisClient.set(key, JSON.stringify(value)).then((data: any) => {
      resolve(data);
    }
    ).catch((err: any) => {
      reject(err);
    }
    )}
    );
}

export function getCache(key: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    redisClient.get(key).then((data: any) => {
      resolve(JSON.parse(data));
    }
    ).catch((err: any) => {
      reject(err);
    }
    )}
    );
}
