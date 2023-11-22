import https from "https";
import app from "./app.js";
import fs from "fs";
import { mongoConnect } from "./server/mongo.js";
import { loadWelfareData } from "./models/welfares.model.js";

const PORT = process.env.PORT || 8000;

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

const server = https.createServer(options, app);

async function startServer() {
  await mongoConnect();
  await loadWelfareData();

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
