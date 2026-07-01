import { Router, Request, Response } from 'express';
import Survey from '../../../models/Survey';
import User from '../../../models/User';
import { ResponseWrapper } from '../../responseWrapper';
import { z } from 'zod';

export default (router: Router) => {
    // POST survey response
    router.post('/surveys', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                name: z.string().optional().default('Anonymous'),
                age: z.string().optional().default('N/A'),
                gender: z.string().optional().default('N/A'),
                education: z.string().optional().default('N/A'),
                occupation: z.string().optional().default('N/A'),
                answers: z.object({
                    brushFrequency: z.string().optional().default('N/A'),
                    useToothpaste: z.string().optional().default('N/A'),
                    flossFrequency: z.string().optional().default('N/A'),
                    useMouthwash: z.string().optional().default('N/A'),
                    dentistVisits: z.string().optional().default('N/A'),
                    triviaAnswer: z.string().optional().default('N/A')
                }),
                score: z.number(),
                correctCount: z.number(),
                wrongCount: z.number(),
                accuracy: z.number()
            });

            const body = schema.parse(req.body);
            const survey = new Survey({
                ...body,
                date: new Date()
            });

            await survey.save();

            // Sync to User health score if user is logged in
            if (req.user) {
                const user = await User.findById(req.user.id);
                if (user) {
                    // Update user's general health score using average of survey assessment and logged stats
                    user.healthScore = Math.round((user.healthScore + body.score) / 2);
                    await user.save();
                }
            }

            return ResponseWrapper.success(res, survey, 'Assessment submitted successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
