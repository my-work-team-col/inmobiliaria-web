# 🏠 Inmobiliaria Web

> Sitio web inmobiliario moderno construido con Astro, TypeScript y Tailwind CSS

[![Astro](https://img.shields.io/badge/Astro-4.x-FF5D01?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+
- pnpm 8+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Navegar al directorio
cd inmobiliaria-web

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

El sitio estará disponible en `http://localhost:4321`

---

## 📁 Estructura del Proyecto

```
inmobiliaria-web/
├── docs/                          # 📚 Documentación
│   ├── PROJECT_DOCUMENTATION.md   # Documentación completa
│   └── VUE_MIGRATION_GUIDE.md     # Guía de migración a Vue
├── src/
│   ├── components/                # 🧩 Componentes Astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Categories.astro
│   │   ├── ListingSection.astro
│   │   └── PropertyCard.astro    # ⭐ Componente reutilizable
│   ├── data/                      # 📊 Datos JSON
│   │   └── properties.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
└── package.json
```

---

## 🎨 Características

- ✅ **SSR/SSG con Astro** - Rendimiento óptimo
- ✅ **TypeScript** - Type safety en todos los componentes
- ✅ **Tailwind CSS** - Estilos modernos y responsive
- ✅ **Componentes Modulares** - Reutilizables y mantenibles
- ✅ **Gestión de Datos JSON** - Fácil de actualizar
- ✅ **Accesibilidad** - Semantic HTML y ARIA labels
- ✅ **Preparado para Vue** - Arquitectura lista para integración

---

## 🧩 Componentes Principales

### PropertyCard

Componente reutilizable para mostrar tarjetas de propiedades.

```astro
---
import PropertyCard from './components/PropertyCard.astro';
---

<PropertyCard
  id={1}
  title="The Grand Estate"
  location="Moscow, 1218"
  price={521}
  image="/images/property.jpg"
  featured={true}
/>
```

### Featured

Sección que muestra propiedades destacadas desde JSON.

```astro
---
import Featured from './components/ListingSection.astro';
---

<Featured />
```

---

## 📊 Gestión de Datos

Las propiedades se almacenan en `src/data/properties.json`:

```json
{
  "id": 1,
  "title": "The Grand Estate",
  "location": "Moscow, 1218",
  "price": 521,
  "image": "https://example.com/image.jpg",
  "featured": true
}
```

Para agregar una nueva propiedad, simplemente agrega un nuevo objeto al array en `properties.json`.

---

## 🛠️ Comandos

| Comando        | Descripción                                       |
| -------------- | ------------------------------------------------- |
| `pnpm dev`     | Inicia servidor de desarrollo en `localhost:4321` |
| `pnpm build`   | Construye el sitio para producción en `./dist/`   |
| `pnpm preview` | Preview del build de producción localmente        |

---

## 📚 Documentación

Para documentación completa, consulta:

- **[Documentación del Proyecto](./docs/PROJECT_DOCUMENTATION.md)** - Guía completa de componentes, TypeScript y mejores prácticas
- **[Guía de Migración a Vue](./docs/VUE_MIGRATION_GUIDE.md)** - Cómo integrar Vue.js en el futuro

---

## 🎯 Roadmap

- [x] Estructura base con Astro
- [x] Componentes modulares con TypeScript
- [x] Gestión de datos con JSON
- [x] Componente PropertyCard reutilizable
- [x] Documentación completa
- [ ] Integración con Vue.js
- [ ] Sistema de favoritos
- [ ] Filtros y búsqueda avanzada
- [ ] Integración con API backend
- [ ] Sistema de autenticación

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

Desarrollado con ❤️ por el equipo de AVC

---

## 📞 Soporte

¿Tienes preguntas? Abre un issue o contacta al equipo de desarrollo.

---

**Última actualización:** 2025-11-21
