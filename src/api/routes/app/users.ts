/// <reference path="../../../@types/express/index.d.ts" />
import { Router, Request, Response } from 'express';
import User from '../../../models/User';
import { ResponseWrapper } from '../../responseWrapper';
import { z } from 'zod';

export default (router: Router) => {
    // GET user profile
    router.get('/users/profile', async (req: Request, res: Response) => {
        try {
            if (!req.user) return ResponseWrapper.error(res, 'User session missing', 401);
            const user = await User.findById(req.user.id);
            if (!user) return ResponseWrapper.error(res, 'User not found', 404);
            return ResponseWrapper.success(res, user);
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // UPDATE user profile
    router.put('/users/profile', async (req: Request, res: Response) => {
        try {
            if (!req.user) return ResponseWrapper.error(res, 'User session missing', 401);
            const schema = z.object({
                name: z.string().optional(),
                email: z.string().email().optional(),
                mobile: z.string().optional(),
                age: z.string().optional(),
                gender: z.string().optional(),
                role: z.string().optional()
            });

            const body = schema.parse(req.body);
            const user = await User.findByIdAndUpdate(req.user.id, body, { new: true });
            if (!user) return ResponseWrapper.error(res, 'User not found', 404);
            return ResponseWrapper.success(res, user, 'Profile updated successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // LOG daily health metrics (recalculates Health Score)
    router.put('/users/metrics', async (req: Request, res: Response) => {
        try {
            if (!req.user) return ResponseWrapper.error(res, 'User session missing', 401);
            const schema = z.object({
                stepsLogged: z.number().optional(),
                waterLogged: z.number().optional(),
                sleepLogged: z.number().optional(),
                weight: z.number().optional()
            });

            const { stepsLogged, waterLogged, sleepLogged, weight } = schema.parse(req.body);
            const user = await User.findById(req.user.id);
            if (!user) return ResponseWrapper.error(res, 'User not found', 404);

            if (stepsLogged !== undefined) user.stepsLogged = stepsLogged;
            if (waterLogged !== undefined) user.waterLogged = waterLogged;
            if (sleepLogged !== undefined) user.sleepLogged = sleepLogged;
            if (weight !== undefined) user.weight = weight;

            // Recalculate health score (formula: 40% steps, 30% water, 30% sleep)
            const stepsScore = Math.min(1, user.stepsLogged / user.stepsTarget) * 40;
            const waterScore = Math.min(1, user.waterLogged / user.waterTarget) * 30;
            const sleepScore = Math.min(1, user.sleepLogged / user.sleepTarget) * 30;
            user.healthScore = Math.min(100, Math.round(stepsScore + waterScore + sleepScore));

            await user.save();
            return ResponseWrapper.success(res, user, 'Metrics logged and health score updated.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // UPDATE standard reminders
    router.put('/users/reminders', async (req: Request, res: Response) => {
        try {
            if (!req.user) return ResponseWrapper.error(res, 'User session missing', 401);
            const schema = z.object({
                drinkWater: z.boolean().optional(),
                morningWalk: z.boolean().optional(),
                takeMedicine: z.boolean().optional(),
                sleepEarly: z.boolean().optional()
            });

            const body = schema.parse(req.body);
            const user = await User.findById(req.user.id);
            if (!user) return ResponseWrapper.error(res, 'User not found', 404);

            user.reminders = { ...user.reminders, ...body };
            await user.save();
            return ResponseWrapper.success(res, user, 'Reminders updated successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
