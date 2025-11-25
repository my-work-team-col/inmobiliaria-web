# 🚀 Guía de Migración a Vue.js

Esta guía te ayudará a integrar Vue.js en tu proyecto Astro de forma progresiva.

## 📋 Tabla de Contenidos

1. [Instalación de Vue](#instalación-de-vue)
2. [Configuración de Astro](#configuración-de-astro)
3. [Migración de Componentes](#migración-de-componentes)
4. [Gestión de Estado](#gestión-de-estado)
5. [Mejores Prácticas](#mejores-prácticas)

---

## 1. Instalación de Vue

### Paso 1: Instalar dependencias

```bash
pnpm add vue
pnpm add -D @astrojs/vue
```

### Paso 2: Configurar Astro

Edita `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";

export default defineConfig({
  integrations: [vue()],
});
```

---

## 2. Configuración de Astro

### Directiva `client:*`

Astro permite controlar cuándo se hidrata un componente Vue:

- `client:load` - Hidrata inmediatamente al cargar la página
- `client:idle` - Hidrata cuando el navegador está inactivo
- `client:visible` - Hidrata cuando el componente es visible
- `client:media` - Hidrata según media query
- `client:only="vue"` - Solo renderiza en el cliente (no SSR)

**Ejemplo:**

```astro
<PropertyCard client:visible {...property} />
```

---

## 3. Migración de Componentes

### 🎯 Componente Objetivo: `PropertyCard`

Este componente es ideal para migrar a Vue porque:

- ✅ Es reutilizable
- ✅ Tendrá interactividad (favoritos, modal, etc.)
- ✅ Maneja estado local

### Paso a Paso: PropertyCard.astro → PropertyCard.vue

#### **Antes (PropertyCard.astro)**

```astro
---
interface Props {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
}

const { id, title, location, price, image } = Astro.props;
---

<article class="...">
  <img :src="image" :alt="title" />
  <h3>{title}</h3>
  <p>{location}</p>
  <p>${price}</p>
</article>
```

#### **Después (PropertyCard.vue)**

Crea `src/components/PropertyCard.vue`:

```vue
<script setup lang="ts">
import { ref } from "vue";

interface Props {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  featured?: boolean;
}

const props = defineProps<Props>();

// Estado reactivo para favoritos
const isFavorite = ref(false);

// Función para toggle favoritos
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  // Aquí puedes agregar lógica para guardar en localStorage o API
  console.log(`Property ${props.id} favorite:`, isFavorite.value);
};

// Función para abrir modal de detalles
const openDetails = () => {
  console.log("Opening details for property:", props.id);
  // Emitir evento o navegar a página de detalles
};
</script>

<template>
  <article
    class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
    :data-property-id="id"
    @click="openDetails"
  >
    <div class="relative h-48 overflow-hidden">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div
        v-if="featured"
        class="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
      >
        Featured
      </div>
    </div>

    <div class="p-4">
      <h3
        class="text-lg font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors"
      >
        {{ title }}
      </h3>
      <p class="text-sm text-gray-500 mb-3 flex items-center gap-1">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        {{ location }}
      </p>
      <div class="flex items-center justify-between">
        <p class="text-xl font-bold text-purple-600">
          ${{ price.toLocaleString() }}
        </p>
        <button
          @click.stop="toggleFavorite"
          class="transition-colors"
          :class="
            isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-purple-600'
          "
          :aria-label="
            isFavorite ? 'Remove from favorites' : 'Add to favorites'
          "
        >
          <svg
            class="w-6 h-6"
            :fill="isFavorite ? 'currentColor' : 'none'"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>
```

#### **Actualizar Featured.astro**

```astro
---
import PropertyCard from './PropertyCard.vue'; // Cambiar .astro por .vue
import propertiesData from '../data/properties.json';

const featuredProperties = propertiesData.filter(property => property.featured);
---

<section class="w-full py-6 px-16" aria-labelledby="featured-heading">
  <!-- ... header ... -->

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {featuredProperties.map((property) => (
      <PropertyCard
        client:visible
        {...property}
      />
    ))}
  </div>
</section>
```

---

## 4. Gestión de Estado

### Opción 1: Pinia (Recomendado)

```bash
pnpm add pinia
```

**Crear store para propiedades:**

```typescript
// src/stores/properties.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePropertiesStore = defineStore("properties", () => {
  const favorites = ref<number[]>([]);

  const addFavorite = (id: number) => {
    if (!favorites.value.includes(id)) {
      favorites.value.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites.value));
    }
  };

  const removeFavorite = (id: number) => {
    favorites.value = favorites.value.filter((fav) => fav !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  };

  const isFavorite = (id: number) => {
    return favorites.value.includes(id);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
});
```

**Usar en PropertyCard.vue:**

```vue
<script setup lang="ts">
import { usePropertiesStore } from "../stores/properties";

const props = defineProps<Props>();
const store = usePropertiesStore();

const toggleFavorite = () => {
  if (store.isFavorite(props.id)) {
    store.removeFavorite(props.id);
  } else {
    store.addFavorite(props.id);
  }
};
</script>
```

### Opción 2: Composables (Para estado simple)

```typescript
// src/composables/useFavorites.ts
import { ref } from "vue";

const favorites = ref<number[]>([]);

export function useFavorites() {
  const addFavorite = (id: number) => {
    if (!favorites.value.includes(id)) {
      favorites.value.push(id);
    }
  };

  const removeFavorite = (id: number) => {
    favorites.value = favorites.value.filter((fav) => fav !== id);
  };

  const isFavorite = (id: number) => {
    return favorites.value.includes(id);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
```

---

## 5. Mejores Prácticas

### ✅ DO's

1. **Usa `client:visible` para componentes below the fold**

   ```astro
   <PropertyCard client:visible {...property} />
   ```

2. **Mantén componentes pequeños y enfocados**
   - Un componente = Una responsabilidad

3. **Usa TypeScript para props**

   ```typescript
   defineProps<Props>();
   ```

4. **Emite eventos para comunicación padre-hijo**

   ```vue
   const emit = defineEmits<{ favoriteToggled: [id: number, isFavorite: boolean]
   }>();
   ```

5. **Usa composables para lógica reutilizable**

### ❌ DON'Ts

1. **No uses `client:load` en todos los componentes**
   - Afecta el performance

2. **No mezcles lógica de negocio en componentes de UI**
   - Usa stores o composables

3. **No olvides el SSR**
   - Astro hace SSR por defecto, aprovéchalo

---

## 🎯 Plan de Migración Sugerido

### Fase 1: Setup (1 día)

- [ ] Instalar Vue y configurar Astro
- [ ] Crear estructura de carpetas para Vue
- [ ] Configurar TypeScript

### Fase 2: Componentes Interactivos (1 semana)

- [ ] Migrar `PropertyCard.astro` → `PropertyCard.vue`
- [ ] Agregar funcionalidad de favoritos
- [ ] Crear modal de detalles
- [ ] Migrar otros componentes interactivos

### Fase 3: Estado Global (3 días)

- [ ] Instalar y configurar Pinia
- [ ] Crear store de propiedades
- [ ] Crear store de favoritos
- [ ] Crear store de búsqueda/filtros

### Fase 4: Optimización (2 días)

- [ ] Optimizar directivas `client:*`
- [ ] Lazy loading de componentes
- [ ] Testing de componentes Vue

---

## 📚 Recursos Adicionales

- [Astro + Vue Docs](https://docs.astro.build/en/guides/integrations-guide/vue/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

## 🆘 Troubleshooting

### Error: "Cannot find module '@astrojs/vue'"

```bash
pnpm add -D @astrojs/vue
```

### Error: "Vue component not hydrating"

Asegúrate de usar una directiva `client:*`:

```astro
<PropertyCard client:visible {...props} />
```

### Performance issues

- Usa `client:idle` o `client:visible` en lugar de `client:load`
- Implementa lazy loading para componentes pesados

---

**Última actualización:** 2025-11-21  
**Versión:** 1.0.0
