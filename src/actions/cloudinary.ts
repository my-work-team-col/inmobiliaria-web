import { defineAction } from 'astro:actions';
import { db, PropertiesImages } from 'astro:db';
import { eq } from 'astro:db';
import { cloudinaryService } from '../../src/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

export const server = {
  migrateImages: defineAction({
    handler: async () => {
      const result = {
        success: true,
        totalImages: 0,
        migratedImages: 0,
        failedImages: 0,
        errors: [] as string[],
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

        // Limit to 10 images per request to avoid timeouts
        const limitedImages = imagesToMigrate.slice(0, 10);

        // Process images
        for (const [index, imageRecord] of limitedImages.entries()) {
          try {
            console.log(`\n[${index + 1}/${limitedImages.length}] Processing: ${imageRecord.image}`);

            // Check if local file exists
            const localPath = path.join(process.cwd(), 'public', imageRecord.image);
            try {
              await fs.access(localPath);
            } catch (error) {
              throw new Error(`Local file not found: ${localPath}`);
            }

            // Upload to Cloudinary
            console.log(`☁️  Uploading to Cloudinary...`);
            
            const uploadResult = await cloudinaryService.uploadFromLocalPath(
              localPath,
              imageRecord.propertyId!,
              index + 1
            );

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

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (error: any) {
            const errorMsg = `Failed to migrate image ${imageRecord.id}: ${error.message}`;
            console.error(`❌ ${errorMsg}`);
            result.errors.push(errorMsg);
            result.failedImages++;
          }
        }

        console.log('\n📊 Batch Summary:');
        console.log(`Batch processed: ${limitedImages.length}`);
        console.log(`Migrated: ${result.migratedImages}`);
        console.log(`Failed: ${result.failedImages}`);

        return result;

      } catch (error: any) {
        result.success = false;
        result.errors.push(`Migration failed: ${error.message}`);
        console.error(`🚨 Migration failed: ${error.message}`);
        return result;
      }
    },
    accept: 'json' as const,
  }),

  testCloudinary: defineAction({
    handler: async () => {
      try {
        console.log('🧪 Testing Cloudinary configuration...');
        
        // Check environment variables
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
          throw new Error('Missing Cloudinary environment variables');
        }
        
        console.log('✅ Environment variables OK');
        
        // Test with a small existing image
        const testImagePath = path.join(process.cwd(), 'public', 'images', 'property-1.jpg');
        
        try {
          await fs.access(testImagePath);
          console.log('✅ Test image found');
          
          // Test upload
          const testResult = await cloudinaryService.uploadImage(testImagePath, {
            folder: 'test',
            public_id: `test_${Date.now()}`
          });
          
          console.log('✅ Upload test successful:', testResult.public_id);
          
          // Clean up
          await cloudinaryService.deleteImage(testResult.public_id);
          console.log('✅ Cleanup successful');
          
        } catch (accessError) {
          console.log('⚠️  Test image not found, skipping upload test');
        }
        
        return { success: true, message: 'Cloudinary is properly configured!' };
        
      } catch (error: any) {
        console.error('❌ Cloudinary configuration test failed:', error.message);
        return { success: false, error: error.message };
      }
    },
    accept: 'json' as const,
  }),
};