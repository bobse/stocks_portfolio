import express from "express";
import {
  httpGetIncomes,
  httpInsertIncome,
  httpGetTotalIncomes,
} from "./income.controller";

const incomeRouter = express.Router();

incomeRouter.post("/", httpInsertIncome);
incomeRouter.get("/totals/:ticker?/:year?", httpGetTotalIncomes);
incomeRouter.get("/:ticker?", httpGetIncomes);

export { incomeRouter };
