export interface CategoryCardProps {
  id: number;
  title: string;
  description?: string;
  count?: number;
  image?: string;
  icon?: string;
  bgColor?: string;
}

export interface Category extends CategoryCardProps {}

// Re-export from category-tree for convenience
export type { CategoryTreeItem, CategoryTree, Category as CategoryWithTree } from './category-tree';
