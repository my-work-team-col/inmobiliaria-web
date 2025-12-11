import { db, Properties, PropertiesImages } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import data from '@/data/properties.json'; 


const queries :any =[];

export default async function seed() {
  // Insertar todos los registros del JSON
  
  // await db.insert(Properties).values(
  //   data.map((item) => ({
  //       id: item.id,
  //       title: item.title,
  //       slug: item.slug,
  //       categories: item.categories,
  //       isActive: item.isActive,
  //       featured: item.featured,
  //       gallery: item.gallery,
  //       location: item.location,
  //       city: item.city,
  //       neighborhood: item.neighborhood,
  //       code: item.code,
  //       description: item.description,
  //       area: item.area,
  //       bedrooms: item.bedrooms,
  //       bathrooms: item.bathrooms,
  //       parking: item.parking,
  //       price: item.price,
  //       participation: item.participation,
  //       address: item.address,
  //       observations: item.observations,
  //   }))
  // );







  // console.log("✔ Seed de propiedades insertado correctamente");

  // refactor para insertar las imágenes relacionadas

data.forEach((item) => {
  const property ={
    id: uuidv4(),
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

  };

  queries.push(db.insert(Properties).values(property));

  item.gallery.forEach((img) => {
    const image = {
      id: uuidv4(),
      image: img,
      propertyId: property.id,
    };
    queries.push(db.insert(PropertiesImages).values(image));
  });

  // close forEach
});

await db.batch(queries);

// console.log("✔ Seed de imágenes insertado correctamente");

}
