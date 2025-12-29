<script setup lang="ts">
import type { PropertiesWithImages } from '@/types';

defineProps<{
  property: PropertiesWithImages;
}>();
</script>

<template>
  <article class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
    <!-- Imagen -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="property.images?.[0] || '/images/default.jpg'"
        :alt="property.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div
        v-if="property.featured"
        class="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md"
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
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          {{ property.area }} m²
        </span>
        
        <span v-if="property.bedrooms > 0" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          {{ property.bedrooms }} Ha.
        </span>
        
        <span v-if="property.bathrooms > 0" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
          </svg>
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
