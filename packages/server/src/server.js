import http from 'http';
import app from './app.js';
import { mongoConnect } from './server/mongo.js';
import { loadWelfareData } from './models/welfares.model.js';

const PORT = process.env.PORT || 8000;

// http.createServer를 사용하여 HTTP 서버를 생성합니다.
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadWelfareData();

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
