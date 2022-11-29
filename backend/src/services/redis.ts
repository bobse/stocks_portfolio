import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;
const redisClient = createClient({
   url: REDIS_URL,
});

async function redisConnect() {
   if (!process.env.REDIS_URL) {
      throw new Error(
         "Could not retrieve REDIS_URL from environment variables"
      );
   }
   redisClient.on("error", (err) => console.log("Redis Client Error", err));
   await redisClient.connect();
}

async function redisDisconnect() {
   redisClient.disconnect();
}

export { redisConnect, redisDisconnect, redisClient };
