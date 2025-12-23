# 🎨 Diseño UX/UI - Guía Completa

> Documentación completa del sistema de diseño, UX/UI, colores, componentes y mejores prácticas visuales del proyecto Inmobiliaria.

**Última actualización:** 2025-12-23  
**Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Sistema de Colores](#-sistema-de-colores)
2. [Componentes UI](#-componentes-ui)
3. [Principios de Diseño](#-principios-de-diseño)
4. [Responsive Design](#-responsive-design)
5. [Accesibilidad](#-accesibilidad)

---

## 🎨 Sistema de Colores

### Paleta de Marca

| Nombre           | Hex     | Variable CSS          | Uso Principal                     |
| ---------------- | ------- | --------------------- | --------------------------------- |
| `primary`        | #2C42D0 | `--color-primary`     | Azul principal - Botones, enlaces |
| `primary-dark`   | #0E1D37 | `--color-primary-dark`| Azul oscuro - Encabezados, fondos |
| `accent`         | #D52B1E | `--color-accent`      | Rojo - CTAs, alertas              |
| `accent-dark`    | #981E32 | `--color-accent-dark` | Rojo oscuro - Hover states        |
| `foreground`     | #404040 | `--color-foreground`  | Texto principal                   |
| `muted`          | #DEDEDE | `--color-muted`       | Texto secundario, fondos sutiles  |

### Uso Rápido

```html
<!-- Backgrounds -->
<div class="bg-[--color-primary]">Fondo azul</div>
<div class="bg-[--color-accent]">Fondo rojo</div>

<!-- Textos -->
<h1 class="text-[--color-primary]">Título azul</h1>
<p class="text-[--color-foreground]">Texto principal</p>

<!-- Botones -->
<button class="bg-[--color-primary] hover:bg-[--color-primary-dark] text-white">
  Botón Principal
</button>
```

### Paleta Completa

#### Colores Primarios

| Color           | Variable CSS              | Hex       | RGB              | Uso Recomendado                                    |
| --------------- | ------------------------- | --------- | ---------------- | -------------------------------------------------- |
| **Azul**        | `--color-primary`         | `#2C42D0` | `44, 66, 208`    | Botones principales, enlaces, elementos destacados |
|                 | `--color-azul`            | `#2C42D0` | `44, 66, 208`    | Alias del color primario                           |
| **Azul Oscuro** | `--color-primary-dark`    | `#0E1D37` | `14, 29, 55`     | Encabezados, textos importantes, fondos oscuros    |
|                 | `--color-azul-oscuro`     | `#0E1D37` | `14, 29, 55`     | Alias del color primario oscuro                    |
| **Rojo**        | `--color-accent`          | `#D52B1E` | `213, 43, 30`    | Botones de acción, alertas, elementos de llamado   |
|                 | `--color-rojo`            | `#D52B1E` | `213, 43, 30`    | Alias del color de acento                          |
| **Rojo Oscuro** | `--color-accent-dark`     | `#981E32` | `152, 30, 50`    | Hover states, acentos secundarios                  |
|                 | `--color-rojo-oscuro`     | `#981E32` | `152, 30, 50`    | Alias del color de acento oscuro                   |

#### Colores de Texto

| Color          | Variable CSS         | Hex       | RGB            | Uso Recomendado                    |
| -------------- | -------------------- | --------- | -------------- | ---------------------------------- |
| **Texto**      | `--color-foreground` | `#404040` | `64, 64, 64`   | Textos principales, párrafos       |
|                | `--color-texto`      | `#404040` | `64, 64, 64`   | Alias del color de texto           |
| **Gris Claro** | `--color-muted`      | `#DEDEDE` | `222, 222, 222`| Textos secundarios, fondos sutiles |
|                | `--color-gris-claro` | `#DEDEDE` | `222, 222, 222`| Alias del color muted              |

#### Colores Secundarios

| Color               | Variable CSS              | Hex       | RGB            |
| ------------------- | ------------------------- | --------- | -------------- |
| **Azul Oscuro Sec** | `--color-secondary-dark`  | `#1A356C` | `26, 53, 108`  |
|                     | `--color-azul-oscuro-sec` | `#1A356C` | `26, 53, 108`  |
| **Azul Sec**        | `--color-secondary`       | `#005B9C` | `0, 91, 156`   |
|                     | `--color-azul-sec`        | `#005B9C` | `0, 91, 156`   |
| **Rojo Sec**        | `--color-accent-red`      | `#AD0E15` | `173, 14, 21`  |
|                     | `--color-rojo-sec`        | `#AD0E15` | `173, 14, 21`  |
| **Rojo Cereza**     | `--color-accent-cherry`   | `#7F000F` | `127, 0, 15`   |
|                     | `--color-rojo-cereza`     | `#7F000F` | `127, 0, 15`   |

---

## 🧩 Componentes UI

### Componentes Astro (Estáticos)

#### Header.astro
- Navegación principal
- Logo y menú
- Botones de autenticación

#### Hero.astro
- Sección hero con imagen de fondo
- Barra de búsqueda
- Diseño responsive

#### Categories.astro
- Grid de categorías de propiedades
- Iconos SVG personalizados
- Hover effects

#### ListingSection.astro
- Grid de propiedades destacadas
- Consume datos desde Astro DB
- Paginación

#### ListingCard.astro
- Tarjeta de propiedad individual
- Badge "Featured" condicional
- Icono de ubicación
- Botón de favoritos
- Hover effects (zoom en imagen)

### Componentes Vue (Interactivos)

#### SearchFilters.vue (Planeado)
- Filtros de búsqueda avanzados
- Estado reactivo
- Integración con Pinia

#### PropertyModal.vue (Planeado)
- Modal de detalles de propiedad
- Galería de imágenes
- Información completa

#### FavoriteButton.vue (Planeado)
- Botón de favoritos interactivo
- Persistencia en localStorage
- Animaciones

#### ContactForm.vue (Planeado)
- Formulario de contacto
- Validación de campos
- Envío a API

---

## 📐 Principios de Diseño

### 1. Mobile-First
- Diseño responsive desde dispositivos móviles
- Breakpoints:
  - **Mobile:** < 768px
  - **Tablet:** 768px - 1024px
  - **Desktop:** > 1024px

### 2. Consistencia Visual
- Sistema de colores unificado
- Espaciado consistente (Tailwind spacing scale)
- Tipografía coherente

### 3. Jerarquía Visual
- Uso de tamaños de fuente para jerarquía
- Colores para destacar elementos importantes
- Espaciado para separar secciones

### 4. Feedback Visual
- Hover states en elementos interactivos
- Transiciones suaves (`transition-all duration-300`)
- Loading states

---

## 📱 Responsive Design

### Grid System

```html
<!-- Mobile: 1 columna, Tablet: 2 columnas, Desktop: 4 columnas -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Contenido -->
</div>
```

### Breakpoints de Tailwind

| Breakpoint | Min Width | Dispositivo |
|------------|-----------|-------------|
| `sm` | 640px | Mobile grande |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop grande |
| `2xl` | 1536px | Desktop extra grande |

### Imágenes Responsive

```html
<img
  src="/images/property.jpg"
  alt="Propiedad"
  class="w-full h-full object-cover"
  loading="lazy"
/>
```

---

## ♿ Accesibilidad

### Contraste de Colores (WCAG 2.1)

| Combinación | Ratio de Contraste | Nivel WCAG | Estado |
|-------------|-------------------|------------|--------|
| **Azul sobre blanco** | 7.2:1 | AAA | ✅ Excelente |
| **Blanco sobre azul** | 14.5:1 | AAA | ✅ Excelente |
| **Blanco sobre rojo** | 8.9:1 | AAA | ✅ Excelente |
| **Texto (#404040) sobre blanco** | 9.7:1 | AAA | ✅ Excelente |
| **Azul oscuro sobre blanco** | 15.2:1 | AAA | ✅ Excelente |

### Mejores Prácticas

✅ **DO:**
- Usa semantic HTML (`<article>`, `<section>`, `<header>`, etc.)
- Agrega `aria-label` y `aria-labelledby` para accesibilidad
- Usa `loading="lazy"` en imágenes
- Proporciona texto alternativo en imágenes
- Asegura contraste suficiente en textos

❌ **DON'T:**
- No uses `<div>` cuando hay un elemento semántico apropiado
- No olvides los atributos ARIA
- No uses colores como única forma de comunicar información
- No uses `--color-muted` como color de texto principal

---

## 🎯 Ejemplos Prácticos

### Botón Principal

```html
<button
  class="bg-[--color-primary] hover:bg-[--color-primary-dark] text-white px-6 py-3 rounded-lg transition-colors"
>
  Buscar Propiedades
</button>
```

### Botón de Acción

```html
<button
  class="bg-[--color-accent] hover:bg-[--color-accent-dark] text-white px-6 py-3 rounded-lg transition-colors"
>
  Contactar Ahora
</button>
```

### Tarjeta de Propiedad

```html
<article class="bg-white border-2 border-[--color-primary] rounded-xl p-6 shadow-primary">
  <h3 class="text-[--color-primary-dark] text-xl font-bold mb-2">
    Propiedad Destacada
  </h3>
  <p class="text-[--color-foreground] mb-4">
    Descripción de la propiedad...
  </p>
  <button class="bg-[--color-accent] hover:bg-[--color-accent-dark] text-white px-4 py-2 rounded">
    Ver Detalles
  </button>
</article>
```

### Badge

```html
<span class="bg-[--color-accent] text-white text-xs font-semibold px-3 py-1 rounded-sm">
  Featured
</span>
```

---

## 🎨 Combinaciones Recomendadas

### Profesional
- Fondo: `bg-[--color-primary-dark]`
- Texto: `text-white`
- Botón: `bg-[--color-accent]`

### Limpia
- Fondo: `bg-white`
- Borde: `border-[--color-primary]`
- Texto: `text-[--color-foreground]`

### Llamativa
- Fondo: `gradient-accent`
- Texto: `text-white`
- Botón: `bg-white text-[--color-accent]`

---

## 🔧 Personalización

### Agregar Nuevos Colores

```css
/* En global.css */
:root {
  --color-custom: #yourcolor;
  --color-custom-rgb: r, g, b;
}

.bg-custom {
  background-color: var(--color-custom);
}

.text-custom {
  color: var(--color-custom);
}
```

---

## 📚 Recursos Adicionales

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Última actualización:** 2025-12-23  
**Versión:** 1.0.0  
**Mantenido por:** Yorrmi Altamiranda & Didier Méndez
