import { Income } from "./income.schema";
import { HydratedDocument } from "mongoose";
import mongoose from "mongoose";
import { IIncome, incomeType } from "../types/income.interfaces";
import { getPaginatedResults } from "./pagination";

async function insertIncome(data: IIncome) {
  const newIncome: HydratedDocument<IIncome> = new Income({
    ...data,
  });
  return await newIncome.save();
}
async function getIncome(
  userEmail: string,
  ticker: string | undefined = undefined,
  category: incomeType | undefined,
  limit: number | undefined,
  page: number | undefined
) {
  const filter = { userEmail: userEmail };
  const sort = { ticker: 1, date: -1 };
  if (ticker) {
    Object.assign(filter, { ticker: ticker.toUpperCase() });
  }
  if (category) {
    Object.assign(filter, { category: category.toUpperCase() });
  }
  return await getPaginatedResults(Income, filter, sort, limit, page);
}

async function getTotalIncomes(
  userEmail: string,
  ticker: string | undefined = undefined,
  year: number | undefined = undefined
) {
  const filter = { userEmail: userEmail };
  if (year) {
    Object.assign(filter, { year: year });
  }
  if (ticker) {
    Object.assign(filter, { ticker: ticker.toUpperCase() });
  }
  const agg: mongoose.PipelineStage[] = [
    {
      $addFields: {
        year: {
          $year: "$date",
        },
      },
    },
    {
      $match: filter,
    },
    {
      $group: {
        _id: "$ticker",
        totalInterests: {
          $sum: {
            $cond: [
              {
                $eq: ["$category", "INTERESTS"],
              },
              "$value",
              0,
            ],
          },
        },
        totalDividends: {
          $sum: {
            $cond: [
              {
                $eq: ["$category", "DIVIDENDS"],
              },
              "$value",
              0,
            ],
          },
        },
        totalCount: {
          $count: {},
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];
  const results = await Income.aggregate(agg);

  return results;
}
export { insertIncome, getIncome, getTotalIncomes };
