import axios from "axios";
import { setNumDecimals } from "../../utils/numDecimals";
import { IStockPrice } from "../../types/portfolio.interfaces";

const yahooApiUrl =
  "https://query1.finance.yahoo.com/v8/finance/chart/<TICKER>.SA?region=BR&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance";

// TODO: IMPLEMENT CACHE HERE
// get from cache. Check date from cache. If its older than Xminutes than delete cache, fetch again and save to cache

async function getStockPrice(ticker: string): Promise<IStockPrice> {
  const url = yahooApiUrl.replace("<TICKER>", ticker);
  const result: IStockPrice = {
    ticker: ticker,
    priceToday: null,
    percentVarToday: null,
  };
  try {
    const res = await axios.get(url, {
      headers: {
        "Content-type": "application/json",
        "Accept-Encoding": "application/json",
      },
    });
    if (res.status !== 200) {
      return result;
    }
    if (res.data) {
      const data = res.data.chart.result[0].meta;
      result.priceToday = data.regularMarketPrice || null;
      if (result.priceToday !== null) {
        result.percentVarToday = setNumDecimals(
          (result.priceToday / data.previousClose - 1) * 100
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
  return result;
}

export { getStockPrice };
