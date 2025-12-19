# Propiedades con Imágenes – Integración de BD y Normalización de Datos

## Resumen

Este cambio documenta la migración exitosa de datos de propiedades simulados (mock) a **datos reales provenientes de Astro DB**, utilizando **dos tablas relacionadas**:

- `Properties`
- `PropertiesImages`

La solución final se centra en **lo que funcionó**, evitando patrones inestables o no soportados en Astro DB, y estableciendo un **flujo de datos limpio y predecible** desde la base de datos hasta la interfaz de usuario (UI).

---

## Cuál Era el Problema

1. Las propiedades y las imágenes residían en **tablas separadas**.
2. El frontend consumía originalmente **JSON simulado (mock)**.
3. Consultas SQL crudas (`db.run`) en Astro DB:
   - Siempre retornan `Row[]`.
   - No pueden ser tipadas genéricamente.
4. Las imágenes se devolvían como **cadenas JSON (strings)**, no como arrays.
5. Los componentes del frontend asumían que `images` era `string[]`.
6. Resultado:
   - Las imágenes no se renderizaban.
   - Múltiples errores `[404] /[` en la terminal.
   - Conflictos de TypeScript por todas partes.

---

## Arquitectura Final (Lo Que Funciona)

```
Astro DB (SQL)
   ↓
Consulta SQL Cruda (JOIN vía subconsulta)
   ↓
Row[] (sin tipado)
   ↓
PropertyRow (límite de conversión/cast)
   ↓
Mapeador (normalización de dominio)
   ↓
PropertiesWithImages (seguro para frontend)
   ↓
Componentes Astro
```

---

## Decisiones Clave de Diseño

### 1. Aceptar las Limitaciones de Astro DB

- `db.run()` **no puede** aceptar genéricos.
- El tipo `Row` no se exporta.
- Una conversión de tipos (cast) controlada es inevitable.

✔ Se aceptó y aisló el cast.
❌ No se esparció `as unknown as` por toda la aplicación.

---

### 2. Introducir un Mapeador (Corrección Crítica)

Toda la lógica de normalización se movió a un **único mapeador**:

- Strings JSON → arrays
- `0 | 1` → boolean
- Garantizado `images: string[]`

Esto eliminó:
- El parseo de JSON en los componentes.
- URLs de imágenes rotas (`/[`).
- Lógica defensiva en la UI.

---

## Archivos Modificados / Agregados

### 1. `src/mappers/property.mapper.ts` ✅ (NUEVO)

```ts
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

    images: JSON.parse(row.images ?? "[]"),
  };
};
```

---

### 2. `src/actions/getPropertiesByPage.ts` ✅ (ACTUALIZADO)

```ts
const { rows } = await db.run(propertiesQuery);

// puente inevitable (limitación de Astro DB)
const typedRows = rows as unknown as PropertyRow[];

// datos seguros para el dominio
const properties = typedRows.map(mapPropertyRow);

return {
  properties,
  totalPages,
  currentPage: page,
  totalRecords: totalRecords.count,
};
```

---

### 3. `ListingSection.astro` ✅ (ACTUALIZADO)

```astro
<ListingCard property={item} />
```

---

### 4. `ListingCard.astro` ✅ (SIMPLIFICADO)

```astro
const image = property.images[0] ?? "/images/default.jpg";
```

---

## Cómo Validamos Que Funciona

### Validación en Backend

```ts
console.log(rows[0]);        // imágenes como string JSON
console.log(properties[0]); // imágenes como string[]
```

### Validación en Base de Datos

```sql
SELECT p.id, pi.image
FROM Properties p
LEFT JOIN PropertiesImages pi
ON pi.propertyId = p.id;
```

### Validación en Frontend

- Se imprimió en consola `property.images` en el componente.
- Se verificó que las URLs reales de las imágenes cargaran.
- Se modificaron rutas de imágenes en BD → La UI se actualizó inmediatamente.

✔ Confirma consumo real de la BD.
✔ Sin datos simulados involucrados.

---

## Resultado Final

✅ Datos reales de BD consumidos.
✅ Imágenes renderizadas correctamente.
✅ Sin errores `[404] /[`.
✅ Fuerte separación de responsabilidades.
✅ Patrón escalable para futuras relaciones.

---

## Resumen

Este cambio establece un **patrón estable y listo para producción** para trabajar con Astro DB + SQL crudo + componentes frontend, respetando las limitaciones actuales del framework y manteniendo el sistema limpio y mantenible.
```
