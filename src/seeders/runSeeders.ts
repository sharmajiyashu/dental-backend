import 'reflect-metadata';
import express from 'express';
import appLoader from '../api/loaders';
import AppLogger from '../api/loaders/logger';

async function run() {
  const app = express();
  await appLoader(app);
  
  AppLogger.info('🚀 Seeding complete! Database is initialized.');
  process.exit(0);
}

run().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
