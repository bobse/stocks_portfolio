interface IPortfolio {
  ticker: string;
  currAvgPrice: number;
  currTotalAmount: number;
  today?: {
    price: number;
    percentage: number;
  };
  profits?: {
    value: number;
    percentage: number;
  };
}

interface IStockPrice {
  ticker: string;
  priceToday: number | null;
  percentVarToday: number | null;
}

export { IPortfolio, IStockPrice };
