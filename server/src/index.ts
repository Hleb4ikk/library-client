import express from 'express';

import { appConfig } from '@/appConfig.js';

const app = express();

app.listen(appConfig.port, (error) => {
  if (!error) {
    console.log(`Server started on port - ${appConfig.port}`);
  } else {
    console.log(`Failed to start server: ${error}`);
  }
});
