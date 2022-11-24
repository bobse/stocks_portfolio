import express from "express";
import { insertTrade, getTrades } from "../../models/trades.model";

async function httpGetTrades(req: express.Request, res: express.Response) {
  try {
    const { ticker } = req.params;
    let limit: number | undefined;
    let page: number | undefined;
    if (req.query.limit) limit = queryParamToNumber(req.query.limit);
    if (req.query.page) page = queryParamToNumber(req.query.page);
    const trades = await getTrades(req.user.email, ticker, limit, page);
    if (trades.pagination.totalCount === 0) {
      return res.status(404).json(trades);
    }
    return res.status(200).json(trades);
  } catch (err: any) {
    if (err.message) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Could not get trade" });
  }
}

function queryParamToNumber(param: Array<any> | any): number {
  if (param instanceof Array) param = param[0];
  param = +param;
  if (isNaN(param) || param <= 0) {
    throw new Error(`${param} must be a valid number and bigger than 0`);
  }
  return param;
}

async function httpAddNewTrade(req: express.Request, res: express.Response) {
  try {
    const data = req.body;
    Object.assign(data, { userEmail: req.user.email });
    const response = await insertTrade(data);
    if (response) {
      return res.status(201).json(response);
    }
  } catch (err: any) {
    // console.error(err);
    if (err._message === "Trade validation failed" && err.errors) {
      const response = new Map<string, string>();
      Object.keys(err.errors).forEach((key) => {
        if (err.errors[key].name === "CastError") {
          // CastErrors occur before validation errors and their message is confusing. So we replace the message.
          response.set(key, `Invalid ${key}`);
        } else {
          response.set(key, err.errors[key].message);
        }
      });
      return res.status(500).json({ error: Object.fromEntries(response) });
    }
    if (err.message) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Could not save this trade" });
  }
}

export { httpGetTrades, httpAddNewTrade };
