import { Container } from 'typedi';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import AppLogger from './logger';

export default async ({
  mongoConnection,
  emailClient,
  cloudinaryClient,
}: {
  mongoConnection: typeof mongoose;
  emailClient: nodemailer.Transporter;
  cloudinaryClient: typeof cloudinary;
}): Promise<void> => {
  try {
    Container.set('mongoConnection', mongoConnection);
    Container.set('emailClient', emailClient);
    Container.set('cloudinaryClient', cloudinaryClient);
    AppLogger.info('✌️ Dependency Injector loaded');
  } catch (e) {
    AppLogger.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
