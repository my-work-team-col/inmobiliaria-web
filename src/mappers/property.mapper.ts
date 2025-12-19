import type { PropertyRow, PropertiesWithImages } from "@/types";

export const mapPropertyRow = (row: PropertyRow): PropertiesWithImages => {
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

    // 🔑 AQUÍ resolvemos el problema de las imágenes
    images: JSON.parse(row.images ?? "[]"),
  };
};
