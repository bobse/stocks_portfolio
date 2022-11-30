import express from "express";
import {
   httpAddNewTrade,
   httpGetTrades,
   httpGetTotalTrades,
   httpDeleteTrade,
} from "./trades.controller";

const tradesRouter = express.Router();

tradesRouter.post("/", httpAddNewTrade);
tradesRouter.get("/totals/:year?/:ticker?", httpGetTotalTrades);
tradesRouter.get("/:year?/:ticker?", httpGetTrades);
tradesRouter.delete("/", httpDeleteTrade);
export { tradesRouter };
