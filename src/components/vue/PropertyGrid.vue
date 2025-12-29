<script setup lang="ts">
import PropertyCard from './PropertyCard.vue';
import type { PropertiesWithImages } from '@/types';

defineProps<{
  properties: PropertiesWithImages[];
  totalProperties: number;
}>();
</script>

<template>
  <div>
    <!-- Grid de propiedades -->
    <TransitionGroup 
      v-if="properties.length > 0"
      name="list"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <PropertyCard 
        v-for="property in properties"
        :key="property.id"
        :property="property"
      />
    </TransitionGroup>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="max-w-md mx-auto">
        <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No se encontraron propiedades
        </h3>
        <p class="text-gray-500 mb-4">
          Intenta ajustar los filtros para ver más resultados
        </p>
        <p class="text-sm text-gray-400">
          Hay {{ totalProperties }} propiedades disponibles en total
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
