# 📚 Documentación del Proyecto - Inmobiliaria Web

> Documentación completa del proyecto de sitio web inmobiliario construido con Astro, TypeScript y Tailwind CSS.

**Última actualización:** 2025-11-21  
**Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Componentes](#componentes)
5. [Gestión de Datos](#gestión-de-datos)
6. [TypeScript](#typescript)
7. [Guías de Uso](#guías-de-uso)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Descripción General

Este proyecto es un sitio web inmobiliario moderno construido con **Astro**, que permite mostrar propiedades destacadas, categorías y un sistema de búsqueda. El proyecto está estructurado siguiendo las mejores prácticas de desarrollo web moderno, con énfasis en:

- ✅ **Performance**: SSR con Astro para carga rápida
- ✅ **Type Safety**: TypeScript en todos los componentes
- ✅ **Accesibilidad**: Semantic HTML y ARIA labels
- ✅ **Mantenibilidad**: Componentes modulares y reutilizables
- ✅ **Escalabilidad**: Preparado para integración con Vue.js

---

## 📁 Estructura del Proyecto

```
inmobiliaria-web/
├── docs/                          # Documentación del proyecto
│   ├── PROJECT_DOCUMENTATION.md   # Este archivo
│   └── VUE_MIGRATION_GUIDE.md     # Guía de migración a Vue
├── public/                        # Archivos estáticos
├── src/
│   ├── assets/                    # Imágenes, iconos, etc.
│   ├── components/                # Componentes Astro
│   │   ├── Header.astro          # Navegación principal
│   │   ├── Hero.astro            # Sección hero con búsqueda
│   │   ├── Categories.astro      # Categorías de propiedades
│   │   ├── Featured.astro        # Sección de propiedades destacadas
│   │   └── PropertyCard.astro    # Tarjeta de propiedad (reutilizable)
│   ├── data/                      # Datos en JSON
│   │   └── properties.json       # Base de datos de propiedades
│   ├── layouts/                   # Layouts de página
│   │   └── Layout.astro          # Layout principal
│   ├── pages/                     # Páginas del sitio
│   │   └── index.astro           # Página de inicio
│   └── styles/                    # Estilos globales
│       └── global.css            # Estilos CSS globales
├── astro.config.mjs              # Configuración de Astro
├── package.json                   # Dependencias del proyecto
├── tsconfig.json                  # Configuración de TypeScript
└── tailwind.config.mjs           # Configuración de Tailwind CSS
```

---

## 🛠️ Tecnologías Utilizadas

### Core

| Tecnología       | Versión | Propósito                     |
| ---------------- | ------- | ----------------------------- |
| **Astro**        | 4.x     | Framework principal (SSR/SSG) |
| **TypeScript**   | 5.x     | Type safety y mejor DX        |
| **Tailwind CSS** | 3.x     | Estilos utility-first         |
| **pnpm**         | 8.x     | Gestor de paquetes            |

### Futuras Integraciones

| Tecnología | Estado      | Propósito                |
| ---------- | ----------- | ------------------------ |
| **Vue.js** | 🔜 Planeado | Componentes interactivos |
| **Pinia**  | 🔜 Planeado | Gestión de estado        |

---

## 🧩 Componentes

### 1. Header.astro

**Ubicación:** `src/components/Header.astro`

**Descripción:** Navegación principal del sitio con logo y menú.

**Props:** Ninguna

**Características:**

- Navegación responsive
- Links a secciones principales
- Botones de autenticación (Login/Signup)

**Uso:**

```astro
---
import Header from '../components/Header.astro';
---

<Header />
```

---

### 2. Hero.astro

**Ubicación:** `src/components/Hero.astro`

**Descripción:** Sección hero con imagen de fondo y barra de búsqueda.

**Props:** Ninguna

**Características:**

- Imagen de fondo full-width
- Título y subtítulo
- Barra de búsqueda con filtros
- Diseño responsive

**Uso:**

```astro
---
import Hero from '../components/Hero.astro';
---

<Hero />
```

---

### 3. Categories.astro

**Ubicación:** `src/components/Categories.astro`

**Descripción:** Muestra las categorías de propiedades disponibles.

**Props:** Ninguna

**Características:**

- Grid de categorías
- Iconos SVG personalizados
- Hover effects

**Uso:**

```astro
---
import Categories from '../components/Categories.astro';
---

<Categories />
```

---

### 4. Featured.astro

**Ubicación:** `src/components/Featured.astro`

**Descripción:** Sección que muestra las propiedades destacadas consumiendo datos desde JSON.

**Props:** Ninguna (consume datos internamente)

**TypeScript Interface:**

```typescript
interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured: boolean;
}
```

**Características:**

- ✅ Consume datos desde `properties.json`
- ✅ Filtra propiedades con `featured: true`
- ✅ Usa componente `PropertyCard` para renderizar
- ✅ Semantic HTML (`<header>`, `<section>`)
- ✅ Accesibilidad (ARIA labels)
- ✅ Estado vacío (mensaje cuando no hay propiedades)

**Código:**

```astro
---
import PropertyCard from './PropertyCard.astro';
import propertiesData from '../data/properties.json';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured: boolean;
}

const featuredProperties = propertiesData.filter((property: Property) => property.featured);
---

<section class="w-full py-6 px-16" aria-labelledby="featured-heading">
  <div class="w-full py-16 px-24 bg-gray-50 rounded-3xl">
    <div class="max-w-7xl mx-auto">
      <header class="flex justify-between items-end mb-8">
        <!-- Header content -->
      </header>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        role="list"
        aria-label="Featured properties"
      >
        {featuredProperties.map((property: Property) => (
          <PropertyCard {...property} />
        ))}
      </div>

      {featuredProperties.length === 0 && (
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">No featured properties available.</p>
        </div>
      )}
    </div>
  </div>
</section>
```

**Uso:**

```astro
---
import Featured from '../components/Featured.astro';
---

<Featured />
```

---

### 5. PropertyCard.astro ⭐

**Ubicación:** `src/components/PropertyCard.astro`

**Descripción:** Componente reutilizable para mostrar una tarjeta de propiedad individual.

**Props (TypeScript Interface):**

```typescript
interface Props {
  id: number; // ID único de la propiedad
  title: string; // Nombre de la propiedad
  location: string; // Ubicación (ciudad, código postal)
  price: number; // Precio en USD
  image: string; // URL de la imagen
  featured?: boolean; // Opcional: si es destacada
}
```

**Características:**

- ✅ **Semantic HTML**: Usa `<article>` en lugar de `<div>`
- ✅ **TypeScript**: Props tipadas con interface
- ✅ **Accesibilidad**:
  - `data-property-id` para identificación
  - `aria-label` en botones
  - `loading="lazy"` en imágenes
- ✅ **Interactividad**:
  - Badge "Featured" condicional
  - Icono de ubicación
  - Botón de favoritos
  - Hover effects (zoom en imagen, cambio de color)
- ✅ **Formato de precio**: Usa `toLocaleString()` para formato con comas
- ✅ **Transiciones suaves**: `transition-all duration-300`

**Código Completo:**

```astro
---
interface Props {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured?: boolean;
}

const { id, title, location, price, image } = Astro.props;
---

<article
  class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
  data-property-id={id}
>
  <div class="relative h-48 overflow-hidden">
    <img
      src={image}
      alt={title}
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
    />
    <div class="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
      Featured
    </div>
  </div>

  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
      {title}
    </h3>
    <p class="text-sm text-gray-500 mb-3 flex items-center gap-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      {location}
    </p>
    <div class="flex items-center justify-between">
      <p class="text-xl font-bold text-purple-600">${price.toLocaleString()}</p>
      <button
        class="text-gray-400 hover:text-purple-600 transition-colors"
        aria-label="Add to favorites"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>
    </div>
  </div>
</article>
```

**Uso:**

```astro
---
import PropertyCard from '../components/PropertyCard.astro';

const property = {
  id: 1,
  title: "The Grand Estate",
  location: "Moscow, 1218",
  price: 521,
  image: "https://example.com/image.jpg",
  featured: true
};
---

<!-- Opción 1: Pasar props individualmente -->
<PropertyCard
  id={property.id}
  title={property.title}
  location={property.location}
  price={property.price}
  image={property.image}
  featured={property.featured}
/>

<!-- Opción 2: Spread operator (recomendado) -->
<PropertyCard {...property} />

<!-- Opción 3: En un map -->
{properties.map((property) => (
  <PropertyCard {...property} />
))}
```

**Variantes de Uso:**

1. **Sin badge "Featured":**

```astro
<PropertyCard
  id={1}
  title="Modern Apartment"
  location="New York, NY"
  price={1200}
  image="/images/apt.jpg"
/>
```

2. **Con badge "Featured":**

```astro
<PropertyCard
  id={2}
  title="Luxury Villa"
  location="Miami, FL"
  price={5000}
  image="/images/villa.jpg"
  featured={true}
/>
```

---

## 📊 Gestión de Datos

### properties.json

**Ubicación:** `src/data/properties.json`

**Descripción:** Base de datos en formato JSON que almacena todas las propiedades del sitio.

**Estructura:**

```json
[
  {
    "id": 1,
    "title": "The Grand Estate",
    "location": "Moscow, 1218",
    "price": 521,
    "image": "https://dummyimage.com/400x300/ededed/3b3b3b",
    "featured": true
  },
  {
    "id": 2,
    "title": "Hostel Estate",
    "location": "Moscow, 1218",
    "price": 412,
    "image": "https://dummyimage.com/400x300/ededed/3b3b3b",
    "featured": true
  }
]
```

**Campos:**

| Campo      | Tipo      | Requerido | Descripción                         |
| ---------- | --------- | --------- | ----------------------------------- |
| `id`       | `number`  | ✅        | Identificador único de la propiedad |
| `title`    | `string`  | ✅        | Nombre/título de la propiedad       |
| `location` | `string`  | ✅        | Ubicación (ciudad, código postal)   |
| `price`    | `number`  | ✅        | Precio en USD (sin símbolo $)       |
| `image`    | `string`  | ✅        | URL de la imagen principal          |
| `featured` | `boolean` | ✅        | Si la propiedad es destacada        |

**Cómo Agregar una Nueva Propiedad:**

1. Abre `src/data/properties.json`
2. Agrega un nuevo objeto al array:

```json
{
  "id": 5,
  "title": "Sunset Beach House",
  "location": "Malibu, CA 90265",
  "price": 3500,
  "image": "https://example.com/beach-house.jpg",
  "featured": true
}
```

3. Guarda el archivo
4. El componente `Featured.astro` automáticamente mostrará la nueva propiedad

**Cómo Consumir los Datos:**

```astro
---
import propertiesData from '../data/properties.json';

// Todas las propiedades
const allProperties = propertiesData;

// Solo propiedades destacadas
const featuredProperties = propertiesData.filter(p => p.featured);

// Propiedades por precio
const expensiveProperties = propertiesData.filter(p => p.price > 500);

// Ordenar por precio
const sortedByPrice = [...propertiesData].sort((a, b) => a.price - b.price);
---
```

---

## 📘 TypeScript

### ¿Por qué TypeScript?

TypeScript nos proporciona:

- ✅ **Type Safety**: Detecta errores en tiempo de desarrollo
- ✅ **Autocompletado**: Mejor experiencia de desarrollo
- ✅ **Documentación**: Las interfaces sirven como documentación
- ✅ **Refactoring**: Más seguro y fácil

### Interfaces Principales

#### Property Interface

```typescript
interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured: boolean;
}
```

**Uso en componentes:**

```astro
---
import type { Property } from '../types'; // Si creas un archivo de tipos

// O definir inline
interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured: boolean;
}

// Tipar variables
const properties: Property[] = propertiesData;

// Tipar parámetros de función
const filterFeatured = (properties: Property[]): Property[] => {
  return properties.filter(p => p.featured);
};
---
```

### Props en Componentes Astro

**Definir Props con TypeScript:**

```astro
---
interface Props {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured?: boolean; // Opcional con ?
}

const { id, title, location, price, image, featured = false } = Astro.props;
---
```

**Ventajas:**

- ✅ Autocompletado al usar el componente
- ✅ Errores si faltan props requeridas
- ✅ Errores si el tipo de prop es incorrecto

### Crear Archivo de Tipos Compartidos

**Ubicación:** `src/types/index.ts`

```typescript
// src/types/index.ts

export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}
```

**Uso:**

```astro
---
import type { Property, Category } from '../types';

const properties: Property[] = propertiesData;
const categories: Category[] = categoriesData;
---
```

---

## 📖 Guías de Uso

### Cómo Agregar un Nuevo Componente

1. **Crear el archivo:**

   ```bash
   touch src/components/NuevoComponente.astro
   ```

2. **Definir la estructura:**

   ```astro
   ---
   interface Props {
     // Define tus props aquí
     title: string;
     description?: string;
   }

   const { title, description } = Astro.props;
   ---

   <div>
     <h2>{title}</h2>
     {description && <p>{description}</p>}
   </div>

   <style>
     /* Estilos scoped del componente */
   </style>
   ```

3. **Importar y usar:**

   ```astro
   ---
   import NuevoComponente from '../components/NuevoComponente.astro';
   ---

   <NuevoComponente title="Hola" description="Mundo" />
   ```

### Cómo Modificar Estilos

**Opción 1: Tailwind CSS (Recomendado)**

```astro
<div class="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700">
  Contenido
</div>
```

**Opción 2: CSS Scoped**

```astro
<div class="custom-box">
  Contenido
</div>

<style>
  .custom-box {
    background: linear-gradient(to right, #667eea, #764ba2);
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>
```

**Opción 3: CSS Global**

```css
/* src/styles/global.css */
.custom-button {
  @apply bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700;
}
```

### Cómo Hacer Fetch de Datos Externos

```astro
---
// Fetch en build time (SSG)
const response = await fetch('https://api.example.com/properties');
const properties = await response.json();

// O usar con try/catch
let properties = [];
try {
  const response = await fetch('https://api.example.com/properties');
  properties = await response.json();
} catch (error) {
  console.error('Error fetching properties:', error);
}
---

<div>
  {properties.map(property => (
    <PropertyCard {...property} />
  ))}
</div>
```

---

## ✅ Mejores Prácticas

### 1. Componentes

✅ **DO:**

- Mantén componentes pequeños y enfocados (Single Responsibility)
- Usa TypeScript para todas las props
- Usa semantic HTML (`<article>`, `<section>`, `<header>`, etc.)
- Agrega `aria-label` y `aria-labelledby` para accesibilidad
- Usa `loading="lazy"` en imágenes

❌ **DON'T:**

- No crees componentes gigantes con múltiples responsabilidades
- No uses `<div>` cuando hay un elemento semántico apropiado
- No olvides la accesibilidad

### 2. TypeScript

✅ **DO:**

- Define interfaces para todas las props
- Usa tipos explícitos en funciones
- Crea un archivo `types/index.ts` para tipos compartidos
- Usa `?` para props opcionales

❌ **DON'T:**

- No uses `any` (usa `unknown` si es necesario)
- No ignores errores de TypeScript

### 3. Datos

✅ **DO:**

- Usa JSON para datos estáticos
- Valida datos antes de usarlos
- Maneja estados vacíos (ej: `properties.length === 0`)

❌ **DON'T:**

- No hardcodees datos en componentes
- No asumas que los datos siempre existen

### 4. Estilos

✅ **DO:**

- Usa Tailwind CSS para consistencia
- Usa clases utilitarias de Tailwind
- Agrupa clases relacionadas
- Usa `hover:`, `focus:`, `active:` para estados

❌ **DON'T:**

- No uses estilos inline (`style=""`)
- No dupliques estilos (crea componentes reutilizables)

### 5. Performance

✅ **DO:**

- Usa `loading="lazy"` en imágenes
- Optimiza imágenes antes de subirlas
- Usa formatos modernos (WebP, AVIF)
- Minimiza el uso de JavaScript

❌ **DON'T:**

- No cargues todas las imágenes al inicio
- No uses imágenes sin optimizar

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview

# Linting
pnpm lint

# Format código
pnpm format
```

---

## 📚 Recursos Adicionales

- [Astro Documentation](https://docs.astro.build/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vue Migration Guide](./VUE_MIGRATION_GUIDE.md)

---

## 🆘 Troubleshooting

### Error: "Cannot find module"

```bash
pnpm install
```

### Error: TypeScript no reconoce las props

Asegúrate de definir la interface `Props`:

```astro
---
interface Props {
  title: string;
}
---
```

### Error: Tailwind classes no funcionan

1. Verifica que `tailwind.config.mjs` incluya tus archivos
2. Importa Tailwind en `src/styles/global.css`
3. Reinicia el servidor de desarrollo

---

**Mantenido por:** Equipo de Desarrollo  
**Contacto:** [tu-email@example.com]
