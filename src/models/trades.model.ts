import { Trade } from "./trades.schema";
import mongoose, { HydratedDocument } from "mongoose";
import { ITradeSchema, INewUserTrade } from "../interfaces/trades.interfaces";

async function insertTrade(data: INewUserTrade) {
  // cant have same trade with exact same dateandtime and user
  // get last trade and compare with the one being saved. If date is more recent than we have to update everything from the inserted record to the last date.
  // Get everything that is more recent and set the flag to valuesUpToDate:False. Then start updating process(To be defined)

  const latestTrade = await getLatestTrade(data.userEmail, data.ticker);
  const trade: HydratedDocument<ITradeSchema> = new Trade({
    ...data,
  });
  if (latestTrade === null || latestTrade.date < trade.date) {
    if (!latestTrade) {
      trade.currAvgPrice = (data.price * data.amount + data.fees) / data.amount;
      trade.currTotalAmount = data.amount;
    } else {
      trade.currTotalAmount = latestTrade.currTotalAmount + data.amount;
      trade.currAvgPrice =
        (data.price * data.amount +
          data.fees +
          latestTrade.currAvgPrice * latestTrade.currTotalAmount) /
        trade.currTotalAmount;
    }
    await trade.save();
    return trade;
  } else {
    console.log("save with flagh valuesUpToDate:false");
  }
}

async function getLatestTrade(userEmail: string, ticker: string) {
  return await Trade.findOne({
    userEmail: userEmail,
    ticker: ticker,
  }).sort("-date");
}

export { insertTrade };
