import { Router } from 'express';
import appSubRouter from './app';
import adminSubRouter from './admin';
import { appAuthMiddleware } from '../middleware/appAuthMiddleware';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware';

export default (): Router => {
    const router: Router = Router();

    const appRouter = Router();
    appRouter.use(appAuthMiddleware);
    appSubRouter(appRouter);
    router.use('/app', appRouter);

    const adminRouter = Router();
    adminRouter.use(adminAuthMiddleware);
    adminSubRouter(adminRouter);
    router.use('/admin', adminRouter);

    return router;
};
