import {
   IsEmail,
   Matches,
   IsNumber,
   Min,
   IsDate,
   IsOptional,
} from "class-validator";

class TradesDTO {
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

   @IsNumber(undefined, {
      message: "Not a valid number",
   })
   @Min(0, {
      message: "Number must be bigger than zero",
   })
   price: number;

   @IsNumber(undefined, {
      message: "Not a valid number",
   })
   @Min(0, {
      message: "Number must be bigger than zero",
   })
   fees: number;

   @IsNumber(undefined, {
      message: "Not a valid number",
   })
   amount: number;

   @IsOptional()
   notes: string;

   constructor(data: {
      date: Date;
      userEmail: string;
      ticker: string;
      price: number | string;
      amount: number | string;
      fees: number | string;
      notes: undefined | string;
   }) {
      this.date = new Date(data.date);
      this.userEmail = data.userEmail;
      this.ticker =
         typeof data.ticker === "string"
            ? data.ticker.toUpperCase()
            : data.ticker;
      this.price = +data.price;
      this.amount = +data.amount;
      this.fees = +data.fees;
      this.notes = data.notes !== undefined ? data.notes : "";
   }
}

export { TradesDTO };
