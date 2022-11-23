import express from "express";
import { tradesRouter } from "./trades/trades.router";
import { portfolioRouter } from "./portfolio/portfolio.router";

const api = express.Router();

api.use("/trades", tradesRouter);
api.use("/portfolio", portfolioRouter);

export { api };
