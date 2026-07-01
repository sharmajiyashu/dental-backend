import { Router, Request, Response } from 'express';
import Enquiry from '../../../models/Enquiry';
import { ResponseWrapper } from '../../responseWrapper';

export default (router: Router) => {
    // GET all enquiries
    router.get('/enquiries', async (req: Request, res: Response) => {
        try {
            const list = await Enquiry.find().sort({ date: -1 });
            return ResponseWrapper.success(res, list);
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // UPDATE enquiry status (Mark Replied)
    router.put('/enquiries/:id/reply', async (req: Request, res: Response) => {
        try {
            const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: 'Replied' }, { new: true });
            if (!enquiry) return ResponseWrapper.error(res, 'Enquiry not found', 404);
            return ResponseWrapper.success(res, enquiry, 'Enquiry marked as replied.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
