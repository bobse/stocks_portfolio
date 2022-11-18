import * as dotenv from "dotenv";
import http from "http";
import { app } from "./app";
import { mongoConnect } from "./services/mongo";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
