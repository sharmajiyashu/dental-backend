import 'reflect-metadata';
import { Express } from 'express';
import express from 'express';
import config from './config';
import AppLogger from './api/loaders/logger';
import appLoader from './api/loaders';

process.on('unhandledRejection', (reason) => {
  AppLogger.error({ name: 'UnhandledRejection', reason });
});

async function startServer() {
  const app: Express = express();
  await appLoader(app);

  return app.listen(config.port, () => {
    AppLogger.info(`👌 Dental Tracker Server Listening on Port: ${config.port}
        **********************************
                 HEALTHY LIFE API
        **********************************
        DB Connection: MongoDB Atlas
        **********************************
        `);
  });
}

startServer()
  .catch(e => {
    AppLogger.error(`Server Failed to Start because ${e.stack}`);
  });
