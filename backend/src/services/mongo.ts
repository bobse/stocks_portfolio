import mongoose from "mongoose";

mongoose.connection.once("open", () => {
   console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
   console.error(err);
});

async function mongoConnect() {
   const MONGO_URL = process.env.MONGO_URL;
   if (!MONGO_URL) {
      throw new Error(
         "Could not retrieve MONGO DB URL from environment variables"
      );
   }
   await mongoose.connect(MONGO_URL, { dbName: "stock-portfolio" });
}

async function mongoDisconnect() {
   await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect };
