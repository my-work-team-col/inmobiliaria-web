// src/lib/helpers/resolveImage.ts

// Interfaz para las imágenes en SSR
export interface PropertyImageSSR {
  image: string;
  cloudinaryUrl?: string | null;
}

// Helper para devolver la URL correcta (Cloudinary o local)
export function resolveImage(image: PropertyImageSSR): string {
  // Si ya está migrada a Cloudinary, usar la URL
  if (image.cloudinaryUrl) return image.cloudinaryUrl;

  // Si no, usar la ruta local
  // Evita doble /images/properties/
  if (image.image.startsWith('/images/properties/')) return image.image;

  return `/images/properties/${image.image}`;
}
