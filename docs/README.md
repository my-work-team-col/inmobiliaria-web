# 📚 Documentación del Proyecto - Inmobiliaria Web

> Documentación completa del proyecto de sitio web inmobiliario construido con Astro, TypeScript, Astro DB y Tailwind CSS.

**Última actualización:** 2025-12-23  
**Versión del Proyecto:** 1.0.0

---

## 🎯 Inicio Rápido

Si eres nuevo en el proyecto, empieza por aquí:

1. **[ESTRUCTURA.md](ESTRUCTURA.md)** - Visión completa del proyecto, objetivos, stack y cronograma
2. **[ASTRO.md](ASTRO.md)** - Framework Astro, SSR, componentes e Islands
3. **[BASE-DE-DATOS.md](BASE-DE-DATOS.md)** - Astro DB, schema, migraciones y Astro Actions
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
| **[BASE-DE-DATOS.md](BASE-DE-DATOS.md)** | Schema de Astro DB, migraciones, Astro Actions, sistema de imágenes y mejores prácticas |

**Temas cubiertos:**
- Schema de Astro DB (Properties, PropertiesImages)
- Migración de JSON a Astro DB
- UUIDs como primary keys
- Relaciones 1:N
- Astro Actions (getPropertiesByPage)
- Sistema de imágenes con mapeador
- Normalización de datos
- Queries eficientes
- Mejores prácticas de BD

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

### Framework
- **Astro SSR**: [ASTRO.md](ASTRO.md) - Sección "Migración SSG → SSR"
- **Estructura del proyecto**: [ASTRO.md](ASTRO.md) - Sección "Estructura del Proyecto"
- **Islands**: [ASTRO.md](ASTRO.md) - Sección "Astro Islands"
- **TypeScript**: [ASTRO.md](ASTRO.md) - Sección "TypeScript"

### Base de Datos
- **Schema**: [BASE-DE-DATOS.md](BASE-DE-DATOS.md) - Sección "Schema de Base de Datos"
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

---

## 📊 Estado del Proyecto

### ✅ Completado
- ✅ Migración de JSON a Astro DB
- ✅ Implementación de UUIDs
- ✅ Sistema de imágenes relacional
- ✅ Astro Actions para paginación
- ✅ Mapeador de datos (PropertyRow → PropertiesWithImages)
- ✅ SSR habilitado
- ✅ API endpoints funcionales
- ✅ Sistema de colores implementado
- ✅ Componentes Astro básicos

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

**Yorrmi Altamiranda**
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

**Mantenido por:** Yorrmi Altamiranda & Didier Méndez  
**Repositorio:** inmobiliaria-web  
**Última revisión completa:** 2025-12-23
