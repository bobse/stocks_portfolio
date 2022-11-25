import { incomeType } from "../types/income.interfaces";
import { IsEmail, Matches, IsIn, IsNumber, Min, IsDate } from "class-validator";

class IncomeUserDTO {
  @IsDate({
    message: "Invalid date format",
  })
  date: Date;

  @IsEmail({
    message: "Invalid email address",
  })
  userEmail: string;

  @Matches(/[A-Za-z0-9]{4}[0-9]{1}/, {
    message: "Invalid Ticker",
  })
  ticker: string;

  @IsIn(Object.values(incomeType), {
    message: `Category can only be ${Object.values(incomeType).join(" or ")}`,
  })
  category: string;

  @IsNumber(undefined, {
    message: "Not a valid number",
  })
  @Min(0, {
    message: "Number must be bigger than zero",
  })
  value: number;

  constructor(data: {
    date: Date;
    userEmail: string;
    ticker: string;
    category: string;
    value: string | number;
  }) {
    this.date = new Date(data.date);
    this.userEmail = data.userEmail;
    this.ticker =
      typeof data.ticker === "string" ? data.ticker.toUpperCase() : data.ticker;
    this.category =
      typeof data.category === "string"
        ? data.category.toUpperCase()
        : data.category;
    this.value = +data.value;
  }
}

export { IncomeUserDTO };
