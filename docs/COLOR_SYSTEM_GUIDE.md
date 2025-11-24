# 🎨 Guía de Uso del Sistema de Colores

Esta guía te muestra cómo usar las variables de color CSS que hemos configurado basadas en tu paleta de marca.

---

## 📋 Paleta de Colores Disponible

### Colores Primarios

| Color | Variable CSS | Hex | Uso Recomendado |
|-------|--------------|-----|-----------------|
| **Azul** | `--color-azul` | `#2C42D0` | Botones principales, enlaces, elementos destacados |
| **Azul Oscuro** | `--color-azul-oscuro` | `#0E1D37` | Encabezados, textos importantes, fondos oscuros |
| **Rojo** | `--color-rojo` | `#D52B1E` | Botones de acción, alertas, elementos de llamado |
| **Rojo Oscuro** | `--color-rojo-oscuro` | `#981E32` | Hover states, acentos secundarios |

### Colores de Texto

| Color | Variable CSS | Hex | Uso Recomendado |
|-------|--------------|-----|-----------------|
| **Texto** | `--color-texto` | `#404040` | Textos principales, párrafos |
| **Gris Claro** | `--color-gris-claro` | `#DEDEDE` | Textos secundarios, fondos sutiles |

### Colores Secundarios

| Color | Variable CSS | Hex |
|-------|--------------|-----|
| **Azul Oscuro Sec** | `--color-azul-oscuro-sec` | `#1A356C` |
| **Azul Sec** | `--color-azul-sec` | `#005B9C` |
| **Rojo Sec** | `--color-rojo-sec` | `#AD0E15` |
| **Rojo Cereza** | `--color-rojo-cereza` | `#7F000F` |

---

## 🛠️ Formas de Usar los Colores

### 1. Clases Utilitarias (Recomendado)

Las clases más comunes ya están creadas en `global.css`:

#### Backgrounds
```html
<div class="bg-azul">Fondo azul</div>
<div class="bg-azul-oscuro">Fondo azul oscuro</div>
<div class="bg-rojo">Fondo rojo</div>
<div class="bg-rojo-oscuro">Fondo rojo oscuro</div>
<div class="bg-gris-claro">Fondo gris claro</div>
```

#### Textos
```html
<h1 class="text-azul">Título azul</h1>
<h2 class="text-azul-oscuro">Título azul oscuro</h2>
<p class="text-rojo">Texto rojo</p>
<p class="text-contenido">Texto principal</p>
```

#### Bordes
```html
<div class="border-2 border-azul">Con borde azul</div>
<div class="border border-rojo">Con borde rojo</div>
```

#### Hover States
```html
<button class="bg-azul hover:bg-azul-oscuro">
  Botón con hover
</button>
<a class="text-azul hover:text-rojo">
  Enlace con hover
</a>
```

---

### 2. Variables CSS Directas

Puedes usar las variables CSS directamente en estilos inline o en bloques `<style>`:

```astro
<div style="background-color: var(--color-azul); color: white;">
  Usando variables CSS
</div>

<style>
  .mi-clase-custom {
    background-color: var(--color-azul);
    border: 2px solid var(--color-rojo);
    color: white;
  }
  
  .mi-clase-custom:hover {
    background-color: var(--color-azul-oscuro);
  }
</style>
```

---

### 3. Clases Especiales

#### Gradientes
```html
<div class="gradient-azul p-8 text-white">
  Gradiente de azul a azul oscuro
</div>

<div class="gradient-rojo p-8 text-white">
  Gradiente de rojo a rojo oscuro
</div>
```

#### Sombras con Color
```html
<div class="bg-white shadow-azul p-6">
  Tarjeta con sombra azul
</div>

<div class="bg-white shadow-rojo p-6">
  Tarjeta con sombra roja
</div>
```

---

## 📝 Ejemplos Prácticos

### Botón Principal (Azul)
```astro
<button class="bg-azul hover:bg-azul-oscuro text-white px-6 py-3 rounded-lg transition-colors">
  Buscar Propiedades
</button>
```

### Botón de Acción (Rojo)
```astro
<button class="bg-rojo hover:bg-rojo-oscuro text-white px-6 py-3 rounded-lg transition-colors">
  Contactar Ahora
</button>
```

### Tarjeta con Colores de Marca
```astro
<article class="bg-white border-2 border-azul rounded-xl p-6 shadow-azul">
  <h3 class="text-azul-oscuro text-xl font-bold mb-2">
    Propiedad Destacada
  </h3>
  <p class="text-contenido mb-4">
    Descripción de la propiedad...
  </p>
  <button class="bg-rojo hover:bg-rojo-oscuro text-white px-4 py-2 rounded">
    Ver Detalles
  </button>
</article>
```

### Badge/Etiqueta
```astro
<span class="bg-azul text-white text-xs font-semibold px-3 py-1 rounded-sm">
  Destacado
</span>

<span class="bg-rojo text-white text-xs font-semibold px-3 py-1 rounded-sm">
  Nuevo
</span>
```

### Header con Gradiente
```astro
<header class="gradient-azul text-white p-6">
  <h1 class="text-3xl font-bold">Mi Inmobiliaria</h1>
</header>
```

---

## 🎯 Recomendaciones de Uso

### Jerarquía de Colores

1. **Azul** (`--color-azul`) - Color principal para:
   - Botones primarios
   - Enlaces
   - Elementos interactivos principales
   - Iconos importantes

2. **Azul Oscuro** (`--color-azul-oscuro`) - Para:
   - Encabezados principales
   - Navegación
   - Fondos de secciones importantes
   - Hover states de elementos azules

3. **Rojo** (`--color-rojo`) - Para:
   - Botones de llamado a la acción (CTA)
   - Elementos que requieren atención
   - Badges de "Nuevo" o "Destacado"
   - Alertas importantes

4. **Texto** (`--color-texto`) - Para:
   - Todos los textos de contenido
   - Párrafos
   - Descripciones

5. **Gris Claro** (`--color-gris-claro`) - Para:
   - Fondos sutiles
   - Separadores
   - Textos secundarios

---

## 🔄 Migración de Colores Existentes

Si tienes componentes usando `purple-600`, aquí está cómo migrarlos:

### Antes (Purple)
```astro
<button class="bg-purple-600 hover:bg-purple-700 text-white">
  Buscar
</button>
```

### Después (Azul de Marca)
```astro
<button class="bg-azul hover:bg-azul-oscuro text-white">
  Buscar
</button>
```

### Antes (Purple para badges)
```astro
<span class="bg-purple-600 text-white px-3 py-1 rounded-full">
  Featured
</span>
```

### Después (Rojo para badges destacados)
```astro
<span class="bg-rojo text-white px-3 py-1 rounded-sm">
  Featured
</span>
```

---

## 🎨 Combinaciones Recomendadas

### Combinación 1: Profesional
```astro
<div class="bg-azul-oscuro text-white">
  <h2 class="text-2xl">Título</h2>
  <button class="bg-rojo hover:bg-rojo-oscuro px-6 py-2 rounded">
    Acción
  </button>
</div>
```

### Combinación 2: Limpia
```astro
<div class="bg-white border-2 border-azul">
  <h3 class="text-azul-oscuro">Título</h3>
  <p class="text-contenido">Contenido</p>
</div>
```

### Combinación 3: Llamativa
```astro
<div class="gradient-rojo text-white p-8">
  <h2 class="text-3xl font-bold">¡Oferta Especial!</h2>
  <button class="bg-white text-rojo hover:bg-gris-claro px-6 py-3 rounded">
    Aprovechar Ahora
  </button>
</div>
```

---

## 📱 Accesibilidad

Todos los colores han sido seleccionados considerando el contraste:

- ✅ **Azul sobre blanco**: Contraste suficiente para textos
- ✅ **Blanco sobre azul**: Excelente contraste
- ✅ **Blanco sobre rojo**: Excelente contraste
- ✅ **Texto (#404040) sobre blanco**: Contraste óptimo

---

## 🔧 Personalización Adicional

Si necesitas crear más variantes, puedes agregar en `global.css`:

```css
/* Ejemplo: Versión clara del azul */
:root {
  --color-azul-claro: #5A6FE8;
  --color-azul-claro-rgb: 90, 111, 232;
}

.bg-azul-claro { background-color: var(--color-azul-claro); }
.text-azul-claro { color: var(--color-azul-claro); }
```

---

**Última actualización:** 2025-11-21
