# 🗄️ Base de Datos - Documentación Completa

> Documentación completa de Astro DB, schema, migraciones, Astro Actions, sistema de imágenes y mejores prácticas.

**Última actualización:** 2025-12-23  
**Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Schema de Base de Datos](#-schema-de-base-de-datos)
2. [Migración y Refactor](#-migración-y-refactor)
3. [Astro Actions](#-astro-actions)
4. [Sistema de Imágenes](#-sistema-de-imágenes)
5. [Mejores Prácticas](#-mejores-prácticas)

---

## 🗄️ Schema de Base de Datos

### Tecnología
- **Motor:** SQLite (Astro DB ^0.18.3)
- **ORM:** Drizzle (integrado)
- **IDs:** UUIDs (v4)

### Tablas Principales

#### Properties

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT (UUID) | Primary key |
| `title` | TEXT | Nombre de la propiedad |
| `slug` | TEXT (UNIQUE) | URL amigable |
| `categories` | JSON | Categorías (apartamento, casa, etc.) |
| `isActive` | BOOLEAN | Si está activa |
| `featured` | BOOLEAN | Si es destacada |
| `gallery` | JSON | ⚠️ Deprecado - usar PropertiesImages |
| `location` | TEXT | Ubicación completa |
| `city` | TEXT | Ciudad |
| `neighborhood` | TEXT | Barrio |
| `code` | TEXT | Código interno |
| `description` | TEXT | Descripción |
| `area` | NUMBER | Área en m² |
| `bedrooms` | NUMBER | Habitaciones |
| `bathrooms` | NUMBER | Baños |
| `parking` | NUMBER | Parqueaderos |
| `price` | NUMBER | Precio |
| `participation` | TEXT | Porcentaje de participación |
| `address` | TEXT | Dirección |
| `observations` | TEXT | Observaciones |

#### PropertiesImages

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT (UUID) | Primary key |
| `propertyId` | TEXT (FK) | Referencia a Properties |
| `image` | TEXT | URL de la imagen |

**Relación:** 1 Property → N Images

---

## 🔄 Migración y Refactor

### Estado Inicial
- Datos en `properties.json`
- IDs numéricos (1, 2, 3...)
- Imágenes como rutas estáticas
- Sin integridad referencial

### Cambios Realizados

#### 1. Migración a UUIDs
```bash
pnpm add uuid
```

```typescript
import { v4 as uuidv4 } from "uuid";

const property = {
  id: uuidv4(), // Genera UUID único
  // ...resto de campos
};
```

#### 2. Schema Actualizado
```typescript
// db/config.ts
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    // ...resto de campos
  },
});

const PropertiesImages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    image: column.text(),
  },
});
```

#### 3. Seed Mejorado
```typescript
// db/seed.ts
import { db, Properties, PropertiesImages } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import data from '@/data/properties.json';

const queries = [];

export default async function seed() {
  data.forEach((item) => {
    const property = {
      id: uuidv4(),
      title: item.title,
      slug: item.slug,
      // ...resto de campos
    };

    queries.push(db.insert(Properties).values(property));

    // Insertar imágenes asociadas
    item.gallery.forEach((img) => {
      const image = {
        id: uuidv4(),
        image: img,
        propertyId: property.id,
      };
      queries.push(db.insert(PropertiesImages).values(image));
    });
  });

  await db.batch(queries); // Transaccional
}
```

---

## ⚡ Astro Actions

### getPropertiesByPage

Astro Action para obtener propiedades paginadas con imágenes.

#### Input
```typescript
{
  page?: number;   // Página actual (default: 1)
  limit?: number;  // Registros por página (default: 10)
}
```

#### Implementación
```typescript
// src/actions/getPropertiesByPage.ts
import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { count, db, Properties, PropertiesImages, sql } from "astro:db";

export const getPropertiesByPage = defineAction({
  accept: "json",

  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
  }),

  handler: async ({ page, limit }) => {
    // Validación
    page = page <= 0 ? 1 : page;

    // Total de registros
    const [totalRecords] = await db
      .select({ count: count() })
      .from(Properties);

    const totalPages = Math.ceil(totalRecords.count / limit);
    const offset = (page - 1) * limit;

    // Query principal: propiedades + imágenes
    const propertiesQuery = sql`
      SELECT a.*,
      (
        SELECT json_group_array(image)
        FROM (
          SELECT image
          FROM ${PropertiesImages}
          WHERE propertyId = a.id
          LIMIT 2
        )
      ) AS images
      FROM ${Properties} a
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    const { rows } = await db.run(propertiesQuery);

    return {
      properties: rows,
      totalPages,
      currentPage: page,
      totalRecords: totalRecords.count,
    };
  },
});
```

#### Output
```typescript
{
  properties: PropertyWithImages[];
  totalPages: number;
  currentPage: number;
  totalRecords: number;
}
```

#### Uso
```typescript
// En un componente Astro
const { properties, totalPages } = await actions.getPropertiesByPage({
  page: 1,
  limit: 10
});
```

---

## 🖼️ Sistema de Imágenes

### Problema Original
- Campo `gallery` (JSON) duplicaba datos de `PropertiesImages`
- Imágenes devueltas como strings JSON, no arrays
- Frontend esperaba `string[]` pero recibía `string`
- Errores `[404] /[` por URLs rotas

### Solución Implementada

#### 1. Mapeador de Datos
```typescript
// src/mappers/property.mapper.ts
import type { PropertyRow, PropertiesWithImages } from "@/types";

export const mapPropertyRow = (row: PropertyRow): PropertiesWithImages => {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,

    categories: JSON.parse(row.categories ?? "[]"),
    gallery: JSON.parse(row.gallery ?? "[]"),

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

    images: JSON.parse(row.images ?? "[]"), // ✅ Parsea a array
  };
};
```

#### 2. Uso en Astro Action
```typescript
const { rows } = await db.run(propertiesQuery);

// Cast controlado (limitación de Astro DB)
const typedRows = rows as unknown as PropertyRow[];

// Datos seguros para el dominio
const properties = typedRows.map(mapPropertyRow);

return {
  properties, // ✅ images es string[]
  totalPages,
  currentPage: page,
  totalRecords: totalRecords.count,
};
```

#### 3. Uso en Frontend
```astro
---
// ListingCard.astro
interface Props {
  property: PropertiesWithImages;
}

const { property } = Astro.props;
const image = property.images[0] ?? "/images/default.jpg"; // ✅ Simple
---

<img src={image} alt={property.title} />
```

### Arquitectura del Flujo de Datos
```
Astro DB (SQL)
   ↓
Consulta SQL Cruda (JOIN vía subconsulta)
   ↓
Row[] (sin tipado)
   ↓
PropertyRow (cast controlado)
   ↓
Mapeador (normalización) ← CLAVE
   ↓
PropertiesWithImages (seguro)
   ↓
Componentes Astro
```

---

## ✅ Mejores Prácticas

### 1. Schema Design

#### ✅ BIEN - UUIDs como Primary Keys
```typescript
id: column.text({ primaryKey: true, unique: true })
```

#### ✅ BIEN - Slugs únicos
```typescript
slug: column.text({ unique: true })
```

#### ✅ BIEN - Foreign Keys
```typescript
propertyId: column.text({ references: () => Properties.columns.id })
```

#### ⚠️ MEJORAR - Agregar índices
```typescript
const Properties = defineTable({
  columns: { /* ... */ },
  indexes: {
    cityIdx: { on: ["city"] },
    neighborhoodIdx: { on: ["neighborhood"] },
    featuredIdx: { on: ["featured"] },
    isActiveIdx: { on: ["isActive"] },
  }
});
```

### 2. Normalización de Datos

#### ❌ MAL - Datos duplicados
```typescript
gallery: column.json(), // ❌ Duplica PropertiesImages
```

#### ✅ BIEN - Una sola fuente de verdad
```typescript
// Solo tabla PropertiesImages
// Eliminar campo gallery
```

### 3. Queries Eficientes

#### ❌ MAL - Sin paginación
```typescript
const properties = await db.select().from(Properties);
```

#### ✅ BIEN - Con paginación
```typescript
const properties = await db
  .select()
  .from(Properties)
  .limit(limit)
  .offset(offset);
```

### 4. Manejo de Tipos

#### ❌ MAL - Tipos any
```typescript
const queries: any = [];
```

#### ✅ BIEN - Tipos correctos
```typescript
import type { InferInsertModel } from 'astro:db';

type PropertyInsert = InferInsertModel<typeof Properties>;
const queries: Array<Promise<any>> = [];
```

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm astro db push      # Aplicar cambios al schema
pnpm astro db seed      # Ejecutar seed
pnpm astro db verify    # Verificar schema

# Producción
pnpm astro db push --remote  # Aplicar a producción
```

---

## 📊 Estado Actual

### ✅ Completado
- Migración de JSON a Astro DB
- Implementación de UUIDs
- Sistema de imágenes relacional
- Astro Actions para paginación
- Mapeador de datos
- Seed transaccional

### ⚠️ Pendiente
- Eliminar campo `gallery` del schema
- Normalizar categorías (tabla relacional)
- Agregar índices a la BD
- Agregar campo `order` a PropertiesImages
- Agregar timestamps (createdAt, updatedAt)

---

## 🚀 Próximos Pasos

1. **Eliminar campo `gallery`**
   - Actualizar schema
   - Actualizar seed
   - Actualizar mapeador

2. **Normalizar categorías**
   - Crear tabla `Categories`
   - Crear tabla intermedia `PropertyCategories`
   - Migrar datos

3. **Agregar índices**
   - Índices en campos de búsqueda frecuente
   - Mejorar performance de queries

4. **Migrar a Turso (Producción)**
   - SQLite distribuido
   - Mejor escalabilidad
   - Edge deployment

---

**Última actualización:** 2025-12-23  
**Versión:** 1.0.0  
**Mantenido por:** Yorrmi Altamiranda & Didier Méndez
