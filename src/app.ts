import express from "express";
import cors from "cors";
import path from "path";
import { api } from "./routes/api";
import { logger } from "./logger";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger);

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/v1", api);

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });

export { app };
