import { db, Categories } from 'astro:db';
import { eq } from 'astro:db';

/**
 * Valida que una categoría no tenga más de 2 niveles
 * Nivel 0: Padre (parentId = null)
 * Nivel 1: Hija (parentId = id de padre)
 */
export async function validateCategoryCreation(data: {
  parentId?: string | null;
}): Promise<{ valid: boolean; error?: string }> {
  // Si no tiene parentId, es categoría padre (nivel 0) - OK
  if (!data.parentId) {
    return { valid: true };
  }
  
  // Si tiene parentId, verificar que el padre exista
  const parent = await db
    .select()
    .from(Categories)
    .where(eq(Categories.id, data.parentId))
    .get();
  
  if (!parent) {
    return { 
      valid: false, 
      error: 'La categoría padre no existe' 
    };
  }
  
  // Verificar que el padre NO tenga parentId (debe ser nivel 0)
  if (parent.parentId !== null) {
    return { 
      valid: false, 
      error: 'No se permiten más de 2 niveles. Solo: Padre → Hija' 
    };
  }
  
  return { valid: true };
}

/**
 * Verifica si una categoría es padre (nivel 0)
 */
export function isParentCategory(category: { parentId: string | null }): boolean {
  return category.parentId === null;
}

/**
 * Verifica si una categoría es hija (nivel 1)
 */
export function isChildCategory(category: { parentId: string | null }): boolean {
  return category.parentId !== null;
}
