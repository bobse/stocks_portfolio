interface IIncome {
   date: Date;
   userEmail: string;
   ticker: string;
   category: incomeType;
   value: number;
}

enum incomeType {
   interests = "INTERESTS",
   dividends = "DIVIDENDS",
}

interface ITotalIncome {
   _id: string;
   totalInterests: number;
   totalDividends: number;
   totalCount: number;
}

export { IIncome, incomeType, ITotalIncome };
