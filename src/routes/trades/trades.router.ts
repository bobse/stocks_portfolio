import express from "express";
import { httpAddNewTrade, httpGetAllTrades } from "./trades.controller";

const tradesRouter = express.Router();

tradesRouter.post("/", httpAddNewTrade);
tradesRouter.get("/", httpGetAllTrades);

export { tradesRouter };
