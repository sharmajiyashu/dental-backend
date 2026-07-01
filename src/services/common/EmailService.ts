import { Inject, Service } from 'typedi';
import config from '../../config';
import nodemailer from 'nodemailer';

@Service()
export class EmailService {
  constructor(
    @Inject('emailClient') private emailTransporter: nodemailer.Transporter
  ) { }

  private async asyncSendEmail(options: { to: string; subject: string; htmlBody: string }) {
    try {
      const info = await this.emailTransporter.sendMail({
        from: config.email.authFrom,
        to: options.to,
        subject: options.subject,
        html: options.htmlBody
      });
      console.log('📧 Email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  async sendEmail(options: { to: string; subject: string; htmlBody: string }) {
    try {
      return await this.asyncSendEmail(options);
    } catch (e) {
      console.log('--------------------------------------------------');
      console.log('📧 [FALLBACK MOCK EMAIL]');
      console.log(`From: ${config.email.authFrom}`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log('--------------------------------------------------');
      return { messageId: 'mock-message-id-' + Date.now() };
    }
  }

  async sendAuthOtpEmail(options: { to: string; secret: string; purpose: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET' }) {
    const subject =
      options.purpose === 'REGISTRATION'
        ? 'Verify Your Email - Healthy Life'
        : options.purpose === 'LOGIN'
        ? 'Your Login OTP - Healthy Life'
        : 'Password Reset - Healthy Life';

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0d9488; font-family: sans-serif;">Healthy Life</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
          <h2 style="color: #0f172a; margin-bottom: 20px;">
            ${options.purpose === 'REGISTRATION' ? 'Verify Your Email' : options.purpose === 'LOGIN' ? 'Login Authentication' : 'Reset Your Password'}
          </h2>
          
          <p style="color: #64748b; font-size: 15px; margin-bottom: 30px;">
            Please use the following 6-digit OTP code to complete your action:
          </p>
          
          <div style="background-color: #0d9488; color: white; font-size: 32px; font-weight: 800; padding: 20px; border-radius: 12px; letter-spacing: 6px; display: inline-block; padding-left: 26px; padding-right: 20px; margin: 10px auto;">
            ${options.secret}
          </div>
          
          <p style="color: #94a3b8; font-size: 13px; margin-top: 30px;">
            This verification code is valid for 10 minutes. If you did not request this, you can safely ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 11px;">
          <p>© 2026 Healthy Life. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: options.to,
      subject,
      htmlBody
    });
  }
}
