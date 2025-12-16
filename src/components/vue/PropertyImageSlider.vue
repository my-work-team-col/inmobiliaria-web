<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PropertyImage {
  id: string;
  image: string;
  order: number;
  isPrimary: boolean;
  alt?: string;
}

interface Props {
  images: PropertyImage[];
  propertyTitle: string;
}

const props = defineProps<Props>();

const modules = [Navigation, Pagination, Autoplay];
</script>

<template>
  <div class="property-image-slider relative">
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :navigation="{
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
      }"
      :pagination="{
        el: '.swiper-pagination-custom',
        clickable: true,
      }"
      :loop="images.length > 1"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      class="w-full h-96 rounded-xl shadow-lg overflow-hidden"
    >
      <SwiperSlide v-for="img in images" :key="img.id">
        <img 
          :src="img.image" 
          :alt="img.alt || propertyTitle"
          class="w-full h-full object-cover"
        />
      </SwiperSlide>

      <!-- Navigation Buttons -->
      <button 
        class="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-md text-gray-800 hover:bg-white transition z-10"
        aria-label="Previous image"
      >
        ❮
      </button>
      <button 
        class="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-md text-gray-800 hover:bg-white transition z-10"
        aria-label="Next image"
      >
        ❯
      </button>

      <!-- Pagination -->
      <div class="swiper-pagination-custom absolute bottom-4 left-0 right-0 flex justify-center z-10"></div>
    </Swiper>

    <!-- Image Counter -->
    <div class="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
      {{ images.length }} {{ images.length === 1 ? 'imagen' : 'imágenes' }}
    </div>
  </div>
</template>

<style scoped>
.swiper-pagination-custom :deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.7;
  width: 10px;
  height: 10px;
}

.swiper-pagination-custom :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: white;
}
</style>
