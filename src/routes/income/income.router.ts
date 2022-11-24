import express from "express";
import {
  httpGetIncomes,
  httpInsertIncome,
  httpGetTotalIncomes,
} from "./income.controller";

const incomeRouter = express.Router();

incomeRouter.post("/", httpInsertIncome);
incomeRouter.get("/totals/:year?/:ticker?", httpGetTotalIncomes);
// all years = "all"
incomeRouter.get("/:year?/:ticker?", httpGetIncomes);

export { incomeRouter };
