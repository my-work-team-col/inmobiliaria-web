import { defineDb, defineTable, column, sql } from 'astro:db';

const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    categories: column.json(),     // array de strings
    isActive: column.boolean(),
    featured: column.boolean(),
    location: column.text(),
    city: column.text(),
    neighborhood: column.text(),
    code: column.text({ unique: true }),  // ✅ Ahora único
    description: column.text(),
    area: column.number(),
    bedrooms: column.number(),
    bathrooms: column.number(),
    parking: column.number(),
    price: column.number(),
    participation: column.text(),  // Ej: "100%"
    address: column.text(),
    observations: column.text(),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),  // ✅ Nuevo
    updatedAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),  // ✅ Nuevo
  },
  indexes: {
    cityIdx: { on: ["city"] },
    neighborhoodIdx: { on: ["neighborhood"] },
    featuredIdx: { on: ["featured"] },
    isActiveIdx: { on: ["isActive"] },
    priceIdx: { on: ["price"] },
  }
});

const PropertiesImages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    image: column.text(),
    order: column.number(),  // ✅ Nuevo - orden de la imagen
    isPrimary: column.boolean({ default: false }),  // ✅ Nuevo - imagen principal
    alt: column.text({ optional: true }),  // ✅ Nuevo - texto alternativo
  },
  indexes: {
    propertyIdx: { on: ["propertyId"] },
    orderIdx: { on: ["propertyId", "order"] },
  }
}); 

// https://astro.build/db/config
export default defineDb({
  tables: {
    Properties,
    PropertiesImages
  }
});
