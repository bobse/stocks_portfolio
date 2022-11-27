import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongodb: MongoMemoryServer;

// FROM: https://github.com/pawap90/test-mongoose-inmemory/blob/master/tests/db-handler.js
/**
 * Connect to the in-memory database.
 */
async function connectTestDb() {
   mongodb = await MongoMemoryServer.create();
   const uri = mongodb.getUri();
   await mongoose.connect(uri);
}

/**
 * Drop database, close the connection and stop mongod.
 */
async function closeTestDb() {
   if (mongodb) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongodb.stop();
   }
}

/**
 * Remove all the data for all db collections.
 */
async function clearTestDb() {
   if (mongodb) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
         const collection = collections[key];
         await collection.deleteMany({});
      }
   }
}

async function setupTestDb() {
   beforeAll(async () => {
      await connectTestDb();
   });

   afterEach(async () => {
      await clearTestDb();
   });

   afterAll(async () => {
      await closeTestDb();
   });
}
export { setupTestDb };
