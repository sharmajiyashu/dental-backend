import { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import AppLogger from './logger';
import routes from '../routes';
import { ZodError } from 'zod';

export default (app: Express): void => {
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    AppLogger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      message: 'Dental Tracker Backend is healthy'
    });
  });

  // Mount API Router
  app.use('/v1/api', routes());

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Route not found: ${req.method} ${req.url}`
    });
  });

  // Global Error Handler
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: (error as ZodError).issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const status = error.status || 500;
    const message = error.message || 'Internal server error';

    AppLogger.error(`[Global Error Handler] ${message}`, {
      stack: error.stack,
      path: req.path,
      method: req.method
    });

    res.status(status).json({
      success: false,
      error: message
    });
  });
};
