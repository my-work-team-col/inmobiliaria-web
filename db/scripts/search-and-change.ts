#!/usr/bin/env tsx
/**
 * Script para buscar propiedades por texto y cambiar su categoría
 * 
 * Uso:
 *   pnpm tsx db/scripts/search-and-change.ts
 */

import { db, Properties, Categories, PropertyCategories } from 'astro:db';
import { eq, like, and, isNull } from 'astro:db';
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
  console.log('║  🔍 Buscar y Cambiar Categoría         ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    // 1. Buscar propiedades
    const searchTerm = await question('Buscar propiedad (título, código o ciudad): ');
    
    if (!searchTerm.trim()) {
      console.log('❌ Debes ingresar un término de búsqueda');
      rl.close();
      return;
    }
    
    console.log('\n🔍 Buscando...\n');
    
    const properties = await db
      .select()
      .from(Properties)
      .where(
        // Buscar en título, código o ciudad
        // Nota: SQLite solo soporta LIKE, no full-text search
        like(Properties.title, `%${searchTerm}%`)
      )
      .all();
    
    if (properties.length === 0) {
      console.log('❌ No se encontraron propiedades');
      rl.close();
      return;
    }
    
    console.log(`📋 Encontradas ${properties.length} propiedades:\n`);
    
    properties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.code} - ${prop.title}`);
      console.log(`   📍 ${prop.city} - ${prop.neighborhood}`);
      console.log(`   💰 $${prop.price.toLocaleString()}\n`);
    });
    
    // 2. Seleccionar propiedades
    console.log('💡 Opciones:');
    console.log('   - Ingresa números separados por coma (ej: 1,3,5)');
    console.log('   - Ingresa "todos" para seleccionar todas');
    console.log('   - Ingresa un rango (ej: 1-5)\n');
    
    const selection = await question('Selecciona propiedades: ');
    
    let selectedProperties: typeof properties = [];
    
    if (selection.toLowerCase() === 'todos' || selection.toLowerCase() === 'all') {
      selectedProperties = properties;
    } else if (selection.includes('-')) {
      // Rango (ej: 1-5)
      const [start, end] = selection.split('-').map(n => parseInt(n.trim()));
      selectedProperties = properties.slice(start - 1, end);
    } else {
      // Números individuales (ej: 1,3,5)
      const indices = selection.split(',').map(n => parseInt(n.trim()) - 1);
      selectedProperties = indices.map(i => properties[i]).filter(Boolean);
    }
    
    if (selectedProperties.length === 0) {
      console.log('❌ No se seleccionaron propiedades válidas');
      rl.close();
      return;
    }
    
    console.log(`\n✅ ${selectedProperties.length} propiedades seleccionadas\n`);
    
    // 3. Listar categorías
    console.log('📂 Categorías disponibles:\n');
    
    const parentCategories = await db
      .select()
      .from(Categories)
      .where(and(isNull(Categories.parentId), eq(Categories.isActive, true)))
      .all();
    
    const allCategories: any[] = [];
    
    for (const parent of parentCategories) {
      console.log(`${parent.icon} ${parent.name}`);
      
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
    
    // 4. Seleccionar nueva categoría
    const categoryInput = await question('Nueva categoría para las propiedades seleccionadas: ');
    
    const newCategory = allCategories.find(
      cat => cat.name.toLowerCase() === categoryInput.toLowerCase() || 
             cat.slug.toLowerCase() === categoryInput.toLowerCase()
    );
    
    if (!newCategory) {
      console.log('❌ Categoría no encontrada');
      rl.close();
      return;
    }
    
    // 5. Confirmar
    console.log(`\n🔄 Cambiar ${selectedProperties.length} propiedades a "${newCategory.icon} ${newCategory.name}"`);
    console.log('\nPropiedades a actualizar:');
    selectedProperties.forEach(prop => console.log(`   - ${prop.title}`));
    
    const confirm = await question('\n¿Confirmar? (s/n): ');
    
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'si') {
      console.log('❌ Operación cancelada');
      rl.close();
      return;
    }
    
    // 6. Actualizar en batch
    console.log('\n🔄 Actualizando...\n');
    let updated = 0;
    let errors = 0;
    
    for (const prop of selectedProperties) {
      try {
        // Verificar si ya tiene categoría
        const existing = await db
          .select()
          .from(PropertyCategories)
          .where(eq(PropertyCategories.propertyId, prop.id))
          .get();
        
        if (existing) {
          // Actualizar
          await db
            .update(PropertyCategories)
            .set({ 
              categoryId: newCategory.id,
              createdAt: new Date(),
            })
            .where(eq(PropertyCategories.propertyId, prop.id))
            .run();
        } else {
          // Insertar
          await db
            .insert(PropertyCategories)
            .values({
              propertyId: prop.id,
              categoryId: newCategory.id,
              isPrimary: true,
              createdAt: new Date(),
            })
            .run();
        }
        
        updated++;
        console.log(`   ✓ ${prop.code} - ${prop.title}`);
      } catch (error) {
        errors++;
        console.log(`   ✗ ${prop.code} - Error: ${error}`);
      }
    }
    
    console.log(`\n✅ Actualización completada!`);
    console.log(`   • Exitosas: ${updated}`);
    if (errors > 0) {
      console.log(`   • Errores: ${errors}`);
    }
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
  }
}

main();
