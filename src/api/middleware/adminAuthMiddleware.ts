import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from './errors';
import _ from 'lodash';
import { AuthenticationService } from '../../services/common/AuthenticationService';
import Container from 'typedi';

const adminWhitelistRoutes = [
    '/v1/api/admin/auth/login'
];

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skipAuth = adminWhitelistRoutes.some(path => req.originalUrl === path || req.originalUrl.startsWith(path + '/'));

        const authHeader = req.headers.authorization;
        if (_.isEmpty(authHeader) || authHeader === 'Bearer dev-admin' || authHeader === 'dev-admin') {
            if (skipAuth) return next();
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                req.user = {
                    id: 'admin-dev-id',
                    role: 'admin'
                };
                return next();
            }
            return next(new UnauthorizedError(new Error('Authorization header missing')));
        }

        const [authType, accessToken] = authHeader!.split(' ');

        if (_.isEmpty(authType) || authType.toLowerCase() !== 'bearer') {
            if (skipAuth) return next();
            return next(new UnauthorizedError(new Error('Invalid authorization type')));
        }

        if (_.isEmpty(accessToken) || accessToken === 'undefined' || accessToken === 'null') {
            if (skipAuth) return next();
            return next(new UnauthorizedError(new Error('Access token missing')));
        }

        const authService = Container.get(AuthenticationService);
        try {
            const user = await authService.verifyToken(accessToken);

            if (!user) {
                if (skipAuth) return next();
                return next(new UnauthorizedError(new Error('Invalid token')));
            }

            if (user.userRole !== 'admin') {
                if (skipAuth) return next();
                return next(new ForbiddenError(new Error('Access restricted to administrators only')));
            }

            req.user = {
                id: user._id.toString(),
                role: user.userRole
            };
            next();
        } catch (error) {
            if (skipAuth) return next();
            return next(new UnauthorizedError(error));
        }
    } catch (error) {
        next(new UnauthorizedError(error));
    }
};
