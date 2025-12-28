import { db, Categories, PropertyCategories, Properties } from 'astro:db';
import { eq, and, isNull, desc } from 'astro:db';

/**
 * Obtener todas las categorías padre (nivel 0)
 */
export async function getParentCategories() {
  return await db
    .select()
    .from(Categories)
    .where(and(
      isNull(Categories.parentId),
      eq(Categories.isActive, true)
    ))
    .orderBy(Categories.displayOrder)
    .all();
}

/**
 * Obtener categorías hijas de un padre específico
 */
export async function getChildCategories(parentId: string) {
  return await db
    .select()
    .from(Categories)
    .where(and(
      eq(Categories.parentId, parentId),
      eq(Categories.isActive, true)
    ))
    .orderBy(Categories.displayOrder)
    .all();
}

/**
 * Obtener árbol completo de categorías (padre con sus hijas)
 */
export async function getCategoryTree() {
  const parents = await getParentCategories();
  
  const tree = await Promise.all(
    parents.map(async (parent) => ({
      ...parent,
      children: await getChildCategories(parent.id),
    }))
  );
  
  return tree;
}

/**
 * Obtener una categoría por slug
 */
export async function getCategoryBySlug(slug: string) {
  return await db
    .select()
    .from(Categories)
    .where(eq(Categories.slug, slug))
    .get();
}

/**
 * Obtener categorías de una propiedad
 */
export async function getPropertyCategories(propertyId: string) {
  const result = await db
    .select({
      category: Categories,
      isPrimary: PropertyCategories.isPrimary,
    })
    .from(PropertyCategories)
    .innerJoin(Categories, eq(PropertyCategories.categoryId, Categories.id))
    .where(eq(PropertyCategories.propertyId, propertyId))
    .all();
  
  return result;
}

/**
 * Obtener propiedades de una categoría
 */
export async function getPropertiesByCategory(categoryId: string, limit = 10) {
  const result = await db
    .select({
      property: Properties,
      isPrimary: PropertyCategories.isPrimary,
    })
    .from(PropertyCategories)
    .innerJoin(Properties, eq(PropertyCategories.propertyId, Properties.id))
    .where(and(
      eq(PropertyCategories.categoryId, categoryId),
      eq(Properties.isActive, true)
    ))
    .orderBy(desc(Properties.featured))
    .limit(limit)
    .all();
  
  return result.map(r => r.property);
}

/**
 * Contar propiedades por categoría
 */
export async function countPropertiesByCategory(categoryId: string) {
  const result = await db
    .select()
    .from(PropertyCategories)
    .innerJoin(Properties, eq(PropertyCategories.propertyId, Properties.id))
    .where(and(
      eq(PropertyCategories.categoryId, categoryId),
      eq(Properties.isActive, true)
    ))
    .all();
  
  return result.length;
}
