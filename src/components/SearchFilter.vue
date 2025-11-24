<script setup>
import { ref } from "vue";
import { usePopover } from "../composables/usePopover.ts";

const { openPopover, togglePopover, closePopover } = usePopover();

const categories = [
  "Apartamento",
  "Casa",
  "Finca",
  "Habitación",
];

const types = ["Alquiler", "Venta"];

const cities = [
  "Medellín",
  "Bogotá",
  "Cali",
  "Cartagena",
  "Santa Marta",
  "Buenos Aires",
  "Cancún",
  "Madrid",
];

// Valores seleccionados
const selected = ref({
  category: "Todas las categorías",
  type: "Todos los tipos",
  city: "Todas las ciudades",
});
</script>

<template>
  <div
    class="w-full bg-white/70 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 shadow-xl
           flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-4 md:gap-6 p-4 md:p-6 lg:p-8
           items-stretch sm:items-end"
  >
    <!-- CATEGORY -->
    <div class="flex-1 min-w-[220px] max-w-full relative">
      <label class="block text-xs md:text-sm font-medium text-gray-600 pl-1 pb-1">
        Categoría
      </label>

      <button
        data-popover-trigger
        class="w-full text-left rounded-full border border-gray-200 bg-gray-50
               px-4 md:px-5 py-3 text-gray-700 hover:bg-gray-100 transition
               flex justify-between items-center shadow-sm"
        @click.stop="togglePopover('category')"
      >
        <span class="truncate">{{ selected.category }}</span>
        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="fade">
        <div
          v-if="openPopover === 'category'"
          data-popover-panel
          class="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-2xl p-4 border border-gray-200 animate-fade-in"
        >
          <div
            v-for="item in categories"
            :key="item"
            class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            @click="selected.category = item; closePopover()"
          >
            {{ item }}
          </div>
        </div>
      </transition>
    </div>

    <!-- TYPE -->
    <div class="flex-1 min-w-[220px] max-w-full relative">
      <label class="block text-xs md:text-sm font-medium text-gray-600 pl-1 pb-1">
        Tipo
      </label>

      <button
        data-popover-trigger
        class="w-full text-left rounded-full border border-gray-200 bg-gray-50
               px-4 md:px-5 py-3 text-gray-700 hover:bg-gray-100 transition
               flex justify-between items-center shadow-sm"
        @click.stop="togglePopover('type')"
      >
        <span class="truncate">{{ selected.type }}</span>
        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="fade">
        <div
          v-if="openPopover === 'type'"
          data-popover-panel
          class="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-2xl p-4 border border-gray-200 animate-fade-in"
        >
          <div
            v-for="item in types"
            :key="item"
            class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            @click="selected.type = item; closePopover()"
          >
            {{ item }}
          </div>
        </div>
      </transition>
    </div>

    <!-- CITY -->
    <div class="flex-1 min-w-[220px] max-w-full relative">
      <label class="block text-xs md:text-sm font-medium text-gray-600 pl-1 pb-1">
        Ciudad
      </label>

      <button
        data-popover-trigger
        class="w-full text-left rounded-full border border-gray-200 bg-gray-50
               px-4 md:px-5 py-3 text-gray-700 hover:bg-gray-100 transition
               flex justify-between items-center shadow-sm"
        @click.stop="togglePopover('city')"
      >
        <span class="truncate">{{ selected.city }}</span>
        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="fade">
        <div
          v-if="openPopover === 'city'"
          data-popover-panel
          class="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-2xl p-4 border border-gray-200 animate-fade-in"
        >
          <div
            v-for="item in cities"
            :key="item"
            class="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            @click="selected.city = item; closePopover()"
          >
            {{ item }}
          </div>
        </div>
      </transition>
    </div>

    <!-- SEARCH BUTTON -->
    <div class="flex-1 min-w-[220px] max-w-full flex items-end">
      <button
        class="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold
               py-3 md:py-3.5 px-6 rounded-full shadow-lg transition
               flex items-center justify-center gap-2 text-base md:text-lg"
      >
        <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
        </svg>
        Buscar
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
