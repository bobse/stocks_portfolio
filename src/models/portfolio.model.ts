import { Trade } from "./trades.schema";
import mongoose from "mongoose";
import { IPortfolio } from "../interfaces/portfolio.interfaces";

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
      },
    },
  ];
  let results = await Trade.aggregate(agg);
  results = results.map((elm) => {
    const newObj = { ticker: elm._id, ...elm };
    delete newObj._id;
    return newObj;
  });
  return results;
}

export { GetCurrPortfolio };
