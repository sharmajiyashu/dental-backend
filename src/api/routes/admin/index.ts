import { Router } from 'express';
import users from './users';
import surveys from './surveys';
import enquiries from './enquiries';
import articles from './articles';
import metrics from './metrics';
import media from './media';

export default (router: Router): void => {
    users(router);
    surveys(router);
    enquiries(router);
    articles(router);
    metrics(router);
    media(router);
};
