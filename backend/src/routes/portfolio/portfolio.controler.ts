import express from "express";
import { GetCurrPortfolio } from "../../models/portfolio.model";
import { IPortfolio } from "../../types/portfolio.interfaces";
import { getStockPrice } from "./stockPrices.helper";
import { setNumDecimals } from "../../utils/utils";
import { IStockPrice } from "../../types/portfolio.interfaces";
import { parseErrorsResponse } from "../../utils/utils";

// TODO: CONSIDER IF WE SHOULD GET STOCKPRICES TODAY IN THE BACKEND OR IN THE FRONTEND FOR FASTER RESPONSE
async function httpGetCurrPortfolio(
   req: express.Request,
   res: express.Response
) {
   try {
      const user = req.user as string;
      const portfolio: IPortfolio[] = await GetCurrPortfolio(user);
      const stocksPricesToday = await Promise.all(
         portfolio.map((elem) => getStockPrice(elem.ticker))
      );
      updatePortfolioWithTodayPrices(portfolio, stocksPricesToday);
      return res.status(200).json(portfolio);
   } catch (err) {
      console.log(err);
      const response = parseErrorsResponse(
         err,
         "Sorry, could not retrieve stock portfolio"
      );
      return res.status(500).json(response);
   }
}

function updatePortfolioWithTodayPrices(
   portfolio: IPortfolio[],
   stocksPricesToday: IStockPrice[]
) {
   portfolio.forEach((trade, idx) => {
      const { priceToday, percentVarToday } = stocksPricesToday[idx];
      let profits = null;
      let profitsPercent = null;
      if (priceToday !== null && percentVarToday !== null) {
         profits = setNumDecimals(
            priceToday * trade.currTotalAmount -
               trade.currAvgPrice * trade.currTotalAmount
         );
         profitsPercent = setNumDecimals(
            (priceToday / trade.currAvgPrice - 1) * 100
         );
      }
      Object.assign(trade, {
         today: {
            percentage: percentVarToday,
            price: priceToday,
         },
         profits: {
            value: profits,
            percentage: profitsPercent,
         },
      });
   });
}
export { httpGetCurrPortfolio };
