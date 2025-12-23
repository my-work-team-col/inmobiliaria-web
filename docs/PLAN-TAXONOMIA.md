# 📋 Plan de Acción: Categorías, Etiquetas, Atributos y Marca

> Plan detallado para implementar un sistema robusto y escalable de taxonomía de propiedades.

**Fecha de creación:** 2025-12-23  
**Versión:** 1.0.0  
**Estado:** Planificación

---

## 📋 Tabla de Contenidos

1. [Análisis del Estado Actual](#-análisis-del-estado-actual)
2. [Propuesta de Arquitectura](#-propuesta-de-arquitectura)
3. [Diseño de Tablas](#-diseño-de-tablas)
4. [Plan de Implementación](#-plan-de-implementación)
5. [Ejemplos de Uso](#-ejemplos-de-uso)
6. [Migración de Datos](#-migración-de-datos)

---

## 🔍 Análisis del Estado Actual

### Schema Actual

```typescript
// db/config.ts - ESTADO ACTUAL
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    categories: column.json(),  // ❌ PROBLEMA: Array de strings en JSON
    // ...resto de campos
  },
});
```

### Problemas Identificados

| Problema | Impacto | Prioridad |
|----------|---------|-----------|
| **Categorías en JSON** | No se pueden hacer queries eficientes, no hay integridad referencial | 🔴 Alta |
| **Sin etiquetas** | No hay forma de clasificar propiedades por características adicionales | 🟡 Media |
| **Sin atributos dinámicos** | Campos fijos, no escalable para nuevas características | 🟡 Media |
| **Sin marca/desarrollador** | No se puede filtrar por constructor o inmobiliaria | 🟢 Baja |

---

## 🏗️ Propuesta de Arquitectura

### Opción 1: Normalización Completa (Recomendada) ⭐

**Ventajas:**
- ✅ Integridad referencial
- ✅ Queries eficientes
- ✅ Fácil de filtrar y buscar
- ✅ Escalable

**Desventajas:**
- ⚠️ Más tablas (mayor complejidad)
- ⚠️ Joins en queries

### Opción 2: Híbrida (JSON + Tablas)

**Ventajas:**
- ✅ Menos tablas
- ✅ Más simple

**Desventajas:**
- ❌ Queries menos eficientes
- ❌ Difícil de mantener

### **Decisión: Opción 1 - Normalización Completa**

---

## 🗄️ Diseño de Tablas

### 1. Categorías (Categories)

**Propósito:** Clasificación principal de propiedades (Casa, Apartamento, Local, etc.)

```typescript
const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text({ unique: true }),        // "Apartamento", "Casa", "Local"
    slug: column.text({ unique: true }),        // "apartamento", "casa", "local"
    parentId: column.text({                     // ✨ NUEVO: Categoría padre
      optional: true,
      references: () => Categories.columns.id   // Self-reference
    }),
    level: column.number({ default: 0 }),       // 0 = raíz, 1 = hijo, 2 = nieto
    description: column.text({ optional: true }),
    icon: column.text({ optional: true }),      // Nombre del icono
    order: column.number({ default: 0 }),       // Para ordenar en UI
    isActive: column.boolean({ default: true }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
  indexes: {
    slugIdx: { on: ["slug"] },
    parentIdx: { on: ["parentId"] },            // ✨ NUEVO: Índice para búsqueda por padre
    activeIdx: { on: ["isActive"] },
    levelIdx: { on: ["level"] },                // ✨ NUEVO: Índice por nivel
  }
});
```

**Ejemplos de datos con jerarquía:**

```typescript
// Categorías RAÍZ (level 0, parentId = null)
const residencialId = uuid();
const comercialId = uuid();
const terrenosId = uuid();

const rootCategories = [
  { 
    id: residencialId, 
    name: "Residencial", 
    slug: "residencial", 
    parentId: null, 
    level: 0,
    icon: "home", 
    order: 1 
  },
  { 
    id: comercialId, 
    name: "Comercial", 
    slug: "comercial", 
    parentId: null, 
    level: 0,
    icon: "briefcase", 
    order: 2 
  },
  { 
    id: terrenosId, 
    name: "Terrenos", 
    slug: "terrenos", 
    parentId: null, 
    level: 0,
    icon: "map", 
    order: 3 
  },
];

// Categorías HIJAS de "Residencial" (level 1)
const apartamentoId = uuid();
const casaId = uuid();

const residencialChildren = [
  { 
    id: apartamentoId, 
    name: "Apartamento", 
    slug: "apartamento", 
    parentId: residencialId,  // ← Padre: Residencial
    level: 1,
    icon: "building", 
    order: 1 
  },
  { 
    id: casaId, 
    name: "Casa", 
    slug: "casa", 
    parentId: residencialId,  // ← Padre: Residencial
    level: 1,
    icon: "home-modern", 
    order: 2 
  },
  { 
    id: uuid(), 
    name: "Penthouse", 
    slug: "penthouse", 
    parentId: residencialId,  // ← Padre: Residencial
    level: 1,
    icon: "building-skyscraper", 
    order: 3 
  },
  { 
    id: uuid(), 
    name: "Estudio", 
    slug: "estudio", 
    parentId: residencialId,  // ← Padre: Residencial
    level: 1,
    icon: "home-simple", 
    order: 4 
  },
];

// Categorías HIJAS de "Apartamento" (level 2 - sub-categorías)
const apartamentoChildren = [
  { 
    id: uuid(), 
    name: "Apartamento 1 Habitación", 
    slug: "apartamento-1-habitacion", 
    parentId: apartamentoId,  // ← Padre: Apartamento
    level: 2,
    icon: "bed", 
    order: 1 
  },
  { 
    id: uuid(), 
    name: "Apartamento 2 Habitaciones", 
    slug: "apartamento-2-habitaciones", 
    parentId: apartamentoId,  // ← Padre: Apartamento
    level: 2,
    icon: "bed-double", 
    order: 2 
  },
  { 
    id: uuid(), 
    name: "Apartamento 3+ Habitaciones", 
    slug: "apartamento-3-habitaciones", 
    parentId: apartamentoId,  // ← Padre: Apartamento
    level: 2,
    icon: "bed-king", 
    order: 3 
  },
];

// Categorías HIJAS de "Comercial" (level 1)
const comercialChildren = [
  { 
    id: uuid(), 
    name: "Local Comercial", 
    slug: "local-comercial", 
    parentId: comercialId,  // ← Padre: Comercial
    level: 1,
    icon: "store", 
    order: 1 
  },
  { 
    id: uuid(), 
    name: "Oficina", 
    slug: "oficina", 
    parentId: comercialId,  // ← Padre: Comercial
    level: 1,
    icon: "briefcase", 
    order: 2 
  },
  { 
    id: uuid(), 
    name: "Bodega", 
    slug: "bodega", 
    parentId: comercialId,  // ← Padre: Comercial
    level: 1,
    icon: "warehouse", 
    order: 3 
  },
];
```

**Estructura jerárquica resultante:**

```
📁 Residencial (level 0)
  ├── 🏢 Apartamento (level 1)
  │   ├── 🛏️ Apartamento 1 Habitación (level 2)
  │   ├── 🛏️ Apartamento 2 Habitaciones (level 2)
  │   └── 🛏️ Apartamento 3+ Habitaciones (level 2)
  ├── 🏠 Casa (level 1)
  ├── 🏙️ Penthouse (level 1)
  └── 🏘️ Estudio (level 1)

💼 Comercial (level 0)
  ├── 🏪 Local Comercial (level 1)
  ├── 💼 Oficina (level 1)
  └── 📦 Bodega (level 1)

🗺️ Terrenos (level 0)
```

---

### 2. Etiquetas (Tags)

**Propósito:** Características adicionales (Piscina, Parqueadero, Amoblado, etc.)

```typescript
const Tags = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text({ unique: true }),        // "Piscina", "Parqueadero"
    slug: column.text({ unique: true }),        // "piscina", "parqueadero"
    parentId: column.text({                     // ✨ NUEVO: Tag padre
      optional: true,
      references: () => Tags.columns.id         // Self-reference
    }),
    level: column.number({ default: 0 }),       // 0 = raíz, 1 = hijo
    type: column.text(),                        // "amenity", "feature", "condition"
    icon: column.text({ optional: true }),
    color: column.text({ optional: true }),     // Para badges en UI
    isActive: column.boolean({ default: true }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
  indexes: {
    typeIdx: { on: ["type"] },
    parentIdx: { on: ["parentId"] },            // ✨ NUEVO: Índice para búsqueda por padre
    activeIdx: { on: ["isActive"] },
    levelIdx: { on: ["level"] },                // ✨ NUEVO: Índice por nivel
  }
});
```

**Tipos de etiquetas:**
- `amenity` - Amenidades (Piscina, Gym, Portería)
- `feature` - Características (Balcón, Terraza, Vista)
- `condition` - Estado (Nuevo, Remodelado, A estrenar)

**Ejemplos de datos:**
```typescript
[
  // Amenidades
  { id: uuid(), name: "Piscina", slug: "piscina", type: "amenity", icon: "pool", color: "blue" },
  { id: uuid(), name: "Gimnasio", slug: "gimnasio", type: "amenity", icon: "dumbbell", color: "red" },
  { id: uuid(), name: "Portería 24/7", slug: "porteria-24-7", type: "amenity", icon: "shield", color: "green" },
  
  // Características
  { id: uuid(), name: "Balcón", slug: "balcon", type: "feature", icon: "balcony", color: "purple" },
  { id: uuid(), name: "Terraza", slug: "terraza", type: "feature", icon: "deck", color: "orange" },
  { id: uuid(), name: "Vista al Mar", slug: "vista-al-mar", type: "feature", icon: "waves", color: "cyan" },
  
  // Estado
  { id: uuid(), name: "Nuevo", slug: "nuevo", type: "condition", icon: "sparkles", color: "yellow" },
  { id: uuid(), name: "Remodelado", slug: "remodelado", type: "condition", icon: "hammer", color: "gray" },
]
```

---

### 3. Atributos (Attributes)

**Propósito:** Características dinámicas con valores (Piso: 5, Estrato: 4, etc.)

```typescript
const Attributes = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text({ unique: true }),        // "Piso", "Estrato", "Antigüedad"
    slug: column.text({ unique: true }),
    type: column.text(),                        // "number", "text", "boolean", "select"
    unit: column.text({ optional: true }),      // "años", "m²", null
    options: column.json({ optional: true }),   // Para type="select": ["Opción 1", "Opción 2"]
    isRequired: column.boolean({ default: false }),
    isActive: column.boolean({ default: true }),
    order: column.number({ default: 0 }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
  indexes: {
    typeIdx: { on: ["type"] },
    activeIdx: { on: ["isActive"] },
  }
});
```

**Ejemplos de datos:**
```typescript
[
  { id: uuid(), name: "Piso", slug: "piso", type: "number", unit: null },
  { id: uuid(), name: "Estrato", slug: "estrato", type: "select", options: ["1", "2", "3", "4", "5", "6"] },
  { id: uuid(), name: "Antigüedad", slug: "antiguedad", type: "number", unit: "años" },
  { id: uuid(), name: "Administración", slug: "administracion", type: "number", unit: "COP" },
  { id: uuid(), name: "Orientación", slug: "orientacion", type: "select", options: ["Norte", "Sur", "Este", "Oeste"] },
]
```

---

### 4. Marca/Desarrollador (Brands)

**Propósito:** Constructor, inmobiliaria o desarrollador de la propiedad

```typescript
const Brands = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text({ unique: true }),        // "Constructora ABC", "Inmobiliaria XYZ"
    slug: column.text({ unique: true }),
    type: column.text(),                        // "constructor", "inmobiliaria", "desarrollador"
    logo: column.text({ optional: true }),      // URL del logo
    website: column.text({ optional: true }),
    phone: column.text({ optional: true }),
    email: column.text({ optional: true }),
    description: column.text({ optional: true }),
    isActive: column.boolean({ default: true }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
  indexes: {
    typeIdx: { on: ["type"] },
    activeIdx: { on: ["isActive"] },
  }
});
```

**Ejemplos de datos:**
```typescript
[
  {
    id: uuid(),
    name: "Constructora Bolívar",
    slug: "constructora-bolivar",
    type: "constructor",
    website: "https://constructorabolivar.com",
    logo: "/images/brands/bolivar.png"
  },
  {
    id: uuid(),
    name: "Amarilo",
    slug: "amarilo",
    type: "constructor",
    website: "https://amarilo.com.co",
    logo: "/images/brands/amarilo.png"
  },
]
```

---

### 5. Tablas de Relación (Many-to-Many)

#### PropertyCategories
```typescript
const PropertyCategories = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    categoryId: column.text({ references: () => Categories.columns.id }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
  indexes: {
    propertyIdx: { on: ["propertyId"] },
    categoryIdx: { on: ["categoryId"] },
    uniquePair: { on: ["propertyId", "categoryId"], unique: true },
  }
});
```

#### PropertyTags
```typescript
const PropertyTags = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    tagId: column.text({ references: () => Tags.columns.id }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
  indexes: {
    propertyIdx: { on: ["propertyId"] },
    tagIdx: { on: ["tagId"] },
    uniquePair: { on: ["propertyId", "tagId"], unique: true },
  }
});
```

#### PropertyAttributes
```typescript
const PropertyAttributes = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    attributeId: column.text({ references: () => Attributes.columns.id }),
    value: column.text(),                       // Valor como string (se parsea según type)
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
  indexes: {
    propertyIdx: { on: ["propertyId"] },
    attributeIdx: { on: ["attributeId"] },
    uniquePair: { on: ["propertyId", "attributeId"], unique: true },
  }
});
```

#### Actualización de Properties
```typescript
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    // ❌ ELIMINAR: categories: column.json(),
    brandId: column.text({ 
      optional: true,
      references: () => Brands.columns.id 
    }),
    // ...resto de campos sin cambios
  },
  indexes: {
    brandIdx: { on: ["brandId"] },
    // ...resto de índices
  }
});
```

---

## 📅 Plan de Implementación

### Fase 1: Preparación (1-2 días)

#### Paso 1.1: Crear nuevas tablas
- [ ] Crear `Categories` table
- [ ] Crear `Tags` table
- [ ] Crear `Attributes` table
- [ ] Crear `Brands` table
- [ ] Crear tablas de relación

#### Paso 1.2: Seed inicial
- [ ] Seed de categorías básicas
- [ ] Seed de tags comunes
- [ ] Seed de atributos estándar
- [ ] Seed de marcas (opcional)

---

### Fase 2: Migración de Datos (1 día)

#### Paso 2.1: Migrar categorías existentes
```typescript
// Ejemplo de migración
const existingProperties = await db.select().from(Properties);

for (const property of existingProperties) {
  const categories = JSON.parse(property.categories);
  
  for (const categoryName of categories) {
    // Buscar o crear categoría
    let category = await db
      .select()
      .from(Categories)
      .where(eq(Categories.name, categoryName))
      .get();
    
    if (!category) {
      category = await db.insert(Categories).values({
        id: uuidv4(),
        name: categoryName,
        slug: slugify(categoryName),
      }).returning();
    }
    
    // Crear relación
    await db.insert(PropertyCategories).values({
      id: uuidv4(),
      propertyId: property.id,
      categoryId: category.id,
    });
  }
}
```

#### Paso 2.2: Eliminar campo `categories` de Properties
- [ ] Actualizar schema
- [ ] Ejecutar migración
- [ ] Verificar datos

---

### Fase 3: Actualizar Queries (2-3 días)

#### Paso 3.1: Actualizar Astro Actions
```typescript
// Ejemplo: getPropertiesByPage con categorías
const propertiesQuery = sql`
  SELECT 
    p.*,
    (
      SELECT json_group_array(
        json_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'icon', c.icon
        )
      )
      FROM ${PropertyCategories} pc
      JOIN ${Categories} c ON c.id = pc.categoryId
      WHERE pc.propertyId = p.id
    ) AS categories,
    (
      SELECT json_group_array(
        json_object(
          'id', t.id,
          'name', t.name,
          'slug', t.slug,
          'type', t.type,
          'icon', t.icon,
          'color', t.color
        )
      )
      FROM ${PropertyTags} pt
      JOIN ${Tags} t ON t.id = pt.tagId
      WHERE pt.propertyId = p.id
    ) AS tags,
    (
      SELECT json_group_array(image)
      FROM ${PropertiesImages}
      WHERE propertyId = p.id
      LIMIT 2
    ) AS images
  FROM ${Properties} p
  WHERE p.isActive = true
  LIMIT ${limit}
  OFFSET ${offset};
`;
```

#### Paso 3.2: Crear nuevas Actions
- [ ] `getCategoriesWithCount` - Categorías con # de propiedades
- [ ] `getTagsWithCount` - Tags con # de propiedades
- [ ] `filterPropertiesByTaxonomy` - Filtrar por categorías/tags
- [ ] `getBrands` - Listar marcas/desarrolladores

---

### Fase 4: Actualizar Frontend (2-3 días)

#### Paso 4.1: Actualizar tipos TypeScript
```typescript
// src/types/domain/Property.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  type: 'amenity' | 'feature' | 'condition';
  icon?: string;
  color?: string;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  value: string;
  unit?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface PropertyWithTaxonomy extends Property {
  categories: Category[];
  tags: Tag[];
  attributes: Attribute[];
  brand?: Brand;
  images: string[];
}
```

#### Paso 4.2: Actualizar componentes
- [ ] `ListingCard.astro` - Mostrar categorías y tags
- [ ] `PropertyDetails.astro` - Mostrar atributos completos
- [ ] `FilterSidebar.vue` - Filtros por categorías/tags
- [ ] `CategoryBadge.astro` - Componente de badge
- [ ] `TagBadge.astro` - Componente de tag

---

### Fase 5: Testing y Optimización (1-2 días)

- [ ] Testing de queries
- [ ] Verificar performance
- [ ] Agregar índices si es necesario
- [ ] Testing de UI
- [ ] Documentar cambios

---

## 💡 Ejemplos de Uso

### Crear una propiedad con taxonomía completa

```typescript
// 1. Crear la propiedad
const propertyId = uuidv4();
await db.insert(Properties).values({
  id: propertyId,
  title: "Apartamento en El Poblado",
  slug: "apartamento-el-poblado-123",
  brandId: "uuid-constructora-bolivar",
  // ...resto de campos
});

// 2. Asignar categoría
const categoryId = "uuid-apartamento";
await db.insert(PropertyCategories).values({
  id: uuidv4(),
  propertyId,
  categoryId,
});

// 3. Asignar tags
const tags = ["uuid-piscina", "uuid-gimnasio", "uuid-nuevo"];
for (const tagId of tags) {
  await db.insert(PropertyTags).values({
    id: uuidv4(),
    propertyId,
    tagId,
  });
}

// 4. Asignar atributos
await db.insert(PropertyAttributes).values([
  { id: uuidv4(), propertyId, attributeId: "uuid-piso", value: "5" },
  { id: uuidv4(), propertyId, attributeId: "uuid-estrato", value: "6" },
  { id: uuidv4(), propertyId, attributeId: "uuid-administracion", value: "350000" },
]);
```

### Filtrar propiedades por categoría y tags

```typescript
// Buscar apartamentos con piscina y gimnasio
const properties = await db
  .select()
  .from(Properties)
  .innerJoin(PropertyCategories, eq(PropertyCategories.propertyId, Properties.id))
  .innerJoin(Categories, eq(Categories.id, PropertyCategories.categoryId))
  .innerJoin(PropertyTags, eq(PropertyTags.propertyId, Properties.id))
  .innerJoin(Tags, eq(Tags.id, PropertyTags.tagId))
  .where(
    and(
      eq(Categories.slug, "apartamento"),
      inArray(Tags.slug, ["piscina", "gimnasio"])
    )
  );
```

---

## 🔄 Migración de Datos Existentes

### Script de Migración

```typescript
// scripts/migrate-taxonomy.ts
import { db, Properties, Categories, PropertyCategories } from 'astro:db';
import { v4 as uuidv4 } from 'uuid';

async function migrateTaxonomy() {
  console.log("🚀 Iniciando migración de taxonomía...");
  
  // 1. Obtener todas las propiedades
  const properties = await db.select().from(Properties);
  console.log(`📊 Propiedades encontradas: ${properties.length}`);
  
  // 2. Extraer categorías únicas
  const uniqueCategories = new Set<string>();
  for (const property of properties) {
    const categories = JSON.parse(property.categories || "[]");
    categories.forEach((cat: string) => uniqueCategories.add(cat));
  }
  
  console.log(`📋 Categorías únicas: ${uniqueCategories.size}`);
  
  // 3. Crear categorías en la BD
  const categoryMap = new Map<string, string>(); // name -> id
  
  for (const categoryName of uniqueCategories) {
    const categoryId = uuidv4();
    await db.insert(Categories).values({
      id: categoryId,
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      order: 0,
      isActive: true,
    });
    categoryMap.set(categoryName, categoryId);
    console.log(`✅ Categoría creada: ${categoryName}`);
  }
  
  // 4. Crear relaciones PropertyCategories
  let relationsCreated = 0;
  for (const property of properties) {
    const categories = JSON.parse(property.categories || "[]");
    
    for (const categoryName of categories) {
      const categoryId = categoryMap.get(categoryName);
      if (categoryId) {
        await db.insert(PropertyCategories).values({
          id: uuidv4(),
          propertyId: property.id,
          categoryId,
        });
        relationsCreated++;
      }
    }
  }
  
  console.log(`✅ Relaciones creadas: ${relationsCreated}`);
  console.log("🎉 Migración completada!");
}

migrateTaxonomy();
```

---

## 📊 Estimación de Tiempos

| Fase | Duración | Prioridad |
|------|----------|-----------|
| **Fase 1:** Preparación | 1-2 días | 🔴 Alta |
| **Fase 2:** Migración | 1 día | 🔴 Alta |
| **Fase 3:** Queries | 2-3 días | 🟡 Media |
| **Fase 4:** Frontend | 2-3 días | 🟡 Media |
| **Fase 5:** Testing | 1-2 días | 🟢 Baja |
| **TOTAL** | **7-11 días** | - |

---

## ✅ Checklist de Implementación

### Preparación
- [ ] Revisar y aprobar diseño de tablas
- [ ] Crear branch `feature/taxonomy-system`
- [ ] Backup de base de datos actual

### Base de Datos
- [ ] Crear tabla `Categories`
- [ ] Crear tabla `Tags`
- [ ] Crear tabla `Attributes`
- [ ] Crear tabla `Brands`
- [ ] Crear tabla `PropertyCategories`
- [ ] Crear tabla `PropertyTags`
- [ ] Crear tabla `PropertyAttributes`
- [ ] Actualizar tabla `Properties` (agregar `brandId`)
- [ ] Crear seeds iniciales
- [ ] Ejecutar migración de datos
- [ ] Eliminar campo `categories` de `Properties`

### Backend
- [ ] Actualizar tipos TypeScript
- [ ] Actualizar `getPropertiesByPage` Action
- [ ] Crear `getCategoriesWithCount` Action
- [ ] Crear `getTagsWithCount` Action
- [ ] Crear `filterPropertiesByTaxonomy` Action
- [ ] Crear `getBrands` Action
- [ ] Actualizar mapeadores

### Frontend
- [ ] Actualizar interfaces de tipos
- [ ] Crear componente `CategoryBadge`
- [ ] Crear componente `TagBadge`
- [ ] Actualizar `ListingCard`
- [ ] Actualizar `PropertyDetails`
- [ ] Crear `FilterSidebar` (Vue)
- [ ] Crear página de categorías
- [ ] Crear página de tags

### Testing
- [ ] Testing de queries
- [ ] Testing de performance
- [ ] Testing de UI
- [ ] Testing de filtros
- [ ] Verificar migración de datos

### Documentación
- [ ] Actualizar `BASE-DE-DATOS.md`
- [ ] Documentar nuevas Actions
- [ ] Crear guía de uso de taxonomía
- [ ] Actualizar `CHANGELOG-DOCS.md`

---

**Fecha de creación:** 2025-12-23  
**Versión:** 1.0.0  
**Autores:** Didier Méndez & Yorrmi Altamiranda

---

## 🌳 Trabajando con Jerarquías

### Queries para Categorías Jerárquicas

#### 1. Obtener todas las categorías raíz (nivel 0)

```typescript
const rootCategories = await db
  .select()
  .from(Categories)
  .where(isNull(Categories.parentId))
  .orderBy(Categories.order);
```

#### 2. Obtener hijos de una categoría específica

```typescript
const children = await db
  .select()
  .from(Categories)
  .where(eq(Categories.parentId, parentCategoryId))
  .orderBy(Categories.order);
```

#### 3. Obtener categoría con sus hijos (1 nivel)

```typescript
const categoryWithChildren = await db
  .select({
    id: Categories.id,
    name: Categories.name,
    slug: Categories.slug,
    level: Categories.level,
    children: sql`(
      SELECT json_group_array(
        json_object(
          'id', id,
          'name', name,
          'slug', slug,
          'icon', icon,
          'level', level
        )
      )
      FROM ${Categories}
      WHERE parentId = ${Categories.id}
      ORDER BY \`order\`
    )`,
  })
  .from(Categories)
  .where(eq(Categories.id, categoryId));
```

#### 4. Obtener árbol completo de categorías (recursivo)

```typescript
// Función helper para construir árbol
async function getCategoryTree() {
  // 1. Obtener todas las categorías
  const allCategories = await db
    .select()
    .from(Categories)
    .where(eq(Categories.isActive, true))
    .orderBy(Categories.order);
  
  // 2. Construir árbol en memoria
  const categoryMap = new Map();
  const rootCategories = [];
  
  // Crear mapa de categorías
  allCategories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });
  
  // Construir relaciones padre-hijo
  allCategories.forEach(cat => {
    if (cat.parentId === null) {
      rootCategories.push(categoryMap.get(cat.id));
    } else {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children.push(categoryMap.get(cat.id));
      }
    }
  });
  
  return rootCategories;
}
```

#### 5. Obtener ruta completa de una categoría (breadcrumb)

```typescript
async function getCategoryPath(categoryId: string) {
  const path = [];
  let currentId = categoryId;
  
  while (currentId) {
    const category = await db
      .select()
      .from(Categories)
      .where(eq(Categories.id, currentId))
      .get();
    
    if (!category) break;
    
    path.unshift(category); // Agregar al inicio
    currentId = category.parentId;
  }
  
  return path;
}

// Uso:
// const path = await getCategoryPath("uuid-apartamento-2-habitaciones");
// Resultado: [Residencial, Apartamento, Apartamento 2 Habitaciones]
```

#### 6. Filtrar propiedades por categoría (incluyendo subcategorías)

```typescript
async function getPropertiesByCategory(categorySlug: string) {
  // 1. Obtener categoría
  const category = await db
    .select()
    .from(Categories)
    .where(eq(Categories.slug, categorySlug))
    .get();
  
  if (!category) return [];
  
  // 2. Obtener IDs de categoría y todas sus subcategorías
  const categoryIds = [category.id];
  
  // Obtener hijos (nivel 1)
  const children = await db
    .select({ id: Categories.id })
    .from(Categories)
    .where(eq(Categories.parentId, category.id));
  
  categoryIds.push(...children.map(c => c.id));
  
  // Obtener nietos (nivel 2)
  for (const child of children) {
    const grandchildren = await db
      .select({ id: Categories.id })
      .from(Categories)
      .where(eq(Categories.parentId, child.id));
    
    categoryIds.push(...grandchildren.map(c => c.id));
  }
  
  // 3. Buscar propiedades con cualquiera de estas categorías
  const properties = await db
    .select()
    .from(Properties)
    .innerJoin(PropertyCategories, eq(PropertyCategories.propertyId, Properties.id))
    .where(inArray(PropertyCategories.categoryId, categoryIds));
  
  return properties;
}
```

---

### Componente Vue para Árbol de Categorías

```vue
<!-- CategoryTree.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  level: number;
  children: Category[];
}

const categories = ref<Category[]>([]);
const expandedIds = ref<Set<string>>(new Set());

onMounted(async () => {
  // Cargar categorías desde API
  const response = await fetch('/api/categories/tree');
  categories.value = await response.json();
});

function toggleExpand(categoryId: string) {
  if (expandedIds.value.has(categoryId)) {
    expandedIds.value.delete(categoryId);
  } else {
    expandedIds.value.add(categoryId);
  }
}

function isExpanded(categoryId: string) {
  return expandedIds.value.has(categoryId);
}
</script>

<template>
  <div class="category-tree">
    <CategoryNode
      v-for="category in categories"
      :key="category.id"
      :category="category"
      :is-expanded="isExpanded(category.id)"
      @toggle="toggleExpand"
    />
  </div>
</template>

<!-- CategoryNode.vue (componente recursivo) -->
<script setup lang="ts">
interface Props {
  category: Category;
  isExpanded: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['toggle']);
</script>

<template>
  <div class="category-node" :class="`level-${category.level}`">
    <div class="category-header" @click="emit('toggle', category.id)">
      <span v-if="category.children.length > 0" class="expand-icon">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span class="category-icon">{{ category.icon }}</span>
      <span class="category-name">{{ category.name }}</span>
    </div>
    
    <div v-if="isExpanded && category.children.length > 0" class="category-children">
      <CategoryNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :is-expanded="isExpanded"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.category-node {
  margin-left: 0;
}

.level-1 {
  margin-left: 20px;
}

.level-2 {
  margin-left: 40px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.category-header:hover {
  background-color: var(--color-muted);
}

.expand-icon {
  width: 16px;
  font-size: 12px;
}

.category-children {
  margin-top: 4px;
}
</style>
```

---

### Astro Action para Árbol de Categorías

```typescript
// src/actions/getCategoryTree.ts
import { defineAction } from "astro:actions";
import { db, Categories } from "astro:db";
import { eq } from "astro:db";

export const getCategoryTree = defineAction({
  accept: "json",
  
  handler: async () => {
    // 1. Obtener todas las categorías activas
    const allCategories = await db
      .select()
      .from(Categories)
      .where(eq(Categories.isActive, true))
      .orderBy(Categories.order);
    
    // 2. Construir árbol
    const categoryMap = new Map();
    const rootCategories = [];
    
    // Crear mapa
    allCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    
    // Construir relaciones
    allCategories.forEach(cat => {
      if (cat.parentId === null) {
        rootCategories.push(categoryMap.get(cat.id));
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(cat.id));
        }
      }
    });
    
    return rootCategories;
  },
});
```

---

### Beneficios de la Jerarquía

✅ **Organización clara** - Estructura lógica de categorías  
✅ **Navegación intuitiva** - Usuarios pueden explorar por niveles  
✅ **Filtros potentes** - Buscar en categoría padre incluye hijos  
✅ **Escalable** - Fácil agregar nuevas subcategorías  
✅ **SEO mejorado** - URLs jerárquicas (`/residencial/apartamento/2-habitaciones`)  

---

**Última actualización:** 2025-12-23  
**Versión:** 1.1.0 (Agregado soporte de jerarquías)  
**Autores:** Didier Méndez & Yorrmi Altamiranda
