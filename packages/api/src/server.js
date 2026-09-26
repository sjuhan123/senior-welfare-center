import http from 'http';
import app from './app.js';
import { mongoConnect } from './server/mongo.js';
import { initSocket } from './server/socket.js';
import { loadWelfareData } from './models/welfares/welfares.model.js';

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
initSocket(server);

async function startServer() {
  await mongoConnect();
  await loadWelfareData();

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
