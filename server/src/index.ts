import express from "express";

import { appConfig } from "@/appConfig.js";
import { errorHandler } from "./middleware/error.handler.js";

const app = express();

app.use(errorHandler);

app.listen(appConfig.port, (error) => {
  if (!error) {
    console.log(`Server started on port - ${appConfig.port}`);
  } else {
    console.log(`Failed to start server: ${error}`);
  }
});
