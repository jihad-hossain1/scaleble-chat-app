import http from 'http';
import SocketService from './service/socket';
import { startConsumerMessage } from './service/kafka';
import dotenv from "dotenv";
import app from "./app"; 

// Load environment variables from .env file
dotenv.config();

async function init() {
  startConsumerMessage();

  const socketService = new SocketService();
  const httpServer = http.createServer(app);
  // const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

  socketService.io.attach(httpServer);

  socketService.initListener();

  httpServer.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening on port ${process.env.PORT || 8000}`);
  });
}

init();