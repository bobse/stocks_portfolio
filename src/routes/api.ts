import express from "express";
import { tradesRouter } from "./trades/trades.router";

const api = express.Router();

api.use("/trades", tradesRouter);

export { api };
