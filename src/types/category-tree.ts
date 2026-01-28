export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
  parentId?: string | null;
  propertyCount?: number;
  children?: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryTreeItem extends Category {
  children: Category[];
}

export type CategoryTree = CategoryTreeItem[];
