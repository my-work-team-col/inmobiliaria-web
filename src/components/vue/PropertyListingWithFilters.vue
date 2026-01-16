<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon, addCollection } from '@iconify/vue';
import hugeiconsData from '@iconify-json/hugeicons/icons.json';
import SidebarFilter from './SidebarFilter.vue';
import PropertyGrid from './PropertyGrid.vue';
import { usePropertyFilters } from '@/composables/usePropertyFilters';
import { useUrlSync } from '@/composables/useUrlSync';
import type { PropertiesWithImages } from '@/types';

addCollection(hugeiconsData);

const props = defineProps<{
  properties: PropertiesWithImages[];
}>();

const propertiesRef = computed(() => props.properties);
const showFilters = ref(false);

const {
  filters,
  filteredProperties,
  resultCount,
  activeFilterCount,
  resetFilters,
  getPropertiesByCategory,
} = usePropertyFilters(propertiesRef);

const { loadFromUrl } = useUrlSync(filters);

onMounted(() => {
  loadFromUrl();
});
</script>

<template>
  <div class="w-full">
    <!-- Grid principal (sin sidebar visible) -->
    <div class="w-full">
      <main class="w-full">
        <PropertyGrid 
          :properties="filteredProperties"
          :total-properties="properties.length"
        />
      </main>
    </div>

    <!-- Botón flotante izquierdo - Siempre visible -->
    <div class="fixed left-6 bottom-6 z-50">
      <button 
        @click="showFilters = true"
        class="bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center gap-2 group"
      >
        <Icon icon="hugeicons:filter" class="w-6 h-6" />
        <span class="font-medium hidden sm:inline">Filtros</span>
        <span 
          v-if="activeFilterCount > 0" 
          class="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
        >
          {{ activeFilterCount }}
        </span>
      </button>
    </div>

    <!-- Drawer desde la izquierda (Teleport) -->
    <Teleport to="body">
      <Transition name="drawer">
        <div
          v-show="showFilters"
          class="fixed inset-0 z-[999] flex"
        >
          <!-- Overlay -->
          <div 
            @click="showFilters = false"
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          ></div>
          
          <!-- Drawer desde la izquierda -->
          <div class="relative w-11/12 max-w-md bg-white h-full overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="hugeicons:filter" class="w-6 h-6 text-primary" />
                <h2 class="text-xl font-bold">Filtros</h2>
              </div>
              <button 
                @click="showFilters = false"
                class="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Cerrar filtros"
              >
                <Icon icon="hugeicons:cancel-01" class="w-6 h-6" />
              </button>
            </div>
            
            <div class="p-4">
              <SidebarFilter 
                v-model="filters"
                :total="resultCount"
                :active-count="activeFilterCount"
                :get-category-count="getPropertiesByCategory"
                @reset="resetFilters"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Transición del overlay */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

/* Transición del drawer desde la izquierda */
.drawer-enter-active .relative {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.drawer-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.drawer-enter-from .relative {
  transform: translateX(-100%);
}

.drawer-leave-to .relative {
  transform: translateX(-100%);
}
</style>
cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from .relative,
.drawer-leave-to .relative {
  transform: translateX(-