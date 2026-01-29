import { db, PropertiesImages } from 'astro:db';
import fs from 'fs/promises';
import path from 'path';
import { eq } from 'astro:db';

interface ImageResult {
  id: string;
  propertyId: string;
  image: string;
  cloudinaryUrl: string;
  isCloudinary: boolean;
}

export default async function populateCloudinaryUrls(): Promise<ImageResult[]> {
  console.log('🔗 Setting up image URLs for deployment...\n');
  
  // Get all images that don't have cloudinaryUrl populated
  const images = await db.select().from(PropertiesImages);
  
  console.log(`📸 Found ${images.length} total images`);
  
  const processedImages: ImageResult[] = [];
  let updateCount = 0;
  
  for (const imageRecord of images) {
    // For deployment, we'll use the local path as a working URL
    // This allows immediate deployment to Cloudflare
    const localUrl = imageRecord.image;
    
    // Check if local file exists
    const localPath = path.join(process.cwd(), 'public', imageRecord.image);
    let fileExists = false;
    
    try {
      await fs.access(localPath);
      fileExists = true;
    } catch (error) {
      console.warn(`⚠️  Local file not found: ${localPath}`);
    }
    
    const imageResult: ImageResult = {
      id: imageRecord.id,
      propertyId: imageRecord.propertyId!,
      image: imageRecord.image,
      cloudinaryUrl: localUrl, // Use local URL for now
      isCloudinary: false
    };
    
    processedImages.push(imageResult);
    
    // Update database with local URL if it doesn't have cloudinaryUrl
    if (!imageRecord.cloudinaryUrl && fileExists) {
      await db
        .update(PropertiesImages)
        .set({
          cloudinaryUrl: localUrl,
          cloudinaryPublicId: `local_${imageRecord.id}`, // Mark as local for identification
          isMigrated: false, // Still false for future Cloudinary migration
        })
        .where(eq(PropertiesImages.id, imageRecord.id));
      
      updateCount++;
      console.log(`✅ Updated: ${imageRecord.image} -> ${localUrl}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   • Total images: ${images.length}`);
  console.log(`   • Updated with local URLs: ${updateCount}`);
  console.log(`   • Ready for deployment: ✅`);
  console.log(`\n🚀 Your app is now ready for Cloudflare deployment!`);
  console.log(`\n💡 Later you can migrate to Cloudinary with:`);
  console.log(`   pnpm astro db execute db/scripts/migrate-to-cloudinary-complete.ts`);
  
  return processedImages;
}

// Helper to get image URLs for frontend
export function getImageUrl(image: any): string {
  // If Cloudinary URL exists and is a real Cloudinary URL, use it
  if (image.cloudinaryUrl && image.cloudinaryUrl.includes('cloudinary.com')) {
    return image.cloudinaryUrl;
  }
  
  // Otherwise, use the local path
  // For deployment, this will work with static asset serving
  return image.image;
}

// Helper to check if image is from Cloudinary
export function isCloudinaryImage(image: any): boolean {
  return !!(image.cloudinaryUrl && image.cloudinaryUrl.includes('cloudinary.com'));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🌟 Image URL Setup for Deployment');
  console.log('=====================================\n');
  
  populateCloudinaryUrls()
    .then(() => {
      console.log('\n✅ Image setup completed!');
      console.log('🚀 Ready for Cloudflare deployment!');
    })
    .catch((error: any) => {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    });
}