import 'reflect-metadata';
import express, { Express } from 'express';
import appLoader from '../src/api/loaders';

const app: Express = express();

// Boot the app loader (MongoDB, Cloudinary, DI, Express middleware/routes)
let isReady = false;

const init = appLoader(app).then(() => {
  isReady = true;
});

// Export the Express app as a Vercel serverless handler
export default async function handler(req: any, res: any) {
  if (!isReady) {
    await init;
  }
  app(req, res);
}
