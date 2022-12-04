import express from "express";
import {
   httpGetIncomes,
   httpInsertIncome,
   httpGetTotalIncomes,
   httpDeleteIncome,
   httpUpdateIncome,
   httpUploadCSV,
} from "./income.controller";

const incomeRouter = express.Router();

incomeRouter.post("/", httpInsertIncome);
incomeRouter.get("/totals/:year?/:ticker?", httpGetTotalIncomes);
// all years = "all"
incomeRouter.get("/:year?/:ticker?", httpGetIncomes);
incomeRouter.delete("/", httpDeleteIncome);
incomeRouter.put("/", httpUpdateIncome);
incomeRouter.post("/csvfile", httpUploadCSV);

export { incomeRouter };
