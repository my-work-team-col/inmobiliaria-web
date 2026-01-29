import { db, Properties, PropertiesImages, Categories, PropertyCategories } from 'astro:db';
import { eq, like, and } from 'astro:db';

// Helper function to get image URL with fallback
export function getImageUrl(image: any): string {
  // If Cloudinary URL exists and is a real Cloudinary URL, use it
  if (image.cloudinaryUrl && image.cloudinaryUrl.includes('cloudinary.com')) {
    return image.cloudinaryUrl;
  }
  
  // Otherwise, use local path
  // For deployment, this will work with static asset serving
  return image.image;
}

// Helper to check if image is from Cloudinary
export function isCloudinaryImage(image: any): boolean {
  return !!(image.cloudinaryUrl && image.cloudinaryUrl.includes('cloudinary.com'));
}

// Get all properties with their images and categories
export async function getAllProperties(options: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
} = {}) {
  const { page = 1, limit = 10, category, featured, search } = options;
  const offset = (page - 1) * limit;
  
  // Get all properties
  let properties = await db.select().from(Properties);
  
  // Apply filters
  if (featured !== undefined) {
    properties = properties.filter(p => Boolean(p.featured) === featured);
  }
  
  if (search) {
    properties = properties.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    // Get category ID from slug
    const categories = await db.select().from(Categories);
    const targetCategory = categories.find(c => c.slug === category);
    
    if (targetCategory) {
      // Get property-category relationships
      const propertyCategories = await db.select().from(PropertyCategories);
      const propertyIdsWithCategory = propertyCategories
        .filter(pc => pc.categoryId === targetCategory.id)
        .map(pc => pc.propertyId);
      
      properties = properties.filter(p => propertyIdsWithCategory.includes(p.id));
    }
  }
  
  // Get all images
  const allImages = await db.select().from(PropertiesImages);
  
  // Map properties with their images
  const propertiesWithImages = properties.map(property => {
    // Get images for this property
    const propertyImages = allImages
      .filter(img => img.propertyId === property.id)
      .map(img => ({
        id: img.id,
        image: img.image,
        cloudinaryUrl: getImageUrl(img),
        propertyId: property.id,
        isMigrated: img.isMigrated,
        isCloudinary: isCloudinaryImage(img)
      }));
    
    return {
      ...property,
      images: propertyImages
    };
  });
  
  // Apply pagination
  const totalItems = propertiesWithImages.length;
  const paginatedProperties = propertiesWithImages.slice(offset, offset + limit);
  
  return {
    properties: paginatedProperties,
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
}

// Get a single property by ID with images
export async function getPropertyById(id: string) {
  const properties = await db.select().from(Properties);
  const property = properties.find(p => p.id === id);
  
  if (!property) {
    return null;
  }
  
  // Get images for this property
  const allImages = await db.select().from(PropertiesImages);
  const propertyImages = allImages
    .filter(img => img.propertyId === property.id)
    .map(img => ({
      id: img.id,
      image: img.image,
      cloudinaryUrl: getImageUrl(img),
      propertyId: property.id,
      isMigrated: img.isMigrated,
      isCloudinary: isCloudinaryImage(img)
    }));
  
  return {
    ...property,
    images: propertyImages
  };
}

// Get properties by category with images
export async function getPropertiesByCategory(categorySlug: string, options: {
  page?: number;
  limit?: number;
} = {}) {
  return getAllProperties({ ...options, category: categorySlug });
}

// Get featured properties with images
export async function getFeaturedProperties(options: {
  page?: number;
  limit?: number;
} = {}) {
  return getAllProperties({ ...options, featured: true });
}

// Search properties with images
export async function searchProperties(query: string, options: {
  page?: number;
  limit?: number;
} = {}) {
  return getAllProperties({ ...options, search: query });
}