import express from "express";
import multer from "multer";
import { validateOrReject } from "class-validator";

async function processUploadRequest(
   req: express.Request,
   res: express.Response,
   DTOValidator: any,
   insertMethod: any
) {
   const user = req.user as string;

   const storage = multer.memoryStorage();

   const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 },
      fileFilter: (req, file, cb) => {
         if (file.mimetype != "text/csv") {
            cb(new Error("Invalid file format. Files must be .csv"));
         }
         cb(null, true);
      },
   }).single("csv_file");

   upload(req, res, async function (err) {
      try {
         if (
            req.file === undefined ||
            req.file?.buffer.toString() === undefined ||
            err
         ) {
            if (err) {
               throw new Error(err.message);
            }
            throw new Error("Invalid file. Please review the guidelines");
         }
         const { validData, invalidLinesinFile } = await processCSV(
            req.file.buffer.toString(),
            user,
            DTOValidator
         );
         let allIncome = [];
         if (insertMethod.name === "insertTrade") {
            for (const data of validData) {
               allIncome.push(await insertMethod(data));
            }
            //   Since for trades we need to process one entrie at time in other to calculate avg price, we need to insert this sequencially.
         } else {
            allIncome = await Promise.all(
               validData.map((data) => insertMethod(data))
            );
         }
         if (allIncome.length === 0) {
            throw new Error(
               "No records were saved. Please review the csv file."
            );
         }
         return res.status(200).json({
            savedCount: allIncome.length,
            invalidLinesinFile: invalidLinesinFile,
         });
      } catch (err: any) {
         return res.status(400).json({ error: err.message });
      }
   });
}

async function processCSV(
   csvData: string,
   userEmail: string,
   DTOValidator: any
): Promise<{ validData: typeof DTOValidator[]; invalidLinesinFile: number[] }> {
   const { data, headers } = splitCSVString(csvData);
   const validData: typeof DTOValidator[] = [];
   const invalidLinesinFile: number[] = [];

   for (const idx in data) {
      const line = data[idx];
      if (line.length === headers.length) {
         const obj: any = { userEmail: userEmail };
         line.forEach((value, idx) => {
            Object.assign(obj, { [headers[idx]]: value });
         });
         // console.log(obj);

         const dto = new DTOValidator(obj);
         try {
            await validateOrReject(dto);
            validData.push(dto);
         } catch (err: any) {
            invalidLinesinFile.push(+idx + 2);
         }
      }
   }
   return { validData, invalidLinesinFile };
}

function splitCSVString(csvData: string): {
   data: string[][];
   headers: string[];
} {
   // first line must be the keys for the csv file
   csvData = csvData.replaceAll("\r", "");
   csvData = csvData.replaceAll('"', "");

   const arrayData = csvData.split("\n").map((line) => {
      return line.split(",");
   });
   if (arrayData.length === 0) {
      throw new Error("Invalid file");
   }
   const headers: string[] = arrayData.shift() as string[];
   return { data: arrayData, headers: headers };
}

export { processUploadRequest };
