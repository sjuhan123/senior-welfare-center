import { mongoConnect, mongoDisconnect } from '../server/mongo.js';
import { loadWelfareData } from '../models/welfares/welfares.model.js';

beforeAll(async () => {
  await mongoConnect();
  await loadWelfareData();
});

afterAll(async () => {
  await mongoDisconnect();
});
