import { db, Properties, PropertiesImages } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import data from '@/data/properties.json'; 

export default async function seed() {
  const queries: Array<Promise<any>> = [];
  
  console.log("🌱 Starting database seed...");

  try {
    data.forEach((item, index) => {
      // ✅ Validación de campos requeridos
      if (!item.title || !item.slug || !item.code) {
        console.warn(`⚠️  Property ${index + 1} missing required fields (title, slug, or code), skipping...`);
        return;
      }

      const propertyId = uuidv4();

      const property = {
        id: propertyId,
        title: item.title,
        slug: item.slug,
        categories: item.categories,
        isActive: item.isActive ?? true,
        featured: item.featured ?? false,
        // ❌ Removido: gallery (ahora solo en PropertiesImages)
        location: item.location,
        city: item.city,
        neighborhood: item.neighborhood,
        code: item.code,
        description: item.description,
        area: item.area,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        parking: item.parking,
        price: item.price,
        participation: item.participation,
        address: item.address,
        observations: item.observations,
      };

      queries.push(db.insert(Properties).values(property));

      // ✅ Validación de galería antes de insertar imágenes
      if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
        item.gallery.forEach((img, imgIndex) => {
          const image = {
            id: uuidv4(),
            image: img,
            propertyId: propertyId,
            order: imgIndex + 1,  // ✅ Orden de la imagen
            isPrimary: imgIndex === 0,  // ✅ Primera imagen es principal
            alt: `${item.title} - Imagen ${imgIndex + 1}`,  // ✅ Texto alternativo
          };
          queries.push(db.insert(PropertiesImages).values(image));
        });
      } else {
        console.warn(`⚠️  Property "${item.title}" has no images`);
      }
    });

    console.log(`📊 Inserting ${queries.length} records...`);
    await db.batch(queries);
    console.log("✅ Seed completed successfully!");
    console.log(`   - Properties: ${data.length}`);
    console.log(`   - Images: ${queries.length - data.length}`);
    
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  }
}
