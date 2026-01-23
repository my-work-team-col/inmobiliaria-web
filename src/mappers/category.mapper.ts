import type { Category, CategoryTreeItem } from '@/types/category-tree';

// Import from astro:db for the raw database types
interface RawCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface RawCategoryTreeItem extends RawCategory {
  children: RawCategory[];
}

/**
 * Transform raw database category to our Category interface
 */
export function mapCategory(raw: RawCategory): Category {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    icon: raw.icon || undefined,
    description: raw.description || undefined,
    isActive: raw.isActive,
    displayOrder: raw.displayOrder,
    parentId: raw.parentId || undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/**
 * Transform category tree with nested children
 */
export function mapCategoryTree(raw: RawCategoryTreeItem): CategoryTreeItem {
  return {
    ...mapCategory(raw),
    children: raw.children.map(child => mapCategory(child)),
  };
}

/**
 * Transform array of category tree items
 */
export function mapCategoryTreeArray(raw: RawCategoryTreeItem[]): CategoryTreeItem[] {
  return raw.map(item => mapCategoryTree(item));
}