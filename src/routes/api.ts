import express from "express";
import { tradesRouter } from "./trades/trades.router";
import { portfolioRouter } from "./portfolio/portfolio.router";
import { checkLoggedIn } from "@routes/services/auth";

const api = express.Router();

api.use("/trades", checkLoggedIn, tradesRouter);
api.use("/portfolio", checkLoggedIn, portfolioRouter);

export { api };
