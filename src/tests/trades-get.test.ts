import supertest from "supertest";
import { app, API_START_URL } from "../app";
import { setupTestDb } from "./db-handler";

setupTestDb();

describe("Trades Api", () => {
  describe("Get Trades", () => {
    test("Test httpGetAllTrades 200", async () => {
      const res = await supertest(app)
        .get(`${API_START_URL}/trades`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toStrictEqual({ data: "data" });
    });
  });
});
