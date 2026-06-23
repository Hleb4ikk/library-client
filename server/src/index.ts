import express from "express";
import { appConfig } from "@/appConfig.js";
import { errorHandler } from "./middleware/error.handler.js";
import apiRouter from "./routes/index.js";
import { createServer } from 'http';
import { wsService } from './services/ws.service.js';

const app = express();
const httpServer = createServer(app);

app.use(express.json());

app.use('/api', apiRouter);

app.use(errorHandler);

wsService.init(httpServer);

httpServer.listen(appConfig.port, () => {
  console.log(`Server started on port - ${appConfig.port}`);
}).on('error', (error) => {
  console.log(`Failed to start server: ${error}`);
});
