import { Router, Request, Response } from 'express';
import User from '../../../models/User';
import { ResponseWrapper } from '../../responseWrapper';

export default (router: Router) => {
    // GET all patients
    router.get('/users', async (req: Request, res: Response) => {
        try {
            const list = await User.find({ userRole: 'patient' }).sort({ registrationDate: -1 });
            return ResponseWrapper.success(res, list);
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // DELETE a patient
    router.delete('/users/:id', async (req: Request, res: Response) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            return ResponseWrapper.success(res, null, 'User deleted successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
