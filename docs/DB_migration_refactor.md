# Project Migration & Refactor — Astro DB + UUIDs + Image Mapping

## 1. Overview
Este documento consolida y aclara los cambios recientes realizados en el proyecto de la inmobiliaria. Incluye la migración desde un sistema basado en archivos JSON e IDs numéricos hacia Astro DB utilizando UUIDs, una tabla relacional para imágenes, rutas estáticas/SSR que el proyecto **ya tenía funcionando**, y un flujo de seed más profesional y escalable.

Tu proyecto **ya era SSR y usaba API routes** antes del refactor. Lo que se hizo fue **migrar el modelo de datos**, no cambiar la arquitectura SSR que ya existía.

---

## 2. Estado inicial del proyecto
Antes del refactor, el proyecto funcionaba así:

### **2.1 Datos y almacenamiento**
- Los datos provenían de `properties.json`.
- Los IDs de cada propiedad eran **numéricos** (`1,2,3…`).
- Las imágenes estaban dentro del JSON como rutas estáticas simples.
- NO existía una tabla separada de imágenes.
- NO existía integridad referencial, solo relaciones implícitas.

### **2.2 Base de datos y arquitectura**
- Ya estabas utilizando Astro con:
  - Rutas dinámicas.
  - SSR.
  - API endpoints.
- Pero la data estaba mockeada y no provenía de una DB real.

---

## 3. Objetivo del refactor
El propósito principal fue **preparar el proyecto para un entorno real de producción**, listo para integrarse con herramientas como:
- **Turso** (SQLite distribuido)
- **Supabase** (Postgres con APIs y Auth)
- **PlanetScale / Neon**
- **Azure / Vercel Storage / cualquier BaaS**

Y lograr:
- IDs universales y seguros (**UUID v4**).
- Tablas relacionales reales.
- Manejo de imágenes adecuado y escalable.
- Un sistema de seed profesional.
- Un modelo más cercano a producción real.

---

## 4. Cambios realizados en el refactor
### **4.1 Configuración de Astro DB (config.ts)**
Se actualizaron las tablas para:

- Cambiar `id: column.number()` → `id: column.text()` para almacenar UUIDs.
- Definir `propertyId` también como texto.
- Crear la tabla `PropertiesImages` con relación hacia `Properties`.

```ts
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

const PropertiesImages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ references: () => Properties.columns.id }),
    image: column.text(),
  },
});
```

---

### **4.2 Instalación y uso de UUIDs**
Se instaló:
```
pnpm add uuid
```
Y se importó:
```ts
import { v4 as uuidv4 } from "uuid";
```
Esto permite IDs seguros y únicos, compatibles con cualquier proveedor cloud.

---

### **4.3 Cambio en el naming de las imágenes**
Se adoptó un formato consistente:
```
/images/properties/property-{uuid}-1.jpg
/images/properties/property-{uuid}-2.jpg
...
```
Esto permite:
- Escalar a storage externo.
- Organizar imágenes por propiedad.
- Evitar colisiones de nombres.

---

### **4.4 Refactor del Seed (seed.ts)**
Antes:
- Se usaba `map` directamente dentro del `db.insert`.
- Se ejecutaban inserts planos sin relaciones explícitas.

Ahora:
- Se genera un UUID para cada propiedad.
- Se genera un UUID por cada imagen.
- Se usa un arreglo `queries[]`.
- Se ejecuta todo con `db.batch(queries)`.

Esto hace el seed más robusto, escalable y transaccional.

---

## 5. Nuevo flujo de seed (versión final)
```ts
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

  await db.batch(queries);
}
```

---

## 6. Errores comunes y cómo prevenirlos
### **❌ Error: Overload no coincide (IDs numéricos vs text)**
Sucede cuando:
- La tabla usa `column.number()`.
- Le envías un string UUID.

**Solución:** cambiar a `column.text()`.

### **❌ Error con `propertyId`: está usando el ID antiguo**
Se resolvió ajustando:
```ts
propertyId: property.id
```
En lugar de `item.id`.

### **❌ Warning de PNPM sobre build scripts**
Mensaje:
```
Ignored build scripts: esbuild, sharp, workerd
```
Solo significa que PNPM no ejecuta los scripts postinstall automáticamente.
No afecta tu proyecto.

---

## 7. Próximo paso: Renderizar propiedades en el frontend
Con la DB lista, lo siguiente es:

1. Crear un servicio para consultar propiedades.
2. Cargar datos en la página dinámica `/propiedad/[slug]`.
3. Reemplazar dependencias del JSON por queries reales. | Validar si falto algo

Esto ya está listo el proyecto es SSR y usa api!.

## 7.1 Próximo paso: Renderizar propiedades emparejando las tabla de imagenes
- Consultar imágenes desde `PropertiesImages`. (Actualmente consume la url desde el mock .json)
- Crear archivo .ENV y template 
- Construir las rutas dinmicas de la api usando variables de entorno http o localhost
---

## 8. Conclusión
Con este refactor:
- Migraste a un modelo de datos **real y profesional**.
- Tu proyecto sigue siendo SSR y API-driven como antes.
- Ahora tiene integridad relacional.
- Utilizas UUIDs, lo que te desbloquea cualquier proveedor cloud.
- Tienes un seed robusto, limpio y escalable.

Estás listo para pasar a la etapa de **consumo real desde el frontend** y preparar el deployment.

---

## 9. Créditos
Documento generado a partir del historial del proyecto, decisiones técnicas y tu proceso de aprendizaje personal.
