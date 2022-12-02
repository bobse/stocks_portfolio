import express from "express";
import { validateOrReject, isMongoId } from "class-validator";
import {
   insertTrade,
   getTrades,
   deleteTrade,
   getTotalTrades,
} from "../../models/trades.model";
import { parseErrorsResponse } from "../../utils/utils";
import { validatePagination, yearParamConvert } from "../../utils/validators";
import { TradesDTO } from "../../DTO/trades.dto";

async function httpGetTrades(req: express.Request, res: express.Response) {
   try {
      const user = req.user as string;
      const ticker = req.params.ticker;
      const year = yearParamConvert(req.params.year);
      const { limit, page } = validatePagination(
         req.query.limit,
         req.query.page
      );
      const trades = await getTrades(user, ticker, year, limit, page);
      return res.status(200).json(trades);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (err: any) {
      const response = parseErrorsResponse(err, "Could not get list of trades");
      return res.status(500).json(response);
   }
}

async function httpGetTotalTrades(req: express.Request, res: express.Response) {
   try {
      const user = req.user as string;
      const { ticker } = req.params;
      const year = yearParamConvert(req.params.year);
      const totals = await getTotalTrades(user, ticker, year);
      return res.status(200).json(totals);
   } catch (err) {
      const response = parseErrorsResponse(
         err,
         "Could not get totals. Please try again"
      );
      return res.status(500).json(response);
   }
}

async function httpAddNewTrade(req: express.Request, res: express.Response) {
   try {
      const data = new TradesDTO(req.body);
      Object.assign(data, { userEmail: req.user as string });
      await validateOrReject(data);
      const response = await insertTrade(data);
      if (response) {
         return res.status(201).json(response);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (err: any) {
      // console.error(err);
      const response = parseErrorsResponse(err, "Could not save this trade");
      return res.status(500).json(response);
   }
}

async function httpDeleteTrade(req: express.Request, res: express.Response) {
   try {
      if (isMongoId(req.body._id)) {
         const user = req.user as string;
         const response = await deleteTrade(user, req.body._id);
         if (response) {
            return res.status(204).json();
         } else {
            return res.status(404).json({ error: "Could not find id" });
         }
      } else {
         throw new Error("Must provide a valid Mongo Id for deletion.");
      }
   } catch (err) {
      const response = parseErrorsResponse(err, "Could not delete this trade");
      return res.status(500).json(response);
   }
}

export { httpGetTrades, httpGetTotalTrades, httpAddNewTrade, httpDeleteTrade };
