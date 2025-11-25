# 🎨 Guía Rápida - Sistema de Colores

## Colores Disponibles

| Nombre           | Hex     | Uso                               |
| ---------------- | ------- | --------------------------------- |
| `primary`        | #2c42d0 | Azul principal - Botones, enlaces |
| `primary-dark`   | #0e1d37 | Azul oscuro - Encabezados, fondos |
| `secondary`      | #005b9c | Azul secundario                   |
| `secondary-dark` | #1a356c | Azul secundario oscuro            |
| `accent`         | #d52b1e | Rojo - CTAs, alertas              |
| `accent-dark`    | #981e32 | Rojo oscuro - Hover states        |
| `accent-red`     | #ad0e15 | Rojo alternativo                  |
| `accent-cherry`  | #7f000f | Rojo cereza                       |
| `foreground`     | #404040 | Texto principal                   |
| `muted`          | #dedede | Texto secundario, fondos sutiles  |

---

## 🚀 Cómo Usar

### Backgrounds

```html
<div class="bg-[--color-primary]">Fondo azul principal</div>
<div class="bg-[--color-accent]">Fondo rojo</div>
<div class="bg-[--color-primary-dark]">Fondo azul oscuro</div>
```

### Text Colors

```html
<h1 class="text-[--color-primary]">Título azul</h1>
<p class="text-[--color-foreground]">Texto principal</p>
<span class="text-[--color-accent]">Texto rojo</span>
<p class="text-[--color-muted]">Texto secundario</p>
```

### Borders

```html
<div class="border-2 border-[--color-primary]">Borde azul</div>
<div class="border border-[--color-accent]">Borde rojo</div>
```

### Hover States

```html
<button class="bg-[--color-primary] hover:bg-[--color-primary-dark] text-white">
  Botón con hover
</button>

<a class="text-[--color-primary] hover:text-[--color-accent]">
  Enlace con hover
</a>
```

---

## 📦 Clases Especiales

### Gradientes

```html
<div class="gradient-primary text-white p-8">Gradiente azul</div>

<div class="gradient-accent text-white p-8">Gradiente rojo</div>
```

### Sombras

```html
<div class="bg-white shadow-primary p-6">Sombra azul</div>

<div class="bg-white shadow-accent p-6">Sombra roja</div>
```

### Hero Background

```html
<div class="bg-hero min-h-screen">Fondo hero</div>
```

---

## 💡 Ejemplos Completos

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

### Badge

```html
<span
  class="bg-[--color-accent] text-white text-xs font-semibold px-3 py-1 rounded-sm"
>
  Featured
</span>
```

### Tarjeta

```html
<div
  class="bg-white border-2 border-[--color-primary] rounded-xl p-6 shadow-primary"
>
  <h3 class="text-[--color-primary-dark] text-xl font-bold mb-2">Título</h3>
  <p class="text-[--color-foreground] mb-4">Descripción de la propiedad...</p>
  <button
    class="bg-[--color-accent] hover:bg-[--color-accent-dark] text-white px-4 py-2 rounded"
  >
    Ver Detalles
  </button>
</div>
```

### Header con Gradiente

```html
<header class="gradient-primary text-white p-6">
  <h1 class="text-3xl font-bold">Mi Inmobiliaria</h1>
  <p class="text-[--color-muted]">Encuentra tu hogar ideal</p>
</header>
```

---

## 🎯 Combinaciones Recomendadas

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

**Última actualización:** 2025-11-21
