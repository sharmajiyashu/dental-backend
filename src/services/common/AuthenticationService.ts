import { Inject, Service } from "typedi";
import mongoose from "mongoose";
import User, { IUser } from '../../models/User';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import config from "../../config";
import { EmailService } from "./EmailService";
import { addMinutes } from "date-fns";

@Service()
export class AuthenticationService {
    constructor(
        @Inject('mongoConnection') private mongoConnection: typeof mongoose,
        @Inject() private emailService: EmailService,
    ) { }

    private generateToken(userId: string, role: string): string {
        const payload = { userId, role };
        const secret = config.auth.secret;
        return jwt.sign(payload, secret, { expiresIn: config.auth.accessExpiry as any }) as string;
    }

    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async verifyToken(token: string): Promise<IUser | null> {
        try {
            const decoded = jwt.verify(token, config.auth.secret) as { userId: string; role: string };
            return await User.findById(decoded.userId);
        } catch (e) {
            return null;
        }
    }

    async userRegister(data: {
        name: string;
        email: string;
        mobile: string;
        password?: string;
        age?: string;
        gender?: string;
        role?: string;
    }): Promise<{ user: IUser; otpCode: string }> {
        const email = data.email.trim().toLowerCase();
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email address already registered');
        }

        const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
        const otp = this.generateOTP();

        const newUser = new User({
            name: data.name,
            email,
            mobile: data.mobile,
            password: hashedPassword,
            userRole: 'patient',
            age: data.age || '24',
            gender: data.gender || 'Male',
            role: data.role || 'Student',
            otpCode: otp,
            otpExpiresAt: addMinutes(new Date(), 10)
        });

        await newUser.save();
        await this.emailService.sendAuthOtpEmail({
            to: email,
            secret: otp,
            purpose: 'REGISTRATION'
        });

        return { user: newUser, otpCode: otp };
    }

    async userLoginPassword(email: string, password?: string): Promise<{ token?: string; user: IUser; requireOtp: boolean; otpCode?: string }> {
        const val = email.trim();
        const user = await User.findOne({
            $or: [
                { email: val.toLowerCase() },
                { mobile: val },
                { name: { $regex: new RegExp(`^${val}$`, 'i') } }
            ]
        });

        if (!user) {
            throw new Error('User not found. Please register first.');
        }

        if (password && user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }
        }

        // Generate and send login OTP code
        const otp = this.generateOTP();
        user.otpCode = otp;
        user.otpExpiresAt = addMinutes(new Date(), 10);
        await user.save();

        await this.emailService.sendAuthOtpEmail({
            to: user.email,
            secret: otp,
            purpose: 'LOGIN'
        });

        return { user, requireOtp: true, otpCode: otp };
    }

    async verifyLoginOtp(email: string, otp: string): Promise<{ token: string; user: IUser }> {
        const val = email.trim();
        const user = await User.findOne({
            $or: [
                { email: val.toLowerCase() },
                { mobile: val },
                { name: { $regex: new RegExp(`^${val}$`, 'i') } }
            ]
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.otpCode || user.otpCode !== otp) {
            throw new Error('Invalid verification code');
        }

        if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
            throw new Error('Verification code has expired');
        }

        // Clear OTP
        user.otpCode = undefined;
        user.otpExpiresAt = undefined;
        user.lastLoginAt = new Date();
        await user.save();

        const token = this.generateToken(user._id.toString(), user.userRole);
        return { token, user };
    }

    async userSendForgotPassword(email: string): Promise<{ otpCode: string }> {
        email = email.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('No user associated with this email address');
        }

        const otp = this.generateOTP();
        user.otpCode = otp;
        user.otpExpiresAt = addMinutes(new Date(), 10);
        await user.save();

        await this.emailService.sendAuthOtpEmail({
            to: email,
            secret: otp,
            purpose: 'PASSWORD_RESET'
        });

        return { otpCode: otp };
    }

    async userResetPassword(email: string, otp: string, newPassword?: string): Promise<void> {
        email = email.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.otpCode || user.otpCode !== otp) {
            throw new Error('Invalid verification code');
        }

        if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
            throw new Error('Verification code has expired');
        }

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }
        user.otpCode = undefined;
        user.otpExpiresAt = undefined;
        await user.save();
    }
}
