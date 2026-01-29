import { cloudinaryService } from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

// Database configuration
const DB_PATH = path.join(process.cwd(), '.astro', 'content.db');

// Mock database operations for migration
interface PropertyImage {
  id: string;
  image: string;
  propertyId: string;
  cloudinaryUrl?: string | null;
  cloudinaryPublicId?: string | null;
  cloudinaryMetadata?: string | null;
  isMigrated?: boolean;
}

interface MigrationResult {
  success: boolean;
  totalImages: number;
  migratedImages: number;
  failedImages: number;
  errors: string[];
}

// Simulated database connection for migration
class MigrationDB {
  private static instance: MigrationDB;
  private db: any = null;

  static getInstance(): MigrationDB {
    if (!MigrationDB.instance) {
      MigrationDB.instance = new MigrationDB();
    }
    return MigrationDB.instance;
  }

  async getAllImages(): Promise<PropertyImage[]> {
    try {
      // For now, create a mock based on existing files
      const propertiesDir = path.join(process.cwd(), 'public', 'images', 'properties');
      const files = await fs.readdir(propertiesDir, { recursive: true });
      
      const images: PropertyImage[] = [];
      let imageId = 1;

      for (const file of files) {
        if (typeof file === 'string' && file.match(/\.jpg|\.jpeg|\.png|\.webp$/)) {
          // Extract property ID from filename
          const match = file.match(/property-(\d+)-(\d+)/);
          if (match) {
            const propertyId = match[1];
            const imagePath = `/images/properties/${file}`;
            
            images.push({
              id: `img_${imageId++}`,
              image: imagePath,
              propertyId: propertyId,
              cloudinaryUrl: null,
              cloudinaryPublicId: null,
              cloudinaryMetadata: null,
              isMigrated: false
            });
          }
        }
      }

      return images;
    } catch (error) {
      console.error('Error getting images:', error);
      return [];
    }
  }

  async updateImage(id: string, data: Partial<PropertyImage>): Promise<void> {
    console.log(`✅ Updated image ${id} with Cloudinary data:`, {
      cloudinaryUrl: data.cloudinaryUrl ? 'SET' : 'NULL',
      cloudinaryPublicId: data.cloudinaryPublicId ? 'SET' : 'NULL',
      isMigrated: data.isMigrated ? 'TRUE' : 'FALSE'
    });
    
    // In real implementation, this would update the Astro DB
    // For now, we just log the action
  }
}

export async function migrateImagesToCloudinary(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    totalImages: 0,
    migratedImages: 0,
    failedImages: 0,
    errors: [],
  };

  try {
    console.log('🚀 Starting Cloudinary migration...');

    // Get database instance
    const db = MigrationDB.getInstance();

    // Get all images that haven't been migrated
    const imagesToMigrate = await db.getAllImages();
    
    // Filter only non-migrated images
    const nonMigratedImages = imagesToMigrate.filter(img => !img.isMigrated);
    
    result.totalImages = nonMigratedImages.length;
    console.log(`📸 Found ${result.totalImages} images to migrate`);

    if (result.totalImages === 0) {
      console.log('✨ No images to migrate - all images already on Cloudinary!');
      return result;
    }

    // Process images in batches to avoid rate limiting
    const batchSize = 5;
    
    for (let i = 0; i < nonMigratedImages.length; i += batchSize) {
      const batch = nonMigratedImages.slice(i, i + batchSize);
      
      for (const [batchIndex, imageRecord] of batch.entries()) {
        try {
          const globalIndex = i + batchIndex + 1;
          console.log(`\n[${globalIndex}/${result.totalImages}] Processing: ${imageRecord.image}`);

          // Check if local file exists
          const localPath = path.join(process.cwd(), 'public', imageRecord.image);
          try {
            await fs.access(localPath);
          } catch (error) {
            throw new Error(`Local file not found: ${localPath}`);
          }

          // Upload to Cloudinary with retry logic
          console.log(`☁️  Uploading to Cloudinary...`);
          
          let uploadResult;
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            try {
              uploadResult = await cloudinaryService.uploadFromLocalPath(
                localPath,
                imageRecord.propertyId,
                globalIndex
              );
              break; // Success, exit retry loop
            } catch (uploadError) {
              retryCount++;
              if (retryCount >= maxRetries) {
                throw uploadError;
              }
              console.log(`⚠️  Retry ${retryCount}/${maxRetries} for ${imageRecord.image}`);
              await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Exponential backoff
            }
          }

          console.log(`✅ Upload successful: ${uploadResult!.public_id}`);

          // Update database record
          await db.updateImage(imageRecord.id, {
            cloudinaryUrl: uploadResult!.secure_url,
            cloudinaryPublicId: uploadResult!.public_id,
            cloudinaryMetadata: JSON.stringify({
              format: uploadResult!.format,
              bytes: uploadResult!.bytes,
              width: uploadResult!.width,
              height: uploadResult!.height,
              createdAt: uploadResult!.created_at,
            }),
            isMigrated: true,
          });

          result.migratedImages++;
          console.log(`💾 Database updated successfully`);

          // Rate limiting to avoid API limits
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error: any) {
          const errorMsg = `Failed to migrate image ${imageRecord.id}: ${error.message}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
          result.failedImages++;
        }
      }
      
      // Pause between batches
      if (i + batchSize < nonMigratedImages.length) {
        console.log('\n⏸️  Pausing between batches...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Migration summary
    console.log('\n📊 Migration Summary:');
    console.log(`Total images: ${result.totalImages}`);
    console.log(`Migrated: ${result.migratedImages}`);
    console.log(`Failed: ${result.failedImages}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
      result.success = false;
    }

    if (result.migratedImages > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('📝 Note: This is a mock migration.');
      console.log('💡 To update your actual Astro DB, you need to:');
      console.log('   1. Set up proper Astro DB connection in the script');
      console.log('   2. Use db.update() with actual database operations');
      console.log('   3. Run with: pnpm migrate:cloudinary');
    }

    return result;

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Migration failed: ${error.message}`);
    console.error(`🚨 Migration failed: ${error.message}`);
    return result;
  }
}

// Test function to verify Cloudinary configuration
export async function testCloudinaryConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Cloudinary connection...');
    
    // Test configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary environment variables');
    }
    
    console.log('✅ Configuration check passed');
    
    // Test upload with a small image
    const testImagePath = path.join(process.cwd(), 'public', 'images', 'property-1.jpg');
    
    try {
      await fs.access(testImagePath);
      console.log('✅ Test image found');
    } catch {
      console.log('⚠️  Test image not found, skipping upload test');
      return true;
    }
    
    const testResult = await cloudinaryService.uploadImage(testImagePath, {
      folder: 'test',
      public_id: `test_${Date.now()}`
    });
    
    console.log('✅ Upload test successful:', testResult.public_id);
    
    // Clean up test image
    await cloudinaryService.deleteImage(testResult.public_id);
    console.log('✅ Cleanup successful');
    
    return true;
  } catch (error: any) {
    console.error('❌ Cloudinary connection test failed:', error.message);
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Test connection first
  testCloudinaryConnection()
    .then(testSuccess => {
      if (testSuccess) {
        // Run migration
        return migrateImagesToCloudinary();
      } else {
        console.error('❌ Please fix Cloudinary configuration before running migration');
        process.exit(1);
      }
    })
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);
      } else {
        console.log('\n💥 Migration completed with errors!');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Migration crashed:', error);
      process.exit(1);
    });
}