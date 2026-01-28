import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Configure Cloudinary with hardcoded values for testing
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
}

export class CloudinaryService {
  async uploadImage(
    fileOrPath: string | Buffer,
    options: any = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload(
          fileOrPath as string,
          {
            folder: 'inmobiliaria/properties',
            resource_type: 'auto',
            transformation: {
              quality: 'auto:good',
              fetch_format: 'auto',
            },
            public_id: `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            invalidate: true,
            ...options,
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
      });

      return result;
    } catch (error: any) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async uploadFromLocalPath(
    localPath: string,
    propertyId: string,
    imageIndex: number
  ): Promise<CloudinaryUploadResult> {
    const publicId = `property_${propertyId}_${imageIndex}_${Date.now()}`;
    
    return this.uploadImage(localPath, {
      public_id: publicId,
      transformation: {
        quality: 'auto:good',
        fetch_format: 'auto',
        crop: 'fill',
        aspect_ratio: '16:9',
      },
    });
  }

  generateOptimizedUrl(
    cloudinaryUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      crop?: string;
      format?: string;
    } = {}
  ): string {
    if (!cloudinaryUrl.includes('cloudinary.com')) {
      return cloudinaryUrl;
    }

    const {
      width,
      height,
      quality = 80,
      crop = 'fill',
      format = 'auto'
    } = options;

    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (crop) transformations.push(`c_${crop}`);
    if (format) transformations.push(`f_${format}`);

    const baseUrl = cloudinaryUrl.split('/upload/')[0];
    const publicIdWithFolder = cloudinaryUrl.split('/upload/')[1];

    return `${baseUrl}/upload/${transformations.join(',')}/${publicIdWithFolder}`;
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
          if (error) reject(error);
          else resolve();
        });
      });
    } catch (error: any) {
      throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
  }
}

export const cloudinaryService = new CloudinaryService();
