import dotenv from 'dotenv';
import process from 'process';

const envFound = dotenv.config();
if (!envFound) throw new Error(' ⚠️ No Environment Variable File Found ⚠️ ');

export default {
    port: parseInt(process.env.PORT || '3003', 10),
    auth: {
        secret: process.env.JWT_SECRET || 'dental-healthylife-jwt-secret-key-change-in-production',
        accessExpiry: '24h',
    },
    database: {
        mongo: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dental_healthylife'
        }
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    },
    email: {
        authFrom: process.env.EMAIL_AUTH || 'Healthy Life <jangidkapilyashu@gmail.com>',
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465', 10),
            secure: true,
            auth: {
                user: process.env.SMTP_USER || 'jangidkapilyashu@gmail.com',
                pass: process.env.SMTP_PASS || 'pjqu spte vnpy drtz'
            }
        }
    }
};
