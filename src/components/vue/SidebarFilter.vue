<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon, addCollection } from '@iconify/vue';
import type { Filters } from '@/composables/usePropertyFilters';

// Cargar colección hugeicons offline
import hugeiconsData from '@iconify-json/hugeicons/icons.json';
addCollection(hugeiconsData);

const filters = defineModel<Filters>({ required: true });

defineProps<{
  total: number;
  activeCount: number;
  getCategoryCount: (slug: string) => number;
}>();

const emit = defineEmits<{
  reset: [];
}>();

const categories = [
  { slug: 'apartamento', name: 'Apartamento', icon: 'hugeicons:building-03' },
  { slug: 'casa', name: 'Casa', icon: 'hugeicons:home-01' },
  { slug: 'finca', name: 'Finca', icon: 'hugeicons:tree-02' },
  { slug: 'local-comercial', name: 'Local Comercial', icon: 'hugeicons:store-01' },
  { slug: 'oficina', name: 'Oficina', icon: 'hugeicons:office' },
  { slug: 'bodega', name: 'Bodega', icon: 'hugeicons:package' },
  { slug: 'lote', name: 'Lote', icon: 'hugeicons:grid' },
  { slug: 'terreno-rural', name: 'Terreno Rural', icon: 'hugeicons:plant-02' },
];

const pricePresets = [
  { label: 'Hasta $200M', min: 0, max: 200000000 },
  { label: '$200M - $500M', min: 200000000, max: 500000000 },
  { label: '$500M - $1B', min: 500000000, max: 1000000000 },
  { label: 'Más de $1B', min: 1000000000, max: 2000000000 },
];

const transactionTypes = [
  { value: 'sale', label: 'Venta', icon: 'hugeicons:tag-01' },
  { value: 'rent', label: 'Arriendo', icon: 'hugeicons:key-01' },
  { value: null, label: 'Cualquiera', icon: 'hugeicons:refresh' },
];

const minPrice = ref(filters.value.priceRange[0]);
const maxPrice = ref(filters.value.priceRange[1]);

const formatPrice = (value: number) => {
  return `$${(value / 1000000).toFixed(0)}M`;
};

const updatePriceRange = () => {
  filters.value.priceRange = [minPrice.value, maxPrice.value];
};

const applyPricePreset = (preset: typeof pricePresets[0]) => {
  minPrice.value = preset.min;
  maxPrice.value = preset.max;
  updatePriceRange();
};

const toggleRoom = (type: 'bedrooms' | 'bathrooms', value: number) => {
  filters.value[type] = filters.value[type] === value ? null : value;
};

onMounted(() => {
  minPrice.value = filters.value.priceRange[0];
  maxPrice.value = filters.value.priceRange[1];
});
</script>

<template>
  <div class="bg-white rounded-lg h-full flex flex-col">
    <!-- Header fijo -->
    <div class="flex items-center justify-between p-6 pb-4 shrink-0">
      <h2 class="text-xl font-bold text-gray-800">Filtros</h2>
      <button 
        v-if="activeCount > 0"
        @click="emit('reset')"
        class="text-sm text-primary hover:underline font-medium"
      >
        Limpiar ({{ activeCount }})
      </button>
    </div>
    
    <!-- Contador de resultados fijo -->
    <div class="px-6 pb-4 shrink-0">
      <div class="p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">
          <span class="font-bold text-primary text-lg">{{ total }}</span>
          {{ total === 1 ? 'propiedad encontrada' : 'propiedades encontradas' }}
        </p>
      </div>
    </div>

    <!-- Contenido con scroll -->
    <div class="flex-1 overflow-y-auto px-6 pb-6">
      <div class="space-y-6">
      <!-- CATEGORÍAS -->
      <div>
        <h3 class="font-semibold mb-3 text-gray-800">Tipo de Propiedad</h3>
        <div class="space-y-2">
          <label 
            v-for="cat in categories" 
            :key="cat.slug"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition group"
          >
            <input 
              type="checkbox" 
              :value="cat.slug"
              v-model="filters.categories"
              class="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
            />
            <Icon :icon="cat.icon" class="w-5 h-5 text-gray-600 group-hover:text-primary transition" />
            <span class="flex-1 text-sm group-hover:text-primary transition">{{ cat.name }}</span>
            <span class="text-xs text-gray-400">({{ getCategoryCount(cat.slug) }})</span>
          </label>
        </div>
      </div>

      <!-- HABITACIONES -->
      <div>
        <h3 class="font-semibold mb-3 text-gray-800">Habitaciones</h3>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="num in [1, 2, 3, 4, 5, 6]"
            :key="num"
            @click="toggleRoom('bedrooms', num)"
            type="button"
            :class="[
              'py-2 px-3 rounded-lg border-2 transition-all font-medium text-sm',
              filters.bedrooms === num 
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'border-gray-200 hover:border-primary hover:bg-primary/5'
            ]"
          >
            {{ num }} Ha.
          </button>
        </div>
      </div>

      <!-- BAÑOS -->
      <div>
        <h3 class="font-semibold mb-3 text-gray-800">Baños</h3>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="num in [1, 2, 3, 4, 5]"
            :key="num"
            @click="toggleRoom('bathrooms', num)"
            type="button"
            :class="[
              'py-2 px-3 rounded-lg border-2 transition-all font-medium text-sm',
              filters.bathrooms === num 
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'border-gray-200 hover:border-primary hover:bg-primary/5'
            ]"
          >
            {{ num }} Ba.
          </button>
        </div>
      </div>

      <!-- TIPO DE OPERACIÓN -->
      <div>
        <h3 class="font-semibold mb-3 text-gray-800">Tipo de Operación</h3>
        <div class="space-y-2">
          <label 
            v-for="type in transactionTypes" 
            :key="type.value || 'any'"
            class="flex items-center gap-3 p-3 rounded-lg border-2 transition cursor-pointer group hover:bg-gray-50"
            :class="filters.transactionType === type.value ? 'border-primary bg-primary/5' : 'border-gray-200'"
          >
            <input 
              type="radio" 
              :value="type.value"
              v-model="filters.transactionType"
              class="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <Icon :icon="type.icon" class="w-5 h-5 text-gray-600 group-hover:text-primary transition" />
            <span class="font-medium text-sm group-hover:text-primary transition">{{ type.label }}</span>
          </label>
        </div>
      </div>

      <!-- RANGO DE PRECIO -->
      <div>
        <h3 class="font-semibold mb-3 text-gray-800">Rango de Precio</h3>
        <div class="space-y-4">
          <!-- Slider doble -->
          <div class="px-2">
            <div class="relative">
              <input 
                type="range" 
                v-model.number="minPrice"
                @input="updatePriceRange"
                min="0"
                max="2000000000"
                step="10000000"
                class="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <input 
                type="range" 
                v-model.number="maxPrice"
                @input="updatePriceRange"
                min="0"
                max="2000000000"
                step="10000000"
                class="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div class="w-full h-2 bg-gray-200 rounded-full pointer-events-none">
                <div 
                  class="h-2 bg-primary rounded-full"
                  :style="{ 
                    marginLeft: `${(minPrice / 2000000000) * 100}%`, 
                    width: `${((maxPrice - minPrice) / 2000000000) * 100}%` 
                  }"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- Labels -->
          <div class="flex justify-between text-sm font-medium text-gray-700">
            <span>{{ formatPrice(minPrice) }}</span>
            <span>{{ formatPrice(maxPrice) }}</span>
          </div>
          
          <!-- Presets -->
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="preset in pricePresets"
              :key="preset.label"
              @click="applyPricePreset(preset)"
              type="button"
              class="px-3 py-1.5 text-xs rounded-full border border-gray-200 hover:border-primary hover:bg-primary/5 transition font-medium"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-moz-range-thumb {
  pointer-events: auto;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--color-primary, #6366f1);
  cursor: pointer;
  border: none;
}

input[type="range"]::-moz-range-track {
  background: transparent;
}
</style>
