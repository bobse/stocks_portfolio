import express from "express";
import { insertTrade, getTrades } from "../../models/trades.model";
import { getPagination, parseErrorsResponse } from "../../utils/utils";

async function httpGetTrades(req: express.Request, res: express.Response) {
  try {
    const { ticker } = req.params;
    const { limit, page } = getPagination(req.query.limit, req.query.page);
    const trades = await getTrades(req.user.email, ticker, limit, page);
    if (trades.pagination.totalCount === 0) {
      return res.status(404).json(trades);
    }
    return res.status(200).json(trades);
  } catch (err: any) {
    const response = parseErrorsResponse(err, "Could not get list of trades");
    return res.status(500).json(response);
  }
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
    const response = parseErrorsResponse(err, "Could not save this trade");
    return res.status(500).json(response);
}

export { httpGetTrades, httpAddNewTrade };
