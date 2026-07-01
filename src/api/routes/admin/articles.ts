import { Router, Request, Response } from 'express';
import Article from '../../../models/Article';
import { ResponseWrapper } from '../../responseWrapper';
import { z } from 'zod';

export default (router: Router) => {
    // CREATE article
    router.post('/articles', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                title: z.string().min(2),
                category: z.enum(['Oral Health', 'Nutrition', 'Fitness', 'Mental Health']),
                readTime: z.string(),
                description: z.string(),
                videoUrl: z.string().optional(),
                imageUrl: z.string().optional(),
                steps: z.array(z.string()).default([])
            });

            const body = schema.parse(req.body);
            const article = new Article(body);
            await article.save();
            return ResponseWrapper.success(res, article, 'Article created successfully.', 210);
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // UPDATE article
    router.put('/articles/:id', async (req: Request, res: Response) => {
        try {
            const schema = z.object({
                title: z.string().optional(),
                category: z.enum(['Oral Health', 'Nutrition', 'Fitness', 'Mental Health']).optional(),
                readTime: z.string().optional(),
                description: z.string().optional(),
                videoUrl: z.string().optional(),
                imageUrl: z.string().optional(),
                steps: z.array(z.string()).optional()
            });

            const body = schema.parse(req.body);
            const article = await Article.findByIdAndUpdate(req.params.id, body, { new: true });
            if (!article) return ResponseWrapper.error(res, 'Article not found', 404);
            return ResponseWrapper.success(res, article, 'Article updated successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    // DELETE article
    router.delete('/articles/:id', async (req: Request, res: Response) => {
        try {
            const article = await Article.findByIdAndDelete(req.params.id);
            if (!article) return ResponseWrapper.error(res, 'Article not found', 404);
            return ResponseWrapper.success(res, null, 'Article deleted successfully.');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
