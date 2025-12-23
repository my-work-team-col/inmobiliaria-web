# Astro Action — getPropertiesByPage

## 📌 Descripción

`getPropertiesByPage` es una **Astro Action** que obtiene una lista paginada de propiedades desde **Astro DB (SQLite)**, uniendo datos de dos tablas:

- `Properties` → información principal de la propiedad
- `PropertiesImages` → imágenes asociadas a cada propiedad

Esta acción reemplaza el uso de **mocks JSON** y construye la **data final de producción** que consume el frontend.

---

## 🎯 Objetivo

- Centralizar la paginación en backend
- Unir propiedades e imágenes en una sola respuesta
- Mantener consistencia con el formato usado en el frontend
- Preparar la app para escalar (más imágenes, filtros, etc.)

---

## 📥 Input

La acción acepta un objeto JSON con los siguientes parámetros:

```ts
{
  page?: number;   // Página actual (default: 1)
  limit?: number;  // Registros por página (default: 10)
}
```

### Validaciones internas

- Si `page <= 0` → se fuerza a `1`
- `limit` usa valor por defecto `10`

---

## ⚙️ Implementación completa

```ts
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
    // Validación básica
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

---

## 🧠 ¿Qué hace el SQL principal?

```sql
SELECT a.*,
(
  SELECT json_group_array(image)
  FROM (
    SELECT image
    FROM PropertiesImages
    WHERE propertyId = a.id
    LIMIT 2
  )
) AS images
FROM Properties a
LIMIT ? OFFSET ?;
```

### Explicación

- `a.*` → devuelve todas las columnas de `Properties`
- Subquery:
  - busca imágenes relacionadas por `propertyId`
  - limita a **2 imágenes por propiedad**
  - devuelve un **array JSON**
- `LIMIT / OFFSET` → paginación real desde base de datos

---

## 📤 Output (estructura de respuesta)

```ts
{
  properties: PropertyWithImages[];
  totalPages: number;
  currentPage: number;
  totalRecords: number;
}
```

---

## 🧱 Ejemplo real de retorno

```json
{
  "properties": [
    {
      "id": "f8f3d670-8f14-4061-a776-912364574831",
      "title": "Casa en Rosales",
      "slug": "casa-rosales",
      "categories": "[\"casa\",\"venta\"]",
      "isActive": 1,
      "featured": 1,
      "gallery": "[\"/images/properties/property-4-1.jpg\",\"/images/properties/property-4-2.jpg\",\"/images/properties/property-4-3.jpg\"]",
      "location": "Bogotá, Colombia",
      "city": "Bogotá",
      "neighborhood": "Rosales",
      "code": "00000001860",
      "description": "Casa amplia con terraza y zonas verdes...",
      "area": 260,
      "bedrooms": 4,
      "bathrooms": 4,
      "parking": 2,
      "price": 1900000000,
      "participation": "100%",
      "address": "CR 2 72 - 48...",
      "observations": "Remodelación reciente",
      "images": "[\"/images/properties/property-4-1.jpg\",\"/images/properties/property-4-2.jpg\"]"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalRecords": 20
}
```

---

## ⚠️ Consideraciones importantes

### 1️⃣ Campos JSON como string

Los siguientes campos se devuelven como **string JSON** desde SQLite:

- `categories`
- `gallery`
- `images`

En el frontend deben parsearse:

```ts
const images = JSON.parse(property.images);
```

---

### 2️⃣ Diferencia entre `gallery` e `images`

- `gallery` → campo heredado del mock / schema inicial
- `images` → datos reales desde la tabla `PropertiesImages`

👉 En producción se recomienda **usar únicamente `images`**.

---

## ✅ Ventajas de esta implementación

- ✔️ Elimina mocks en producción
- ✔️ Mantiene integridad relacional
- ✔️ Paginación eficiente
- ✔️ Estructura consistente para el frontend
- ✔️ Escalable (más imágenes, filtros, etc.)

---

## 🚀 Estado actual

- Acción funcional
- SQL validado
- Retorno correcto
- Lista para producción

---

## 🔜 Posibles mejoras futuras

- Parsear JSON automáticamente en backend
- Tipar el retorno (`PropertyWithImages`)
- Agregar filtros (ciudad, precio, destacados)
- Eliminar definitivamente `gallery` del schema
