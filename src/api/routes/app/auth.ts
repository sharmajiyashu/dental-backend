import { Router, Request, Response } from 'express';
import Container from 'typedi';
import { AuthenticationService } from '../../../services/common/AuthenticationService';
import { ResponseWrapper } from '../../responseWrapper';
import { z } from 'zod';

export default (router: Router) => {
    const authService = Container.get(AuthenticationService);

    // Register Patient
    router.post('/auth/register', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                name: z.string().min(2),
                email: z.string().email(),
                mobile: z.string(),
                password: z.string().min(6).optional(),
                age: z.string().optional(),
                gender: z.string().optional(),
                role: z.string().optional()
            });

            const body = schema.parse(req.body);
            const result = await authService.userRegister(body);
            return ResponseWrapper.success(res, { user: result.user, otpCode: result.otpCode }, 'Registration OTP sent to email.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // Login with Email & Password (sends OTP)
    router.post('/auth/login', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                email: z.string(),
                password: z.string().min(6).optional()
            });

            const { email, password } = schema.parse(req.body);
            const result = await authService.userLoginPassword(email, password);
            return ResponseWrapper.success(res, { otpCode: result.otpCode }, 'Verification OTP sent to email.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // Verify OTP and generate token
    router.post('/auth/verify-otp', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                email: z.string(),
                otp: z.string().length(6)
            });

            const { email, otp } = schema.parse(req.body);
            const result = await authService.verifyLoginOtp(email, otp);
            return ResponseWrapper.success(res, result, 'Verification successful.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // Forgot Password
    router.post('/auth/forgot-password', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                email: z.string().email()
            });
            const { email } = schema.parse(req.body);
            const result = await authService.userSendForgotPassword(email);
            return ResponseWrapper.success(res, { otpCode: result.otpCode }, 'Password reset OTP sent to email.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // Reset Password
    router.post('/auth/reset-password', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                email: z.string().email(),
                otp: z.string().length(6),
                password: z.string().min(6)
            });
            const { email, otp, password } = schema.parse(req.body);
            await authService.userResetPassword(email, otp, password);
            return ResponseWrapper.success(res, null, 'Password reset successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
