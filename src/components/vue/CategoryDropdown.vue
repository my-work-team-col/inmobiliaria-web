<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue';
import CategoryItem from './CategoryItem.vue';
import type { CategoryTreeItem } from '@/types/category-tree';

interface Props {
  category: CategoryTreeItem;
  variant?: 'desktop' | 'mobile';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'desktop'
});

const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement>();
const triggerRef = ref<HTMLElement>();
const timeoutRef = ref<number>();

const openDropdown = () => {
  if (timeoutRef.value) {
    clearTimeout(timeoutRef.value);
  }
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  timeoutRef.value = setTimeout(() => {
    isDropdownOpen.value = false;
  }, 150); // Small delay for better UX
};

const handleMouseEnter = () => {
  if (props.variant === 'desktop') {
    openDropdown();
  }
};

const handleMouseLeave = () => {
  if (props.variant === 'desktop') {
    closeDropdown();
  }
};

const handleClick = () => {
  if (props.variant === 'mobile') {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (props.variant === 'mobile') {
      isDropdownOpen.value = !isDropdownOpen.value;
    } else {
      // For desktop, navigate to parent category
      window.location.href = `/listing/category/${props.category.slug}`;
    }
  } else if (event.key === 'Escape') {
    isDropdownOpen.value = false;
    triggerRef.value?.focus();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (timeoutRef.value) {
    clearTimeout(timeoutRef.value);
  }
});

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
};

const triggerClasses = computed(() => {
  const base = [
    'flex items-center gap-2 font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[--color-primary]/50'
  ];
  
  if (props.variant === 'desktop') {
    base.push(
      'px-4 py-2 text-[--color-foreground]',
      'hover:bg-[--color-primary]/10'
    );
  } else {
    base.push(
      'w-full px-3 py-3 text-left',
      'bg-white hover:bg-[--color-muted]/50',
      isDropdownOpen.value ? 'bg-[--color-muted]/50' : ''
    );
  }
  
  return base.join(' ');
});

const chevronClasses = computed(() => {
  const base = ['transition-transform duration-200'];
  if (props.variant === 'mobile') {
    base.push(isDropdownOpen.value ? 'rotate-180' : '');
  }
  return base.join(' ');
});

const dropdownClasses = computed(() => {
  const base = ['z-50'];
  
  if (props.variant === 'desktop') {
    base.push(
      'absolute top-full left-0 mt-1',
      'bg-white rounded-lg shadow-lg border border-[--color-muted]',
      'min-w-64 py-2',
      'opacity-0 invisible scale-95 origin-top',
      isDropdownOpen.value ? 'opacity-100 visible scale-100' : ''
    );
  } else {
    base.push(
      'mt-1 bg-white rounded-lg border border-[--color-muted]',
      isDropdownOpen.value ? 'block' : 'hidden'
    );
  }
  
  return base.join(' ');
});

const hasChildren = computed(() => {
  return props.category.children && props.category.children.length > 0;
});
</script>

<template>
  <div 
    ref="dropdownRef"
    class="relative"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Trigger -->
    <component
      :is="variant === 'desktop' ? 'a' : 'button'"
      :href="variant === 'desktop' ? `/listing/category/${category.slug}` : undefined"
      ref="triggerRef"
      :class="triggerClasses"
      :aria-expanded="isDropdownOpen"
      :aria-haspopup="hasChildren"
      :role="variant === 'desktop' ? 'link' : 'button'"
      :tabindex="0"
      @click="handleClick"
      @keydown="handleKeyDown"
    >
      <slot name="icon">
        <CategoryItem 
          :category="category" 
          :show-count="false"
          :size="variant === 'desktop' ? 'md' : 'sm'"
          variant="dropdown"
        />
      </slot>
      
      <!-- Chevron for mobile -->
      <svg 
        v-if="variant === 'mobile' && hasChildren"
        :class="chevronClasses"
        class="w-4 h-4 ml-auto text-[--color-foreground]"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </component>

    <!-- Dropdown -->
    <div 
      v-if="hasChildren && isDropdownOpen"
      :class="dropdownClasses"
      role="menu"
    >
      <div class="py-1">
        <CategoryItem
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :show-count="true"
          size="sm"
          variant="dropdown"
          class="mx-2 my-1"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom transitions for dropdown */
.absolute {
  transition: all 0.2s ease-in-out;
}
</style>