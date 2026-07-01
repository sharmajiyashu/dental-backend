import { Router, Request, Response } from 'express';
import Survey from '../../../models/Survey';
import { ResponseWrapper } from '../../responseWrapper';

export default (router: Router) => {
    // GET all survey responses
    router.get('/surveys', async (req: Request, res: Response) => {
        try {
            const list = await Survey.find().sort({ date: -1 });
            return ResponseWrapper.success(res, list);
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
