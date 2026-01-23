<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, type Ref } from 'vue';
import { Icon } from '@iconify/vue';
import CategoryDropdown from './CategoryDropdown.vue';
import CategoryItem from './CategoryItem.vue';
import type { CategoryTreeItem } from '@/types/category-tree';

interface Props {
  categoryTree: CategoryTreeItem[];
  variant?: 'header' | 'sidebar';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'header'
});

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const navbarRef = ref<HTMLElement>();

// Handle scroll for sticky navbar effect
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// Close mobile menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (navbarRef.value && !navbarRef.value.contains(event.target as Node)) {
    isMobileMenuOpen.value = false;
  }
};

// Close mobile menu on escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false;
  }
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Prevent body scroll when mobile menu is open
const toggleBodyScroll = (isOpen: boolean) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
};

// Watch mobile menu state
watchEffect(() => {
  toggleBodyScroll(isMobileMenuOpen.value);
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
  toggleBodyScroll(false);
});

const navbarClasses = computed(() => {
  const base = [
    'sticky top-0 z-40 w-full transition-all duration-300',
    'bg-white border-b'
  ];
  
  if (isScrolled.value) {
    base.push('shadow-lg border-[--color-muted]');
  } else {
    base.push('border-transparent');
  }
  
  if (props.variant === 'header') {
    base.push('backdrop-blur-lg bg-white/95');
  }
  
  return base.join(' ');
});

const mobileMenuClasses = computed(() => {
  const base = [
    'fixed inset-0 z-50 lg:hidden',
    'transition-all duration-300 ease-in-out'
  ];
  
  if (isMobileMenuOpen.value) {
    base.push('opacity-100 pointer-events-auto');
  } else {
    base.push('opacity-0 pointer-events-none');
  }
  
  return base.join(' ');
});

const mobileMenuPanelClasses = computed(() => {
  const base = [
    'absolute right-0 top-0 h-full w-80 max-w-full',
    'bg-white shadow-2xl border-l border-[--color-muted]',
    'transform transition-transform duration-300 ease-in-out'
  ];
  
  if (isMobileMenuOpen.value) {
    base.push('translate-x-0');
  } else {
    base.push('translate-x-full');
  }
  
  return base.join(' ');
});

const hasCategories = computed(() => {
  return props.categoryTree && props.categoryTree.length > 0;
});
</script>

<template>
  <nav 
    ref="navbarRef"
    :class="navbarClasses"
    role="navigation"
    aria-label="Categories navigation"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Desktop Categories -->
        <div v-if="hasCategories" class="hidden lg:flex items-center space-x-1">
          <CategoryDropdown
            v-for="category in categoryTree"
            :key="category.id"
            :category="category"
            variant="desktop"
          />
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden flex items-center">
          <button
            type="button"
            class="p-2 rounded-lg text-[--color-foreground] hover:bg-[--color-muted]/50 focus:outline-none focus:ring-2 focus:ring-[--color-primary]/50"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-menu"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">Toggle categories menu</span>
            <Icon 
              :icon="isMobileMenuOpen ? 'hugeicons:close-circle' : 'hugeicons:menu-01'" 
              class="w-6 h-6"
              aria-hidden="true"
            />
          </button>
        </div>

        <!-- Optional: Logo/Brand area -->
        <div class="flex-1 lg:flex-none"></div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div :class="mobileMenuClasses">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="closeMobileMenu"
      ></div>

      <!-- Mobile Menu Panel -->
      <div :class="mobileMenuPanelClasses">
        <div class="flex flex-col h-full">
          <!-- Mobile Header -->
          <div class="flex items-center justify-between p-4 border-b border-[--color-muted]">
            <h2 class="text-lg font-semibold text-[--color-foreground]">
              Categories
            </h2>
            <button
              type="button"
              class="p-2 rounded-lg text-[--color-foreground] hover:bg-[--color-muted]/50 focus:outline-none focus:ring-2 focus:ring-[--color-primary]/50"
              @click="closeMobileMenu"
            >
              <span class="sr-only">Close menu</span>
              <Icon 
                icon="hugeicons:close-circle" 
                class="w-5 h-5"
                aria-hidden="true"
              />
            </button>
          </div>

          <!-- Mobile Categories -->
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="hasCategories" class="space-y-2">
              <!-- Parent Categories with Children -->
              <CategoryDropdown
                v-for="category in categoryTree.filter(cat => cat.children && cat.children.length > 0)"
                :key="category.id"
                :category="category"
                variant="mobile"
              />

              <!-- Parent Categories without Children -->
              <div
                v-for="category in categoryTree.filter(cat => !cat.children || cat.children.length === 0)"
                :key="category.id"
                class="mb-2"
              >
                <CategoryItem
                  :category="category"
                  :show-count="true"
                  size="md"
                  variant="dropdown"
                />
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8">
              <Icon 
                icon="hugeicons:folder-open" 
                class="w-12 h-12 text-[--color-muted] mx-auto mb-4"
                aria-hidden="true"
              />
              <p class="text-[--color-foreground] text-sm">
                No categories available
              </p>
            </div>
          </div>

          <!-- Mobile Footer (Optional) -->
          <div class="p-4 border-t border-[--color-muted]">
            <a
              href="/"
              class="flex items-center gap-2 text-[--color-primary] hover:text-[--color-primary]/80 transition-colors"
            >
              <Icon icon="hugeicons:home-01" class="w-4 h-4" aria-hidden="true" />
              <span class="text-sm font-medium">Back to Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for mobile menu */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: var(--color-muted);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary)/80;
}
</style>