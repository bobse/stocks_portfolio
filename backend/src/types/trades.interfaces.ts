interface ITradeSchema {
   date: Date;
   userEmail: string;
   ticker: string;
   price: number;
   amount: number;
   fees: number;
   profits: {
      value: number;
      percentage: number;
   };
   currAvgPrice: number;
   currTotalAmount: number;
   valuesUpToDate: boolean;
   notes?: string;
}
interface ITotalTrade {
   _id: string;
   totalProfits: number;
   totalCount: number;
}
export { ITradeSchema, ITotalTrade };
