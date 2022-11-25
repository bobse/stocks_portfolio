interface ITradeSchema {
  date: Date;
  userEmail: string;
  ticker: string;
  price: number;
  amount: number;
  fees: number;
  profitAndLosses: number;
  currAvgPrice: number;
  currTotalAmount: number;
  valuesUpToDate: boolean;
}

export { ITradeSchema };
