import { defineDb, defineTable, column, NOW } from 'astro:db';

// ============================================
// TABLA: Categories (Jerarquía 2 niveles)
// ============================================
const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // UUID
    name: column.text(), // "Residencial", "Apartamento"
    slug: column.text({ unique: true }), // "residencial", "apartamento"
    parentId: column.text({ optional: true }), // null = nivel 0 (padre), valor = nivel 1 (hija) - Self-reference
    description: column.text({ optional: true }),
    icon: column.text({ optional: true }), // emoji o nombre de icono
    displayOrder: column.number({ default: 0 }),
    isActive: column.boolean({ default: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

// ============================================
// TABLA: PropertyCategories (Relación Many-to-Many)
// ============================================
const PropertyCategories = defineTable({
  columns: {
    propertyId: column.text({ optional: true, references: () => Properties.columns.id }),
    categoryId: column.text({ optional: true, references: () => Categories.columns.id }),
    isPrimary: column.boolean({ default: false }), // categoría principal de la propiedad
    createdAt: column.date({ default: NOW }),
  },
});

// ============================================
// TABLA: Properties (ACTUALIZADA - Sin campo categories)
// ============================================
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    // ❌ ELIMINADO: categories: column.json(),
    isActive: column.boolean(),
    featured: column.boolean(),
    gallery: column.json(),        // array de strings (mantener por compatibilidad)
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
    transactionType: column.text(), // 'sale' | 'rent' | 'both'
    address: column.text(),
    observations: column.text(),
  },
});

// ============================================
// TABLA: PropertiesImages (Con cambios -> Cloudinary)
// ============================================
const PropertiesImages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ optional: true, references: () => Properties.columns.id }),
    image: column.text(),

    // Campos Cloudinary
    cloudinaryPublicId: column.text({ optional: true }),
    cloudinaryUrl: column.text({ optional: true }),
    cloudinaryMetadata: column.json({ optional: true }),
    isMigrated: column.boolean({ default: false }),
  },
});



// https://astro.build/db/config
export default defineDb({
  tables: {
    Properties,
    PropertiesImages,
    Categories,
    PropertyCategories,
  }
});
