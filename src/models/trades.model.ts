import { Trade } from "./trades.schema";
import mongoose, { HydratedDocument } from "mongoose";
import { ITradeSchema, INewUserTrade } from "../types/trades.interfaces";
import { getPaginatedResults } from "./pagination";

async function getTrades(
  userEmail: string,
  ticker: string | undefined = undefined,
  year: number | undefined = undefined,
  limit: number | undefined,
  page: number | undefined
) {
  const filter = { userEmail: userEmail };
  const sort = { ticker: 1, date: -1 };
  if (ticker) {
    Object.assign(filter, { ticker: ticker.toUpperCase() });
  }
  if (year) {
    Object.assign(filter, { year: year });
  }
  return await getPaginatedResults(Trade, filter, sort, limit, page);
}

async function insertTrade(data: INewUserTrade) {
  const newTrade: HydratedDocument<ITradeSchema> = new Trade({
    ...data,
  });
  if (await tradeExists(newTrade)) {
    throw new Error(
      "Can not insert the same trade again. Please check the datetime"
    );
  }

  const latestTrade = await getLatestTrade(data.userEmail, data.ticker);
  if (latestTrade === null) return await calcAndSaveNewTrade(newTrade);
  if (newTrade.date > latestTrade.date)
    return await calcAndSaveNewTrade(newTrade, latestTrade);

  const previousTrade = await getPreviousTrade(
    data.userEmail,
    data.ticker,
    data.date
  );

  if (previousTrade) {
    await calcAndSaveNewTrade(newTrade, previousTrade);
  } else {
    // if we are inserting at the very beginning. Very first date
    await calcAndSaveNewTrade(newTrade);
  }
  await updateAvgAndTotalTrades(newTrade);
  return newTrade;
}

async function tradeExists(
  newTrade: HydratedDocument<ITradeSchema>
): Promise<boolean> {
  const res = await Trade.exists({
    date: newTrade.date,
    ticker: newTrade.ticker,
    userEmail: newTrade.userEmail,
  });
  return res !== null;
}

async function getLatestTrade(userEmail: string, ticker: string) {
  return await Trade.findOne({
    userEmail: userEmail,
    ticker: ticker,
  }).sort("-date");
}

async function calcAndSaveNewTrade(
  newTrade: HydratedDocument<ITradeSchema>,
  oldTrade?: ITradeSchema & {
    _id: mongoose.Types.ObjectId;
  }
) {
  let oldAvgPrice = 0;
  let oldTotalAmount = 0;
  if (oldTrade) {
    oldAvgPrice = oldTrade.currAvgPrice;
    oldTotalAmount = oldTrade.currTotalAmount;
  }
  const { currAvgPrice, currTotalAmount } = calcNewAvgPrice(
    newTrade.price,
    newTrade.amount,
    newTrade.fees,
    oldAvgPrice,
    oldTotalAmount
  );
  newTrade.currAvgPrice = currAvgPrice;
  newTrade.currTotalAmount = currTotalAmount;
  if (newTrade.amount < 0) {
    newTrade.profitAndLosses = calcProfits(newTrade);
  }
  return await newTrade.save();
}

function calcNewAvgPrice(
  newPrice: number,
  newAmount: number,
  newFees: number,
  oldAvgPrice: number,
  oldTotalAmount: number
): { currAvgPrice: number; currTotalAmount: number } {
  const currTotalAmount = newAmount + oldTotalAmount;
  checkTotalAmountValid(currTotalAmount);
  let currAvgPrice = oldAvgPrice;
  if (newAmount > 0) {
    // if buying update the currAvgPrice
    currAvgPrice =
      (newPrice * newAmount + newFees + oldAvgPrice * oldTotalAmount) /
      currTotalAmount;
  }
  if (currTotalAmount === 0) {
    currAvgPrice = 0;
  }
  return { currTotalAmount, currAvgPrice };
}

function checkTotalAmountValid(totalAmount: number) {
  if (totalAmount < 0) {
    throw new Error(
      "Total amount can not be negative. Trying to sell more than in custody"
    );
  }
}

// MAYBE WE SHOULD CALC THIS IN THE FRONTEND
function calcProfits(newTrade: HydratedDocument<ITradeSchema>) {
  return (
    (newTrade.price - newTrade.currAvgPrice) * Math.abs(newTrade.amount) -
    newTrade.fees
  );
}

async function getPreviousTrade(
  userEmail: string,
  ticker: string,
  currTradeDate: Date
) {
  const previousTrade = await Trade.findOne({
    userEmail: userEmail,
    ticker: ticker,
    date: { $lt: currTradeDate },
  }).sort("-date");
  return previousTrade;
}

async function updateAvgAndTotalTrades(
  newTrade: HydratedDocument<ITradeSchema>
): Promise<void> {
  try {
    const tradesForUpdate = await Trade.find({
      userEmail: newTrade.userEmail,
      ticker: newTrade.ticker,
      date: { $gt: newTrade.date },
    }).sort("date");
    if (tradesForUpdate) {
      let recordsUpdated = 0;
      tradesForUpdate.forEach(async (trade, idx) => {
        const previousTrade = idx === 0 ? newTrade : tradesForUpdate[idx - 1];
        await calcAndSaveNewTrade(trade, previousTrade);
        recordsUpdated += 1;
      });
      console.log(
        `${recordsUpdated}|${tradesForUpdate.length} updated with new Avg and Total Amounts`
      );
    }
  } catch (err) {
    console.error(
      `Please contact adm to trigger recalculation on ${newTrade.userEmail} - ${newTrade.ticker} -> $gt: ${newTrade.date}`
    );
    console.error(err);
    setAllTradesAfterDateToRecalc(newTrade);
  }
}

async function setAllTradesAfterDateToRecalc(
  newTrade: HydratedDocument<ITradeSchema>
): Promise<void> {
  await Trade.updateMany(
    {
      userEmail: newTrade.userEmail,
      ticker: newTrade.ticker,
      date: { $gt: newTrade.date },
    },
    { valuesUpToDate: false }
  );
}

export { getTrades, insertTrade };
