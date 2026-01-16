<script setup lang="ts">
import type { PropertiesWithImages } from '@/types';
import { Icon, addCollection } from '@iconify/vue';
import hugeiconsData from '@iconify-json/hugeicons/icons.json';

addCollection(hugeiconsData);

defineProps<{
  property: PropertiesWithImages;
}>();
</script>

<template>
  <article class="overflow-hidden transition-all duration-300 group">
    <!-- Imagen -->
    <div class="relative h-48 overflow-hidden rounded-xl">
      <img
        :src="property.images?.[0] || '/images/default.jpg'"
        :alt="property.title"
        class="w-full h-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div
        v-if="property.featured"
        class="absolute top-3 right-3 bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-sm shadow-md"
      >
        Destacado
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary transition line-clamp-2">
        {{ property.title }}
      </h3>
      
      <p class="text-sm text-gray-500 mb-3">
        {{ property.city }} - {{ property.neighborhood }} | {{ property.code }}
      </p>
      
      <!-- Características -->
      <div class="flex items-center gap-4 text-gray-600 text-sm mb-3">
        <span class="flex items-center gap-1">
           <Icon icon="hugeicons:arrow-expand" class="w-5 h-5" />
          {{ property.area }} m²
        </span>
        
        <span v-if="property.bedrooms > 0" class="flex items-center gap-1">
          <Icon icon="hugeicons:bed-double" class="w-5 h-5" />
          {{ property.bedrooms }} Ha.
        </span>
        
        <span v-if="property.bathrooms > 0" class="flex items-center gap-1">
          <Icon icon="hugeicons:bathtub-01" class="w-5 h-5" />
          {{ property.bathrooms }} Ba.
        </span>
      </div>
      
      <!-- Precio y participación -->
      <div class="flex items-center justify-between">
        <p class="text-xl font-bold text-primary">
          ${{ property.price.toLocaleString('es-CO') }}
        </p>
        <span class="text-xs text-gray-500">
          {{ property.participation }}
        </span>
      </div>
      
      <!-- Botón Ver más -->
      <a
        :href="`/listing/${property.slug}`"
        class="mt-4 block border border-primary text-primary font-semibold py-2 rounded-xl text-center hover:bg-primary hover:text-white transition-colors"
      >
        Ver más
      </a>
    </div>
  </article>
</template>
