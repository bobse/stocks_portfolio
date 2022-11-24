import express from "express";
import { httpAddNewTrade, httpGetTrades } from "./trades.controller";

const tradesRouter = express.Router();

tradesRouter.post("/", httpAddNewTrade);
tradesRouter.get("/:year?/:ticker?", httpGetTrades);

export { tradesRouter };
