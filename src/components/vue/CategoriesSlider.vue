<script setup lang="ts">
import { onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";

import CategoryCard from "@/components/vue/CategoryCard.vue";
import { useCategories } from "@/composables/useCategories";


const { data } = useCategories();

onMounted(() => {
  // Asegura que Swiper encuentre los controles externos
});
</script>

<template>
  <section class="w-full py-6">
    <!-- CARD CONTENEDOR -->
    <div
      class="w-full bg-white rounded-3xl  px-4 py-8 md:px-10 md:py-10 relative overflow-visible"
    >
      <!-- HEADER -->
      <header
        class="flex items-center justify-between mb-6"
      >
        <!-- TÍTULO -->
        <h2
          class="text-lg md:text-2xl font-semibold text-gray-700 flex items-center gap-2"
        >
          <span class="block w-1.5 h-6 bg-primary rounded-full"></span>
          Más vistos | Categorías
        </h2>

        <!-- CONTROLES (FLECHAS) -->
        <div class="flex items-center gap-3">
          <button
            class="custom-prev w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            class="custom-next w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      <!-- SWIPER SLIDER -->
      <Swiper
        :modules="[Navigation, Pagination]"
        :slides-per-view="1.15"
        :space-between="16"
        :breakpoints="{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 }
        }"
        :navigation="{
          nextEl: '.custom-next',
          prevEl: '.custom-prev'
        }"
        :pagination="{
          el: '.custom-pagination',
          clickable: true
        }"
        class="overflow-visible"
      >
        <SwiperSlide
          v-for="category in data"
          :key="category.id"
          class="pb-10"
        >
          <CategoryCard v-bind="category" />
        </SwiperSlide>
      </Swiper>

      <!-- PAGINACIÓN -->
      <div class="custom-pagination flex justify-center mt-6"></div>
    </div>
  </section>
</template>

<style scoped>
/* Estilos de bullets para que coincidan con tu diseño */
.custom-pagination .swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background: #d1d5db; /* gray-300 */
  opacity: 1;
}

.custom-pagination .swiper-pagination-bullet-active {
  background: #ef4444; /* primary (rojo) */
  transform: scale(1.2);
}
</style>
