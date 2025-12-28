# 🗄️ Base de Datos - Documentación Completa

> Documentación completa de Astro DB, schema, migraciones, taxonomía, Astro Actions, sistema de imágenes y mejores prácticas.

**Última actualización:** 28 de diciembre de 2025  
**Versión:** 2.0.0

---

## 📋 Tabla de Contenidos

1. [Tecnología y Configuración](#-tecnología-y-configuración)
   - [Entorno Local vs Producción](#entorno-local-vs-producción)
2. [Deployment a Producción con Turso](#-deployment-a-producción-con-turso)
   - [Configuración de Turso](#1-configuración-de-turso)
   - [Deployment en Vercel](#2-deployment-en-vercel)
   - [Deployment en Cloudflare](#3-deployment-en-cloudflare)
   - [Otros Hosting](#4-otros-hosting-netlify-railway-etc)
3. [Schema Completo](#-schema-completo)
   - [Properties](#1-properties)
   - [PropertiesImages](#2-propertiesimages)
   - [Categories (Implementado)](#3-categories--implementado)
   - [PropertyCategories (Implementado)](#4-propertycategories--implementado)
   - [Tags (Pendiente)](#5-tags--pendiente)
   - [Attributes (Pendiente)](#6-attributes--pendiente)
   - [Brands (Pendiente)](#7-brands--pendiente)
4. [Sistema de Taxonomía](#-sistema-de-taxonomía)
   - [Estado Actual](#estado-actual)
   - [Datos en Producción](#datos-en-producción)
   - [Queries Helper](#queries-helper-implementadas)
   - [Plan Futuro](#plan-de-implementación-futuro)
5. [Migración y Refactor](#-migración-y-refactor)
6. [Astro Actions](#-astro-actions)
7. [Sistema de Imágenes](#-sistema-de-imágenes)
8. [Mejores Prácticas](#-mejores-prácticas)
9. [Estado y Próximos Pasos](#-estado-y-próximos-pasos)

---

## � Tecnología y Configuración

### Stack
- **Motor:** SQLite (Astro DB ^0.18.3)
- **ORM:** Drizzle (integrado)
- **IDs:** UUIDs (v4)
- **Deployment:** Turso (SQLite distribuido para producción)

### Arquitectura de Relaciones
```
Properties (1) ←→ (N) PropertiesImages
Properties (1) ←→ (N) PropertyCategories (N) ←→ (1) Categories ✅
Properties (1) ←→ (N) PropertyTags (N) ←→ (1) Tags ⏳
Properties (1) ←→ (N) PropertyAttributes (N) ←→ (1) Attributes ⏳
Properties (N) ←→ (1) Brands ⏳
```
### Entorno Local vs Producción

#### 📍 Desarrollo Local (SQLite)

Cuando ejecutas `pnpm dev` o `pnpm astro db push`, Astro DB crea automáticamente una base de datos SQLite **local** en tu computadora.

**Características:**
- ✅ **Ubicación:** `.astro/content.db` (archivo en tu disco)
- ✅ **Velocidad:** Instantánea (sin latencia de red)
- ✅ **Datos:** Independientes por desarrollador
- ✅ **Reset:** Fácil con `--force-reset`
- ✅ **Configuración:** Ninguna requerida
- ✅ **Costo:** Gratis

**Comandos:**
```bash
# Primera vez - Crear BD y seed
pnpm astro db push --force-reset

# Desarrollo normal
pnpm dev

# Ver datos en GUI
pnpm astro db studio
```

#### ☁️ Producción (Turso - SQLite Remoto)

Para desplegar tu aplicación en producción (Vercel, Cloudflare, etc.), necesitas una base de datos **remota** accesible desde internet.

**¿Qué es Turso?**
- 🌐 SQLite en la nube (distribuido globalmente)
- 🚀 Compatible 100% con SQLite (mismo código, sin cambios)
- 🔗 Se conecta mediante URL remota + token
- 🌍 Réplicas en múltiples regiones (baja latencia)
- 🔐 Conexión segura
- 💰 Plan gratuito: 500 MB + 1B lecturas/mes

**Diferencias clave:**

| Aspecto | Local (SQLite) | Producción (Turso) |
|---------|----------------|-------------------|
| **Ubicación** | `.astro/content.db` | Cloud (turso.tech) |
| **Acceso** | Solo tu PC | Global (internet) |
| **Velocidad** | Instantánea | ~50-200ms |
| **Persistencia** | Solo local | Permanente en cloud |
| **Compartida** | ❌ No | ✅ Sí (todos los usuarios) |
| **Configuración** | Automática | Variables de entorno |
| **Comando** | `pnpm dev` | `pnpm astro db push --remote` |

**Flujo de trabajo:**
```
┌─────────────────────┐         ┌──────────────────────┐
│  DESARROLLO LOCAL   │         │     PRODUCCIÓN       │
├─────────────────────┤         ├──────────────────────┤
│  pnpm dev           │         │  Deploy to hosting   │
│       ↓             │         │        ↓             │
│  .astro/content.db  │         │  Turso Cloud SQLite  │
│  (archivo local)    │         │  (URL remota)        │
│       ↓             │         │        ↓             │
│  db/seed.ts         │         │  Migrations          │
│  (datos de prueba)  │         │  (datos reales)      │
└─────────────────────┘         └──────────────────────┘
```

---

## 🚀 Deployment a Producción con Turso

Esta guía te muestra cómo configurar Turso para desplegar tu aplicación en producción en diferentes plataformas de hosting.

### 1. Configuración de Turso

#### Paso 1.1: Instalar Turso CLI

**macOS:**
```bash
brew install tursodatabase/tap/turso
```

**Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Windows (WSL):**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Paso 1.2: Crear cuenta y autenticarse

```bash
# Crear cuenta (abre el navegador)
turso auth signup

# O si ya tienes cuenta
turso auth login
```

#### Paso 1.3: Crear base de datos remota

```bash
# Crear base de datos
turso db create inmobiliaria-web

# Verificar que se creó
turso db list
```

**Output esperado:**
```
Name                Region       URL
inmobiliaria-web    Frankfurt    libsql://inmobiliaria-web-[tu-username].turso.io
```

#### Paso 1.4: Obtener credenciales

**1. Obtener URL de conexión:**
```bash
turso db show inmobiliaria-web --url
```

**Copia el output (ejemplo):**
```
libsql://inmobiliaria-web-tu-username.turso.io
```

**2. Generar token de autenticación:**
```bash
turso db tokens create inmobiliaria-web
```

**Copia el token generado (ejemplo):**
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQ...
```

⚠️ **Importante:** Guarda el token de forma segura. No lo compartas ni lo subas a git.

#### Paso 1.5: Aplicar schema a Turso

```bash
# Push del schema (db/config.ts) a la base de datos remota
pnpm astro db push --remote
```

Cuando te pregunte por las credenciales:
- **ASTRO_DB_REMOTE_URL:** Pega la URL que copiaste
- **ASTRO_DB_APP_TOKEN:** Pega el token que copiaste

**Output esperado:**
```
✓ Database schema pushed successfully
✓ 7 tables created
```

#### Paso 1.6: (Opcional) Seedear datos de prueba en Turso

Si quieres los mismos datos de ejemplo en producción:

```bash
# Ejecutar seed en remoto
pnpm astro db execute db/seed.ts --remote
```

---

### 2. Deployment en Vercel

#### Paso 2.1: Configurar variables de entorno

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com)
2. Navega a **Settings → Environment Variables**
3. Agrega las siguientes variables:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `ASTRO_DB_REMOTE_URL` | `libsql://inmobiliaria-web-xxx.turso.io` | Production, Preview |
| `ASTRO_DB_APP_TOKEN` | `eyJhbGciOiJ...` (tu token) | Production, Preview |

**Captura de pantalla esperada:**
```
┌──────────────────────────────────────────────────┐
│ ASTRO_DB_REMOTE_URL                              │
│ libsql://inmobiliaria-web-tu-user.turso.io       │
│ [✓] Production  [✓] Preview  [ ] Development     │
└──────────────────────────────────────────────────┘
```

#### Paso 2.2: Desplegar

**Opción A: Desde CLI**
```bash
# Primera vez
npm i -g vercel
vercel login
vercel --prod

# Despliegues posteriores
vercel --prod
```

**Opción B: Desde GitHub**
1. Conecta tu repositorio en Vercel
2. Push a la rama `main`
3. Vercel desplegará automáticamente

#### Paso 2.3: Verificar

Visita tu URL de Vercel. La app debería conectarse a Turso automáticamente.

**Para verificar conexión:**
```bash
# Ver logs de Vercel
vercel logs [tu-deployment-url]
```

---

### 3. Deployment en Cloudflare

#### Paso 3.1: Configurar variables de entorno

**Opción A: Desde CLI (wrangler)**
```bash
# Instalar wrangler si no lo tienes
npm install -g wrangler

# Login
wrangler login

# Agregar secrets
wrangler secret put ASTRO_DB_REMOTE_URL
# Pegar: libsql://inmobiliaria-web-xxx.turso.io

wrangler secret put ASTRO_DB_APP_TOKEN
# Pegar tu token
```

**Opción B: Desde Dashboard**
1. Ve a [Cloudflare Pages Dashboard](https://dash.cloudflare.com)
2. Selecciona tu proyecto
3. **Settings → Environment Variables**
4. Agrega:
   - `ASTRO_DB_REMOTE_URL` = tu URL de Turso
   - `ASTRO_DB_APP_TOKEN` = tu token

#### Paso 3.2: Desplegar

**Opción A: Desde CLI**
```bash
pnpm run build
wrangler pages deploy dist
```

**Opción B: Desde GitHub**
1. Conecta tu repo en Cloudflare Pages
2. Push a `main`
3. Cloudflare construye y despliega automáticamente

#### Paso 3.3: Verificar

```bash
# Ver logs
wrangler pages deployment tail
```

---

### 4. Otros Hosting (Netlify, Railway, etc.)

El proceso es similar en cualquier plataforma:

#### Paso 4.1: Configurar variables de entorno

En el dashboard de tu hosting, agrega:
- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`

**Netlify:**
- Site settings → Build & deploy → Environment variables

**Railway:**
- Project → Variables tab

**Render:**
- Environment → Environment Variables

**Fly.io:**
```bash
flyctl secrets set ASTRO_DB_REMOTE_URL="libsql://..."
flyctl secrets set ASTRO_DB_APP_TOKEN="eyJ..."
```

#### Paso 4.2: Desplegar según el hosting

Cada plataforma tiene su método (CLI, GitHub, Git push, etc.)

---

### 🔍 Verificación de Conexión

#### Verificar que Astro DB detecta Turso

En tu aplicación desplegada, Astro DB automáticamente:
1. Detecta las variables `ASTRO_DB_REMOTE_URL` y `ASTRO_DB_APP_TOKEN`
2. Cambia de SQLite local a Turso remoto
3. Todas tus queries funcionan igual (sin cambios en código)

#### Verificar datos en Turso

**Opción 1: Turso CLI**
```bash
# Abrir shell SQL
turso db shell inmobiliaria-web

# Ejecutar queries
SELECT COUNT(*) FROM Categories;
SELECT * FROM Properties LIMIT 5;
```

**Opción 2: Turso Dashboard**
1. Ve a [turso.tech/app](https://turso.tech/app)
2. Selecciona tu base de datos
3. Usa el SQL editor

---

### 🚨 Troubleshooting

#### Error: "Database not found"
```bash
# Verificar que la BD existe
turso db list

# Verificar URL
turso db show inmobiliaria-web --url
```

#### Error: "Authentication failed"
```bash
# Regenerar token
turso db tokens create inmobiliaria-web

# Actualizar en variables de entorno del hosting
```

#### Error: "Table not found"
```bash
# Aplicar schema nuevamente
pnpm astro db push --remote
```

#### Verificar variables de entorno en producción

**Vercel:**
```bash
vercel env ls
```

**Cloudflare:**
```bash
wrangler pages deployment list
wrangler pages deployment tail [deployment-id]
```

---

### 💡 Mejores Prácticas

#### 1. Entornos separados
```bash
# Crear BD para staging
turso db create inmobiliaria-web-staging

# Crear BD para producción
turso db create inmobiliaria-web-production
```

Configura variables diferentes en Preview vs Production en Vercel.

#### 2. Backups automáticos

Turso hace backups automáticos, pero puedes exportar manualmente:
```bash
# Exportar a SQL
turso db shell inmobiliaria-web --dump > backup.sql

# Restaurar
turso db shell inmobiliaria-web < backup.sql
```

#### 3. Monitoreo

```bash
# Ver uso y estadísticas
turso db inspect inmobiliaria-web

# Ver réplicas
turso db show inmobiliaria-web
```

#### 4. Escalabilidad

Si tu app crece, puedes agregar réplicas en otras regiones:
```bash
# Agregar réplica en otra región
turso db replicate inmobiliaria-web --region sao
```

---

### 📊 Costo y Límites

**Plan Gratuito de Turso:**
- ✅ 500 MB de almacenamiento
- ✅ 1B row reads/mes
- ✅ 25M row writes/mes
- ✅ 3 bases de datos
- ✅ 3 ubicaciones

**Suficiente para:**
- ~50,000 propiedades
- ~500,000 visitas/mes
- Múltiples desarrolladores

**Escalar si es necesario:**
- [Planes de Turso](https://turso.tech/pricing)
---

## 🗄️ Schema Completo

### 1. Properties

**Estado:** ✅ Actualizado (campo `categories` eliminado)

```typescript
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    title: column.text(),
    slug: column.text({ unique: true }),
    // ✅ ELIMINADO: categories: column.json()
    isActive: column.boolean(),
    featured: column.boolean(),
    gallery: column.json(), // ⚠️ Mantener por compatibilidad
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
    // ⏳ FUTURO: brandId
  },
});
```

| Campo | Tipo | Descripción | Estado |
|-------|------|-------------|--------|
| `id` | UUID | Primary key | ✅ |
| `title` | TEXT | Nombre de la propiedad | ✅ |
| `slug` | TEXT | URL amigable (único) | ✅ |
| `isActive` | BOOLEAN | Si está activa | ✅ |
| `featured` | BOOLEAN | Si es destacada | ✅ |
| `gallery` | JSON | ⚠️ Deprecado (mantener compatibilidad) | ⚠️ |
| `price` | NUMBER | Precio | ✅ |
| `area` | NUMBER | Área en m² | ✅ |
| `bedrooms` | NUMBER | Habitaciones | ✅ |
| `bathrooms` | NUMBER | Baños | ✅ |
| `parking` | NUMBER | Parqueaderos | ✅ |
| `brandId` | UUID | Marca/Constructor (FK) | ⏳ Pendiente |

---

### 2. PropertiesImages

**Estado:** ✅ Implementado

```typescript
const PropertiesImages = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    propertyId: column.text({ optional: true, references: () => Properties.columns.id }),
    image: column.text(),
  },
});
```

**Relación:** 1 Property → N Images

---

### 3. Categories ✅ IMPLEMENTADO

**Fecha:** 28 de diciembre de 2025  
**Jerarquía:** 2 niveles (Padre → Hija)

```typescript
const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    slug: column.text({ unique: true }),
    parentId: column.text({ optional: true, references: () => Categories.columns.id }),
    description: column.text({ optional: true }),
    icon: column.text({ optional: true }),
    displayOrder: column.number({ default: 0 }),
    isActive: column.boolean({ default: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});
```

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `parentId` | null = Padre, valor = Hija | null, "uuid-residencial" |
| `displayOrder` | Orden en UI | 1, 2, 3... |
| `icon` | Emoji o nombre icono | "🏠", "building" |

**Validación:** Solo permite 2 niveles (padre e hija).

---

### 4. PropertyCategories ✅ IMPLEMENTADO

**Relación:** Many-to-Many entre Properties y Categories

```typescript
const PropertyCategories = defineTable({
  columns: {
    propertyId: column.text({ optional: true, references: () => Properties.columns.id }),
    categoryId: column.text({ optional: true, references: () => Categories.columns.id }),
    isPrimary: column.boolean({ default: false }),
    createdAt: column.date({ default: NOW }),
  },
});
```

---

### 5. Tags ⏳ PENDIENTE

**Propósito:** Amenidades, características y estados

```typescript
const Tags = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
    slug: column.text({ unique: true }),
    type: column.text(), // "amenity", "feature", "condition"
    icon: column.text({ optional: true }),
    color: column.text({ optional: true }),
    isActive: column.boolean({ default: true }),
    createdAt: column.date({ default: NOW }),
  },
});
```

**Tipos:**
- `amenity` - Piscina, Gym, Portería
- `feature` - Balcón, Terraza, Vista
- `condition` - Nuevo, Remodelado

**Tabla relacional:**
```typescript
const PropertyTags = defineTable({
  columns: {
    propertyId: column.text({ references: () => Properties.columns.id }),
    tagId: column.text({ references: () => Tags.columns.id }),
    createdAt: column.date({ default: NOW }),
  },
});
```

---

### 6. Attributes ⏳ PENDIENTE

**Propósito:** Campos dinámicos con valores (Piso: 5, Estrato: 4)

```typescript
const Attributes = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
    slug: column.text({ unique: true }),
    type: column.text(), // "number", "text", "boolean", "select"
    unit: column.text({ optional: true }), // "años", "m²", "COP"
    options: column.json({ optional: true }),
    isRequired: column.boolean({ default: false }),
    isActive: column.boolean({ default: true }),
    displayOrder: column.number({ default: 0 }),
    createdAt: column.date({ default: NOW }),
  },
});
```

**Ejemplos:** Piso, Estrato, Antigüedad, Administración, Orientación

---

### 7. Brands ⏳ PENDIENTE

**Propósito:** Constructoras, inmobiliarias, desarrolladores

```typescript
const Brands = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text({ unique: true }),
    slug: column.text({ unique: true }),
    type: column.text(), // "constructor", "inmobiliaria", "desarrollador"
    logo: column.text({ optional: true }),
    website: column.text({ optional: true }),
    phone: column.text({ optional: true }),
    email: column.text({ optional: true }),
    description: column.text({ optional: true }),
    isActive: column.boolean({ default: true }),
    createdAt: column.date({ default: NOW }),
  },
});
```

---

## 📊 Sistema de Taxonomía

### Estado Actual

**✅ Implementado (28 diciembre 2025):**
- Tabla `Categories` con jerarquía de 2 niveles
- Tabla `PropertyCategories` (relación many-to-many)
- Seed con 11 categorías (3 padre + 8 hijas)
- 20 propiedades relacionadas
- Queries helper completas
- Validaciones de jerarquía

**⏳ Pendiente:**
- Tags (amenidades y características)
- Attributes (campos dinámicos)
- Brands (constructoras/inmobiliarias)

### Datos en Producción

**Categorías Padre (3):**
```
🏠 Residencial
💼 Comercial
🗺️ Terrenos
```

**Categorías Hijas (8):**
```
🏠 Residencial
   ├── 🏢 Apartamento
   ├── 🏡 Casa
   └── 🏞️ Finca

💼 Comercial
   ├── 🏪 Local Comercial
   ├── 🏢 Oficina
   └── 📦 Bodega

🗺️ Terrenos
   ├── 📐 Lote
   └── 🌾 Terreno Rural
```

### Queries Helper (Implementadas)

**Archivo:** `src/lib/db/categoryQueries.ts`

```typescript
// Categorías padre (nivel 0)
export async function getParentCategories()

// Hijas de un padre específico
export async function getChildCategories(parentId: string)

// Árbol completo (padre con sus hijas)
export async function getCategoryTree()

// Por slug
export async function getCategoryBySlug(slug: string)

// Categorías de una propiedad
export async function getPropertyCategories(propertyId: string)

// Propiedades de una categoría
export async function getPropertiesByCategory(categoryId: string, limit = 10)

// Contar propiedades por categoría
export async function countPropertiesByCategory(categoryId: string)
```

**Validaciones:** `src/lib/validation/categoryValidation.ts`
- Validar máximo 2 niveles
- Verificar si es padre/hija

### Plan de Implementación Futuro

#### Fase 2: Tags (3-4 días) - Prioridad Alta
1. Crear tablas `Tags` y `PropertyTags`
2. Seed con 20-30 tags comunes
3. Actualizar queries para incluir tags
4. Componente `TagBadge.vue`
5. Actualizar `ListingCard` y `PropertyDetails`

#### Fase 3: Attributes (2-3 días) - Prioridad Media
1. Crear tablas `Attributes` y `PropertyAttributes`
2. Seed con atributos básicos (Piso, Estrato, etc.)
3. Formularios dinámicos en admin
4. Mostrar atributos en detalles

#### Fase 4: Brands (1-2 días) - Prioridad Baja
1. Crear tabla `Brands`
2. Agregar `brandId` a Properties
3. Páginas de marca/constructor
4. Logo en listings

#### Fase 5: Frontend (4-5 días)
1. Componente `CategoryTree.vue`
2. Componente `FilterSidebar.vue`
3. Página `/categoria/[slug]`
4. Breadcrumbs jerárquicos
5. SEO optimization

**Estimación total restante:** 10-14 días

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

## 📊 Estado y Próximos Pasos

### ✅ Completado
- ✅ Migración de JSON a Astro DB
- ✅ Implementación de UUIDs
- ✅ Sistema de imágenes relacional (PropertiesImages)
- ✅ **Sistema de categorías jerárquicas (2 niveles)** ⭐
- ✅ **11 categorías en producción (3 padre + 8 hijas)** ⭐
- ✅ **Queries helper para categorías** ⭐
- ✅ **Validaciones de jerarquía** ⭐
- ✅ Astro Actions para paginación
- ✅ Mapeador de datos
- ✅ Seed transaccional

### 🚧 En Progreso
- 🚧 Componentes frontend para categorías

### ⏳ Pendiente

**Base de Datos:**
- ⏳ Sistema de Tags (amenidades, características) - 3-4 días
- ⏳ Sistema de Attributes (campos dinámicos) - 2-3 días
- ⏳ Sistema de Brands (constructoras/inmobiliarias) - 1-2 días
- ⏳ Eliminar campo `gallery` del schema
- ⏳ Agregar índices optimizados
- ⏳ Agregar timestamps (createdAt, updatedAt) a Properties

**Frontend:**
- ⏳ Componente `CategoryBadge.astro`
- ⏳ Componente `CategoryTree.vue`
- ⏳ Página `/categoria/[slug]`
- ⏳ Breadcrumbs jerárquicos
- ⏳ Componentes de Tags
- ⏳ Filtros avanzados

### 🎯 Próxima Fase Recomendada

**Fase 2: Tags (Alta Prioridad)**
- Agregar amenidades y características a las propiedades
- Mejorar experiencia de búsqueda y filtrado
- Estimación: 3-4 días

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm astro db push      # Aplicar cambios al schema
pnpm astro db seed      # Ejecutar seed
pnpm astro db verify    # Verificar schema
pnpm astro db studio    # Abrir GUI de base de datos

# Producción
pnpm astro db push --remote  # Aplicar a Turso/producción
```

---

## 📚 Archivos Relacionados

**Schema y Seeds:**
- [db/config.ts](../db/config.ts) - Definición de tablas
- [db/seed.ts](../db/seed.ts) - Datos iniciales

**Queries y Validaciones:**
- [src/lib/db/categoryQueries.ts](../src/lib/db/categoryQueries.ts) - Queries de categorías
- [src/lib/validation/categoryValidation.ts](../src/lib/validation/categoryValidation.ts) - Validaciones

**Mappers y Types:**
- [src/mappers/property.mapper.ts](../src/mappers/property.mapper.ts) - Transformación de datos
- [src/types/properties.ts](../src/types/properties.ts) - Interfaces TypeScript

**Documentación:**
- [ESTRUCTURA.md](ESTRUCTURA.md) - Información del proyecto
- [ASTRO.md](ASTRO.md) - Framework y arquitectura

---
∫
**Última actualización:** 28 de diciembre de 2025  
**Versión:** 2.0.0  
**Mantenido por:** Didier Méndez & Yormi Altamiranda