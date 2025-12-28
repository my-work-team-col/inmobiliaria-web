# 📚 Documentación del Proyecto - Inmobiliaria

> Sistema web de gestión inmobiliaria construido con Astro, TypeScript y Astro DB

**Última actualización:** 2025-12-23  
**Versión:** 1.0.0

---

## 1. Portada del Proyecto

### Información General

* **Nombre del proyecto:** Inmobiliaria
* **Descripción:** Portal web para la publicación de inmuebles en venta y alquiler
* **Versión:** 1.0.0
* **Fecha de inicio:** 2025-11-21
* **Última actualización:** 2025-12-23

### Autores

| Nombre | Email | Rol |
|--------|-------|-----|
| **Didier Méndez** | didierm.com@gmail.com | Desarrollador Full Stack |
| **Yormi Altamiranda** | yormian@gmail.com | Desarrollador Full Stack |

### Enlaces

* **Repositorio:** `inmobiliaria-web`
* **Documentación:** `/docs`
* **Servidor de desarrollo:** `http://localhost:4321`

---

## 2. Introducción

### ¿Qué es Inmobiliaria?

Inmobiliaria es un portal web moderno diseñado para la **publicación, gestión y búsqueda de inmuebles en venta y alquiler**. El proyecto utiliza tecnologías de vanguardia para ofrecer una experiencia de usuario fluida y un rendimiento óptimo tanto para propietarios que desean publicar sus inmuebles como para usuarios que buscan comprar o alquilar.

### Propósito del Proyecto

* Proporcionar una plataforma para **publicar inmuebles en venta y alquiler**
* Facilitar la búsqueda y filtrado de propiedades por tipo de transacción (venta/alquiler)
* Ofrecer una interfaz intuitiva y responsive para propietarios y buscadores
* Implementar un sistema de base de datos robusto y escalable
* Preparar la infraestructura para integración con servicios externos

### Características Principales

* ✅ Publicación de inmuebles (venta y alquiler)
* ✅ Listado de propiedades con paginación
* ✅ Sistema de imágenes relacional
* ✅ Búsqueda y filtros avanzados (tipo, precio, ubicación)
* ✅ Diseño responsive y moderno
* ✅ Renderizado del lado del servidor (SSR)
* ✅ Base de datos SQLite con Astro DB
* ✅ Sistema de colores de marca consistente

---

## 3. Objetivos del Proyecto

### 3.1 Objetivo General

Desarrollar una aplicación web inmobiliaria escalable, moderna y eficiente que permita la gestión integral de propiedades, utilizando las mejores prácticas de desarrollo web y arquitectura de software.

### 3.2 Objetivos Específicos

#### Técnicos
* ✅ Implementar SSR con Astro para mejor SEO y performance
* ✅ Utilizar Astro DB para gestión de datos relacional
* ✅ Crear un sistema de tipos robusto con TypeScript
* ✅ Implementar Astro Actions para operaciones de servidor
* 🚧 Integrar Vue.js para componentes interactivos (Islands)
* 📋 Implementar sistema de autenticación
* 📋 Agregar gestión de favoritos

#### Funcionales
* ✅ Mostrar propiedades destacadas en la página principal
* ✅ Implementar paginación de resultados
* ✅ Sistema de categorías de propiedades
* 🚧 Filtros avanzados (precio, ubicación, tipo)
* 📋 Página de detalles de propiedad
* 📋 Sistema de contacto
* 📋 Panel de administración

#### De Diseño
* ✅ Diseño responsive mobile-first
* ✅ Sistema de colores de marca consistente
* ✅ Componentes reutilizables
* 📋 Animaciones y transiciones suaves
* 📋 Modo oscuro (opcional)

**Leyenda:**
- ✅ Completado
- 🚧 En progreso
- 📋 Pendiente

---

## 4. Stack Tecnológico

### 4.1 Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Astro** | ^5.16.0 | Framework principal (SSR/SSG) |
| **Vue.js** | ^3.5.25 | Componentes interactivos (Islands) |
| **Tailwind CSS** | ^4.1.17 | Framework de estilos utility-first |
| **TypeScript** | 5.x | Type safety y mejor DX |
| **Astro Icon** | ^1.1.5 | Sistema de iconos |
| **Swiper** | ^12.0.3 | Carrusel de imágenes |

**Integraciones de Astro:**
- `@astrojs/vue` (^5.1.3) - Integración de Vue.js
- `@astrojs/db` (^0.18.3) - Base de datos integrada
- `@astrojs/cloudflare` (^12.6.12) - Adapter para deployment en Cloudflare

**Plugins de Vite:**
- `@tailwindcss/vite` (^4.1.17) - Plugin de Tailwind para Vite

### 4.2 Backend y Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Astro DB** | ^0.18.3 | Base de datos integrada (SQLite) |
| **Astro Actions** | - | Server-side operations |
| **UUID** | ^13.0.0 | Generación de IDs únicos |

**Motor de Base de Datos:**
- SQLite (a través de Astro DB)
- ORM: Drizzle (integrado en Astro DB)

### 4.3 Deployment y Hosting

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Cloudflare** | - | Plataforma de hosting (adapter configurado) |
| **Cloudflare Pages** | - | Deployment automático |
| **Cloudflare Workers** | - | Edge computing |

### 4.4 Herramientas de Desarrollo

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **pnpm** | - | Gestor de paquetes |
| **TypeScript** | 5.x (strict mode) | Lenguaje de programación |
| **Vite** | - | Build tool (integrado en Astro) |
| **Git** | - | Control de versiones |

**Configuración de TypeScript:**
- Modo estricto (`astro/tsconfigs/strict`)
- Path aliases configurados (`@/*` → `./src/*`)
- JSX preserve mode

### 4.5 Iconos y Assets

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **@iconify/json** | ^2.2.410 | Colección completa de iconos |
| **@iconify-json/hugeicons** | ^1.2.18 | Set de iconos Hugeicons |
| **astro-icon** | ^1.1.5 | Componente de iconos para Astro |

### 4.6 Configuración del Proyecto

**Astro Config (`astro.config.mjs`):**
```javascript
{
  integrations: [
    vue(),           // Vue.js Islands
    icon(),          // Sistema de iconos
    db()             // Astro DB
  ],
  adapter: cloudflare(),  // Deployment en Cloudflare
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@data": "/src/data"
      }
    }
  }
}
```

**TypeScript Config:**
- Base: `astro/tsconfigs/strict`
- Aliases: `@/*` apunta a `./src/*`
- JSX: preserve mode para Vue

### 4.7 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Construye para producción |
| `pnpm preview` | Preview del build de producción |
| `pnpm astro` | CLI de Astro |

### 4.8 Futuras Integraciones Planeadas

* **Pinia** - Gestión de estado global (Vue)
* **Turso** - SQLite distribuido (alternativa a Astro DB para producción)
* **Cloudinary** - Gestión y optimización de imágenes
* **Resend/SendGrid** - Envío de emails
* **Stripe/PayPal** - Pagos (si se implementa sistema de anuncios premium)

---

## 5. Implementación de Diseño

### 5.1 Principios de Diseño

* **Mobile-first:** Diseño responsive desde dispositivos móviles
* **Accesibilidad:** Cumplimiento de WCAG 2.1 AAA
* **Consistencia:** Sistema de diseño unificado
* **Performance:** Optimización de carga y renderizado

### 5.2 Sistema de Colores

#### Colores Primarios
* **Azul Principal:** `#2C42D0` - Botones, enlaces
* **Azul Oscuro:** `#0E1D37` - Encabezados, fondos
* **Rojo Acento:** `#D52B1E` - CTAs, alertas
* **Rojo Oscuro:** `#981E32` - Hover states

#### Colores de Texto
* **Foreground:** `#404040` - Texto principal
* **Muted:** `#DEDEDE` - Texto secundario

**Documentación completa:** [color-system-guide.md](color-system-guide.md)

### 5.3 Componentes UI

#### Componentes Astro (Estáticos)
* `Header.astro` - Navegación principal
* `Hero.astro` - Sección hero con búsqueda
* `Categories.astro` - Categorías de propiedades
* `ListingSection.astro` - Grid de propiedades
* `ListingCard.astro` - Tarjeta de propiedad
* `Footer.astro` - Pie de página

#### Componentes Vue (Interactivos)
* 🚧 `SearchFilters.vue` - Filtros de búsqueda
* 📋 `PropertyModal.vue` - Modal de detalles
* 📋 `FavoriteButton.vue` - Botón de favoritos
* 📋 `ContactForm.vue` - Formulario de contacto

### 5.4 Diseño Responsive

* **Mobile:** < 768px
* **Tablet:** 768px - 1024px
* **Desktop:** > 1024px

---

## 6. Organización y Estructura de Datos

### 6.1 Arquitectura del Proyecto

**Patrón:** Astro Islands Architecture

* **SSR (Server-Side Rendering)** para páginas principales
* **Islands** para componentes interactivos con Vue
* **Astro Actions** para operaciones de servidor
* **API Routes** para endpoints REST

### 6.2 Estructura de Carpetas

```
inmobiliaria-web/
├── docs/                          # Documentación del proyecto
│   ├── README.md                  # Índice principal
│   ├── estructura.md              # Este documento
│   ├── color-system-guide.md      # Sistema de colores
│   ├── db-analysis-and-best-practices.md
│   ├── db-migration-refactor.md
│   ├── get-properties-by-page.md
│   ├── propiedades-imagenes-integracion.md
│   ├── migration-ssg-to-ssr.md
│   ├── vue-migration-guide.md
│   ├── project-documentation.md
│   └── project-structure.md
│
├── db/                            # Configuración de Astro DB
│   ├── config.ts                  # Schema de tablas
│   └── seed.ts                    # Datos de prueba
│
├── public/                        # Archivos estáticos
│   └── images/                    # Imágenes públicas
│
├── src/
│   ├── actions/                   # Astro Actions
│   │   └── getPropertiesByPage.ts
│   │
│   ├── components/                # Componentes
│   │   ├── astro/                 # Componentes Astro
│   │   ├── vue/                   # Componentes Vue
│   │   └── islands/               # Astro Islands
│   │
│   ├── composables/               # Composables Vue
│   │
│   ├── data/                      # Datos estáticos
│   │   └── properties.json
│   │
│   ├── layouts/                   # Layouts de página
│   │   └── Layout.astro
│   │
│   ├── mappers/                   # Mapeadores de datos
│   │   └── property.mapper.ts
│   │
│   ├── pages/                     # Páginas (routing)
│   │   ├── index.astro
│   │   ├── listing/
│   │   └── api/
│   │
│   ├── styles/                    # Estilos globales
│   │   └── global.css
│   │
│   └── types/                     # Tipos TypeScript
│       ├── domain/                # Tipos de dominio
│       ├── ui/                    # Tipos de UI
│       └── index.ts
│
├── astro.config.mjs               # Configuración de Astro
├── tailwind.config.mjs            # Configuración de Tailwind
├── tsconfig.json                  # Configuración de TypeScript
└── package.json                   # Dependencias
```

### 6.3 Modelo de Datos

#### Tabla: Properties

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT (UUID) | Primary key |
| `title` | TEXT | Nombre de la propiedad |
| `slug` | TEXT (UNIQUE) | URL amigable |
| `categories` | JSON | Categorías (apartamento, casa, etc.) |
| `isActive` | BOOLEAN | Si está activa |
| `featured` | BOOLEAN | Si es destacada |
| `gallery` | JSON | ⚠️ Deprecado - usar PropertiesImages |
| `location` | TEXT | Ubicación completa |
| `city` | TEXT | Ciudad |
| `neighborhood` | TEXT | Barrio |
| `code` | TEXT | Código interno |
| `description` | TEXT | Descripción |
| `area` | NUMBER | Área en m² |
| `bedrooms` | NUMBER | Habitaciones |
| `bathrooms` | NUMBER | Baños |
| `parking` | NUMBER | Parqueaderos |
| `price` | NUMBER | Precio |
| `participation` | TEXT | Porcentaje de participación |
| `address` | TEXT | Dirección |
| `observations` | TEXT | Observaciones |

#### Tabla: PropertiesImages

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT (UUID) | Primary key |
| `propertyId` | TEXT (FK) | Referencia a Properties |
| `image` | TEXT | URL de la imagen |

**Relación:** 1 Property → N Images

**Documentación completa:**
- [db-analysis-and-best-practices.md](db-analysis-and-best-practices.md)
- [propiedades-imagenes-integracion.md](propiedades-imagenes-integracion.md)

---

## 7. Etapas de Desarrollo

### 7.1 Análisis ✅ (Completado)

* ✅ Recolección de requisitos
* ✅ Definición de alcance
* ✅ Selección de tecnologías
* ✅ Diseño de arquitectura

**Duración:** 1 semana (Nov 21-28, 2025)

### 7.2 Diseño ✅ (Completado)

* ✅ Sistema de colores de marca
* ✅ Componentes base
* ✅ Diseño de base de datos
* ✅ Wireframes de páginas principales

**Duración:** 1 semana (Nov 28 - Dic 5, 2025)

### 7.3 Desarrollo 🚧 (En Progreso)

#### Fase 1: Fundamentos ✅
* ✅ Setup inicial del proyecto
* ✅ Configuración de Astro DB
* ✅ Migración de JSON a BD
* ✅ Implementación de UUIDs
* ✅ Sistema de imágenes relacional

**Duración:** 2 semanas (Dic 5-19, 2025)

#### Fase 2: Backend ✅
* ✅ Astro Actions (getPropertiesByPage)
* ✅ Mapeador de datos (PropertyRow → PropertiesWithImages)
* ✅ Paginación backend
* ✅ API endpoints básicos

**Duración:** 1 semana (Dic 19-23, 2025)

#### Fase 3: Frontend 🚧 (En Progreso)
* ✅ Componentes Astro básicos
* ✅ Sistema de colores implementado
* ✅ Listado de propiedades
* 🚧 Integración con Vue.js
* 📋 Página de detalles
* 📋 Sistema de filtros

**Duración estimada:** 2 semanas (Dic 23 - Ene 6, 2026)

#### Fase 4: Interactividad 📋 (Pendiente)
* 📋 Componentes Vue interactivos
* 📋 Gestión de estado con Pinia
* 📋 Sistema de favoritos
* 📋 Formulario de contacto

**Duración estimada:** 1 semana (Ene 6-13, 2026)

### 7.4 Pruebas 📋 (Pendiente)

* 📋 Pruebas unitarias (componentes)
* 📋 Pruebas de integración (API)
* 📋 Pruebas de usuario (UX)
* 📋 Pruebas de rendimiento
* 📋 Pruebas de accesibilidad

**Duración estimada:** 1 semana (Ene 13-20, 2026)

### 7.5 Despliegue 📋 (Pendiente)

* 📋 Configuración de servidor
* 📋 CI/CD pipeline
* 📋 Migración a Turso (producción)
* 📋 Optimización de imágenes
* 📋 Configuración de dominio

**Duración estimada:** 3 días (Ene 20-23, 2026)

### 7.6 Mantenimiento 📋 (Continuo)

* 📋 Corrección de errores
* 📋 Mejoras continuas
* 📋 Actualización de dependencias
* 📋 Nuevas funcionalidades

---

## 8. Cronograma

### Línea de Tiempo

```
Nov 2025          Dic 2025          Ene 2026
|---------|---------|---------|---------|
  Análisis  Diseño   Desarrollo      Testing
    ✅        ✅      🚧 50%         📋
```

### Hitos Principales

| Fecha | Hito | Estado |
|-------|------|--------|
| 2025-11-21 | Inicio del proyecto | ✅ |
| 2025-11-28 | Análisis completado | ✅ |
| 2025-12-05 | Diseño completado | ✅ |
| 2025-12-15 | Migración a Astro DB | ✅ |
| 2025-12-23 | Backend completado | ✅ |
| 2026-01-06 | Frontend completado | 📋 |
| 2026-01-13 | Interactividad completada | 📋 |
| 2026-01-20 | Testing completado | 📋 |
| 2026-01-23 | Despliegue a producción | 📋 |

### Progreso Actual

**Completado:** 60%
- ✅ Análisis: 100%
- ✅ Diseño: 100%
- 🚧 Desarrollo: 50%
- 📋 Pruebas: 0%
- 📋 Despliegue: 0%

---

## 9. Riesgos y Consideraciones

### 9.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Problemas de rendimiento con SQLite** | Media | Alto | Migrar a Turso en producción |
| **Complejidad de Islands con Vue** | Media | Medio | Documentación y pruebas exhaustivas |
| **Escalabilidad de imágenes** | Alta | Alto | Integrar Cloudinary o similar |
| **SEO con SSR** | Baja | Alto | Astro maneja SSR nativamente |

### 9.2 Limitaciones Actuales

* ⚠️ Campo `gallery` duplica datos de `PropertiesImages` (pendiente eliminar)
* ⚠️ Categorías almacenadas como JSON (debería ser relacional)
* ⚠️ Sin índices en BD (queries lentas con muchos datos)
* ⚠️ Imágenes en sistema de archivos (no escalable)

### 9.3 Suposiciones

* Se asume disponibilidad de servidor para deployment
* Se asume que el volumen de propiedades no excederá 10,000 en el primer año
* Se asume que las imágenes serán optimizadas antes de subir
* Se asume integración futura con CRM inmobiliario

### 9.4 Dependencias Externas

* **Astro Framework** - Actualizaciones y breaking changes
* **Astro DB** - Limitaciones de SQLite
* **Tailwind CSS** - Cambios en versiones
* **Vue.js** - Compatibilidad con Astro Islands

---

## 10. Conclusión

### Resumen del Estado Actual

El proyecto **Inmobiliaria** ha completado exitosamente las fases de análisis, diseño y gran parte del desarrollo backend. La arquitectura basada en Astro con SSR, Astro DB y TypeScript proporciona una base sólida y escalable.

### Logros Principales

* ✅ Migración exitosa de JSON a base de datos relacional
* ✅ Implementación de UUIDs para escalabilidad
* ✅ Sistema de imágenes normalizado con mapeador
* ✅ Astro Actions funcionales con paginación
* ✅ Documentación completa y organizada
* ✅ Sistema de colores de marca implementado

### Próximos Pasos

1. **Corto Plazo (1-2 semanas):**
   - Completar integración con Vue.js
   - Implementar página de detalles de propiedad
   - Agregar sistema de filtros avanzados

2. **Mediano Plazo (1 mes):**
   - Implementar gestión de favoritos
   - Agregar formulario de contacto
   - Realizar pruebas exhaustivas
   - Preparar deployment

3. **Largo Plazo (3 meses):**
   - Panel de administración
   - Integración con CRM
   - Sistema de autenticación
   - Optimización de imágenes con CDN

### Recomendaciones

* **Priorizar** la eliminación del campo `gallery` duplicado
* **Implementar** índices en la base de datos antes de producción
* **Migrar** a Turso para mejor escalabilidad
* **Integrar** servicio de imágenes (Cloudinary) lo antes posible
* **Mantener** la documentación actualizada con cada cambio

---

## 📚 Recursos Adicionales

### Documentación del Proyecto

* [README.md](README.md) - Índice principal de documentación
* [color-system-guide.md](color-system-guide.md) - Sistema de colores
* [db-analysis-and-best-practices.md](db-analysis-and-best-practices.md) - Análisis de BD
* [get-properties-by-page.md](get-properties-by-page.md) - Astro Action de paginación
* [propiedades-imagenes-integracion.md](propiedades-imagenes-integracion.md) - Sistema de imágenes
* [vue-migration-guide.md](vue-migration-guide.md) - Guía de integración Vue

### Enlaces Externos

* [Astro Documentation](https://docs.astro.build)
* [Astro DB Documentation](https://docs.astro.build/en/guides/astro-db/)
* [Vue.js Documentation](https://vuejs.org)
* [Tailwind CSS Documentation](https://tailwindcss.com)

---

## 📞 Contacto

### Equipo de Desarrollo

**Didier Méndez**
- Email: didierm.com@gmail.com
- Rol: Desarrollador Full Stack

∫**Yormi Altamiranda**
- Email: yormian@gmail.com
- Rol: Desarrollador Full Stack


### Soporte

Para preguntas sobre el proyecto:
1. Consulta la documentación en `/docs`
2. Revisa los archivos de guía específicos
3. Contacta al equipo de desarrollo

---

**Documento creado:** 2025-12-23  
**Última actualización:** 2025-12-23  
**Versión:** 1.0.0  
**Mantenido por:** Didier Méndez & Yormi Altamiranda
