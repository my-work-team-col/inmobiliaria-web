<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";


import CategoryCard from "@/components/vue/CategoryCard.vue";
import { useCategories } from "@/composables/useCategories";

const { data } = useCategories();
</script>

<template>
<Swiper
  :modules="[Navigation, Pagination]"
  :slides-per-view="1.2"
  :space-between="20"
  :breakpoints="{
    768: { slidesPerView: 2},
    1024: { slidesPerView: 3 }
  }"
  navigation
  pagination    
>
    <SwiperSlide
      v-for="category in data"
      :key="category.id"
      class="p-2"
    >
      <CategoryCard v-bind="category" />
    </SwiperSlide>
  </Swiper>
</template>
