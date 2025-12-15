# 🔧 Plan de Refactoring - Base de Datos

> **Rama:** `refactoring`  
> **Fecha inicio:** 2025-12-15  
> **Objetivo:** Implementar mejoras críticas identificadas en el análisis de DB

---

## 📋 Estado del Refactoring

### Progreso General

```
Fase 1 (Crítico):     [ ] 0/4 completadas
Fase 2 (Importante):  [ ] 0/6 completadas
Fase 3 (Opcional):    [ ] 0/3 completadas
```

---

## 🔴 FASE 1: Cambios Críticos

### ✅ Checklist de Tareas

#### 1. Resolver Duplicación de Imágenes
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 2-3 horas  
**Estado:** ⏳ Pendiente

- [ ] **1.1** Modificar schema `db/config.ts`
  - [ ] Eliminar campo `gallery` de tabla `Properties`
  - [ ] Agregar campo `order` a `PropertiesImages`
  - [ ] Agregar campo `isPrimary` a `PropertiesImages`
  - [ ] Agregar campo `alt` a `PropertiesImages` (opcional)
  - [ ] Agregar índices a `PropertiesImages`

- [ ] **1.2** Actualizar seed `db/seed.ts`
  - [ ] Remover inserción de campo `gallery`
  - [ ] Agregar `order` al insertar imágenes
  - [ ] Marcar primera imagen como `isPrimary`
  - [ ] Agregar `alt` text automático

- [ ] **1.3** Actualizar JSON `src/data/properties.json`
  - [ ] Documentar que campo `id` se ignora
  - [ ] (Opcional) Remover campo `id` numérico

- [ ] **1.4** Crear endpoint de imágenes
  - [ ] Crear `src/pages/api/properties/[slug]/images.ts`
  - [ ] Implementar GET con ordenamiento
  - [ ] Agregar manejo de errores

- [ ] **1.5** Actualizar endpoint principal
  - [ ] Modificar `src/pages/api/properties/[slug].ts`
  - [ ] Hacer JOIN con `PropertiesImages`
  - [ ] Incluir imágenes en respuesta

- [ ] **1.6** Actualizar componentes frontend
  - [ ] Identificar componentes que usan `gallery`
  - [ ] Actualizar para usar `images` array
  - [ ] Probar renderizado

- [ ] **1.7** Testing
  - [ ] Probar seed: `pnpm astro db push --force-reset`
  - [ ] Probar endpoint `/api/properties`
  - [ ] Probar endpoint `/api/properties/[slug]`
  - [ ] Verificar frontend

---

#### 2. Agregar `prerender = false` y Headers
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 15 minutos  
**Estado:** ⏳ Pendiente

- [ ] **2.1** Actualizar `src/pages/api/properties/index.ts`
  - [ ] Agregar `export const prerender = false;`
  - [ ] Agregar header `Content-Type: application/json`
  - [ ] Agregar header `Cache-Control` (opcional)

- [ ] **2.2** Actualizar `src/pages/api/properties/[slug].ts`
  - [ ] Verificar `prerender = false` existe
  - [ ] Agregar header `Content-Type: application/json`
  - [ ] Agregar header `Cache-Control` (opcional)

- [ ] **2.3** Testing
  - [ ] Verificar headers en respuesta
  - [ ] Verificar SSR funciona correctamente

---

#### 3. Hacer Campo `code` Único
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 5 minutos  
**Estado:** ⏳ Pendiente

- [ ] **3.1** Modificar schema
  - [ ] Cambiar `code: column.text()` a `code: column.text({ unique: true })`

- [ ] **3.2** Verificar datos
  - [ ] Revisar que no hay códigos duplicados en JSON
  - [ ] Ejecutar seed

---

#### 4. Validación en Seed
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 30 minutos  
**Estado:** ⏳ Pendiente

- [ ] **4.1** Agregar validaciones
  - [ ] Validar `item.gallery` existe y no está vacío
  - [ ] Validar campos requeridos (title, slug, etc.)
  - [ ] Agregar try/catch general
  - [ ] Agregar logs informativos

- [ ] **4.2** Testing
  - [ ] Probar con datos válidos
  - [ ] Probar con datos inválidos (simular error)

---

## 🟡 FASE 2: Mejoras Importantes

### ✅ Checklist de Tareas

#### 5. Migrar Categorías a Tabla Relacional
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 4-5 horas  
**Estado:** ⏳ Pendiente

- [ ] **5.1** Crear tablas
  - [ ] Crear tabla `Categories` en schema
  - [ ] Crear tabla `PropertyCategories` en schema
  - [ ] Agregar índices

- [ ] **5.2** Seed de categorías
  - [ ] Crear array de categorías base
  - [ ] Insertar categorías en seed
  - [ ] Relacionar propiedades con categorías

- [ ] **5.3** Actualizar queries
  - [ ] Modificar endpoints para incluir categorías
  - [ ] Crear endpoint `/api/categories`

- [ ] **5.4** Actualizar frontend
  - [ ] Actualizar componentes que usan categorías
  - [ ] Probar filtrado por categoría

---

#### 6. Agregar Índices
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 30 minutos  
**Estado:** ⏳ Pendiente

- [ ] **6.1** Agregar índices a `Properties`
  - [ ] Índice en `city`
  - [ ] Índice en `neighborhood`
  - [ ] Índice en `featured`
  - [ ] Índice en `isActive`
  - [ ] Índice en `price`

- [ ] **6.2** Testing
  - [ ] Ejecutar seed
  - [ ] Verificar performance de queries

---

#### 7. Agregar Timestamps
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 30 minutos  
**Estado:** ⏳ Pendiente

- [ ] **7.1** Modificar schema
  - [ ] Agregar `createdAt` con default `CURRENT_TIMESTAMP`
  - [ ] Agregar `updatedAt` con default `CURRENT_TIMESTAMP`

- [ ] **7.2** Testing
  - [ ] Ejecutar seed
  - [ ] Verificar timestamps se generan correctamente

---

#### 8. Mejorar Manejo de Errores en APIs
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1 hora  
**Estado:** ⏳ Pendiente

- [ ] **8.1** Agregar try/catch a todos los endpoints
- [ ] **8.2** Estandarizar formato de errores
- [ ] **8.3** Agregar logs de errores
- [ ] **8.4** Testing de casos de error

---

#### 9. Crear Tipos TypeScript Centralizados
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 1 hora  
**Estado:** ⏳ Pendiente

- [ ] **9.1** Crear archivos de tipos
  - [ ] `src/types/domain/Property.ts`
  - [ ] `src/types/domain/PropertyImage.ts`
  - [ ] `src/types/domain/Category.ts`

- [ ] **9.2** Exportar desde index
  - [ ] `src/types/index.ts`

- [ ] **9.3** Actualizar código para usar tipos
  - [ ] Actualizar seed
  - [ ] Actualizar endpoints
  - [ ] Actualizar componentes

---

#### 10. Documentar Cambios
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 1 hora  
**Estado:** ⏳ Pendiente

- [ ] **10.1** Actualizar README.md
- [ ] **10.2** Actualizar PROJECT_DOCUMENTATION.md
- [ ] **10.3** Crear CHANGELOG.md
- [ ] **10.4** Documentar nuevos endpoints

---

## 🟢 FASE 3: Optimizaciones Opcionales

### ✅ Checklist de Tareas

#### 11. Implementar Paginación
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 2 horas  
**Estado:** ⏳ Pendiente

- [ ] **11.1** Agregar paginación a `/api/properties`
- [ ] **11.2** Agregar parámetros `page` y `limit`
- [ ] **11.3** Incluir metadata de paginación en respuesta
- [ ] **11.4** Testing

---

#### 12. Implementar Filtros Avanzados
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 3 horas  
**Estado:** ⏳ Pendiente

- [ ] **12.1** Filtro por ciudad
- [ ] **12.2** Filtro por rango de precio
- [ ] **12.3** Filtro por número de habitaciones
- [ ] **12.4** Filtro por categoría
- [ ] **12.5** Testing

---

#### 13. Optimización de Performance
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 2 horas  
**Estado:** ⏳ Pendiente

- [ ] **13.1** Agregar cache headers
- [ ] **13.2** Optimizar queries (evitar N+1)
- [ ] **13.3** Benchmark de performance

---

## 📝 Notas de Implementación

### Comandos Útiles

```bash
# Resetear DB y ejecutar seed
pnpm astro db push --force-reset

# Ver schema actual
pnpm astro db shell

# Ejecutar dev server
pnpm dev

# Build para verificar
pnpm build
```

### Orden Recomendado de Implementación

1. ✅ **Primero:** Tarea 2 (prerender y headers) - Rápido y seguro
2. ✅ **Segundo:** Tarea 3 (code único) - Rápido y seguro
3. ✅ **Tercero:** Tarea 4 (validación seed) - Preparación
4. ✅ **Cuarto:** Tarea 1 (imágenes) - El más complejo, requiere testing
5. ✅ **Después:** Resto de Fase 2 según prioridad

### Puntos de Verificación

Después de cada tarea:
- [ ] Ejecutar `pnpm astro db push --force-reset`
- [ ] Verificar que seed funciona sin errores
- [ ] Probar endpoints en navegador o Postman
- [ ] Verificar que frontend sigue funcionando
- [ ] Hacer commit con mensaje descriptivo

### Estrategia de Commits

```bash
# Formato de commits
git commit -m "refactor(db): descripción del cambio"

# Ejemplos:
git commit -m "refactor(db): add prerender false to all endpoints"
git commit -m "refactor(db): make code field unique"
git commit -m "refactor(db): remove gallery field and use PropertiesImages table"
```

---

## 🚨 Consideraciones Importantes

### Antes de Empezar

- ✅ Estamos en rama `refactoring` (verificar con `git branch`)
- ✅ Servidor dev está corriendo (`pnpm dev`)
- ✅ Tenemos backup de la rama principal

### Durante el Refactoring

- ⚠️ **Hacer commits frecuentes** - Después de cada tarea completada
- ⚠️ **Probar después de cada cambio** - No acumular cambios sin probar
- ⚠️ **Documentar problemas** - Anotar cualquier issue encontrado

### Después de Completar Fase 1

- [ ] Ejecutar testing completo
- [ ] Verificar que no hay errores en consola
- [ ] Hacer commit final de la fase
- [ ] (Opcional) Merge a rama principal si todo funciona

---

## 📊 Métricas de Éxito

### Fase 1 Completada Cuando:

- ✅ No hay duplicación de imágenes
- ✅ Todos los endpoints tienen `prerender = false`
- ✅ Todos los endpoints tienen headers correctos
- ✅ Campo `code` es único
- ✅ Seed tiene validación
- ✅ Frontend funciona correctamente
- ✅ No hay errores en consola

### Fase 2 Completada Cuando:

- ✅ Categorías son relacionales
- ✅ Índices están implementados
- ✅ Timestamps funcionan
- ✅ Manejo de errores es robusto
- ✅ Tipos TypeScript están centralizados
- ✅ Documentación está actualizada

---

## 🎯 Próximos Pasos

1. **Revisar este plan** - Asegurarse de entender cada tarea
2. **Empezar con Tarea 2** - La más simple para calentar
3. **Seguir el orden recomendado** - No saltar pasos
4. **Pedir ayuda si es necesario** - Mejor preguntar que romper algo

---

**Última actualización:** 2025-12-15  
**Rama:** `refactoring`  
**Estado:** 🚀 Listo para empezar
