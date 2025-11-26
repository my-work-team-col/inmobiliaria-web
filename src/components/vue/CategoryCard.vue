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
  <div class="group w-full ">
    <div
      class="flex  flex-col lg:flex-row items-center gap-4 lg:gap-4 bg-white rounded-2xl p-0 lg:p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <!-- Content -->
      <div class="flex-1 w-full">
        <h2 class="text-3xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {{ props.title }}
        </h2>

        <p v-if="props.description" class="text-gray-600 text-md mb-6 line-clamp-3">
          {{ props.description }}
        </p>

        <p v-if="props.count" class="text-sm font-semibold text-blue-600 mb-8">
          {{ props.count.toLocaleString() }} properties
        </p>

        <button
          class="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          Learn More
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Image -->
      <div class="w-full lg:flex-1">
        <div class="relative overflow-hidden rounded-2xl h-56 lg:h-64 w-full">
          <img
            :src="props.image"
            :alt="props.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            class="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
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
