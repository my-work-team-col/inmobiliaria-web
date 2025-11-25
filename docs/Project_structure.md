# 📁 Estructura Oficial del Proyecto — Documentación Interna (Astro + Vue)

Esta guía define la **arquitectura oficial**, las **convenciones**, y el **enfoque profesional** para mantener un código limpio, escalable y entendible para todo el equipo.  
Este archivo debe mantenerse actualizado a medida que el proyecto evolucione.

---

# 🚀 Objetivos de esta arquitectura

- Tener una estructura **clara, escalable y fácil de navegar**.
- Separar *UI estática*, *UI dinámica*, *Vue*, *Astro* y *Islands* de forma ordenada.
- Evitar duplicación de código.
- Mantener **tipos TypeScript centralizados** y reutilizables.
- Facilitar trabajo en equipo con convenciones claras.

---

# 📂 Estructura General

```
src/
│
├─ assets/
│   ├─ images/
│   ├─ icons/
│   └─ fonts/
│
├─ components/
│   ├─ astro/
│   ├─ vue/
│   └─ islands/
│
├─ composables/
│
├─ types/
│   ├─ domain/
│   ├─ ui/
│   └─ index.ts
│
├─ data/
│
├─ layouts/
│
├─ pages/
│
├─ styles/
│
└─ env.d.ts
```

---

# 🧱 1. Assets

```
assets/
│─ images/
│─ icons/
│─ fonts/
```

### ✔️ Buenas prácticas
- `icons/` almacena SVGs optimizados o íconos para Astro Icon.
- `images/` guarda imágenes grandes o estáticas.
- `fonts/` contiene tipografías locales cuando sea necesario.

---

# 🧱 2. Components

```
components/
│── astro/
│── vue/
└── islands/
```

### **2.1. `astro/` → UI estática y layout**
Componentes renderizados en servidor, sin JavaScript en cliente:

Ejemplos:
- Botones estáticos (`Button.astro`)
- Cards (`Card.astro`)
- Secciones de UI estática
- Headers / Footers

---

### **2.2. `vue/` → Vue PURO (NO islands)**

Son componentes Vue **sin montarse automáticamente**.  
Estos archivos contienen:
- Lógica Reactiva
- Interactividad compleja
- Estados compartidos

Se usan **dentro de una Island**.

Ejemplos:
```
SearchFilters.vue
Modal.vue
Dropdown.vue
```

---

### **2.3. `islands/` → Astro Islands**

Aquí van los archivos `.astro` que montan Vue en el cliente:

Ejemplo:
```
<SearchFiltersIsland client:load />
```

Cada Island:
- Importa un componente Vue
- Define *hasta qué punto se hidrata*

Ejemplo interno:

```astro
---
import SearchFilters from "@components/vue/SearchFilters.vue";
---

<SearchFilters client:visible />
```

Esto permite:
- Hydration parcial
- Performance óptimo
- Solo lo necesario se ejecuta en el navegador

---

# 🧱 3. Composables (`composables/`)

Aquí se guarda **lógica reutilizable**, como en Nuxt o Vue 3:

Ejemplos:

```
useFilters.ts
useModal.ts
useSearch.ts
useUiState.ts
```

✔️ Se usan desde cualquier componente Vue  
✔️ Mantienen el código limpio y desacoplado  
✔️ Facilitan testeo

---

# 🧱 4. Types (`types/`)

Separación profesional:

```
types/
│── domain/
│     ├─ FilterTypes.ts
│     ├─ Property.ts
│     └─ Pagination.ts
│
│── ui/
│     ├─ ButtonProps.ts
│     └─ CardProps.ts
│
└── index.ts
```

### ✔️ Domain → lógicas del negocio  
Ej:
- Propiedades
- Categorías
- Filtros

### ✔️ UI → props de componentes  
Ej:
- Props de Button  
- Props de Select  
- Props de Card

### ✔️ index.ts  
Reexporta todo para importar fácilmente:

```ts
export * from "./domain/Property";
export * from "./ui/ButtonProps";
```

---

# 🧱 5. Data (`data/`)

Contiene *mock data* temporal o archivos estáticos pequeños:

```
categories.json
properties.json
```

---

# 🧱 6. Layouts (`layouts/`)

Plantillas globales para páginas:

```
MainLayout.astro
LandingLayout.astro
```

---

# 🧱 7. Pages (`pages/`)

Rutas de tu sitio:

```
pages/
├─ index.astro
├─ propiedades/
│     └─ index.astro
└─ contacto.astro
```

Estas siguen el **Astro File-Based Routing**.

---

# 🧱 8. Styles (`styles/`)

```
globals.css
utilities.css
tokens.css
```

### ✔️ `tokens.css`
Variables globales:
- Colores
- Espaciados
- Tipografías

### ✔️ `globals.css`
Estilos globales base.

### ✔️ `utilities.css`
Helpers y utilidades personalizadas.

---

# 🧱 9. env.d.ts

Define tipos globales de Astro e integraciones:

```ts
/// <reference path="../.astro/types.d.ts" />
```

---

# 📘 Convenciones del Proyecto

### ✔️ Naming
- Carpeta → singular  
- Archivos → PascalCase para componentes  
- Composables → camelCase + prefijo `use`

### ✔️ Tipos fuera de los componentes  
Evita esto ❌:

```ts
interface Props { ... }
```

Dentro de un `.vue`.

Correcto ✔️:
```
types/ui/ButtonProps.ts
```

---

# 🏁 Conclusión

Esta estructura permite:

- Escalabilidad
- Separación clara de responsabilidades
- Islands optimizadas
- Buena mantenibilidad
- Documentación limpia para el equipo

Si necesitas, puedo generar también:

✅ Boilerplate completo del proyecto  
✅ Un PDF profesional para onboarding del equipo  
✅ Generar reglas de ESLint, Prettier, y convenciones de commits

