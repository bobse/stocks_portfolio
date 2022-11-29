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

export { IIncome, incomeType };
