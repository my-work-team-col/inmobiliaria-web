# Categories Navbar Components

This documentation explains how to use the three Vue components that create a responsive categories navigation system for the inmobiliaria-web project.

## Components Overview

### 1. CategoryItem.vue
A reusable component for displaying a single category with icon, name, and optional property count.

**Props:**
- `category: Category` - The category object to display
- `showCount?: boolean` - Whether to show property count badge (default: true)
- `size?: 'sm' | 'md' | 'lg'` - Size variant (default: 'md')
- `variant?: 'default' | 'dropdown'` - Display variant (default: 'default')

**Features:**
- Automatically maps emoji icons to @iconify equivalents
- Generates correct URLs: `/listing/category/[slug]`
- Accessibility compliant with ARIA labels
- Responsive sizing options

### 2. CategoryDropdown.vue
A dropdown component for parent categories with hover functionality (desktop) and accordion behavior (mobile).

**Props:**
- `category: CategoryTreeItem` - Parent category with children
- `variant?: 'desktop' | 'mobile'` - Display mode (default: 'desktop')

**Features:**
- **Desktop:** Hover to open dropdown with smooth transitions
- **Mobile:** Click to expand/collapse accordion style
- Keyboard navigation support (Enter, Space, Escape)
- Click outside to close
- Shows all child categories with property counts

### 3. CategoriesNavbar.vue
The main navigation component that combines everything into a responsive navbar.

**Props:**
- `categoryTree: CategoryTree` - Hierarchical array of categories
- `variant?: 'header' | 'sidebar'` - Layout variant (default: 'header')

**Features:**
- **Desktop:** Horizontal navbar with hover dropdowns
- **Mobile:** Hamburger menu with slide-out panel
- Sticky header with scroll effects
- Body scroll lock when mobile menu is open
- Fully responsive design
- Accessibility compliant

## Usage Example

### Basic Implementation

```astro
---
import Layout from "@/layouts/Layout.astro";
import CategoriesNavbar from "@/components/vue/CategoriesNavbar.vue";
import { getCategoryTree } from "@/lib/db/categoryQueries";
import { mapCategoryTreeArray } from "@/mappers/category.mapper";

// Fetch and map category data
const rawCategoryTree = await getCategoryTree();
const categoryTree = mapCategoryTreeArray(rawCategoryTree);
---

<Layout>
  <!-- Add navbar to your page -->
  <CategoriesNavbar categoryTree={categoryTree} client:load />
  
  <!-- Page content -->
  <main class="pt-20">
    <!-- Your content here -->
  </main>
</Layout>
```

### With Property Counts

If you want to include property counts, you need to fetch them separately:

```astro
---
import { getCategoryTree, countPropertiesByCategory } from "@/lib/db/categoryQueries";
import { mapCategoryTreeArray } from "@/mappers/category.mapper";

const rawCategoryTree = await getCategoryTree();

// Add property counts to each category
const categoryTreeWithCounts = await Promise.all(
  rawCategoryTree.map(async (parent) => ({
    ...parent,
    propertyCount: await countPropertiesByCategory(parent.id),
    children: await Promise.all(
      parent.children.map(async (child) => ({
        ...child,
        propertyCount: await countPropertiesByCategory(child.id),
      }))
    ),
  }))
);

const categoryTree = mapCategoryTreeArray(categoryTreeWithCounts);
---
```

## Data Structure

The components expect data in this structure:

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null; // Emoji icon (e.g., "🏠", "🏢")
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
  parentId?: string | null;
  propertyCount?: number; // Optional count badge
  children?: Category[]; // For tree items
}

type CategoryTree = CategoryTreeItem[];
```

## Icon Mapping

The components automatically map emoji icons to @iconify equivalents:

- "🏠" → `hugeicons:home-01`
- "🏢" → `hugeicons:building-03`
- "🏘️" → `hugeicons:tree-01`
- "🏬" → `hugeicons:store-01`
- "🏪" → `hugeicons:store-01`
- "🏭" → `hugeicons:building-03`
- "🏞️" → `hugeicons:plant-02`
- "🏡" → `hugeicons:home-01`

If no icon is provided, defaults to `hugeicons:tag-01`.

## Styling

The components use the project's CSS variables:

- `--color-primary` - Primary blue color
- `--color-foreground` - Main text color
- `--color-muted` - Light gray for backgrounds and borders

All styling is done with Tailwind CSS classes and is fully responsive.

## Accessibility

- ARIA labels and roles for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML structure
- High contrast support

## Mobile Experience

- Touch-friendly tap targets
- Smooth slide-out menu
- Backdrop to close menu
- Escape key support
- Body scroll lock prevention

The components work seamlessly together to provide a professional, accessible, and user-friendly category navigation system.