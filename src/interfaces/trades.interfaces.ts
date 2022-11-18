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

interface INewUserTrade {
  date: Date;
  userEmail: string;
  ticker: string;
  price: number;
  amount: number;
  fees: number;
}
export { ITradeSchema, INewUserTrade };
