/**
 * Helper para resolver URLs de imágenes compatible con Cloudinary y locales
 */

export interface PropertyImageSSR {
  id: string;
  image: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  cloudinaryMetadata?: any;
  propertyId: string;
  isMigrated?: boolean;
}

export interface ResolvedImage extends PropertyImageSSR {
  isCloudinary: boolean;
  optimizedUrl: string;
}

/**
 * Resuelve la URL de una imagen para renderizado SSR
 * Prioriza URLs de Cloudinary sobre locales
 */
export function resolveImage(img: any): ResolvedImage {
  // Si la imagen ya tiene una URL de Cloudinary, usarla
  if (img.cloudinaryUrl) {
    return {
      ...img,
      image: img.cloudinaryUrl,
      isCloudinary: true,
      optimizedUrl: img.cloudinaryUrl,
    };
  }
  
  // Si no, mantener la URL local original
  return {
    ...img,
    image: img.image,
    isCloudinary: false,
    optimizedUrl: img.image,
  };
}

/**
 * Genera URL optimizada para Cloudinary
 */
export function getCloudinaryOptimizedUrl(
  cloudinaryUrl: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: string;
    format?: string;
  } = {}
): string {
  if (!cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl;
  }

  const {
    width,
    height,
    quality = 80,
    crop = 'fill',
    format = 'auto'
  } = options;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (crop) transformations.push(`c_${crop}`);
  if (format) transformations.push(`f_${format}`);

  const baseUrl = cloudinaryUrl.split('/upload/')[0];
  const publicIdWithFolder = cloudinaryUrl.split('/upload/')[1];

  return `${baseUrl}/upload/${transformations.join(',')}/${publicIdWithFolder}`;
}

/**
 * Verifica si una imagen está migrada a Cloudinary
 */
export function isCloudinaryImage(img: any): boolean {
  return !!(img.cloudinaryUrl && img.isMigrated);
}

/**
 * Mapea un array de imágenes resolviendo URLs
 */
export function resolveImages(images: any[]): ResolvedImage[] {
  return images.map(resolveImage);
}