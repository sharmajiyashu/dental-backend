import { Router, Request, Response } from 'express';
import Article from '../../../models/Article';
import { ResponseWrapper } from '../../responseWrapper';

export default (router: Router) => {
    // FETCH articles (supports category and search query filters)
    router.get('/articles', async (req: Request, res: Response) => {
        try {
            const { category, search } = req.query;
            const filterQuery: any = {};

            if (category && category !== 'All') {
                filterQuery.category = category;
            }

            if (search) {
                filterQuery.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const list = await Article.find(filterQuery);
            return ResponseWrapper.success(res, list);
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // FETCH specific article
    router.get('/articles/:id', async (req: Request, res: Response) => {
        try {
            const art = await Article.findById(req.params.id);
            if (!art) return ResponseWrapper.error(res, 'Article not found', 404);
            return ResponseWrapper.success(res, art);
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
