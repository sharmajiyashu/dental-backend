import { Service, Inject } from 'typedi';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import AppLogger from '../../api/loaders/logger';
import { randomUUID } from 'crypto';
import streamifier from 'streamifier';

export interface IMediaResult {
  type: string;
  key: string;
  mimetype: string;
  url: string;
  size?: number;
  width?: number;
  height?: number;
}

@Service()
export class CloudinaryService {
  constructor(@Inject('cloudinaryClient') private readonly cloudinaryClient: typeof cloudinary) {}

  async uploadMedia(
    type: string,
    files: Express.Multer.File[],
    folderPath: string
  ): Promise<IMediaResult[]> {
    const results: IMediaResult[] = [];

    for (const file of files) {
      const result = await this.uploadToCloudinary(file.buffer, folderPath, type);
      
      results.push({
        type: type,
        key: result.public_id,
        mimetype: file.mimetype,
        url: result.secure_url,
        size: result.bytes,
        width: result.width,
        height: result.height
      });
    }

    return results;
  }

  private async uploadToCloudinary(
    buffer: Buffer,
    folder: string,
    type: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryClient.uploader.upload_stream(
        {
          folder: folder,
          resource_type: type === 'video' ? 'video' : 'auto',
          public_id: randomUUID()
        },
        (error, result) => {
          if (error) {
            AppLogger.error('Cloudinary upload error:', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload result is undefined'));
          }
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async deleteMedia(publicIds: string[]): Promise<void> {
    if (publicIds.length === 0) return;
    
    try {
      await Promise.all(
        publicIds.map(id => 
          this.cloudinaryClient.uploader.destroy(id)
        )
      );
    } catch (error) {
      AppLogger.error('Cloudinary delete error:', error);
    }
  }
}
