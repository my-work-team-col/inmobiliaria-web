import { defineDb, defineTable, column } from 'astro:db';

const Properties = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    slug: column.text(),
    categories: column.json(),     // array de strings
    isActive: column.boolean(),
    featured: column.boolean(),
    gallery: column.json(),        // array de strings
    location: column.text(),
    city: column.text(),
    neighborhood: column.text(),
    code: column.text(),
    description: column.text(),
    area: column.number(),
    bedrooms: column.number(),
    bathrooms: column.number(),
    parking: column.number(),
    price: column.number(),
    participation: column.text(),  // Ej: "100%"
    address: column.text(),
    observations: column.text(),
  },
});


// https://astro.build/db/config
export default defineDb({
  tables: {

    Properties,
  }
});
