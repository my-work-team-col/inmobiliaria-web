import { cloudinaryService } from './index';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
<<<<<<< HEAD
=======
import fs from 'fs/promises';
>>>>>>> 1cc2763 (feat: Implement Turso Cloud Data Synchronization Fix)

// Custom timeout function to avoid import issues
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to configure cloudinary with current environment
function ensureCloudinaryConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Define interfaces inline to avoid import issues
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

export interface CloudinaryBatchResult {
  totalImages: number;
  successfulUploads: number;
  failedUploads: number;
  uploadedUrls: Array<{
    id: string;
    url: string;
    publicId: string;
  }>;
  errors: Array<{
    imageId: string;
    error: string;
  }>;
}

/**
 * Batch upload images to Cloudinary with rate limiting and error handling
 */
export class CloudinaryBatchUploader {
  private readonly MAX_CONCURRENT_UPLOADS = 3;
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between uploads
  private readonly MAX_RETRIES = 2;

  /**
   * Upload multiple images in batches
   */
  async uploadImages(
    imageData: Array<{
      id: string;
      propertyId: string;
      imageIndex: number;
      localPath: string;
    }>
  ): Promise<CloudinaryBatchResult> {
    const result: CloudinaryBatchResult = {
      totalImages: imageData.length,
      successfulUploads: 0,
      failedUploads: 0,
      uploadedUrls: [],
      errors: []
    };

    console.log(`🚀 Starting Cloudinary batch upload for ${imageData.length} images...`);

    // Process images in batches to avoid rate limits
    for (let i = 0; i < imageData.length; i += this.MAX_CONCURRENT_UPLOADS) {
      const batch = imageData.slice(i, i + this.MAX_CONCURRENT_UPLOADS);
      
      console.log(`📦 Processing batch ${Math.floor(i / this.MAX_CONCURRENT_UPLOADS) + 1}/${Math.ceil(imageData.length / this.MAX_CONCURRENT_UPLOADS)}`);
      
      // Process current batch concurrently
      const batchPromises = batch.map(async (img) => {
        return this.uploadSingleImageWithRetry(img);
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      // Process batch results
      for (const promiseResult of batchResults) {
        if (promiseResult.status === 'fulfilled' && promiseResult.value) {
          result.successfulUploads++;
          result.uploadedUrls.push({
            id: promiseResult.value.id,
            url: promiseResult.value.url,
            publicId: promiseResult.value.publicId
          });
        } else {
          result.failedUploads++;
          const error = promiseResult.status === 'rejected' ? promiseResult.reason : new Error('Unknown error');
          result.errors.push({
            imageId: batch[batchResults.indexOf(promiseResult)]?.id || 'unknown',
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      // Rate limiting between batches
      if (i + this.MAX_CONCURRENT_UPLOADS < imageData.length) {
        console.log(`⏳ Waiting ${this.RATE_LIMIT_DELAY}ms before next batch...`);
        await delay(this.RATE_LIMIT_DELAY);
      }
    }

    console.log(`✅ Batch upload completed: ${result.successfulUploads}/${result.totalImages} successful`);
    
    return result;
  }

  /**
   * Upload a single image with retry logic
   */
  private async uploadSingleImageWithRetry(
    imageData: {
      id: string;
      propertyId: string;
      imageIndex: number;
      localPath: string;
    }
  ): Promise<{ id: string; url: string; publicId: string } | null> {
    let lastError: Error | null = null;

    // Note: File existence check removed due to potential permission issues in test environment
    // The actual upload will fail if file doesn't exist

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`☁️  [${attempt}/${this.MAX_RETRIES}] Uploading ${path.basename(imageData.localPath)}...`);
        
        const uploadResult: CloudinaryUploadResult = await cloudinaryService.uploadFromLocalPath(
          imageData.localPath,
          imageData.propertyId,
          imageData.imageIndex
        );

        console.log(`✅ Upload successful: ${uploadResult.public_id}`);
        
        return {
          id: imageData.id,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        };

      } catch (error: any) {
        lastError = error as Error;
        console.log(`❌ Upload attempt ${attempt} failed: ${error.message}`);
        
        // Don't retry on authentication errors
        if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
          throw error;
        }

        // Wait before retry (except on last attempt)
        if (attempt < this.MAX_RETRIES) {
          const backoffDelay = this.RATE_LIMIT_DELAY * attempt; // Exponential backoff
          console.log(`⏳ Retrying in ${backoffDelay}ms...`);
          await delay(backoffDelay);
        }
      }
    }

    throw lastError || new Error('Upload failed after maximum retries');
  }

  /**
   * Validate Cloudinary configuration
   */
  async validateConfiguration(): Promise<{ valid: boolean; error?: string }> {
    try {
      // Check environment variables
      if (!process.env.CLOUDINARY_CLOUD_NAME || 
          !process.env.CLOUDINARY_API_KEY || 
          !process.env.CLOUDINARY_API_SECRET) {
        return {
          valid: false,
          error: 'Missing required Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)'
        };
      }

      // Configure cloudinary before testing
      ensureCloudinaryConfig();

      // Test API access with a simple ping
      const testResult = await new Promise<boolean>((resolve, reject) => {
        cloudinary.api.ping((error: any, result: any) => {
          if (error) reject(error);
          else resolve(true);
        });
      });

      return { valid: true };
      
    } catch (error: any) {
      return {
        valid: false,
        error: `Cloudinary configuration error: ${error.message}`
      };
    }
  }

  /**
   * Test upload with a small sample image
   */
  async testUpload(): Promise<{ success: boolean; error?: string }> {
    try {
      // Configure cloudinary before testing
      ensureCloudinaryConfig();

      // Look for a test image
      const testImagePath = path.join(process.cwd(), 'public', 'images', 'properties', 'property-1-1.jpg');
      
      try {
        await fs.access(testImagePath);
      } catch (error) {
        return {
          success: false,
          error: 'Test image not found at expected path'
        };
      }

      const testResult = await cloudinaryService.uploadImage(testImagePath, {
        folder: 'test-seed',
        public_id: `test_${Date.now()}`,
        resource_type: 'image'
      });

      console.log(`✅ Test upload successful: ${testResult.public_id}`);

      // Clean up test image
      await cloudinaryService.deleteImage(testResult.public_id);
      console.log('✅ Test cleanup successful');

      return { success: true };
      
    } catch (error: any) {
      return {
        success: false,
        error: `Test upload failed: ${error.message}`
      };
    }
  }
}

export const cloudinaryBatchUploader = new CloudinaryBatchUploader();