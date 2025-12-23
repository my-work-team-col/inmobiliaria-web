# 🚀 Astro - Documentación Completa

> Documentación completa de Astro Framework, SSR, arquitectura, componentes, estructura del proyecto y mejores prácticas.

**Última actualización:** 2025-12-23  
**Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Migración SSG → SSR](#-migración-ssg--ssr)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Componentes](#-componentes)
4. [Astro Islands](#-astro-islands)
5. [TypeScript](#-typescript)
6. [Mejores Prácticas](#-mejores-prácticas)

---

## 🔄 Migración SSG → SSR

### Cambio de Arquitectura

**Antes:** Static Site Generation (SSG)
- `getStaticPaths()` para páginas dinámicas
- JSON mock data
- Build-time rendering

**Ahora:** Server-Side Rendering (SSR)
- `prerender = false` para SSR
- Astro DB como fuente de datos
- Runtime rendering

### Cambios Realizados

#### 1. Eliminación de `getStaticPaths()`

**Antes:**
```typescript
export const getStaticPaths = async () => {
  return listings.map((listing) => ({
    params: { slug: listing.slug },
    props: { listing },
  }));
};
```

**Ahora:**
```typescript
// No se necesita getStaticPaths
// Las páginas se renderizan en runtime
```

#### 2. Habilitación de SSR

```typescript
// src/pages/api/properties/[slug].ts
export const prerender = false; // ✅ SSR habilitado

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  
  const property = await db
    .select()
    .from(Properties)
    .where(eq(Properties.slug, slug))
    .get();

  return new Response(JSON.stringify({ ok: true, property }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

#### 3. API Endpoints Dinámicos

**Endpoints creados:**
- `GET /api/properties` - Todas las propiedades
- `GET /api/properties/[slug]` - Propiedad por slug
- `GET /api/properties/[propertyId]` - Propiedad por ID

### Beneficios de SSR

✅ **Real-time data** - Datos siempre actualizados  
✅ **No build time** - Sin pre-generación de páginas  
✅ **Escalabilidad** - Maneja grandes datasets  
✅ **SEO** - Astro maneja SSR nativamente  

---

## 📁 Estructura del Proyecto

### Arquitectura: Astro Islands

```
src/
│
├── actions/                   # Astro Actions
│   └── getPropertiesByPage.ts
│
├── components/                # Componentes
│   ├── astro/                 # Componentes Astro (estáticos)
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Categories.astro
│   │   ├── ListingSection.astro
│   │   └── ListingCard.astro
│   │
│   ├── vue/                   # Componentes Vue (NO islands)
│   │   ├── SearchFilters.vue
│   │   ├── Modal.vue
│   │   └── Dropdown.vue
│   │
│   └── islands/               # Astro Islands
│       └── SearchFiltersIsland.astro
│
├── composables/               # Composables Vue
│   ├── useFilters.ts
│   ├── useModal.ts
│   └── useSearch.ts
│
├── data/                      # Datos estáticos
│   └── properties.json
│
├── layouts/                   # Layouts de página
│   └── Layout.astro
│
├── mappers/                   # Mapeadores de datos
│   └── property.mapper.ts
│
├── pages/                     # Páginas (routing)
│   ├── index.astro
│   ├── listing/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── api/
│       └── properties/
│           ├── index.ts
│           └── [slug].ts
│
├── styles/                    # Estilos globales
│   └── global.css
│
└── types/                     # Tipos TypeScript
    ├── domain/                # Tipos de dominio
    │   ├── Property.ts
    │   └── Pagination.ts
    ├── ui/                    # Tipos de UI
    │   └── ButtonProps.ts
    └── index.ts
```

### Convenciones

#### Naming
- **Carpetas:** singular
- **Componentes Astro:** `PascalCase.astro`
- **Componentes Vue:** `PascalCase.vue`
- **Composables:** `camelCase.ts` con prefijo `use`
- **Tipos:** `PascalCase.ts`

#### Organización
- **Componentes estáticos:** `src/components/astro/`
- **Componentes Vue:** `src/components/vue/`
- **Islands:** `src/components/islands/`
- **Tipos compartidos:** `src/types/`
- **Composables:** `src/composables/`

---

## 🧩 Componentes

### Componentes Astro (Estáticos)

#### Header.astro
**Ubicación:** `src/components/astro/Header.astro`

**Props:** Ninguna

**Características:**
- Navegación responsive
- Links a secciones principales
- Botones de autenticación

**Uso:**
```astro
---
import Header from '@/components/astro/Header.astro';
---

<Header />
```

#### ListingCard.astro
**Ubicación:** `src/components/astro/ListingCard.astro`

**Props:**
```typescript
interface Props {
  property: PropertiesWithImages;
}
```

**Características:**
- ✅ Semantic HTML (`<article>`)
- ✅ TypeScript props tipadas
- ✅ Accesibilidad (ARIA labels)
- ✅ Lazy loading de imágenes
- ✅ Hover effects

**Código:**
```astro
---
import type { PropertiesWithImages } from '@/types';

interface Props {
  property: PropertiesWithImages;
}

const { property } = Astro.props;
const image = property.images[0] ?? "/images/default.jpg";
---

<article
  class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
  data-property-id={property.id}
>
  <div class="relative h-48 overflow-hidden">
    <img
      src={image}
      alt={property.title}
      class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      loading="lazy"
    />
    {property.featured && (
      <div class="absolute top-3 right-3 bg-[--color-accent] text-white text-xs font-semibold px-3 py-1 rounded-full">
        Featured
      </div>
    )}
  </div>

  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-1">
      {property.title}
    </h3>
    <p class="text-sm text-gray-500 mb-3">
      {property.location}
    </p>
    <p class="text-xl font-bold text-[--color-primary]">
      ${property.price.toLocaleString()}
    </p>
  </div>
</article>
```

---

## 🏝️ Astro Islands

### ¿Qué son las Islands?

Astro Islands es un patrón de arquitectura que permite:
- **Hidratación parcial** - Solo componentes interactivos se hidratan
- **Performance óptimo** - Menos JavaScript en el cliente
- **Componentes aislados** - Cada island es independiente

### Directivas `client:*`

| Directiva | Cuándo se hidrata | Uso recomendado |
|-----------|-------------------|------------------|
| `client:load` | Inmediatamente al cargar | Componentes críticos |
| `client:idle` | Cuando el navegador está inactivo | Componentes importantes |
| `client:visible` | Cuando el componente es visible | Componentes below the fold |
| `client:media` | Según media query | Componentes responsive |
| `client:only="vue"` | Solo en cliente (no SSR) | Componentes con window/document |

### Ejemplo de Island

```astro
---
// src/components/islands/SearchFiltersIsland.astro
import SearchFilters from "@/components/vue/SearchFilters.vue";
---

<SearchFilters client:visible />
```

**Uso en página:**
```astro
---
import SearchFiltersIsland from '@/components/islands/SearchFiltersIsland.astro';
---

<SearchFiltersIsland />
```

---

## 📘 TypeScript

### Configuración

**tsconfig.json:**
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "preserve"
  }
}
```

### Tipos Principales

#### Property Types
```typescript
// src/types/domain/Property.ts
export interface Property {
  id: string;
  title: string;
  slug: string;
  categories: string[];
  isActive: boolean;
  featured: boolean;
  location: string;
  city: string;
  neighborhood: string;
  code: string;
  description: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  price: number;
  participation: string;
  address: string;
  observations: string;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  image: string;
}

export interface PropertiesWithImages extends Property {
  images: string[];
  gallery: string[];
}
```

### Props en Componentes

```astro
---
interface Props {
  title: string;
  description?: string; // Opcional
}

const { title, description = "Default" } = Astro.props;
---

<div>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>
```

---

## ✅ Mejores Prácticas

### 1. Componentes

✅ **DO:**
- Mantén componentes pequeños y enfocados
- Usa TypeScript para todas las props
- Usa semantic HTML
- Agrega ARIA labels
- Usa `loading="lazy"` en imágenes

❌ **DON'T:**
- No crees componentes gigantes
- No uses `<div>` cuando hay elemento semántico
- No olvides la accesibilidad

### 2. Islands

✅ **DO:**
- Usa `client:visible` para componentes below the fold
- Usa `client:idle` para componentes no críticos
- Mantén islands pequeñas

❌ **DON'T:**
- No uses `client:load` en todos los componentes
- No mezcles lógica de negocio en componentes UI

### 3. TypeScript

✅ **DO:**
- Define interfaces para todas las props
- Usa tipos explícitos
- Crea archivo `types/index.ts` para tipos compartidos

❌ **DON'T:**
- No uses `any`
- No ignores errores de TypeScript

### 4. Performance

✅ **DO:**
- Usa `loading="lazy"` en imágenes
- Optimiza imágenes
- Minimiza JavaScript

❌ **DON'T:**
- No cargues todas las imágenes al inicio
- No uses imágenes sin optimizar

---

## 🔧 Configuración de Astro

### astro.config.mjs

```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";
import icon from "astro-icon";
import db from "@astrojs/db";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  integrations: [
    vue(),           // Vue.js Islands
    icon(),          // Sistema de iconos
    db()             // Astro DB
  ],
  adapter: cloudflare(),  // Deployment en Cloudflare
  
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@data": "/src/data"
      }
    }
  },
});
```

---

## 📚 Recursos Adicionales

- [Astro Documentation](https://docs.astro.build)
- [Astro DB Documentation](https://docs.astro.build/en/guides/astro-db/)
- [Astro Islands](https://docs.astro.build/en/concepts/islands/)
- [TypeScript in Astro](https://docs.astro.build/en/guides/typescript/)

---

**Última actualización:** 2025-12-23  
**Versión:** 1.0.0  
**Mantenido por:** Yorrmi Altamiranda & Didier Méndez
