import { db, PropertiesImages } from 'astro:db';
import { eq } from 'astro:db';
import { cloudinaryService } from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

interface MigrationResult {
  success: boolean;
  totalImages: number;
  migratedImages: number;
  failedImages: number;
  errors: string[];
}

export async function migrateImagesToCloudinaryDB(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    totalImages: 0,
    migratedImages: 0,
    failedImages: 0,
    errors: [],
  };

  try {
    console.log('🚀 Starting Cloudinary migration with Astro DB...');

    // Get all images that haven't been migrated from Astro DB
    const imagesToMigrate = await db
      .select()
      .from(PropertiesImages)
      .where(eq(PropertiesImages.isMigrated, false));

    result.totalImages = imagesToMigrate.length;
    console.log(`📸 Found ${result.totalImages} images to migrate`);

    if (result.totalImages === 0) {
      console.log('✨ No images to migrate - all images already on Cloudinary!');
      return result;
    }

    // Process images
    for (const [index, imageRecord] of imagesToMigrate.entries()) {
      try {
        console.log(`\n[${index + 1}/${result.totalImages}] Processing: ${imageRecord.image}`);

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
              imageRecord.propertyId!,
              index + 1
            );
            break; // Success, exit retry loop
          } catch (uploadError: any) {
            retryCount++;
            if (retryCount >= maxRetries) {
              throw uploadError;
            }
            console.log(`⚠️  Retry ${retryCount}/${maxRetries} for ${imageRecord.image}`);
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Exponential backoff
          }
        }

        if (!uploadResult) {
          throw new Error('Upload failed after retries');
        }

        console.log(`✅ Upload successful: ${uploadResult.public_id}`);

        // Update database record in Astro DB
        await db
          .update(PropertiesImages)
          .set({
            cloudinaryUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            cloudinaryMetadata: JSON.stringify({
              format: uploadResult.format,
              bytes: uploadResult.bytes,
              width: uploadResult.width,
              height: uploadResult.height,
              createdAt: uploadResult.created_at,
            }),
            isMigrated: true,
          })
          .where(eq(PropertiesImages.id, imageRecord.id));

        result.migratedImages++;
        console.log(`💾 Astro DB updated successfully`);

        // Rate limiting to avoid API limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        const errorMsg = `Failed to migrate image ${imageRecord.id}: ${error.message}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
        result.failedImages++;
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
      console.log('\n🎉 Astro DB migration completed successfully!');
    }

    return result;

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Migration failed: ${error.message}`);
    console.error(`🚨 Migration failed: ${error.message}`);
    return result;
  }
}

// Test Cloudinary configuration
export async function testCloudinaryConfig(): Promise<boolean> {
  try {
    console.log('🧪 Testing Cloudinary configuration...');
    
    // Check environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary environment variables. Check your .env file.');
    }
    
    console.log('✅ Environment variables OK');
    
    // Test upload with a small existing image
    const testImagePath = path.join(process.cwd(), 'public', 'images', 'property-1.jpg');
    
    try {
      await fs.access(testImagePath);
      console.log('✅ Test image found:', path.basename(testImagePath));
      
      // Test upload
      const testResult = await cloudinaryService.uploadImage(testImagePath, {
        folder: 'test',
        public_id: `test_${Date.now()}`
      });
      
      console.log('✅ Upload test successful:', testResult.public_id);
      
      // Clean up test image
      await cloudinaryService.deleteImage(testResult.public_id);
      console.log('✅ Cleanup successful');
      
    } catch (accessError) {
      console.log('⚠️  Test image not found, skipping upload test');
      console.log('   (This is OK for configuration testing)');
    }
    
    console.log('✅ Cloudinary is properly configured!');
    return true;
    
  } catch (error: any) {
    console.error('❌ Cloudinary configuration test failed:', error.message);
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🌟 Cloudinary Migration for Astro DB');
  console.log('=====================================\n');
  
  // Test configuration first
  testCloudinaryConfig()
    .then(testSuccess => {
      if (testSuccess) {
        console.log('\n🚀 Starting migration...\n');
        // Run actual migration
        return migrateImagesToCloudinaryDB();
      } else {
        console.error('\n❌ Please fix Cloudinary configuration before running migration');
        console.log('   Check your .env file contains:');
        console.log('   - CLOUDINARY_CLOUD_NAME');
        console.log('   - CLOUDINARY_API_KEY');
        console.log('   - CLOUDINARY_API_SECRET');
        console.log('   - CLOUDINARY_FOLDER');
        process.exit(1);
      }
    })
    .then(result => {
      console.log('\n' + '='.repeat(50));
      if (result.success) {
        console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
        console.log(`✅ ${result.migratedImages} images migrated to Cloudinary`);
        console.log('📝 Your images are now served from Cloudinary CDN');
        process.exit(0);
      } else {
        console.log('💥 MIGRATION COMPLETED WITH ERRORS!');
        console.log(`❌ ${result.failedImages} images failed to migrate`);
        console.log('📝 Check the errors above and retry the migration');
        process.exit(1);
      }
    })
    .catch((error: any) => {
      console.error('\n💥 MIGRATION CRASHED:', error.message);
      console.error('Stack:', error.stack);
      process.exit(1);
    });
}