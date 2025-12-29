<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SidebarFilter from './SidebarFilter.vue';
import PropertyGrid from './PropertyGrid.vue';
import { usePropertyFilters } from '@/composables/usePropertyFilters';
import { useUrlSync } from '@/composables/useUrlSync';
import type { PropertiesWithImages } from '@/types';

const props = defineProps<{
  properties: PropertiesWithImages[];
}>();

const propertiesRef = computed(() => props.properties);
const showMobileFilters = ref(false);

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
    <!-- Desktop: Sidebar visible -->
    <div class="flex gap-6">
      <aside class="hidden lg:block lg:w-80 flex-shrink-0">
        <SidebarFilter 
          v-model="filters"
          :total="resultCount"
          :active-count="activeFilterCount"
          :get-category-count="getPropertiesByCategory"
          @reset="resetFilters"
        />
      </aside>

      <!-- Grid principal -->
      <main class="flex-1 min-w-0">
        <PropertyGrid 
          :properties="filteredProperties"
          :total-properties="properties.length"
        />
      </main>
    </div>

    <!-- Mobile: Botón flotante -->
    <div class="lg:hidden fixed bottom-6 right-6 z-50">
      <button 
        @click="showMobileFilters = true"
        class="bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span class="font-medium">Filtros</span>
        <span v-if="activeFilterCount > 0" class="bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold">
          {{ activeFilterCount }}
        </span>
      </button>
    </div>

    <!-- Mobile: Drawer (Teleport) -->
    <Teleport to="body">
      <Transition name="drawer">
        <div 
          v-show="showMobileFilters"
          class="lg:hidden fixed inset-0 z-[999] flex justify-end"
        >
          <!-- Overlay -->
          <div 
            @click="showMobileFilters = false"
            class="absolute inset-0 bg-black/50"
          ></div>
          
          <!-- Drawer -->
          <div class="relative w-11/12 max-w-md bg-white h-full overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
              <h2 class="text-xl font-bold">Filtros</h2>
              <button 
                @click="showMobileFilters = false"
                class="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
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
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .relative,
.drawer-leave-active .relative {
  transition: transform 0.3s ease;
}

.drawer-enter-from .relative,
.drawer-leave-to .relative {
  transform: translateX(100%);
}
</style>
