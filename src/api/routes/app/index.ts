import { Router } from 'express';
import auth from './auth';
import users from './users';
import articles from './articles';
import surveys from './surveys';
import enquiries from './enquiries';
import media from './media';

export default (router: Router): void => {
    auth(router);
    users(router);
    articles(router);
    surveys(router);
    enquiries(router);
    media(router);
};
