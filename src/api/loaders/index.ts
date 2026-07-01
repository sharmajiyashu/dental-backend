import { Express } from 'express';
import expressLoader from './express';
import dbLoader from './db';
import dependencyInjector from './di';
import smtpLoader from './smtp';
import cloudinaryLoader from './cloudinary';
import AppLogger from './logger';

export default async (expressApp: Express): Promise<void> => {
    const mongoConnection = await dbLoader();
    const emailClient = await smtpLoader();
    const cloudinaryClient = await cloudinaryLoader();

    // Auto-seeding default articles if needed
    try {
        const { seedArticles } = await import('../../seeders/ArticleSeeder');
        await seedArticles();
    } catch (err) {
        AppLogger.error('❌ Failed to run Article auto-seeder:', err);
    }

    await dependencyInjector({
        mongoConnection,
        emailClient,
        cloudinaryClient,
    });

    expressLoader(expressApp);
    AppLogger.info('✌️ Express Loaded Successfully');
};
