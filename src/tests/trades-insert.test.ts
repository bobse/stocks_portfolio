import supertest from "supertest";
import { app, API_START_URL } from "../app";
import { setupTestDb } from "./db-handler";
import { Trade } from "../models/trades.schema";
import { setNumDecimals } from "../utils/utils";

setupTestDb();

describe("TRADES API - INSERT", () => {
  describe("INSERT VALID TRADES - 201", () => {
    const validData = {
      date: new Date(),
      ticker: "VALE5",
      price: 20,
      amount: 200,
      userEmail: "test@test.com",
      fees: 0.01,
    };

    test("INSERT ONE VALID TRADE", async () => {
      const res = await supertest(app)
        .post(`${API_START_URL}/trades`)
        .send(validData)
        .expect("Content-Type", /json/)
        .expect(201);
      expect(res.body.currAvgPrice).toStrictEqual(validData.price);
      expect(res.body.currTotalAmount).toStrictEqual(validData.amount);
      expect(await Trade.count({})).toBe(1);
    });

    test("INSERT 3 VALID TRADES SAME TICKER AND GET NEW CURRAVGPRICE AND CURRTOTALAMOUNT", async () => {
      let totalAmount = 0;
      let totalInvested = 0;
      for (let i = 1; i < 4; i++) {
        const newData = { ...validData };
        newData.date = new Date();
        newData.amount = newData.amount * i;
        newData.price = newData.price * i;
        totalInvested += newData.price * newData.amount;
        totalAmount += newData.amount;
        const res = await supertest(app)
          .post(`${API_START_URL}/trades`)
          .send(newData)
          .expect("Content-Type", /json/)
          .expect(201);
        expect(res.body.currAvgPrice).toStrictEqual(
          setNumDecimals(totalInvested / totalAmount)
        );
        expect(res.body.currTotalAmount).toStrictEqual(totalAmount);
      }
      expect(await Trade.count({})).toBe(3);
    });

    test("INSERT TWO TRADES. THAN INSERT A NEW ONE IN BETWEEN.", async () => {
      let totalAmount = 0;
      let totalInvested = 0;
      for (let i = 1; i < 3; i++) {
        const newData = { ...validData };
        newData.date = new Date(new Date().valueOf() + i * 24 * 60 * 60 * 1000);
        newData.price = 100;
        newData.amount = 100;
        totalInvested += newData.price * newData.amount;
        totalAmount += newData.amount;
        const res = await supertest(app)
          .post(`${API_START_URL}/trades`)
          .send(newData)
          .expect("Content-Type", /json/)
          .expect(201);
        expect(res.body.currAvgPrice).toStrictEqual(
          setNumDecimals(totalInvested / totalAmount)
        );
      }
      const newInsertion = { ...validData };
      newInsertion.date = new Date(
        new Date().valueOf() + 1.5 * 24 * 60 * 60 * 1000
      );
      newInsertion.price = 250;
      newInsertion.amount = 200;

      await supertest(app)
        .post(`${API_START_URL}/trades`)
        .send(newInsertion)
        .expect("Content-Type", /json/)
        .expect(201);
      expect(await Trade.count({})).toBe(3);
      // checking all the records in DB
      const records = await Trade.find({}).sort("date");
      const avgPriceRecords = [100, 200, 175];
      const amountRecords = [100, 300, 400];
      records.forEach((record, idx) => {
        expect(record.currAvgPrice).toStrictEqual(avgPriceRecords[idx]);
        expect(record.currTotalAmount).toStrictEqual(amountRecords[idx]);
      });
    });

    test("INSERT TWO TRADES. THAN INSERT A NEW ONE OLDER THAN THE TWO", async () => {
      for (let i = 1; i < 3; i++) {
        const newData = { ...validData };
        newData.date = new Date();
        newData.price = 100 / i;
        newData.amount = 100;
        const res = await supertest(app)
          .post(`${API_START_URL}/trades`)
          .send(newData)
          .expect("Content-Type", /json/)
          .expect(201);
      }
      const newInsertion = { ...validData };
      newInsertion.date = new Date(new Date().valueOf() - 24 * 60 * 60 * 1000);
      newInsertion.price = 50;
      newInsertion.amount = 100;

      await supertest(app)
        .post(`${API_START_URL}/trades`)
        .send(newInsertion)
        .expect("Content-Type", /json/)
        .expect(201);
      expect(await Trade.count({})).toBe(3);
      // checking all the records in DB
      const records = await Trade.find({}).sort("date");
      const avgPriceRecords = [50, 75, 66.67];
      const amountRecords = [100, 200, 300];
      records.forEach((record, idx) => {
        expect(record.currAvgPrice).toStrictEqual(avgPriceRecords[idx]);
        expect(record.currTotalAmount).toStrictEqual(amountRecords[idx]);
      });
    });
  });

  describe("INVALID TRADES - 500", () => {
    test("WRONG DATE", async () => {
      const invalidData = {
        date: "20/20/01",
        ticker: "VALE5",
        price: 20,
        amount: 200,
        userEmail: "test@test.com",
        fees: 0.01,
      };
      const res = await supertest(app)
        .post(`${API_START_URL}/trades`)
        .send(invalidData)
        .expect("Content-Type", /json/)
        .expect(500);
      expect(res.body).toStrictEqual({ error: { date: "Invalid date" } });
      expect(await Trade.count({})).toBe(0);
    });

    test("SAME TRADE TWICE", async () => {
      const invalidData = {
        date: new Date(),
        ticker: "VALE5",
        price: 20,
        amount: 200,
        userEmail: "test@test.com",
        fees: 0.01,
      };
      const expectCode = [201, 500];
      for (let i = 0; i < 2; i++) {
        const res = await supertest(app)
          .post(`${API_START_URL}/trades`)
          .send(invalidData)
          .expect("Content-Type", /json/)
          .expect(expectCode[i]);
        if (i > 1) {
          expect(res.body).toStrictEqual({
            error:
              "Can not insert the same trade again. Please check the datetime",
          });
        }
      }
      expect(await Trade.count({})).toBe(1);
    });

    test("WRONG TICKER AND WRONG DATE", async () => {
      const invalidData = {
        date: "20/20/01",
        ticker: "xyz",
        price: 20,
        amount: 200,
        userEmail: "test@test.com",
        fees: 0.01,
      };
      const res = await supertest(app)
        .post(`${API_START_URL}/trades`)
        .send(invalidData)
        .expect("Content-Type", /json/)
        .expect(500);
      expect(res.body).toStrictEqual({
        error: {
          ticker: "Please provide a valid Ticker Ie. PETR4",
          date: "Invalid date",
        },
      });
      expect(await Trade.count({})).toBe(0);
    });

    test("SELL MORE THAN IN CUSTODY", async () => {
      const invalidData = {
        date: new Date(),
        ticker: "Petr4",
        price: 20,
        amount: -200,
        userEmail: "test@test.com",
        fees: 0.01,
      };
      const res = await supertest(app)
        .post(`${API_START_URL}/trades`)
        .send(invalidData)
        .expect("Content-Type", /json/)
        .expect(500);
      expect(res.body).toStrictEqual({
        error:
          "Total amount can not be negative. Trying to sell more than in custody",
      });
      expect(await Trade.count({})).toBe(0);
    });
  });
});
