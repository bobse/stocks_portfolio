import supertest from "supertest";
import { app, API_START_URL } from "../app";
import { setupTestDb } from "./db-handler";
import { Trade, priceHelper } from "../models/trades.schema";

setupTestDb();

describe("Trades Api - INSERT", () => {
  describe("Insert VALID Trades - 201", () => {
    const validData = {
      date: new Date(),
      ticker: "VALE5",
      price: 20,
      amount: 200,
      userEmail: "test@test.com",
      fees: 0.01,
    };

    test("Insert one valid trade", async () => {
      const res = await supertest(app)
        .post(`${API_START_URL}/trades`)
        .send(validData)
        .expect("Content-Type", /json/)
        .expect(201);
      expect(res.body.currAvgPrice).toStrictEqual(validData.price);
      expect(res.body.currTotalAmount).toStrictEqual(validData.amount);
      expect(await Trade.count({})).toBe(1);
    });

    test("Insert 3 valid trades same ticker and get new currAvgPrice and currTotalAmount", async () => {
      let totalAmount = 0;
      let totalInvested = 0;
      for (let i = 1; i < 4; i++) {
        validData.date = new Date();
        validData.amount = validData.amount * i;
        validData.price = validData.price * i;
        totalInvested += validData.price * validData.amount;
        totalAmount += validData.amount;
        const res = await supertest(app)
          .post(`${API_START_URL}/trades`)
          .send(validData)
          .expect("Content-Type", /json/)
          .expect(201);
        expect(res.body.currAvgPrice).toStrictEqual(
          priceHelper.setPrice(totalInvested / totalAmount)
        );
        expect(res.body.currTotalAmount).toStrictEqual(totalAmount);
      }
      expect(await Trade.count({})).toBe(3);
    });
    // TODO:
    // Insert third trade to be older than second. Recalculate second inserted trade and make sure first is intact.
    // Insert third trade to be older than first. Recalculate all trades.
  });

  describe("Insert INVALID Trades - 500", () => {
    test("Insert one INVALID trade - WRONG DATE", async () => {
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

    test("Insert SAME trade TWICE", async () => {
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

    test("Insert one INVALID trade - WRONG TICKER and WRONG DATE", async () => {
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
    // TODO:
    // try to sell more than in custody
  });
});
