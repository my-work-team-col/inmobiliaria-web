<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import type { CategoryTreeItem } from '@/types/category-tree';

interface Props {
  category: CategoryTreeItem;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dropdown';
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  size: 'md',
  variant: 'default'
});

// Map emoji icons to iconify equivalents
const iconMap: Record<string, string> = {
  '🏠': 'hugeicons:home-01',
  '🏡': 'hugeicons:home-01',
  '🏢': 'hugeicons:office-building-01',
  '🏘️': 'hugeicons:home-group-01',
  '🏬': 'hugeicons:shop-01',
  '🏪': 'hugeicons:store-01',
  '🏭': 'hugeicons:factory-01',
  '🏗️': 'hugeicons:building-03',
  '🏚️': 'hugeicons:building-03',
  '🏞️': 'hugeicons:tree-01',
  '🌳': 'hugeicons:tree-01'
};

const mappedIcon = computed(() => {
  if (!props.category.icon) return 'hugeicons:tag-01';
  return iconMap[props.category.icon] || 'hugeicons:tag-01';
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3'
  };
  return sizes[props.size];
});

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  return sizes[props.size];
});

const linkClasses = computed(() => {
  const base = [
    'flex items-center gap-2 rounded-lg transition-all duration-200',
    'hover:bg-[--color-primary]/10',
    'focus:outline-none focus:ring-2 focus:ring-[--color-primary]/50',
    sizeClasses.value
  ];
  
  if (props.variant === 'dropdown') {
    base.push('w-full text-left');
  } else {
    base.push('text-[--color-foreground]');
  }
  
  return base.join(' ');
});

const categoryUrl = `/listing/category/${props.category.slug}`;
</script>

<template>
  <a 
    :href="categoryUrl"
    :class="linkClasses"
    :aria-label="`View ${category.name} properties`"
    role="menuitem"
  >
    <Icon 
      :icon="mappedIcon" 
      :class="iconSizeClasses"
      class="text-[--color-primary]"
      aria-hidden="true"
    />
    <span class="font-medium">{{ category.name }}</span>
    <span 
      v-if="showCount && category.propertyCount !== undefined"
      class="ml-auto bg-[--color-muted] text-[--color-foreground] text-xs font-semibold px-2 py-1 rounded-full"
    >
      {{ category.propertyCount }}
    </span>
  </a>
</template>