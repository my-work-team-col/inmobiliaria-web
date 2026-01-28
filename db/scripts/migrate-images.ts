import { uploadImage } from '@/lib/cloudinary/index';
import { db, PropertiesImages } from 'astro:db';
import path from 'path';
import { eq } from 'astro:db';

export async function migrateImages() {
  const images = await db.select().from(PropertiesImages);

  for (const image of images) {
    if (!image.propertyId) continue; // evita null

    const localPath = path.join(process.cwd(), 'public', image.image);

    try {
      const result: any = await uploadImage(localPath, image.propertyId);

      await db.update(PropertiesImages)
        .set({
          cloudinaryUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          cloudinaryMetadata: result,
          isMigrated: true,
        })
        .where(eq(PropertiesImages.id, image.id));

      console.log(`✅ Migrated: ${image.image}`);
    } catch (error) {
      console.error(`❌ Failed: ${image.image}`, error);
    }
  }
}

if (require.main === module) {
  migrateImages().then(() => console.log('🌟 Migration complete')).catch(console.error);
}
