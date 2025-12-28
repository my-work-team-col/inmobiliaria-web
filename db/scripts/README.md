# 🔧 Herramientas para Gestionar Categorías

Este directorio contiene scripts y utilidades para cambiar y gestionar categorías de propiedades.

## 📋 Herramientas Disponibles

### 1. **Script Interactivo Individual** 
Cambiar la categoría de UNA propiedad de forma interactiva

```bash
pnpm db:change-category
# o
pnpm tsx db/scripts/change-category.ts
```

**Características:**
- ✅ Lista las últimas 10 propiedades
- ✅ Buscar por número o código
- ✅ Muestra categoría actual
- ✅ Árbol visual de categorías disponibles
- ✅ Confirmación antes de cambiar

**Ejemplo de uso:**
```
📋 Últimas 10 propiedades:

1. PROP-ABC123 - Apartamento en Chapinero, Bogotá
2. PROP-XYZ789 - Casa en El Poblado, Medellín
...

Ingresa el número o código de la propiedad: 1

✅ Propiedad seleccionada: Apartamento en Chapinero, Bogotá
📂 Categoría actual: Casa

📂 Categorías disponibles:

🏠 Residencial
   ├── 🏢 Apartamento
   ├── 🏡 Casa
   └── 🏞️ Finca
...

Nueva categoría: Apartamento
🔄 Cambiar de "Casa" a "Apartamento"
¿Confirmar? (s/n): s

✅ Categoría actualizada exitosamente!
```

---

### 2. **Script de Búsqueda y Cambio Masivo**
Buscar múltiples propiedades y cambiar sus categorías en batch

```bash
pnpm db:search-change
# o
pnpm tsx db/scripts/search-and-change.ts
```

**Características:**
- ✅ Buscar por título, código o ciudad
- ✅ Seleccionar múltiples propiedades
- ✅ Cambiar categoría en lote
- ✅ Soporta rangos (1-5) o individuales (1,3,5)
- ✅ Opción "todos" para seleccionar todas

**Ejemplo de uso:**
```
Buscar propiedad (título, código o ciudad): Bogotá

🔍 Buscando...

📋 Encontradas 15 propiedades:

1. PROP-ABC123 - Apartamento en Chapinero, Bogotá
2. PROP-DEF456 - Casa en Usaquén, Bogotá
...

Selecciona propiedades: 1-5

✅ 5 propiedades seleccionadas

Nueva categoría para las propiedades seleccionadas: Apartamento

🔄 Cambiar 5 propiedades a "🏢 Apartamento"
¿Confirmar? (s/n): s

✅ Actualización completada!
   • Exitosas: 5
```

---

### 3. **Astro DB Studio (GUI Visual)**
Interfaz gráfica oficial de Astro DB

```bash
pnpm db:studio
# o
pnpm astro db studio
```

**Características:**
- ✅ Interfaz visual en el navegador
- ✅ Ver todas las tablas
- ✅ Editar datos directamente
- ✅ Ejecutar queries SQL
- ✅ Exportar datos

**Pasos para cambiar categoría:**
1. Abre `http://localhost:4321/_astro/db` (se abre automático)
2. Ve a la tabla `PropertyCategories`
3. Busca la propiedad por `propertyId`
4. Edita el campo `categoryId` con el nuevo ID
5. Guarda cambios

**Nota:** Necesitas tener los IDs de las categorías. Puedes verlos en la tabla `Categories`.

---

### 4. **Helpers de Código (Programático)**
Funciones helper para usar en tu código Astro/TypeScript

```typescript
import { 
  changePropertyCategory, 
  changePropertyCategoryBySlug,
  getPropertyMainCategory 
} from '@/lib/db/categoryHelpers';

// Cambiar por ID
await changePropertyCategory(propertyId, newCategoryId);

// Cambiar por slug (más fácil)
await changePropertyCategoryBySlug(propertyId, 'apartamento');

// Obtener categoría actual
const category = await getPropertyMainCategory(propertyId);
console.log(category.categoryName); // "Apartamento"
```

**Funciones disponibles:**

| Función | Descripción |
|---------|-------------|
| `changePropertyCategory(propertyId, categoryId)` | Cambiar categoría por IDs |
| `changePropertyCategoryBySlug(propertyId, slug)` | Cambiar por slug ('apartamento', 'casa') |
| `assignMultipleCategories(propertyId, categoryIds)` | Asignar múltiples categorías |
| `getPropertyMainCategory(propertyId)` | Obtener categoría principal |
| `batchChangeCategories(updates[])` | Cambio masivo |

**Ejemplo completo:**
```typescript
// En un Astro Action o API endpoint
import { defineAction } from 'astro:actions';
import { changePropertyCategoryBySlug } from '@/lib/db/categoryHelpers';

export const server = {
  updateCategory: defineAction({
    input: z.object({
      propertyId: z.string(),
      categorySlug: z.string(),
    }),
    handler: async ({ propertyId, categorySlug }) => {
      const result = await changePropertyCategoryBySlug(propertyId, categorySlug);
      return result;
    },
  }),
};
```

---

## 🎯 Casos de Uso

### Caso 1: Corregir una propiedad mal categorizada
```bash
pnpm db:change-category
# Selecciona la propiedad y asigna la categoría correcta
```

### Caso 2: Migrar todas las casas a apartamentos
```bash
pnpm db:search-change
# Busca: "casa"
# Selecciona: "todos"
# Categoría: "apartamento"
```

### Caso 3: Automatizar asignación desde un script
```typescript
import { batchChangeCategories } from '@/lib/db/categoryHelpers';

const updates = properties.map(prop => ({
  propertyId: prop.id,
  categoryId: determineCategory(prop), // Tu lógica aquí
}));

await batchChangeCategories(updates);
```

---

## 📊 IDs de Categorías (Referencia Rápida)

Para usar en Astro DB Studio o código:

| Categoría Padre | Categoría Hija | Slug |
|----------------|----------------|------|
| **🏠 Residencial** | | `residencial` |
| | 🏢 Apartamento | `apartamento` |
| | 🏡 Casa | `casa` |
| | 🏞️ Finca | `finca` |
| **💼 Comercial** | | `comercial` |
| | 🏪 Local Comercial | `local-comercial` |
| | 🏢 Oficina | `oficina` |
| | 📦 Bodega | `bodega` |
| **🗺️ Terrenos** | | `terrenos` |
| | 📐 Lote | `lote` |
| | 🌾 Terreno Rural | `terreno-rural` |

**💡 Tip:** Es más fácil usar el **slug** que el ID:
```typescript
// Fácil ✅
await changePropertyCategoryBySlug(id, 'apartamento');

// Complejo ❌
await changePropertyCategory(id, 'abc-123-uuid-largo...');
```

---

## 🚀 Quick Start

```bash
# 1. Resetear BD con nuevos datos (60 propiedades con Faker)
pnpm db:push

# 2. Ver datos en GUI
pnpm db:studio

# 3. Cambiar categoría de una propiedad
pnpm db:change-category

# 4. Cambiar categorías en lote
pnpm db:search-change
```

---

## 🛠️ Troubleshooting

### Error: "tsx no encontrado"
```bash
pnpm add -D tsx
```

### Error: "Categoría no encontrada"
Verifica que escribiste bien el nombre. Es case-insensitive pero debe ser exacto:
- ✅ `apartamento`, `Apartamento`, `APARTAMENTO`
- ❌ `apartamento s` (con 's')

### Error: "Propiedad sin categoría"
Algunas propiedades pueden no tener categoría asignada. Usa el script para asignarla.

---

## 📚 Archivos Relacionados

- [db/seed.ts](../seed.ts) - Seed con Faker (60 propiedades)
- [src/lib/db/categoryHelpers.ts](../../src/lib/db/categoryHelpers.ts) - Helpers programáticos
- [src/lib/db/categoryQueries.ts](../../src/lib/db/categoryQueries.ts) - Queries de lectura
- [docs/BASE-DE-DATOS.md](../../docs/BASE-DE-DATOS.md) - Documentación completa

---

**Mantenido por:** Yormi Altamiranda & Didier Méndez  
**Última actualización:** 28 de diciembre de 2025
