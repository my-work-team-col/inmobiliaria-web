import { db, Properties } from 'astro:db';
import data from '@/data/properties.json'; // si tu JSON está en otro path, solo cámbialo

export default async function () {
  // Insertar todos los registros del JSON
  await db.insert(Properties).values(
    data.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      categories: item.categories,
      isActive: item.isActive,
      featured: item.featured,
      gallery: item.gallery,
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
    }))
  );

  console.log("✔ Seed de propiedades insertado correctamente");
}
