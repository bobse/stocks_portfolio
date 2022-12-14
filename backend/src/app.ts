import express from "express";
import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";

import { api } from "./routes/api";
import { logger } from "./logger";
import { setupGCPAuth } from "./services/auth";

dotenv.config();

const app = express();
const API_START_URL = "/api/v1";

app.use(
   cors({
      origin: process.env.FRONTEND,
      credentials: true,
   })
);

setupGCPAuth(app);

app.use(logger);

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(API_START_URL, api);

app.get("/*", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export { app, API_START_URL };
