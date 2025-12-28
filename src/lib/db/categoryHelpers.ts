/**
 * Helper para cambiar o asignar categorías a propiedades
 * 
 * Uso en código:
 *   import { changePropertyCategory } from '@/lib/db/categoryHelpers';
 *   await changePropertyCategory(propertyId, newCategoryId);
 */

import { db, PropertyCategories, Categories } from 'astro:db';
import { eq, and } from 'astro:db';

/**
 * Cambia la categoría de una propiedad
 * @param propertyId - ID de la propiedad
 * @param newCategoryId - ID de la nueva categoría
 * @returns true si se cambió exitosamente
 */
export async function changePropertyCategory(
  propertyId: string,
  newCategoryId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Validar que la categoría existe y es hija (nivel 1)
    const category = await db
      .select()
      .from(Categories)
      .where(eq(Categories.id, newCategoryId))
      .get();
    
    if (!category) {
      return {
        success: false,
        message: 'Categoría no encontrada',
      };
    }
    
    if (!category.parentId) {
      return {
        success: false,
        message: 'Solo se pueden asignar categorías hijas. Esta es una categoría padre.',
      };
    }
    
    // Verificar si ya tiene categoría
    const existing = await db
      .select()
      .from(PropertyCategories)
      .where(eq(PropertyCategories.propertyId, propertyId))
      .get();
    
    if (existing) {
      // Actualizar
      await db
        .update(PropertyCategories)
        .set({ 
          categoryId: newCategoryId,
          createdAt: new Date(),
        })
        .where(eq(PropertyCategories.propertyId, propertyId))
        .run();
      
      return {
        success: true,
        message: `Categoría actualizada a: ${category.name}`,
      };
    } else {
      // Insertar nueva
      await db
        .insert(PropertyCategories)
        .values({
          propertyId,
          categoryId: newCategoryId,
          isPrimary: true,
          createdAt: new Date(),
        })
        .run();
      
      return {
        success: true,
        message: `Categoría asignada: ${category.name}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    };
  }
}

/**
 * Asigna múltiples categorías a una propiedad (secundarias)
 * @param propertyId - ID de la propiedad
 * @param categoryIds - Array de IDs de categorías
 */
export async function assignMultipleCategories(
  propertyId: string,
  categoryIds: string[],
  primaryCategoryId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Limpiar categorías existentes
    await db
      .delete(PropertyCategories)
      .where(eq(PropertyCategories.propertyId, propertyId))
      .run();
    
    // Insertar nuevas categorías
    const values = categoryIds.map((categoryId, index) => ({
      propertyId,
      categoryId,
      isPrimary: primaryCategoryId ? categoryId === primaryCategoryId : index === 0,
      createdAt: new Date(),
    }));
    
    await db.insert(PropertyCategories).values(values).run();
    
    return {
      success: true,
      message: `${categoryIds.length} categorías asignadas`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    };
  }
}

/**
 * Obtiene la categoría principal de una propiedad
 * @param propertyId - ID de la propiedad
 */
export async function getPropertyMainCategory(propertyId: string) {
  const result = await db
    .select({
      categoryId: Categories.id,
      categoryName: Categories.name,
      categorySlug: Categories.slug,
      categoryIcon: Categories.icon,
      parentId: Categories.parentId,
    })
    .from(PropertyCategories)
    .innerJoin(Categories, eq(PropertyCategories.categoryId, Categories.id))
    .where(
      and(
        eq(PropertyCategories.propertyId, propertyId),
        eq(PropertyCategories.isPrimary, true)
      )
    )
    .get();
  
  return result;
}

/**
 * Cambia categoría de una propiedad por slug
 * @param propertyId - ID de la propiedad
 * @param categorySlug - Slug de la nueva categoría (ej: 'apartamento', 'casa')
 */
export async function changePropertyCategoryBySlug(
  propertyId: string,
  categorySlug: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Buscar categoría por slug
    const category = await db
      .select()
      .from(Categories)
      .where(eq(Categories.slug, categorySlug))
      .get();
    
    if (!category) {
      return {
        success: false,
        message: `Categoría con slug "${categorySlug}" no encontrada`,
      };
    }
    
    return await changePropertyCategory(propertyId, category.id);
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    };
  }
}

/**
 * Cambia categorías de múltiples propiedades en batch
 * @param updates - Array de { propertyId, categoryId }
 */
export async function batchChangeCate gories(
  updates: Array<{ propertyId: string; categoryId: string }>
): Promise<{ success: boolean; updated: number; errors: number }> {
  let updated = 0;
  let errors = 0;
  
  for (const update of updates) {
    const result = await changePropertyCategory(update.propertyId, update.categoryId);
    if (result.success) {
      updated++;
    } else {
      errors++;
    }
  }
  
  return {
    success: errors === 0,
    updated,
    errors,
  };
}
