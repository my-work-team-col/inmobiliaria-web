# 🏠 Inmobiliaria Web

> Sitio web inmobiliario moderno construido con Astro SSR, Astro DB, Vue.js y Tailwind CSS

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro)](https://astro.build)
[![Astro DB](https://img.shields.io/badge/Astro_DB-0.18.x-FF5D01?logo=astro)](https://astro.build)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+
- pnpm 8+

### Instalación y Desarrollo

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar archivo de variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Cloudinary

# 3. Crear datos locales (solo primera vez)
pnpm seed:force

# 4. Servidor de desarrollo
pnpm dev
# → http://localhost:4321
```

**📖 Guía completa de desarrollo:** [DEVELOPMENT-GUIDE.md](DEVELOPMENT-GUIDE.md)  
**🤖 Para AI Agents:** [AGENTS.md](AGENTS.md)

> **⚠️ Importante:** `pnpm dev` NO ejecuta seed automáticamente. Solo consume datos locales existentes.

---

## 🗄️ Gestión de Datos

```bash
# Crear datos locales + subir imágenes a Cloudinary
pnpm seed:force

# Crear datos en Turso (producción)
pnpm seed:force:remote

# Ver datos en GUI
pnpm db:studio
```

---

## 📁 Estructura del Proyecto

```
inmobiliaria-web/
├── db/                            # 🗄️ Base de Datos
│   ├── config.ts                  # Schema de Astro DB
│   └── seed.ts                    # Datos iniciales (categorías + propiedades)
├── docs/                          # 📚 Documentación técnica detallada
│   ├── README.md                  # Índice de documentación
│   ├── ASTRO.md                   # Framework y SSR
│   ├── BASE-DE-DATOS.md           # Schema, taxonomía y queries
│   ├── DISEÑO-UX-UI.md            # Colores, componentes y UX
│   └── VUE.md                     # Integración con Vue Islands
├── src/
│   ├── actions/                   # ⚡ Astro Actions (API type-safe)
│   ├── components/
│   │   ├── astro/                 # 🧩 Componentes Astro (estáticos)
│   │   └── vue/                   # 💚 Componentes Vue (interactivos)
│   ├── lib/
│   │   ├── db/                    # Queries helper de BD
│   │   └── validation/            # Validaciones (categorías)
│   ├── layouts/                   # 📐 Layouts de página
│   ├── mappers/                   # 🔄 Transformadores de datos
│   ├── pages/                     # 📄 Rutas SSR
│   │   ├── index.astro
│   │   ├── listing/
│   │   └── api/                   # API endpoints
│   ├── styles/
│   │   └── global.css
│   └── types/                     # 📝 TypeScript interfaces
└── package.json
```

---

## 🎨 Características

### ✅ Implementadas
- **Astro SSR** - Renderizado del lado del servidor
- **Astro DB** - Base de datos SQLite con Drizzle ORM
- **Sistema de Categorías** - Jerarquía de 2 niveles (11 categorías: 3 padre + 8 hijas)
- **Astro Actions** - API type-safe para queries
- **Vue Islands** - Componentes interactivos hidratados
- **TypeScript** - Type safety completo
- **Tailwind CSS 4** - Estilos modernos y responsive
- **Sistema de Imágenes** - Relación 1:N con mapeador
- **UUIDs** - Identificadores únicos en toda la BD

### 🚧 En Desarrollo
- Componentes frontend para categorías
- Páginas dinámicas `/categoria/[slug]`

### 📋 Próximamente
- **Tags** - Sistema de amenidades y características (3-4 días)
- **Attributes** - Campos dinámicos por categoría (2-3 días)
- **Brands** - Constructoras e inmobiliarias (1-2 días)
- Filtros avanzados
- Sistema de búsqueda

---

## 🎨 Sistema de Iconos

### Iconify + Hugeicons

El proyecto usa **@iconify/vue** con el set de iconos **Hugeicons** para un sistema de iconos consistente y optimizado.

**En componentes Vue:**
```vue
<script setup>
import { Icon, addCollection } from '@iconify/vue';
import hugeiconsData from '@iconify-json/hugeicons/icons.json';

addCollection(hugeiconsData);
</script>
<template>
  <Icon icon="hugeicons:home-01" class="w-6 h-6" />
</template>
```

**En componentes Astro:**
```astro
---
import { Icon } from '@iconify/vue';
---
<Icon icon="hugeicons:home-01" class="w-6 h-6" client:only="vue" />
```

**Beneficios:**
- ✅ Offline-first (sin CDN)
- ✅ Type-safe con TypeScript
- ✅ Solo incluye iconos usados
- ✅ 20+ iconos implementados

**Ver catálogo:** [Iconify - Hugeicons](https://icon-sets.iconify.design/hugeicons/)

---

## 🛠️ Stack Tecnológico

### Backend
- **Astro 5.x** - Framework SSR con Islands Architecture
- **Astro DB 0.18.x** - SQLite local / Turso en producción
- **Drizzle ORM** - Type-safe database queries
- **UUID v4** - Generación de IDs únicos

### Frontend
- **Astro Components** - Componentes estáticos del servidor
- **Vue.js 3.5.x** - Componentes interactivos (Islands)
- **Tailwind CSS 4.x** - Framework de estilos utility-first
- **TypeScript 5.x** - Type safety completo

### Base de Datos
- **7 tablas:** Properties, PropertiesImages, Categories, PropertyCategories, Tags (⏳), Attributes (⏳), Brands (⏳)
- **Relaciones:** 1:N, Many-to-Many con tablas junction
- **Seed automático:** 11 categorías + 20 propiedades de ejemplo

---

## 📊 Base de Datos

### Astro DB (SQLite + Drizzle)

Las propiedades se almacenan en **Astro DB** con el siguiente schema:

```typescript
// db/config.ts
const Properties = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),  // UUID
    name: column.text(),
    slug: column.text({ unique: true }),
    price: column.number(),
    // ... más campos
  }
});

const Categories = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    parentId: column.text({ optional: true }),  // Jerarquía 2 niveles
    // ...
  }
});
```

### Seed Inicial

El comando `pnpm astro db push --force-reset` crea y llena la BD con:
- **11 categorías** (Residencial, Comercial, Terrenos + subcategorías)
- **20 propiedades** de ejemplo con imágenes
- **Relaciones** entre propiedades y categorías

Para más detalles, consulta [BASE-DE-DATOS.md](./docs/BASE-DE-DATOS.md)

---

## 🛠️ Comandos

| Comando                          | Descripción                                        |
| -------------------------------- | -------------------------------------------------- |
| `pnpm install`                   | Instala todas las dependencias                     |
| `pnpm astro db push --force-reset` | Crea y seedea la base de datos (primera vez)    |
| `pnpm dev`                       | Inicia servidor de desarrollo en `localhost:4321` |
| `pnpm build`                     | Construye el sitio para producción en `./dist/`   |
| `pnpm preview`                   | Preview del build de producción localmente        |
| `pnpm astro db studio`           | Abre el studio visual de Astro DB                 |

---

## 📚 Documentación Técnica

Para documentación detallada, consulta el directorio `/docs/`:

- **[📚 Índice de Documentación](./docs/README.md)** - Punto de entrada a toda la documentación
- **[🚀 ASTRO.md](./docs/ASTRO.md)** - Framework, SSR, componentes e Islands
- **[🗄️ BASE-DE-DATOS.md](./docs/BASE-DE-DATOS.md)** - Schema completo, taxonomía, queries y migraciones
- **[🎨 DISEÑO-UX-UI.md](./docs/DISEÑO-UX-UI.md)** - Sistema de colores, componentes y accesibilidad
- **[💚 VUE.md](./docs/VUE.md)** - Integración de Vue.js con Astro Islands
- **[📋 ESTRUCTURA.md](./docs/ESTRUCTURA.md)** - Información del proyecto, objetivos y cronograma

---

## 🎯 Roadmap

### ✅ Fase 1 - Completada
- [x] Migración a Astro SSR
- [x] Integración de Astro DB (SQLite)
- [x] Sistema de categorías (jerarquía 2 niveles)
- [x] Astro Actions (API type-safe)
- [x] Integración de Vue.js Islands
- [x] Sistema de imágenes con relaciones
- [x] Documentación técnica completa

### 🚧 Fase 2 - En Progreso
- [ ] Componentes frontend de categorías
- [ ] Páginas dinámicas `/categoria/[slug]`
- [ ] Sistema de Tags (amenidades y características)

### 📋 Fase 3 - Próximamente
- [ ] Sistema de Attributes (campos dinámicos)
- [ ] Sistema de Brands (constructoras)
- [ ] Filtros avanzados y búsqueda
- [ ] Sistema de favoritos
- [ ] Optimización de queries
- [ ] SEO y meta tags dinámicos

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👥 Equipo

**Yormi Altamiranda**
- Email: yormian@gmail.com
- Rol: Desarrollador Full Stack

**Didier Méndez**
- Email: didierm.com@gmail.com
- Rol: Desarrollador Full Stack

---

## 📞 Soporte

¿Tienes preguntas? Abre un issue o contacta al equipo de desarrollo.

---

**Última actualización:** 28 de diciembre de 2025
