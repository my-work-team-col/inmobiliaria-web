# AGENTS.md

Guía para agentes de IA trabajando en el proyecto Inmobiliaria Web.

## Setup Rápido

```bash
# Instalar dependencias
pnpm install

# Configurar base de datos local (primera vez)
pnpm astro db push --force-reset

# Servidor de desarrollo
pnpm dev
# → http://localhost:4321

# Build para producción
pnpm build

# Preview del build
pnpm preview
```

## Comandos de Base de Datos

```bash
# Push schema a BD local (con reset y seed)
pnpm astro db push --force-reset

# Abrir GUI de BD
pnpm astro db studio

# Push schema a producción (Turso)
pnpm astro db push --remote

# Scripts personalizados
pnpm db:change-category    # Cambiar categorías de propiedades
pnpm db:search-change      # Buscar y cambiar datos
```

## Estructura del Proyecto

```
src/
├── actions/          # Astro Actions (operaciones de servidor)
├── components/
│   ├── astro/       # Componentes estáticos (.astro)
│   └── vue/         # Componentes interactivos (.vue)
├── composables/     # Composables de Vue (prefijo use*)
├── layouts/         # Layouts de página
├── lib/
│   ├── db/          # Queries helper y utilidades de BD
│   └── validation/  # Validaciones (categoryValidation.ts)
├── mappers/         # Transformadores de datos (property.mapper.ts)
├── pages/           # Routing file-based
│   ├── index.astro
│   ├── listing/     # Páginas de listados
│   └── api/         # API endpoints (/api/properties)
├── styles/          # CSS global
└── types/           # Tipos TypeScript

db/
├── config.ts        # Schema de Astro DB (7 tablas)
└── seed.ts          # Datos iniciales con Faker.js
```

## Base de Datos

**Motor:** Astro DB (SQLite local, Turso en producción)  
**ORM:** Drizzle (integrado)  
**IDs:** UUIDs v4 como Primary Keys

**Tablas principales:**
- `Properties` - Propiedades inmobiliarias (38 registros)
- `PropertiesImages` - Imágenes (relación 1:N con Properties)
- `Categories` - 11 categorías jerárquicas (2 niveles: 3 padre + 8 hijas)
- `PropertyCategories` - Tabla pivot Many-to-Many
- `Tags`, `Attributes`, `Brands` - Pendientes de implementar

**Queries helper disponibles** (en `src/lib/db/categoryQueries.ts`):
```typescript
getAllCategories()
getCategoryById(id)
getParentCategories()
getChildCategories()
getCategoriesByProperty(propertyId)
```

## Convenciones de Código

### Naming
- **Componentes:** PascalCase (ej: `PropertyCard.astro`, `SearchFilter.vue`)
- **Composables:** camelCase con prefijo `use` (ej: `useFilters.ts`)
- **Tipos:** PascalCase (ej: `Property.ts`)
- **Carpetas:** singular dentro de src/ (ej: `component/`, no `components/`)

### TypeScript
- **Strict mode** habilitado
- **Path alias:** `@/*` → `./src/*`, `@data/*` → `./src/data/*`
- **Interfaces explícitas** para props de componentes

### Componentes Astro vs Vue

**Usar .astro cuando:**
- Contenido estático, sin interactividad
- SEO crítico
- Renderizado del servidor

**Usar .vue cuando:**
- Interactividad del lado del cliente
- Estado reactivo
- Formularios, filtros, modales

**Directivas de hidratación:**
```astro
<SearchFilter client:load />      <!-- Inmediatamente -->
<PropertyCard client:visible />   <!-- Cuando es visible -->
<Modal client:idle />             <!-- Cuando el navegador está idle -->
<Icon client:only="vue" />        <!-- Solo cliente (no SSR) -->
```

### Sistema de Iconos

**En archivos .astro:**
```astro
---
import { Icon } from '@iconify/vue';
---
<Icon icon="hugeicons:home-01" class="w-6 h-6" client:only="vue" />
```

**En archivos .vue:**
```vue
<script setup>
import { Icon } from '@iconify/vue';
</script>
<template>
  <Icon icon="hugeicons:building-03" class="w-5 h-5" />
</template>
```

**Set de iconos:** Hugeicons (`@iconify-json/hugeicons`)  
**19+ iconos implementados:** home, building, bed, bath, menu, bookmark, share, location, etc.

## Sistema de Colores

Variables CSS disponibles en Tailwind:
```html
<div class="bg-[--color-primary]">      <!-- #2C42D0 Azul -->
<div class="bg-[--color-accent]">       <!-- #D52B1E Rojo -->
<div class="text-[--color-foreground]"> <!-- #404040 Texto -->
<div class="bg-[--color-muted]">        <!-- #DEDEDE Gris claro -->
```

## Cosas Importantes - NO Hacer ❌

```bash
❌ No uses `getStaticPaths()` 
   → Proyecto migrado a SSR, usa queries directas

❌ No consultes `src/data/properties.json`
   → Usa Astro DB con queries o Actions

❌ No uses emojis para iconos
   → Usa Iconify con Hugeicons

❌ No importes `astro-icon` en archivos .vue
   → Usa `@iconify/vue` en Vue, `@iconify/vue` + `client:only="vue"` en Astro

❌ No mezcles el campo `gallery` (legacy)
   → Usa la tabla `PropertiesImages` con el mapeador

❌ No crees UUIDs con `crypto.randomUUID()`
   → Importa `randomUUID` desde `node:crypto`
```

## Cosas Importantes - SÍ Hacer ✅

```bash
✅ Usa Astro Actions para operaciones de servidor
   → Ver src/actions/properties/

✅ Usa el mapeador para transformar datos de BD
   → import { propertyMapper } from '@/mappers/property.mapper'

✅ Valida categorías antes de insertar
   → import { categoryValidation } from '@/lib/validation/categoryValidation'

✅ Usa queries helper de BD
   → import { getAllCategories } from '@/lib/db/categoryQueries'

✅ Mantén componentes Astro estáticos, Vue interactivos
   → Arquitectura Islands de Astro

✅ Usa UUIDs para todas las Primary Keys
   → import { randomUUID } from 'node:crypto'
```

## Sistema de Taxonomía

**Estado actual:**
- ✅ **Categories** - Implementado (11 categorías, 2 niveles)
- ⏳ **Tags** - Pendiente (amenidades: piscina, gimnasio)
- ⏳ **Attributes** - Pendiente (campos dinámicos por categoría)
- ⏳ **Brands** - Pendiente (constructoras/inmobiliarias)

**11 categorías en producción:**
- **Padre:** Residencial, Comercial, Terrenos
- **Hijas:** Apartamento, Casa, Finca, Local Comercial, Oficina, Bodega, Lote, Terreno Rural

## Testing y Validación

```bash
# Verificar tipos TypeScript
pnpm astro check

# Build de producción (validación completa)
pnpm build

# Verificar errores de BD
pnpm db:studio  # Revisar datos visualmente
```

## Deployment

**Plataforma:** Cloudflare Pages/Workers  
**Adapter:** `@astrojs/cloudflare` (configurado en astro.config.mjs)  
**BD Producción:** Turso (SQLite distribuido)

**Variables de entorno requeridas:**
```env
TURSO_DATABASE_URL=libsql://[project].turso.io
TURSO_AUTH_TOKEN=eyJ...
```

## Documentación Adicional

Para contexto detallado, consulta:
- `docs/README.md` - Índice completo de documentación
- `docs/BASE-DE-DATOS.md` ⭐ - Schema completo, migraciones, taxonomía
- `docs/ASTRO.md` - Framework, SSR, Islands Architecture
- `docs/VUE.md` - Integración Vue.js con Astro
- `docs/DISEÑO-UX-UI.md` - Sistema de diseño y colores
- `docs/CHANGELOG-DOCS.md` - Historial de cambios

---

**Última actualización:** 6 de enero de 2026  
**Mantenedores:** Didier Méndez, Yormi Altamiranda
