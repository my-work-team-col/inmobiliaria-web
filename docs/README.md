# 📚 Documentación del Proyecto - Inmobiliaria Web

> Documentación completa del proyecto de sitio web inmobiliario construido con Astro, TypeScript, Astro DB y Tailwind CSS.

**Última actualización:** 28 de diciembre de 2025  
**Versión del Proyecto:** 1.0.0

---

## 🎯 Inicio Rápido

Si eres nuevo en el proyecto, empieza por aquí:

1. **[ESTRUCTURA.md](ESTRUCTURA.md)** - Visión completa del proyecto, objetivos, stack y cronograma
2. **[ASTRO.md](ASTRO.md)** - Framework Astro, SSR, componentes e Islands
3. **[BASE-DE-DATOS.md](BASE-DE-DATOS.md)** ⭐ - Astro DB, schema, taxonomía, migraciones y Astro Actions
4. **[DISEÑO-UX-UI.md](DISEÑO-UX-UI.md)** - Sistema de colores, componentes y accesibilidad
5. **[VUE.md](VUE.md)** - Integración de Vue.js con Astro Islands

---

## 📋 Documentación por Categoría

### 📖 Información General

| Documento | Descripción |
|-----------|-------------|
| **[ESTRUCTURA.md](ESTRUCTURA.md)** | Información del proyecto, autores, objetivos, stack tecnológico completo y cronograma |
| **[CHANGELOG-DOCS.md](CHANGELOG-DOCS.md)** | Registro de cambios en la documentación |

---

### 🚀 Framework y Arquitectura

| Documento | Descripción |
|-----------|-------------|
| **[ASTRO.md](ASTRO.md)** | Migración SSG→SSR, estructura del proyecto, componentes Astro, Islands, TypeScript y mejores prácticas |

**Temas cubiertos:**
- Migración de SSG a SSR
- Eliminación de `getStaticPaths()`
- Estructura de carpetas
- Componentes Astro vs Vue
- Astro Islands Architecture
- Directivas `client:*`
- TypeScript configuration
- Mejores prácticas

---

### 🗄️ Base de Datos

| Documento | Descripción |
|-----------|-------------|
| **[BASE-DE-DATOS.md](BASE-DE-DATOS.md)** ⭐ | Schema completo, taxonomía y mejores prácticas de Astro DB |
| **[MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md)** ⭐ | Feature completa de migración de imágenes a Cloudinary con eliminación de duplicados |

**BASE-DE-DATOS.md - Temas cubiertos:**
- Schema completo de Astro DB (7 tablas)
- Migración de JSON a Astro DB
- UUIDs como primary keys
- Relaciones 1:N y Many-to-Many
- Sistema de categorías jerárquicas (2 niveles) ✅
- Sistema de Tags, Attributes y Brands ⏳
- Astro Actions (getPropertiesByPage)
- Sistema de imágenes con mapeador
- Queries helper y validaciones
- Mejores prácticas de BD

**MIGRACION-CLOUDINARY.md - Temas cubiertos:**
- 🚀 Feature completa de migración a Cloudinary
- 🗃️ Limpieza de duplicados (180 → 60 registros)
- ☁️ Upload optimizado con transformaciones automáticas
- 🛠️ Herramientas de mantenimiento y API endpoints
- 📊 Métricas de optimización (-40% storage, -100% duplicados)
- 🔐 Seguridad y rate limiting
- 🚀 Guía de deploy a producción
- 📈 Roadmap de mejoras futuras

**Sistema de Taxonomía (Implementación Gradual):**
- ✅ **Categories**: Implementado (2 niveles: padre-hija, 11 categorías en producción)
- ⏳ **Tags**: Pendiente (amenidades, características, condiciones)
- ⏳ **Attributes**: Pendiente (campos dinámicos por categoría)
- ⏳ **Brands**: Pendiente (constructoras/inmobiliarias)

---

### 🎨 Diseño y UI

| Documento | Descripción |
|-----------|-------------|
| **[DISEÑO-UX-UI.md](DISEÑO-UX-UI.md)** | Sistema de colores, componentes UI, principios de diseño, responsive design y accesibilidad |

**Temas cubiertos:**
- Paleta de colores de marca (azul, rojo, grises)
- Variables CSS (`--color-*`)
- Clases utilitarias de Tailwind
- Componentes Astro (Header, Hero, ListingCard, etc.)
- Principios de diseño (Mobile-first, consistencia)
- Responsive design y breakpoints
- Accesibilidad WCAG 2.1 AAA
- Ejemplos prácticos y combinaciones

---

### 🔷 Vue.js

| Documento | Descripción |
|-----------|-------------|
| **[VUE.md](VUE.md)** | Integración de Vue.js con Astro Islands, componentes interactivos y gestión de estado |

**Temas cubiertos:**
- Instalación y configuración de Vue
- Migración de componentes Astro a Vue
- Astro Islands con Vue
- Directivas `client:*`
- Gestión de estado con Pinia
- Composables
- Mejores prácticas

---

## 🔍 Buscar por Tema

### Categorías y Taxonomía
- **Sistema de Taxonomía completo**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Sistema de Taxonomía"
- **Categories (implementado)**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Categories"
- **Tags (pendiente)**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Tags"
- **Attributes (pendiente)**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Attributes"
- **Brands (pendiente)**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Brands"

### Cloudinary y Migración de Imágenes
- **Feature completa**: [MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md) - Documentación completa
- **Schema con Cloudinary**: [MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md) - Sección "Schema de Base de Datos"
- **API de migración**: [MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md) - Sección "API Endpoints"
- **Herramientas de mantenimiento**: [MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md) - Sección "Herramientas de Mantenimiento"
- **Deploy a producción**: [MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md) - Sección "Deploy a Producción"

### Framework
- **Astro SSR**: [ASTRO.md](ASTRO.md) - Sección "Migración SSG → SSR"
- **Estructura del proyecto**: [ASTRO.md](ASTRO.md) - Sección "Estructura del Proyecto"
- **Islands**: [ASTRO.md](ASTRO.md) - Sección "Astro Islands"
- **TypeScript**: [ASTRO.md](ASTRO.md) - Sección "TypeScript"

### Base de Datos
- **Schema completo**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Schema Completo"
- **Migraciones**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Migración y Refactor"
- **UUIDs**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Migración y Refactor"
- **Astro Actions**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Astro Actions"
- **Imágenes**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Sistema de Imágenes"

### Diseño
- **Colores**: [DISEÑO-UX-UI.md](DISEÑO-UX-UI.md) - Sección "Sistema de Colores"
- **Componentes**: [DISEÑO-UX-UI.md](DISEÑO-UX-UI.md) - Sección "Componentes UI"
- **Responsive**: [DISEÑO-UX-UI.md](DISEÑO-UX-UI.md) - Sección "Responsive Design"
- **Accesibilidad**: [DISEÑO-UX-UI.md](DISEÑO-UX-UI.md) - Sección "Accesibilidad"

### Vue.js
- **Instalación**: [VUE.md](VUE.md) - Sección "Instalación de Vue"
- **Migración de componentes**: [VUE.md](VUE.md) - Sección "Migración de Componentes"
- **Pinia**: [VUE.md](VUE.md) - Sección "Gestión de Estado"
**Sistema de categorías con jerarquía (2 niveles)** ⭐ NUEVO
- ✅ **11 categorías creadas (3 padre + 8 hijas)** ⭐ NUEVO
- ✅ **Queries helper para categorías** ⭐ NUEVO
- ✅ Astro Actions para paginación
- ✅ Mapeador de datos (PropertyRow → PropertiesWithImages)
- ✅ SSR habilitado
- ✅ API endpoints funcionales
- ✅ Sistema de colores implementado
- ✅ Componentes Astro básicos
- ✅ **Migración Cloudinary completa** (60 imágenes, 0 duplicados) ⭐ NUEVO
- ✅ **Producción lista para deploy** ⭐ NUEVO

### 🚧 En Progreso
- 🚧 Componentes frontend para categorías
- 🚧 Integración completa con Vue.js
- 🚧 Gestión de estado con Pinia
- 🚧 Optimización de queries

### 📋 Pendiente
- 📋 Sistema de Tags (amenidades, características)
- 📋 Sistema de Attributes (campos dinámicos)
- 📋 Sistema de Brands (constructoras/inmobiliarias)
- 📋 Eliminar campo `gallery` del schema
- 📋 Agregar índices adicional
### 🚧 En Progreso
- 🚧 Integración completa con Vue.js
- 🚧 Gestión de estado con Pinia
- 🚧 Optimización de queries

### 📋 Pendiente
- 📋 Eliminar campo `gallery` del schema
- 📋 Normalizar categorías (tabla relacional)
- 📋 Agregar índices a la BD
- 📋 Implementar filtros avanzados
- 📋 Testing completo
- 📋 Componentes Vue interactivos
- 📋 Sistema de favoritos
- 📋 Formulario de contacto

---

## 🛠️ Tecnologías Principales

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Astro** | ^5.16.0 | Framework principal (SSR) |
| **Astro DB** | ^0.18.3 | Base de datos (SQLite) |
| **TypeScript** | 5.x (strict mode) | Type safety |
| **Tailwind CSS** | ^4.1.17 | Estilos utility-first |
| **Vue.js** | ^3.5.25 | Componentes interactivos (Islands) |
| **UUID** | ^13.0.0 | Generación de IDs únicos |
| **Swiper** | ^12.0.3 | Carrusel de imágenes |
| **Astro Icon** | ^1.1.5 | Sistema de iconos |
| **Cloudinary** | ^2.9.0 | CDN de imágenes (migración completa) |

---

## 📖 Convenciones del Proyecto

### Naming
- **Archivos de documentación**: `MAYUSCULAS-CON-GUIONES.md`
- **Componentes Astro**: `PascalCase.astro`
- **Componentes Vue**: `PascalCase.vue`
- **Composables**: `camelCase.ts` con prefijo `use`
- **Tipos**: `PascalCase.ts`

### Estructura de Código
- **Componentes estáticos**: `src/components/astro/`
- **Componentes Vue**: `src/components/vue/`
- **Islands**: `src/components/islands/`
- **Tipos compartidos**: `src/types/`
- **Composables**: `src/composables/`
- **Astro Actions**: `src/actions/`
- **Mapeadores**: `src/mappers/`

---

## 🆘 Troubleshooting

### Problemas Comunes

**Error: Imágenes no se muestran**
- ✅ Verifica que el mapeador esté parseando `images` correctamente
- ✅ Revisa [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Sistema de Imágenes"
- ✅ Si migraste a Cloudinary, revisa [MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md) - Sección "Helper de Resolución de Imágenes"

**Error: Imágenes Cloudinary no cargan**
- ✅ Verifica configuración en `.env` (ver [MIGRACION-CLOUDINARY.md](MIGRACION-CLOUDINARY.md))
- ✅ Testea con `curl http://localhost:4321/api/migrate-cloudinary`
- ✅ Revisa `isMigrated = true` en PropertiesImages

**Error: TypeScript en componentes**
- ✅ Verifica que las interfaces estén definidas
- ✅ Consulta [ASTRO.md](ASTRO.md) - Sección "TypeScript"

**Error: Queries de BD lentas**
- ✅ Revisa las recomendaciones en [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Mejores Prácticas"

**Error: Vue component not hydrating**
- ✅ Asegúrate de usar una directiva `client:*`
- ✅ Consulta [VUE.md](VUE.md) - Sección "Astro Islands"

---

## 📝 Cómo Contribuir a la Documentación

1. **Actualiza la fecha** en el documento modificado
2. **Mantén el formato Markdown** consistente
3. **Agrega ejemplos de código** cuando sea relevante
4. **Actualiza este README** si agregas nuevos documentos
5. **Sigue la convención de naming**: `MAYUSCULAS-CON-GUIONES.md`

---

## 📞 Contacto y Soporte

### Equipo de Desarrollo

**Yormi Altamiranda**
- Email: yormian@gmail.com
- Rol: Desarrollador Full Stack

**Didier Méndez**
- Email: didierm.com@gmail.com
- Rol: Desarrollador Full Stack

### Soporte

Para preguntas sobre la documentación o el proyecto:
1. Consulta este README
2. Revisa la documentación específica del tema
3. Contacta al equipo de desarrollo

---

**Mantenido por:** Yormi Altamiranda & Didier Méndez  
**Repositorio:** inmobiliaria-web  
**Última revisión completa:** 2026-01-27  
**Feature destacada:** ✅ Migración Cloudinary completa - Producción ready
