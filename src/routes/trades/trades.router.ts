import express from "express";
import {
   httpAddNewTrade,
   httpGetTrades,
   httpDeleteTrade,
} from "./trades.controller";

const tradesRouter = express.Router();

tradesRouter.post("/", httpAddNewTrade);
tradesRouter.get("/:year?/:ticker?", httpGetTrades);
tradesRouter.delete("/", httpDeleteTrade);

export { tradesRouter };
