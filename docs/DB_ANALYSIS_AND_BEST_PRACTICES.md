# 🗄️ Análisis de Base de Datos y Mejores Prácticas - Astro DB

> **Informe Técnico Completo**  
> Análisis del estado actual de la base de datos, problemas identificados, mejores prácticas y recomendaciones de mejora.

**Fecha:** 2025-12-15  
**Versión:** 1.0.0  
**Autor:** Análisis técnico del proyecto

---

## 📋 Tabla de Contenidos

1. [Estado Actual de la Base de Datos](#estado-actual)
2. [Análisis del Schema](#análisis-del-schema)
3. [Análisis del Seed](#análisis-del-seed)
4. [Análisis de los Endpoints API](#análisis-de-endpoints)
5. [Problemas Críticos Identificados](#problemas-críticos)
6. [Mejores Prácticas Recomendadas](#mejores-prácticas)
7. [Plan de Acción Priorizado](#plan-de-acción)
8. [Ejemplos de Implementación](#ejemplos-de-implementación)

---

## 🎯 Estado Actual

### Resumen Ejecutivo

El proyecto utiliza **Astro DB** (SQLite) con una arquitectura SSR bien implementada. La base de datos tiene:

- ✅ **2 tablas**: `Properties` y `PropertiesImages`
- ✅ **20 propiedades** de prueba (datos realistas de Bogotá)
- ✅ **UUIDs** como primary keys (excelente decisión)
- ✅ **Relación 1:N** entre propiedades e imágenes
- ✅ **API REST** con 2 endpoints funcionales

**Calificación general:** ⭐⭐⭐⭐☆ (4/5)

### Tecnologías Utilizadas

```
Astro DB v0.18.3 (SQLite)
UUID v13.0.0
TypeScript 5.x
```

---

## 📊 Análisis del Schema

### Tabla: Properties

**Ubicación:** `db/config.ts`

```typescript
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    categories: column.json(),
    isActive: column.boolean(),
    featured: column.boolean(),
    gallery: column.json(),
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
    participation: column.text(),
    address: column.text(),
    observations: column.text(),
  },
});
```

#### ✅ Fortalezas

| Aspecto | Evaluación | Comentario |
|---------|------------|------------|
| **Primary Key (UUID)** | ✅ Excelente | Uso de UUIDs en lugar de IDs numéricos. Escalable y seguro. |
| **Slug único** | ✅ Excelente | Importante para SEO y URLs amigables. |
| **Campos completos** | ✅ Muy bueno | Toda la información necesaria para una inmobiliaria. |
| **Tipado correcto** | ✅ Muy bueno | Uso apropiado de `text`, `number`, `boolean`, `json`. |
| **Flags de estado** | ✅ Bueno | `isActive` y `featured` permiten filtrado eficiente. |

#### ⚠️ Problemas Identificados

| Problema | Severidad | Impacto |
|----------|-----------|---------|
| **Campo `gallery` (JSON)** | 🔴 Crítico | Duplica datos de `PropertiesImages`. Antipatrón. |
| **Campo `categories` (JSON)** | 🟡 Medio | Dificulta queries y validación. Debería ser relacional. |
| **Campo `code` no único** | 🟡 Medio | Códigos internos deberían ser únicos. |
| **Sin timestamps** | 🟢 Bajo | Falta `createdAt` y `updatedAt`. |
| **Sin índices** | 🟡 Medio | Queries en `city`, `neighborhood` serán lentas. |

---

### Tabla: PropertiesImages

```typescript
const PropertiesImages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    image: column.text(),
  },
});
```

#### ✅ Fortalezas

| Aspecto | Evaluación | Comentario |
|---------|------------|------------|
| **Relación FK** | ✅ Excelente | Foreign key correctamente definida. |
| **Normalización** | ✅ Excelente | Tabla separada para relación 1:N. |
| **UUID como PK** | ✅ Excelente | Consistente con `Properties`. |

#### ⚠️ Problemas Identificados

| Problema | Severidad | Impacto |
|----------|-----------|---------|
| **Tabla no se usa** | 🔴 Crítico | Se llena en seed pero nunca se consulta. |
| **Sin orden de imágenes** | 🟡 Medio | Falta campo `order` para ordenar galería. |
| **Sin metadatos** | 🟢 Bajo | Podría tener `alt`, `caption`, `isPrimary`. |

---

## 🌱 Análisis del Seed

**Ubicación:** `db/seed.ts`

### Código Actual

```typescript
const queries: any = [];

export default async function seed() {
  data.forEach((item) => {
    const property = {
      id: uuidv4(),
      title: item.title,
      slug: item.slug,
      // ... resto de campos
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
  });

  await db.batch(queries);
}
```

### ✅ Fortalezas

| Aspecto | Evaluación | Comentario |
|---------|------------|------------|
| **Batch insert** | ✅ Excelente | Usa `db.batch()` para transaccionalidad. |
| **UUIDs generados** | ✅ Excelente | Genera IDs únicos para cada registro. |
| **Relaciones correctas** | ✅ Excelente | Asocia imágenes con `propertyId`. |
| **Código limpio** | ✅ Muy bueno | Estructura clara y legible. |

### ⚠️ Problemas Identificados

| Problema | Severidad | Impacto |
|----------|-----------|---------|
| **Sin validación** | 🟡 Medio | No valida si `item.gallery` existe o está vacío. |
| **Tipo `any` en queries** | 🟢 Bajo | Debería ser tipado correctamente. |
| **ID del JSON ignorado** | 🟡 Medio | El campo `id` numérico del JSON no se usa (confuso). |

### 🎯 Mejores Prácticas para Seeds

#### ❌ **MAL - Sin validación**

```typescript
item.gallery.forEach((img) => {
  // ❌ Falla si gallery es undefined o null
});
```

#### ✅ **BIEN - Con validación**

```typescript
if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
  item.gallery.forEach((img, index) => {
    const image = {
      id: uuidv4(),
      image: img,
      propertyId: property.id,
      order: index + 1, // ✅ Orden de la imagen
    };
    queries.push(db.insert(PropertiesImages).values(image));
  });
}
```

#### ✅ **BIEN - Tipado correcto**

```typescript
import type { InferInsertModel } from 'astro:db';

type PropertyInsert = InferInsertModel<typeof Properties>;
type ImageInsert = InferInsertModel<typeof PropertiesImages>;

const queries: Array<Promise<any>> = [];
```

---

## 🌐 Análisis de Endpoints API

### Endpoint 1: GET /api/properties

**Ubicación:** `src/pages/api/properties/index.ts`

```typescript
export const GET: APIRoute = async () => {
  const properties = await db.select().from(Properties);

  return new Response(
    JSON.stringify({ properties }),
    { status: 200 }
  );
};
```

#### ⚠️ Problemas

| Problema | Severidad | Solución |
|----------|-----------|----------|
| **Falta `prerender = false`** | 🔴 Crítico | Agregar para SSR real |
| **Sin Content-Type** | 🟡 Medio | Agregar header `application/json` |
| **Sin paginación** | 🟡 Medio | Implementar limit/offset |
| **Sin filtros** | 🟡 Medio | Permitir filtrar por ciudad, categoría, etc. |

#### ✅ **CORRECTO - Versión mejorada**

```typescript
export const prerender = false; // ✅ SSR habilitado

export const GET: APIRoute = async ({ url }) => {
  // ✅ Paginación
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  // ✅ Filtros
  const city = url.searchParams.get('city');
  const featured = url.searchParams.get('featured');

  let query = db.select().from(Properties);

  if (city) {
    query = query.where(eq(Properties.city, city));
  }

  if (featured === 'true') {
    query = query.where(eq(Properties.featured, true));
  }

  const properties = await query.limit(limit).offset(offset);

  return new Response(
    JSON.stringify({ properties }),
    { 
      status: 200,
      headers: { "Content-Type": "application/json" } // ✅ Header correcto
    }
  );
};
```

---

### Endpoint 2: GET /api/properties/[slug]

**Ubicación:** `src/pages/api/properties/[slug].ts`

```typescript
export const prerender = false; // ✅ Correcto

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ ok: false, error: "Slug requerido" }), {
      status: 400,
    });
  }

  const property = await db
    .select()
    .from(Properties)
    .where(eq(Properties.slug, slug))
    .get();

  if (!property) {
    return new Response(JSON.stringify({ ok: false, error: "Propiedad no encontrada" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ ok: true, property }), {
    status: 200,
  });
};
```

#### ✅ Fortalezas

- ✅ `prerender = false` presente
- ✅ Validación de parámetros
- ✅ Manejo de errores (404)

#### ⚠️ Problemas

| Problema | Severidad | Solución |
|----------|-----------|----------|
| **Sin Content-Type** | 🟡 Medio | Agregar header |
| **No incluye imágenes** | 🔴 Crítico | Debería hacer JOIN con `PropertiesImages` |

#### ✅ **CORRECTO - Con imágenes relacionadas**

```typescript
export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(
      JSON.stringify({ ok: false, error: "Slug requerido" }), 
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // ✅ Obtener propiedad
  const property = await db
    .select()
    .from(Properties)
    .where(eq(Properties.slug, slug))
    .get();

  if (!property) {
    return new Response(
      JSON.stringify({ ok: false, error: "Propiedad no encontrada" }), 
      {
        status: 404,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // ✅ Obtener imágenes relacionadas
  const images = await db
    .select()
    .from(PropertiesImages)
    .where(eq(PropertiesImages.propertyId, property.id))
    .orderBy(PropertiesImages.order); // Si agregamos campo order

  return new Response(
    JSON.stringify({ 
      ok: true, 
      property: {
        ...property,
        images // ✅ Incluir imágenes
      }
    }), 
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};
```

---

## 🔴 Problemas Críticos Identificados

### 1. Duplicación de Imágenes (CRÍTICO)

#### El Problema

```typescript
// En Properties table
gallery: column.json(), // ❌ Array de URLs

// En PropertiesImages table
// ✅ Tabla relacional con FK
```

**Consecuencia:**
- Las imágenes están almacenadas en **DOS lugares**
- El seed inserta en ambos
- El código solo consume `gallery` (JSON)
- La tabla `PropertiesImages` **nunca se consulta**

#### ❌ **ANTIPATRÓN - Estado actual**

```typescript
// Seed inserta en ambos lugares
const property = {
  gallery: item.gallery, // ❌ JSON array
};
queries.push(db.insert(Properties).values(property));

item.gallery.forEach((img) => {
  // ❌ También inserta en tabla relacional
  queries.push(db.insert(PropertiesImages).values({
    id: uuidv4(),
    image: img,
    propertyId: property.id,
  }));
});
```

```typescript
// Frontend consume solo el JSON
const property = await db.select().from(Properties).get();
// ❌ Usa property.gallery (JSON)
// ❌ Ignora PropertiesImages table
```

#### ✅ **SOLUCIÓN RECOMENDADA**

**Opción 1: Eliminar campo `gallery` (RECOMENDADO)**

```typescript
// 1. Modificar schema
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    // ❌ ELIMINAR: gallery: column.json(),
    // ... resto de campos
  },
});

const PropertiesImages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    image: column.text(),
    order: column.number(), // ✅ AGREGAR: orden de la imagen
    isPrimary: column.boolean({ default: false }), // ✅ AGREGAR: imagen principal
    alt: column.text({ optional: true }), // ✅ AGREGAR: texto alternativo
  },
});
```

```typescript
// 2. Modificar seed
const property = {
  id: uuidv4(),
  title: item.title,
  // ❌ NO incluir gallery
};
queries.push(db.insert(Properties).values(property));

item.gallery.forEach((img, index) => {
  queries.push(db.insert(PropertiesImages).values({
    id: uuidv4(),
    image: img,
    propertyId: property.id,
    order: index + 1,
    isPrimary: index === 0, // Primera imagen es principal
  }));
});
```

```typescript
// 3. Consultar con JOIN
const property = await db
  .select()
  .from(Properties)
  .where(eq(Properties.slug, slug))
  .get();

const images = await db
  .select()
  .from(PropertiesImages)
  .where(eq(PropertiesImages.propertyId, property.id))
  .orderBy(asc(PropertiesImages.order));

return {
  ...property,
  images
};
```

**Opción 2: Mantener `gallery` como cache (NO RECOMENDADO)**

Solo si necesitas compatibilidad con código legacy:

```typescript
// Mantener gallery sincronizado automáticamente
// Usar triggers o actualizar manualmente
```

---

### 2. Campo `categories` como JSON (MEDIO-ALTO)

#### El Problema

```typescript
categories: column.json(), // ["apartamento", "venta"]
```

**Consecuencias:**
- ❌ No hay validación de categorías
- ❌ Difícil hacer queries eficientes
- ❌ No se pueden agregar metadatos (icono, descripción)
- ❌ Typos no se detectan

#### ✅ **SOLUCIÓN - Tabla relacional**

```typescript
// 1. Crear tabla Categories
const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
    slug: column.text({ unique: true }),
    type: column.text(), // "property_type" o "transaction_type"
    icon: column.text({ optional: true }),
    description: column.text({ optional: true }),
  },
});

// 2. Crear tabla intermedia (Many-to-Many)
const PropertyCategories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    categoryId: column.text({ references: () => Categories.columns.id }),
  },
  indexes: {
    propertyIdx: { on: ["propertyId"] },
    categoryIdx: { on: ["categoryId"] },
  }
});

// 3. Seed de categorías
const categories = [
  { id: uuidv4(), name: "Apartamento", slug: "apartamento", type: "property_type" },
  { id: uuidv4(), name: "Casa", slug: "casa", type: "property_type" },
  { id: uuidv4(), name: "Venta", slug: "venta", type: "transaction_type" },
  { id: uuidv4(), name: "Arriendo", slug: "arriendo", type: "transaction_type" },
];

await db.insert(Categories).values(categories);

// 4. Query con categorías
const propertiesWithCategories = await db
  .select({
    property: Properties,
    category: Categories,
  })
  .from(Properties)
  .leftJoin(PropertyCategories, eq(Properties.id, PropertyCategories.propertyId))
  .leftJoin(Categories, eq(PropertyCategories.categoryId, Categories.id));
```

---

### 3. Falta `prerender = false` en endpoint principal

#### El Problema

```typescript
// src/pages/api/properties/index.ts
export const GET: APIRoute = async () => {
  // ❌ Falta: export const prerender = false;
```

**Consecuencia:**
- El endpoint podría pre-renderizarse en build time
- No reflejaría cambios en la DB después del build

#### ✅ **SOLUCIÓN**

```typescript
export const prerender = false; // ✅ AGREGAR esta línea

export const GET: APIRoute = async () => {
  // ...
};
```

---

## 📚 Mejores Prácticas Recomendadas

### 1. Schema Design

#### ✅ **BIEN - Campos únicos donde corresponde**

```typescript
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }), // ✅
    slug: column.text({ unique: true }), // ✅
    code: column.text({ unique: true }), // ✅ AGREGAR
  },
});
```

#### ✅ **BIEN - Índices para queries frecuentes**

```typescript
const Properties = defineTable({
  columns: { /* ... */ },
  indexes: {
    cityIdx: { on: ["city"] },
    neighborhoodIdx: { on: ["neighborhood"] },
    featuredIdx: { on: ["featured"] },
    isActiveIdx: { on: ["isActive"] },
    priceIdx: { on: ["price"] },
  }
});
```

#### ✅ **BIEN - Timestamps automáticos**

```typescript
import { sql } from 'astro:db';

const Properties = defineTable({
  columns: {
    // ... otros campos
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
    updatedAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
  },
});
```

---

### 2. Normalización de Datos

#### ❌ **MAL - Datos duplicados**

```typescript
// ❌ Imágenes en JSON Y en tabla
gallery: column.json(),
// + tabla PropertiesImages
```

#### ✅ **BIEN - Una sola fuente de verdad**

```typescript
// ✅ Solo tabla PropertiesImages
// ❌ Eliminar campo gallery
```

#### ❌ **MAL - Arrays en JSON**

```typescript
categories: column.json(), // ❌ ["apartamento", "venta"]
```

#### ✅ **BIEN - Tabla relacional**

```typescript
// ✅ Tablas: Categories + PropertyCategories
```

---

### 3. API Responses

#### ❌ **MAL - Sin headers**

```typescript
return new Response(
  JSON.stringify({ data }),
  { status: 200 } // ❌ Falta Content-Type
);
```

#### ✅ **BIEN - Headers completos**

```typescript
return new Response(
  JSON.stringify({ data }),
  { 
    status: 200,
    headers: { 
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60"
    }
  }
);
```

#### ❌ **MAL - Sin manejo de errores**

```typescript
const property = await db.select().from(Properties).get();
return new Response(JSON.stringify({ property }));
// ❌ ¿Qué pasa si property es null?
```

#### ✅ **BIEN - Manejo completo de errores**

```typescript
try {
  const property = await db
    .select()
    .from(Properties)
    .where(eq(Properties.slug, slug))
    .get();

  if (!property) {
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: "Property not found" 
      }), 
      {
        status: 404,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, property }), 
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
} catch (error) {
  return new Response(
    JSON.stringify({ 
      ok: false, 
      error: "Internal server error" 
    }), 
    {
      status: 500,
      headers: { "Content-Type": "application/json" }
    }
  );
}
```

---

### 4. TypeScript Types

#### ❌ **MAL - Tipos any**

```typescript
const queries: any = []; // ❌
```

#### ✅ **BIEN - Tipos correctos**

```typescript
import type { InferInsertModel } from 'astro:db';

type PropertyInsert = InferInsertModel<typeof Properties>;
type ImageInsert = InferInsertModel<typeof PropertiesImages>;

const queries: Array<Promise<any>> = [];
```

#### ✅ **BIEN - Tipos centralizados**

```typescript
// src/types/domain/Property.ts
export interface Property {
  id: string;
  title: string;
  slug: string;
  // ... todos los campos
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  image: string;
  order: number;
  isPrimary: boolean;
}

export interface PropertyWithImages extends Property {
  images: PropertyImage[];
}
```

---

## 📋 Plan de Acción Priorizado

### 🔴 **Fase 1: Crítico (Hacer AHORA)**

#### 1.1 Resolver duplicación de imágenes

**Tiempo estimado:** 2-3 horas

- [ ] Eliminar campo `gallery` de tabla `Properties`
- [ ] Agregar campos `order`, `isPrimary`, `alt` a `PropertiesImages`
- [ ] Actualizar seed para no insertar `gallery`
- [ ] Crear endpoint `/api/properties/[slug]/images`
- [ ] Actualizar frontend para consumir desde `PropertiesImages`

**Archivos a modificar:**
- `db/config.ts`
- `db/seed.ts`
- `src/pages/api/properties/[slug].ts`
- Componentes que usan imágenes

---

#### 1.2 Agregar `prerender = false` y headers

**Tiempo estimado:** 15 minutos

- [ ] Agregar `prerender = false` a `/api/properties/index.ts`
- [ ] Agregar `Content-Type: application/json` a todas las respuestas

**Archivos a modificar:**
- `src/pages/api/properties/index.ts`
- `src/pages/api/properties/[slug].ts`

---

#### 1.3 Hacer campo `code` único

**Tiempo estimado:** 5 minutos

```typescript
code: column.text({ unique: true }),
```

**Archivos a modificar:**
- `db/config.ts`

---

### 🟡 **Fase 2: Importante (Próximas 2 semanas)**

#### 2.1 Migrar categorías a tabla relacional

**Tiempo estimado:** 4-5 horas

- [ ] Crear tabla `Categories`
- [ ] Crear tabla `PropertyCategories`
- [ ] Crear seed de categorías
- [ ] Actualizar queries para usar JOIN
- [ ] Crear endpoint `/api/categories`

---

#### 2.2 Agregar índices

**Tiempo estimado:** 30 minutos

```typescript
indexes: {
  cityIdx: { on: ["city"] },
  neighborhoodIdx: { on: ["neighborhood"] },
  featuredIdx: { on: ["featured"] },
  isActiveIdx: { on: ["isActive"] },
}
```

---

#### 2.3 Agregar timestamps

**Tiempo estimado:** 30 minutos

```typescript
createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
updatedAt: column.date({ default: sql`CURRENT_TIMESTAMP` }),
```

---

#### 2.4 Validación en seed

**Tiempo estimado:** 1 hora

- [ ] Validar que `gallery` existe y no está vacío
- [ ] Validar campos requeridos
- [ ] Agregar try/catch
- [ ] Logs informativos

---

### 🟢 **Fase 3: Optimizaciones (Cuando sea necesario)**

#### 3.1 Paginación en endpoints

**Tiempo estimado:** 2 horas

- [ ] Implementar `page` y `limit` en `/api/properties`
- [ ] Agregar `total` y `totalPages` en respuesta
- [ ] Documentar en README

---

#### 3.2 Filtros avanzados

**Tiempo estimado:** 3 horas

- [ ] Filtro por ciudad
- [ ] Filtro por rango de precio
- [ ] Filtro por número de habitaciones
- [ ] Filtro por categoría

---

#### 3.3 Tipos TypeScript centralizados

**Tiempo estimado:** 2 horas

- [ ] Crear `src/types/domain/Property.ts`
- [ ] Crear `src/types/domain/PropertyImage.ts`
- [ ] Crear `src/types/domain/Category.ts`
- [ ] Exportar desde `src/types/index.ts`

---

## 💡 Ejemplos de Implementación

### Ejemplo 1: Schema Completo Mejorado

```typescript
// db/config.ts
import { defineDb, defineTable, column, sql } from 'astro:db';

const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    isActive: column.boolean({ default: true }),
    featured: column.boolean({ default: false }),
    location: column.text(),
    city: column.text(),
    neighborhood: column.text(),
    code: column.text({ unique: true }), // ✅ Ahora único
    description: column.text(),
    area: column.number(),
    bedrooms: column.number(),
    bathrooms: column.number(),
    parking: column.number(),
    price: column.number(),
    participation: column.text(),
    address: column.text(),
    observations: column.text({ optional: true }),
    createdAt: column.date({ default: sql`CURRENT_TIMESTAMP` }), // ✅ Nuevo
    updatedAt: column.date({ default: sql`CURRENT_TIMESTAMP` }), // ✅ Nuevo
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
    order: column.number(), // ✅ Nuevo
    isPrimary: column.boolean({ default: false }), // ✅ Nuevo
    alt: column.text({ optional: true }), // ✅ Nuevo
  },
  indexes: {
    propertyIdx: { on: ["propertyId"] },
    orderIdx: { on: ["propertyId", "order"] },
  }
});

const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text({ unique: true }),
    slug: column.text({ unique: true }),
    type: column.text(), // "property_type" | "transaction_type"
    icon: column.text({ optional: true }),
    description: column.text({ optional: true }),
  },
});

const PropertyCategories = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    categoryId: column.text({ references: () => Categories.columns.id }),
  },
  indexes: {
    propertyIdx: { on: ["propertyId"] },
    categoryIdx: { on: ["categoryId"] },
  }
});

export default defineDb({
  tables: {
    Properties,
    PropertiesImages,
    Categories,
    PropertyCategories,
  }
});
```

---

### Ejemplo 2: Seed Mejorado

```typescript
// db/seed.ts
import { db, Properties, PropertiesImages, Categories, PropertyCategories } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import data from '@/data/properties.json';

export default async function seed() {
  const queries: Array<Promise<any>> = [];

  // 1. Seed de categorías
  const categoryMap = new Map();
  
  const categories = [
    { id: uuidv4(), name: "Apartamento", slug: "apartamento", type: "property_type" },
    { id: uuidv4(), name: "Casa", slug: "casa", type: "property_type" },
    { id: uuidv4(), name: "Venta", slug: "venta", type: "transaction_type" },
    { id: uuidv4(), name: "Arriendo", slug: "arriendo", type: "transaction_type" },
  ];

  categories.forEach(cat => {
    categoryMap.set(cat.slug, cat.id);
    queries.push(db.insert(Categories).values(cat));
  });

  // 2. Seed de propiedades
  data.forEach((item) => {
    // Validación
    if (!item.title || !item.slug) {
      console.warn(`⚠️ Propiedad sin título o slug, omitida:`, item);
      return;
    }

    const propertyId = uuidv4();

    const property = {
      id: propertyId,
      title: item.title,
      slug: item.slug,
      isActive: item.isActive ?? true,
      featured: item.featured ?? false,
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
      observations: item.observations || "",
    };

    queries.push(db.insert(Properties).values(property));

    // 3. Insertar imágenes
    if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
      item.gallery.forEach((img, index) => {
        const image = {
          id: uuidv4(),
          image: img,
          propertyId: propertyId,
          order: index + 1,
          isPrimary: index === 0,
          alt: `${item.title} - Imagen ${index + 1}`,
        };
        queries.push(db.insert(PropertiesImages).values(image));
      });
    }

    // 4. Insertar categorías
    if (item.categories && Array.isArray(item.categories)) {
      item.categories.forEach(catSlug => {
        const categoryId = categoryMap.get(catSlug);
        if (categoryId) {
          queries.push(db.insert(PropertyCategories).values({
            id: uuidv4(),
            propertyId: propertyId,
            categoryId: categoryId,
          }));
        }
      });
    }
  });

  // Ejecutar todas las queries
  try {
    await db.batch(queries);
    console.log("✅ Seed completado exitosamente");
  } catch (error) {
    console.error("❌ Error en seed:", error);
    throw error;
  }
}
```

---

### Ejemplo 3: Endpoint Completo con Imágenes

```typescript
// src/pages/api/properties/[slug].ts
import type { APIRoute } from "astro";
import { db, Properties, PropertiesImages, eq, asc } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: "Slug es requerido" 
      }), 
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Obtener propiedad
    const property = await db
      .select()
      .from(Properties)
      .where(eq(Properties.slug, slug))
      .get();

    if (!property) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Propiedad no encontrada" 
        }), 
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Obtener imágenes relacionadas
    const images = await db
      .select()
      .from(PropertiesImages)
      .where(eq(PropertiesImages.propertyId, property.id))
      .orderBy(asc(PropertiesImages.order));

    return new Response(
      JSON.stringify({ 
        ok: true, 
        property: {
          ...property,
          images
        }
      }), 
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60"
        }
      }
    );
  } catch (error) {
    console.error("Error fetching property:", error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: "Error interno del servidor" 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
```

---

### Ejemplo 4: Endpoint con Paginación y Filtros

```typescript
// src/pages/api/properties/index.ts
import type { APIRoute } from "astro";
import { db, Properties, eq, gte, lte, and, count } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    // Paginación
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Filtros
    const city = url.searchParams.get('city');
    const featured = url.searchParams.get('featured');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const bedrooms = url.searchParams.get('bedrooms');

    // Construir condiciones
    const conditions = [];

    if (city) {
      conditions.push(eq(Properties.city, city));
    }

    if (featured === 'true') {
      conditions.push(eq(Properties.featured, true));
    }

    if (minPrice) {
      conditions.push(gte(Properties.price, parseInt(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(Properties.price, parseInt(maxPrice)));
    }

    if (bedrooms) {
      conditions.push(eq(Properties.bedrooms, parseInt(bedrooms)));
    }

    // Siempre mostrar solo activas
    conditions.push(eq(Properties.isActive, true));

    // Query con condiciones
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const properties = await db
      .select()
      .from(Properties)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    // Contar total
    const totalResult = await db
      .select({ count: count() })
      .from(Properties)
      .where(whereClause);

    const total = totalResult[0]?.count || 0;

    return new Response(
      JSON.stringify({ 
        ok: true,
        properties,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }), 
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60"
        }
      }
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: "Error interno del servidor" 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
```

---

## 📊 Checklist de Implementación

### Fase 1: Crítico

- [ ] Eliminar campo `gallery` de `Properties`
- [ ] Agregar `order`, `isPrimary`, `alt` a `PropertiesImages`
- [ ] Actualizar seed
- [ ] Agregar `prerender = false` a todos los endpoints
- [ ] Agregar `Content-Type` a todas las respuestas
- [ ] Hacer `code` único
- [ ] Crear endpoint para imágenes

### Fase 2: Importante

- [ ] Crear tabla `Categories`
- [ ] Crear tabla `PropertyCategories`
- [ ] Seed de categorías
- [ ] Agregar índices
- [ ] Agregar timestamps
- [ ] Validación en seed

### Fase 3: Optimizaciones

- [ ] Paginación
- [ ] Filtros avanzados
- [ ] Tipos TypeScript centralizados
- [ ] Documentación de API
- [ ] Tests

---

## 🎓 Recursos de Aprendizaje

### Documentación Oficial

- [Astro DB Documentation](https://docs.astro.build/en/guides/astro-db/)
- [Astro API Routes](https://docs.astro.build/en/core-concepts/endpoints/)
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)

### Mejores Prácticas

- **Normalización:** Evitar duplicación de datos
- **Índices:** Agregar en campos de búsqueda frecuente
- **Foreign Keys:** Mantener integridad referencial
- **Timestamps:** Siempre incluir `createdAt` y `updatedAt`
- **Validación:** Validar datos antes de insertar

---

## 📞 Conclusión

Este proyecto tiene una **base sólida** con Astro DB y UUIDs. Los principales problemas son:

1. 🔴 **Duplicación de imágenes** - Resolver ASAP
2. 🟡 **Categorías en JSON** - Migrar a relacional
3. 🟡 **Falta de índices** - Agregar para performance

Siguiendo este plan de acción, el proyecto estará **listo para producción** con una arquitectura escalable y mantenible.

---

**Última actualización:** 2025-12-15  
**Versión:** 1.0.0
