import mongoose from "mongoose";
import { IIncome, incomeType } from "../types/income.interfaces";
import { setNumDecimals } from "../utils/utils";

const tradesSchema = new mongoose.Schema<IIncome>({
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
  value: {
    type: Number,
    required: [true, "Invalid value. Must be a number bigger than 0"],
    min: 0,
    set: setNumDecimals,
  },
  category: {
    type: String,
    required: true,
    uppercase: true,
    enum: incomeType,
  },
});

const Income = mongoose.model<IIncome>("Income", tradesSchema);

export { Income };
