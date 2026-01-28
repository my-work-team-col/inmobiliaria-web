import { db, PropertiesImages } from 'astro:db';
import { cloudinaryService } from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { eq } from 'astro:db';

interface MigrationResult {
  success: boolean;
  totalImages: number;
  migratedImages: number;
  failedImages: number;
  errors: string[];
  cloudinaryUrls: string[];
}

export default async function migrateToCloudinary(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    totalImages: 0,
    migratedImages: 0,
    failedImages: 0,
    errors: [],
    cloudinaryUrls: [],
  };

  console.log('🚀 Starting complete Cloudinary migration...\n');

  try {
    // Get all images that haven't been migrated
    const imagesToMigrate = await db
      .select()
      .from(PropertiesImages)
      .where(eq(PropertiesImages.isMigrated, false));

    result.totalImages = imagesToMigrate.length;
    console.log(`📸 Found ${result.totalImages} images to migrate`);

    if (result.totalImages === 0) {
      console.log('✨ All images already migrated to Cloudinary!');
      return result;
    }

    // Process images in smaller batches to avoid timeouts
    const batchSize = 10;
    for (let i = 0; i < imagesToMigrate.length; i += batchSize) {
      const batch = imagesToMigrate.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(imagesToMigrate.length/batchSize)} (${batch.length} images)`);

      for (const [index, imageRecord] of batch.entries()) {
        try {
          const globalIndex = i + index + 1;
          console.log(`\n[${globalIndex}/${result.totalImages}] 📷 Processing: ${imageRecord.image}`);

          // Check if local file exists
          const localPath = path.join(process.cwd(), 'public', imageRecord.image);
          try {
            await fs.access(localPath);
            console.log(`✅ Local file found: ${path.basename(localPath)}`);
          } catch (error) {
            throw new Error(`Local file not found: ${localPath}`);
          }

          // Upload to Cloudinary
          console.log(`☁️  Uploading to Cloudinary...`);
          
          const uploadResult = await cloudinaryService.uploadFromLocalPath(
            localPath,
            imageRecord.propertyId!,
            globalIndex
          );

          console.log(`✅ Upload successful: ${uploadResult.public_id}`);
          console.log(`🔗 Cloudinary URL: ${uploadResult.secure_url}`);

          // Update database record
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
          result.cloudinaryUrls.push(uploadResult.secure_url);
          console.log(`💾 Database updated successfully`);

          // Rate limiting to avoid Cloudinary API limits
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error: any) {
          const errorMsg = `Failed to migrate image ${imageRecord.id}: ${error.message}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
          result.failedImages++;
        }
      }

      // Small delay between batches
      if (i + batchSize < imagesToMigrate.length) {
        console.log('\n⏸️  Pausing between batches...');
        await new Promise(resolve => setTimeout(resolve, 2000));
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
      console.log('\n🎉 Cloudinary migration completed successfully!');
      console.log('📝 All images are now served from Cloudinary CDN');
      console.log('🚀 Your app is ready for Cloudflare deployment!');
      
      // Show sample Cloudinary URLs
      console.log('\n🔗 Sample Cloudinary URLs:');
      result.cloudinaryUrls.slice(0, 5).forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
      
      if (result.cloudinaryUrls.length > 5) {
        console.log(`  ... and ${result.cloudinaryUrls.length - 5} more`);
      }
    }

    return result;

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Migration failed: ${error.message}`);
    console.error(`🚨 Migration failed: ${error.message}`);
    return result;
  }
}

// Test Cloudinary configuration before migration
export async function testCloudinaryConfig(): Promise<boolean> {
  try {
    console.log('🧪 Testing Cloudinary configuration...');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing Cloudinary environment variables');
    }
    
    console.log('✅ Environment variables configured');
    
    // Test upload with a small existing image
    const testImagePath = path.join(process.cwd(), 'public', 'images', 'properties', 'property-1-1.jpg');
    
    try {
      await fs.access(testImagePath);
      console.log('✅ Test image found');
      
      const testResult = await cloudinaryService.uploadImage(testImagePath, {
        folder: 'test',
        public_id: `test_${Date.now()}`
      });
      
      console.log('✅ Upload test successful: ', testResult.public_id);
      
      // Clean up
      await cloudinaryService.deleteImage(testResult.public_id);
      console.log('✅ Cleanup successful');
      
    } catch (accessError) {
      console.log('⚠️  Test image not found, skipping upload test');
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
  console.log('🌟 Complete Cloudinary Migration Tool');
  console.log('==================================\n');
  
  // Test configuration first
  testCloudinaryConfig()
    .then(testSuccess => {
      if (testSuccess) {
        console.log('\n🚀 Starting migration...\n');
        return migrateToCloudinary();
      } else {
        console.error('\n❌ Please fix Cloudinary configuration before running migration');
        process.exit(1);
      }
    })
    .then(result => {
      console.log('\n' + '='.repeat(50));
      if (result.success) {
        console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
        console.log(`✅ ${result.migratedImages} images migrated to Cloudinary`);
        console.log('📝 Your app is now ready for Cloudflare deployment!');
        console.log('🚀 Run: pnpm build --remote');
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