import { Router, Request, Response } from 'express';
import Enquiry from '../../../models/Enquiry';
import { ResponseWrapper } from '../../responseWrapper';
import { z } from 'zod';

export default (router: Router) => {
    // POST enquiry
    router.post('/enquiries', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                name: z.string(),
                email: z.string().email(),
                subject: z.string(),
                message: z.string()
            });

            const body = schema.parse(req.body);
            const enquiry = new Enquiry({
                ...body,
                status: 'New',
                date: new Date()
            });

            await enquiry.save();
            return ResponseWrapper.success(res, enquiry, 'Enquiry submitted successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
