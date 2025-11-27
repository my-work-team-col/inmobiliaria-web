<script setup lang="ts">
interface CategoryCardProps {
  id: number;
  title: string;
  description?: string;
  count?: number;
  image?: string;
  bgColor?: string;
}

const props = defineProps<CategoryCardProps>();
</script>

<template>
  <div class="group w-full h-full">
    <div
      class="flex flex-col lg:flex-row items-center gap-6 bg-white rounded-2xl p-4 lg:p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full lg:min-h-60"
    >
      <!-- IMAGE SECTION -->
      <div class="w-full lg:w-5/12 h-48 md:h-56 lg:h-full lg:min-h-[260px]">
        <div class="relative overflow-hidden rounded-md w-full h-full ">
          <img
            :src="props.image"
            :alt="props.title"
            class="w-full h-full lg:min-h-[260px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <!-- CONTENT SECTION -->
      <div
        class="flex-1 w-full lg:w-7/12 flex flex-col justify-between h-full lg:min-h-[260px]"
      >
        <div>
          <h2
            class="text-2xl md:text-3xl lg:text-xl font-bold text-gray-900 mb-3 leading-tight"
          >
            {{ props.title }}
          </h2>

          <p
            v-if="props.description"
            class="text-gray-600 text-md mb-4 md:mb-5 line-clamp-3"
          >
            {{ props.description }}
          </p>

          <p
            v-if="props.count"
            class="text-sm font-semibold text-blue-600 mb-6"
          >
            {{ props.count.toLocaleString() }} properties
          </p>
        </div>

        <!-- CTA BUTTON -->
        <div class="flex lg:justify-start">
          <button
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors duration-300 flex items-center gap-2 text-xs"
          >
            Learn More
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group {
  transition: transform 0.3s ease;
}
.group:hover {
  transform: translateY(-2px);
}
</style>
