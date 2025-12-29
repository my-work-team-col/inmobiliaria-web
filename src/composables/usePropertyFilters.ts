import { ref, computed, type Ref } from 'vue';
import type { PropertiesWithImages } from '@/types';

export interface Filters {
  categories: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  transactionType: string | null;
  priceRange: [number, number];
}

export function usePropertyFilters(properties: Ref<PropertiesWithImages[]>) {
  const filters = ref<Filters>({
    categories: [],
    bedrooms: null,
    bathrooms: null,
    transactionType: null,
    priceRange: [0, 2000000000],
  });

  const filteredProperties = computed(() => {
    return properties.value.filter(property => {
      // 1. Filtro por categorías (OR lógico entre seleccionadas)
      if (filters.value.categories.length > 0) {
        const hasCategory = property.categories?.some((cat: any) => 
          filters.value.categories.includes(cat.slug)
        );
        if (!hasCategory) return false;
      }
      
      // 2. Filtro por habitaciones (igualdad exacta)
      if (filters.value.bedrooms !== null) {
        if (property.bedrooms !== filters.value.bedrooms) return false;
      }
      
      // 3. Filtro por baños (igualdad exacta)
      if (filters.value.bathrooms !== null) {
        if (property.bathrooms !== filters.value.bathrooms) return false;
      }
      
      // 4. Filtro por tipo de transacción
      if (filters.value.transactionType) {
        const propType = (property as any).transactionType;
        if (filters.value.transactionType === 'sale') {
          if (!['sale', 'both'].includes(propType)) return false;
        } else if (filters.value.transactionType === 'rent') {
          if (!['rent', 'both'].includes(propType)) return false;
        }
      }
      
      // 5. Filtro por rango de precio
      const [min, max] = filters.value.priceRange;
      if (property.price < min || property.price > max) return false;
      
      return true;
    });
  });

  const resultCount = computed(() => filteredProperties.value.length);

  const activeFilterCount = computed(() => {
    let count = 0;
    if (filters.value.categories.length > 0) count++;
    if (filters.value.bedrooms !== null) count++;
    if (filters.value.bathrooms !== null) count++;
    if (filters.value.transactionType !== null) count++;
    if (filters.value.priceRange[0] > 0 || filters.value.priceRange[1] < 2000000000) count++;
    return count;
  });

  const resetFilters = () => {
    filters.value = {
      categories: [],
      bedrooms: null,
      bathrooms: null,
      transactionType: null,
      priceRange: [0, 2000000000],
    };
  };

  const getPropertiesByCategory = (categorySlug: string) => {
    return properties.value.filter(p => 
      p.categories?.some((c: any) => c.slug === categorySlug)
    ).length;
  };

  return {
    filters,
    filteredProperties,
    resultCount,
    activeFilterCount,
    resetFilters,
    getPropertiesByCategory,
  };
}
