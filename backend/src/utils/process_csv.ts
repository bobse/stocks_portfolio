import { IncomeUserDTO } from "../DTO/income.dto";
import { validateOrReject } from "class-validator";

async function processIncomeCSV(csvData: string, userEmail: string) {
   const { data, headers } = splitCSVString(csvData);
   const validData: IncomeUserDTO[] = [];
   const invalidLinesinFile: number[] = [];

   for (const idx in data) {
      const line = data[idx];
      if (line.length === headers.length) {
         const obj: any = { userEmail: userEmail };
         line.forEach((value, idx) => {
            Object.assign(obj, { [headers[idx]]: value });
         });

         const dto = new IncomeUserDTO(obj);
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
   const arrayData = csvData.split("\n").map((line) => {
      return line.split(",");
   });
   if (arrayData.length === 0) {
      throw new Error("Invalid file");
   }
   const headers: string[] = arrayData.shift() as string[];
   return { data: arrayData, headers: headers };
}

export { processIncomeCSV };
