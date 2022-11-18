import express from "express";
import { insertTrade } from "../../models/trades.model";

async function httpGetAllTrades(req: express.Request, res: express.Response) {
  try {
    return res.status(200).json({ data: "data" });
  } catch (err) {
    console.log(err);
  }
}

async function httpAddNewTrade(req: express.Request, res: express.Response) {
  try {
    const data = req.body;
    const response = await insertTrade(data);
    if (response) {
      return res.status(201).json(response);
    }
  } catch (err: any) {
    console.error(err);
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
    return res.status(500).json({ error: "Could not save this trade" });
  }
}

export { httpGetAllTrades, httpAddNewTrade };
