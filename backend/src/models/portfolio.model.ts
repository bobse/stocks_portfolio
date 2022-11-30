import { Trade } from "./trades.schema";
import mongoose from "mongoose";
import { IPortfolio } from "../types/portfolio.interfaces";
import { getTotalIncomes } from "./income.model";

async function GetCurrPortfolio(userEmail: string): Promise<IPortfolio[]> {
   const agg: mongoose.PipelineStage[] = [
      {
         $match: {
            userEmail: userEmail,
         },
      },
      {
         $sort: {
            date: -1,
         },
      },
      {
         $group: {
            _id: "$ticker",
            currAvgPrice: {
               $first: "$currAvgPrice",
            },
            currTotalAmount: {
               $first: "$currTotalAmount",
            },
            lastTrade: { $first: "$date" },
         },
      },
      {
         $match: {
            currTotalAmount: { $gt: 0 },
         },
      },
      {
         $sort: {
            _id: 1,
         },
      },
   ];
   let results = await Trade.aggregate(agg);
   results = await Promise.all(
      results.map(async (elm) => {
         const newObj = { ticker: elm._id, ...elm };
         const incomes = await getTotalIncomes(userEmail, newObj.ticker);
         if (incomes[0]) {
            Object.assign(newObj, {
               totalIncome:
                  incomes[0].totalInterests + incomes[0].totalDividends,
            });
         } else {
            Object.assign(newObj, {
               totalIncome: 0,
            });
         }
         delete newObj._id;
         return newObj;
      })
   );
   return results;
}

export { GetCurrPortfolio };
