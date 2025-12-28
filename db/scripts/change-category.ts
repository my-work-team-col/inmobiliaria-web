#!/usr/bin/env tsx
/**
 * Script interactivo para cambiar la categoría de una propiedad
 * 
 * Uso:
 *   pnpm tsx db/scripts/change-category.ts
 */

import { db, Properties, Categories, PropertyCategories } from 'astro:db';
import { eq, and, isNull } from 'astro:db';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🏠 Cambiar Categoría de Propiedad     ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    // 1. Listar propiedades recientes
    console.log('📋 Últimas 10 propiedades:\n');
    const properties = await db
      .select({
        id: Properties.id,
        title: Properties.title,
        code: Properties.code,
      })
      .from(Properties)
      .limit(10)
      .all();
    
    properties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.code} - ${prop.title}`);
    });
    
    console.log('\n💡 Tip: También puedes buscar por código (ej: PROP-ABC123)\n');
    
    // 2. Solicitar código de propiedad
    const propertyInput = await question('Ingresa el número o código de la propiedad: ');
    
    let selectedProperty;
    if (!isNaN(Number(propertyInput))) {
      const index = Number(propertyInput) - 1;
      selectedProperty = properties[index];
    } else {
      const result = await db
        .select()
        .from(Properties)
        .where(eq(Properties.code, propertyInput.toUpperCase()))
        .get();
      selectedProperty = result;
    }
    
    if (!selectedProperty) {
      console.log('❌ Propiedad no encontrada');
      rl.close();
      return;
    }
    
    console.log(`\n✅ Propiedad seleccionada: ${selectedProperty.title}\n`);
    
    // 3. Obtener categoría actual
    const currentCategory = await db
      .select({
        categoryName: Categories.name,
        categoryId: PropertyCategories.categoryId,
      })
      .from(PropertyCategories)
      .innerJoin(Categories, eq(PropertyCategories.categoryId, Categories.id))
      .where(eq(PropertyCategories.propertyId, selectedProperty.id))
      .get();
    
    if (currentCategory) {
      console.log(`📂 Categoría actual: ${currentCategory.categoryName}\n`);
    } else {
      console.log('📂 Categoría actual: Sin categoría\n');
    }
    
    // 4. Listar categorías disponibles
    console.log('📂 Categorías disponibles:\n');
    
    // Obtener categorías padre
    const parentCategories = await db
      .select()
      .from(Categories)
      .where(and(isNull(Categories.parentId), eq(Categories.isActive, true)))
      .all();
    
    const allCategories = [];
    
    for (const parent of parentCategories) {
      console.log(`${parent.icon} ${parent.name}`);
      
      // Obtener hijas
      const children = await db
        .select()
        .from(Categories)
        .where(and(eq(Categories.parentId, parent.id), eq(Categories.isActive, true)))
        .all();
      
      children.forEach((child, index) => {
        const isLast = index === children.length - 1;
        const prefix = isLast ? '   └──' : '   ├──';
        console.log(`${prefix} ${child.icon} ${child.name}`);
        allCategories.push(child);
      });
      
      console.log('');
    }
    
    // 5. Solicitar nueva categoría
    console.log('💡 Ingresa el nombre de la categoría (ej: Apartamento, Casa, Oficina)\n');
    const categoryInput = await question('Nueva categoría: ');
    
    const newCategory = allCategories.find(
      cat => cat.name.toLowerCase() === categoryInput.toLowerCase() || 
             cat.slug.toLowerCase() === categoryInput.toLowerCase()
    );
    
    if (!newCategory) {
      console.log('❌ Categoría no encontrada');
      rl.close();
      return;
    }
    
    // 6. Confirmar cambio
    console.log(`\n🔄 Cambiar de "${currentCategory?.categoryName || 'Sin categoría'}" a "${newCategory.name}"`);
    const confirm = await question('¿Confirmar? (s/n): ');
    
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'si') {
      console.log('❌ Operación cancelada');
      rl.close();
      return;
    }
    
    // 7. Realizar cambio
    if (currentCategory) {
      // Actualizar categoría existente
      await db
        .update(PropertyCategories)
        .set({ categoryId: newCategory.id })
        .where(eq(PropertyCategories.propertyId, selectedProperty.id))
        .run();
    } else {
      // Insertar nueva relación
      await db
        .insert(PropertyCategories)
        .values({
          propertyId: selectedProperty.id,
          categoryId: newCategory.id,
          isPrimary: true,
          createdAt: new Date(),
        })
        .run();
    }
    
    console.log('\n✅ Categoría actualizada exitosamente!');
    console.log(`📝 ${selectedProperty.title} → ${newCategory.icon} ${newCategory.name}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
  }
}

main();
