import { ref } from "vue";
import categories from "@/data/categories.json";

export function useCategories() {
  const data = ref(categories);

  const getAll = () => data.value;

  const getById = (id: number) =>
    data.value.find((item) => item.id === id);

  return {
    data,
    getAll,
    getById
  };
}
