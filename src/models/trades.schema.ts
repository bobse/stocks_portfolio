import mongoose from "mongoose";
import { ITradeSchema } from "@routes/interfaces/trades.interfaces";

const priceHelper = {
  setPrice: (num: number): number => {
    return +(Math.round(num * 100) / 100).toFixed(2);
  },
};
const tradesSchema = new mongoose.Schema<ITradeSchema>({
  date: {
    type: Date,
    required: [true, "Please provide a proper date"],
  },
  userEmail: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Email address is required"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    match: [
      /[A-Za-z0-9]{4}[0-9]{1}/,
      "Please provide a valid Ticker Ie. PETR4",
    ],
  },
  price: {
    type: Number,
    required: [true, "Invalid price"],
    min: 0,
    set: priceHelper.setPrice,
  },
  amount: {
    type: Number,
    required: [true, "Invalid amount"],
  },
  fees: {
    type: Number,
    required: [true, "Invalid fee"],
    min: 0,
    set: priceHelper.setPrice,
  },
  profitAndLosses: {
    type: Number,
    set: priceHelper.setPrice,
  },
  currAvgPrice: {
    type: Number,
    set: priceHelper.setPrice,
    required: true,
  },
  currTotalAmount: {
    type: Number,
    required: true,
  },
  valuesUpToDate: {
    type: Boolean,
    required: true,
    default: true,
  },
});

tradesSchema.index({ userEmail: 1, date: 1, ticker: 1 }, { unique: true });
const Trade = mongoose.model<ITradeSchema>("Trade", tradesSchema);

export { Trade };
