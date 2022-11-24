import express from "express";
import { tradesRouter } from "./trades/trades.router";
import { portfolioRouter } from "./portfolio/portfolio.router";
import { incomeRouter } from "./income/income.router";
import { checkLoggedIn } from "../services/auth";

const api = express.Router();

api.use("/trades", checkLoggedIn, tradesRouter);
api.use("/portfolio", checkLoggedIn, portfolioRouter);
api.use("/incomes", checkLoggedIn, incomeRouter);

export { api };
