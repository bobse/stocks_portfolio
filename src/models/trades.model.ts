import { Trade } from "./trades.schema";
import mongoose, { HydratedDocument } from "mongoose";
import { ITradeSchema, INewUserTrade } from "../interfaces/trades.interfaces";

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
  await setAllTradesAfterDateToRecalc(
    newTrade.userEmail,
    newTrade.ticker,
    newTrade.date
  );
  if (previousTrade) {
    return await calcAndSaveNewTrade(newTrade, previousTrade);
  } else {
    // if we are inserting at the very beginning. Very first date
    return await calcAndSaveNewTrade(newTrade);
  }
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
  const { currAvgPrice, currTotalAmount } = calculateNewAvgPrice(
    newTrade.price,
    newTrade.amount,
    newTrade.fees,
    oldAvgPrice,
    oldTotalAmount
  );
  newTrade.currAvgPrice = currAvgPrice;
  newTrade.currTotalAmount = currTotalAmount;
  return await newTrade.save();
}

async function getLatestTrade(userEmail: string, ticker: string) {
  return await Trade.findOne({
    userEmail: userEmail,
    ticker: ticker,
  }).sort("-date");
}

function calculateNewAvgPrice(
  newPrice: number,
  newAmount: number,
  newFees: number,
  oldAvgPrice: number,
  oldTotalAmount: number
): { currAvgPrice: number; currTotalAmount: number } {
  const currTotalAmount = newAmount + oldTotalAmount;
  const currAvgPrice =
    (newPrice * newAmount + newFees + oldAvgPrice * oldTotalAmount) /
    currTotalAmount;
  return { currTotalAmount, currAvgPrice };
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

async function setAllTradesAfterDateToRecalc(
  userEmail: string,
  ticker: string,
  tradeDate: Date
) {
  const res = await Trade.updateMany(
    { userEmail: userEmail, ticker: ticker, date: { $gt: tradeDate } },
    { valuesUpToDate: false }
  );
  console.log(
    `Setting trades more recent than ${tradeDate} to be recalculated for: <${userEmail}> | ${ticker}`
  );
  if (res.acknowledged) {
    console.log(`${res.matchedCount} found. ${res.modifiedCount} modified`);
  } else {
    console.error("Could not set newer Trades to be recalculated!");
    console.error(
      `Please contact adm to trigger recalculation on ${userEmail} - ${ticker} -> $gt: ${tradeDate}`
    );
  }
}

export { insertTrade };
