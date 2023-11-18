import request from "supertest";
import { mongoConnect, mongoDisconnect } from "../../server/mongo";
import { loadWelfareData } from "../../models/welfares.model";
import app from "../../app";

describe("Welfares API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadWelfareData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("GET /welfares", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/welfares")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
