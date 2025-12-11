import { defineDb, defineTable, column } from 'astro:db';

  const Properties = defineTable({
    columns: {
      id: column.number({ primaryKey: true, unique: true,  }),
      title: column.text(),
      slug: column.text({ unique: true }),
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



  const PropertiesImages = defineTable({
    columns: {
      id: column.number({ primaryKey: true, unique: true,  }),
      propertyId: column.number({ references: () => Properties.columns.id }),
      image: column.text(),
    },
  }); 


// https://astro.build/db/config
export default defineDb({
  tables: {

    Properties,
    PropertiesImages
  }
});
