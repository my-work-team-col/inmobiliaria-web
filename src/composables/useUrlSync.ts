import { watch, type Ref } from 'vue';
import type { Filters } from './usePropertyFilters';

export function useUrlSync(filters: Ref<Filters>) {
  // Cargar filtros desde URL al montar
  const loadFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('categories')) {
      filters.value.categories = params.get('categories')!.split(',').filter(Boolean);
    }
    if (params.has('bedrooms')) {
      filters.value.bedrooms = parseInt(params.get('bedrooms')!);
    }
    if (params.has('bathrooms')) {
      filters.value.bathrooms = parseInt(params.get('bathrooms')!);
    }
    if (params.has('type')) {
      filters.value.transactionType = params.get('type');
    }
    if (params.has('priceMin')) {
      filters.value.priceRange[0] = parseInt(params.get('priceMin')!);
    }
    if (params.has('priceMax')) {
      filters.value.priceRange[1] = parseInt(params.get('priceMax')!);
    }
  };
  
  // Sincronizar filtros con URL (sin reload)
  watch(filters, (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','));
    }
    if (newFilters.bedrooms !== null) {
      params.set('bedrooms', newFilters.bedrooms.toString());
    }
    if (newFilters.bathrooms !== null) {
      params.set('bathrooms', newFilters.bathrooms.toString());
    }
    if (newFilters.transactionType) {
      params.set('type', newFilters.transactionType);
    }
    if (newFilters.priceRange[0] > 0) {
      params.set('priceMin', newFilters.priceRange[0].toString());
    }
    if (newFilters.priceRange[1] < 2000000000) {
      params.set('priceMax', newFilters.priceRange[1].toString());
    }
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
      
    window.history.replaceState({}, '', newUrl);
  }, { deep: true });
  
  return { loadFromUrl };
}
