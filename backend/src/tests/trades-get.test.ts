jest.mock("../services/auth.ts");
import supertest from "supertest";
import { app, API_START_URL } from "../app";
import { setupTestDb } from "./db-handler";
import { TradesDTO } from "../DTO/trades.dto";
import { insertTrade } from "../models/trades.model";

setupTestDb();

describe("Trades Api", () => {
   const validData: TradesDTO = {
      date: new Date(),
      ticker: "VALE5",
      price: 20,
      //TODO: change userEmail once implent AUTH
      userEmail: "testuser@test.com",
      amount: 200,
      fees: 0.01,
   };

   describe("Get Trades", () => {
      test("Test httpGetAllTrades EMPTY 200", async () => {
         const res = await supertest(app)
            .get(`${API_START_URL}/trades`)
            .expect("Content-Type", /json/)
            .expect(200);
         expect(res.body.pagination.totalCount).toBe(0);
      });

      test("Test httpGetAllTrades 200", async () => {
         const insert = await insertTrade(validData);
         const res = await supertest(app)
            .get(`${API_START_URL}/trades`)
            .expect("Content-Type", /json/)
            .expect(200);
         expect(JSON.stringify(res.body.results[0]._id)).toStrictEqual(
            JSON.stringify(insert._id)
         );
         expect(res.body.pagination.totalCount).toBe(1);
         expect(res.body.pagination.page).toBe(1);
         expect(res.body.pagination.hasNext).toBe(false);
      });

      test("Test httpGetAllTrades Test YEAR/TICKER PARAMS", async () => {
         const insert = await insertTrade(validData);
         const res = await supertest(app)
            .get(`${API_START_URL}/trades/${new Date().getFullYear()}/VALE5`)
            .expect("Content-Type", /json/)
            .expect(200);
         expect(JSON.stringify(res.body.results[0]._id)).toStrictEqual(
            JSON.stringify(insert._id)
         );
         expect(res.body.pagination.totalCount).toBe(1);
         expect(res.body.pagination.page).toBe(1);
         expect(res.body.pagination.hasNext).toBe(false);
      });

      test("Test httpGetAllTrades TEST PAGINATION", async () => {
         await insertTrade(validData);
         const res = await supertest(app)
            .get(`${API_START_URL}/trades/?page=2&limit=25`)
            .expect("Content-Type", /json/)
            .expect(200);
         expect(res.body.results.length).toBe(0);
         expect(res.body.pagination.totalCount).toBe(1);
         expect(res.body.pagination.limit).toBe(25);
         expect(res.body.pagination.page).toBe(2);
         expect(res.body.pagination.hasNext).toBe(false);
         expect(res.body.pagination.hasPrevious).toBe(true);
      });
   });
});
