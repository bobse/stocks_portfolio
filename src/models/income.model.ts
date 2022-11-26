import { Income } from "./income.schema";
import { HydratedDocument } from "mongoose";
import mongoose from "mongoose";
import { IIncome } from "../types/income.interfaces";
import { getPaginatedResults } from "./pagination";
import { IncomeUserDTO } from "../DTO/income.dto";

async function insertIncome(data: IncomeUserDTO) {
  const newIncome: HydratedDocument<IIncome> = new Income({
    ...data,
  });
  return await newIncome.save();
}
async function getIncomes(
  userEmail: string,
  ticker: string | undefined = undefined,
  category: string | undefined,
  year: number | undefined = undefined,
  limit: number | undefined,
  page: number | undefined
) {
  const filter = { userEmail: userEmail };
  const sort: Record<string, 1 | -1 | mongoose.Expression.Meta> = {
    ticker: 1,
    date: -1,
  };
  if (ticker) {
    Object.assign(filter, { ticker: ticker.toUpperCase() });
  }
  if (category) {
    Object.assign(filter, { category: category.toUpperCase() });
  }
  if (year) {
    Object.assign(filter, { year: year });
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

async function deleteIncome(
  userEmail: string,
  _id: mongoose.Types.ObjectId | string
) {
  const deletedIncome = await Income.findOneAndDelete({
    userEmail: userEmail,
    _id: _id,
  });
  return deletedIncome;
}

async function updateIncome(data: IncomeUserDTO) {
  const updateDoc = await Income.findOneAndUpdate(
    { _id: data._id, userEmail: data.userEmail },
    data,
    { runValidators: true, returnDocument: "after" }
  );
  return updateDoc;
}

export {
  insertIncome,
  getIncomes,
  getTotalIncomes,
  deleteIncome,
  updateIncome,
};
