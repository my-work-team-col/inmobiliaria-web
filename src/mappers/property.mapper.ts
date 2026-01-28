import type { PropertyRow, PropertiesWithImages } from "@/types";
import { getImageUrl, isCloudinaryImage } from "@/lib/db/propertyQueries";

export const mapPropertyRow = (row: PropertyRow): PropertiesWithImages => {
  // Parse images from JSON string and map to proper format
  const rawImages = JSON.parse(row.images ?? "[]");
  
  // Map images to include proper URL resolution
  const mappedImages = rawImages.map((img: any) => ({
    id: img.id,
    image: img.image,
    cloudinaryUrl: getImageUrl(img),
    propertyId: img.propertyId || row.id,
    isMigrated: img.isMigrated || false,
    isCloudinary: isCloudinaryImage(img)
  }));

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,

    categories: JSON.parse(row.categories ?? "[]"),
    // gallery: JSON.parse(row.gallery ?? "[]"),

    location: row.location,
    city: row.city,
    neighborhood: row.neighborhood,
    code: row.code,
    description: row.description,

    area: row.area,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parking: row.parking,
    price: row.price,

    participation: row.participation,
    address: row.address,
    observations: row.observations,

    featured: Boolean(row.featured),
    isActive: Boolean(row.isActive),

    // ✅ FIXED: Images now properly mapped with URL resolution
    images: mappedImages,
  };
};
