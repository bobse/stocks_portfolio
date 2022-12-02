import express from "express";
import { isMongoId, validateOrReject } from "class-validator";
import {
   insertIncome,
   getIncomes,
   getTotalIncomes,
   deleteIncome,
   updateIncome,
} from "../../models/income.model";
import { parseErrorsResponse } from "../../utils/utils";
import { IncomeUserDTO } from "../../DTO/income.dto";
import { validatePagination, yearParamConvert } from "../../utils/validators";

async function httpGetIncomes(req: express.Request, res: express.Response) {
   try {
      const user = req.user as string;
      const ticker = req.params.ticker;
      const year = yearParamConvert(req.params.year);
      if (req.query.category instanceof Array) {
         req.query.category = req.query.category[0];
      }
      const incomeCategory =
         typeof req.query.category === "string"
            ? req.query.category
            : undefined;
      const { limit, page } = validatePagination(
         req.query.limit,
         req.query.page
      );
      const incomes = await getIncomes(
         user,
         ticker,
         incomeCategory,
         year,
         limit,
         page
      );
      return res.status(200).json(incomes);
   } catch (err) {
      const response = parseErrorsResponse(
         err,
         "Could not get list of incomes"
      );
      return res.status(500).json(response);
   }
}

async function httpGetTotalIncomes(
   req: express.Request,
   res: express.Response
) {
   try {
      const user = req.user as string;
      const { ticker } = req.params;
      const year = yearParamConvert(req.params.year);
      const totals = await getTotalIncomes(user, ticker, year);
      return res.status(200).json(totals);
   } catch (err) {
      const response = parseErrorsResponse(
         err,
         "Could not get totals. Please try again"
      );
      return res.status(500).json(response);
   }
}

async function httpInsertIncome(req: express.Request, res: express.Response) {
   try {
      const data = new IncomeUserDTO(req.body);
      Object.assign(data, { userEmail: req.user });
      await validateOrReject(data);
      const income = await insertIncome(data);
      return res.status(201).json(income);
   } catch (err) {
      const response = parseErrorsResponse(
         err,
         "Could not save this new income"
      );
      return res.status(500).json(response);
   }
}

async function httpDeleteIncome(req: express.Request, res: express.Response) {
   try {
      const user = req.user as string;
      if (isMongoId(req.body._id)) {
         const response = await deleteIncome(user, req.body._id);
         if (response) {
            return res.status(204).json();
         } else {
            return res.status(404).json({ error: "Could not find id" });
         }
      } else {
         throw new Error("Must provide a valid Mongo Id for deletion.");
      }
   } catch (err) {
      const response = parseErrorsResponse(
         err,
         "Could not delete this new income"
      );
      return res.status(500).json(response);
   }
}

async function httpUpdateIncome(req: express.Request, res: express.Response) {
   try {
      const data = new IncomeUserDTO(req.body);
      Object.assign(data, { userEmail: req.user });
      await validateOrReject(data);
      const income = await updateIncome(data);
      if (income) {
         return res.status(200).json(income);
      } else {
         return res.status(404).json({ error: "Could not find id" });
      }
   } catch (err) {
      const response = parseErrorsResponse(
         err,
         "Could not delete this new income"
      );
      return res.status(500).json(response);
   }
}

export {
   httpGetIncomes,
   httpInsertIncome,
   httpGetTotalIncomes,
   httpDeleteIncome,
   httpUpdateIncome,
};
