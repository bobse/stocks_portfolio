import express from "express";
import { httpGetCurrPortfolio } from "./portfolio.controler";

const portfolioRouter = express.Router();

portfolioRouter.get("/", httpGetCurrPortfolio);

export { portfolioRouter };
