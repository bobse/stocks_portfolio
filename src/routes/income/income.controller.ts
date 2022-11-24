import express from "express";
import {
  insertIncome,
  getIncomes,
  getTotalIncomes,
} from "../../models/income.model";
import {
  getPagination,
  parseErrorsResponse,
  yearParamConvert,
} from "../../utils/utils";

async function httpGetIncomes(req: express.Request, res: express.Response) {
  try {
    const ticker = req.params.ticker;
    const year = yearParamConvert(req.params.year);
    const incomeCategory =
      typeof req.query.category === "string" || req.query.category === undefined
        ? req.query.category
        : req.query.category[0];
    const { limit, page } = getPagination(req.query.limit, req.query.page);
    const incomes = await getIncomes(
      req.user.email,
      ticker,
      incomeCategory,
      year,
      limit,
      page
    );
    if (incomes.pagination.totalCount === 0) {
      return res.status(404).json(incomes);
    }
    return res.status(200).json(incomes);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const response = parseErrorsResponse(err, "Could not get list of incomes");
    return res.status(500).json(response);
  }
}

async function httpGetTotalIncomes(
  req: express.Request,
  res: express.Response
) {
  try {
    const { ticker, year } = req.params;
    const totals = await getTotalIncomes(req.user.email, ticker, +year);

    return res.status(200).json(totals);
  } catch (err) {
    const response = parseErrorsResponse(
      err,
      "Could not get totals. Please try again"
    );
    return res.status(500).json(response);
  }
}

async function httpInsertIncome(req: express.Request, res: express.Response) {
  try {
    const data = req.body;
    Object.assign(data, { userEmail: req.user.email });
    const income = await insertIncome(data);
    if (income) {
      return res.status(201).json(income);
    }
  } catch (err) {
    const response = parseErrorsResponse(err, "Could not save this new income");
    return res.status(500).json(response);
  }
}

export { httpGetIncomes, httpInsertIncome, httpGetTotalIncomes };
