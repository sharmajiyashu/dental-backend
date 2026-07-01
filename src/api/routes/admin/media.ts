import { Router, Request, Response } from 'express';
import Container from 'typedi';
import { CloudinaryService } from '../../../services/common/CloudinaryService';
import { MediaService } from '../../../services/common/MediaService';
import upload from '../../middleware/upload';
import { ResponseWrapper } from '../../responseWrapper';

export default (router: Router): void => {
    const cloudinaryService = Container.get(CloudinaryService);
    const mediaService = Container.get(MediaService);

    /**
     * POST /admin/media/upload
     * Upload one or more images (admin panel use - articles, banners, etc.)
     * Field name: "media" (multipart/form-data)
     * Returns: array of { _id, url, mimetype, type, size }
     */
    router.post('/media/upload', upload.array('media', 10), async (req: Request, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return ResponseWrapper.error(res, new Error('No files provided'));
            }

            // Upload to Cloudinary under admin folder
            const uploadResults = await cloudinaryService.uploadMedia(
                'image',
                files,
                'dental-healthylife/admin'
            );

            // Save media records to MongoDB
            const mediaPromises = uploadResults.map(result =>
                mediaService.createMedia({
                    url: result.url,
                    mimetype: result.mimetype,
                    type: 'image',
                    size: result.size,
                    width: result.width,
                    height: result.height,
                })
            );

            const mediaDocs = await Promise.all(mediaPromises);
            const mediaIds = mediaDocs.map(doc => doc._id.toString());

            return ResponseWrapper.success(res, {
                mediaIds,
                media: mediaDocs.map(doc => ({
                    _id: doc._id,
                    url: doc.url,
                    mimetype: doc.mimetype,
                    type: doc.type,
                    size: doc.size,
                    width: doc.width,
                    height: doc.height,
                }))
            }, 'Images uploaded successfully');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });

    /**
     * DELETE /admin/media/:id
     * Delete a media record from DB (Cloudinary cleanup optional).
     */
    router.delete('/media/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await mediaService.deleteMedia(id);
            return ResponseWrapper.success(res, null, 'Media deleted successfully');
        } catch (e: any) {
            return ResponseWrapper.error(res, e);
        }
    });
};
