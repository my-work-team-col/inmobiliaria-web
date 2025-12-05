# 🖼️ Sistema de Imágenes Simplificado

## ✅ Cambios Realizados

### 1. **Estructura de Archivos**

Las imágenes ahora se almacenan en la carpeta `public/`:

```
public/
  └── images/
      ├── property-1.jpg
      ├── property-2.jpg
      ├── property-3.jpg
      └── property-4.jpg
```

### 2. **Rutas en `properties.json`**

```json
{
  "id": 1,
  "title": "The Grand Estate",
  "location": "Moscow, 1218",
  "price": 521,
  "image": "/images/property-1.jpg",
  "featured": true
}
```

**Nota:** Las rutas comienzan con `/` porque apuntan a la carpeta `public/`.

---

## 📝 Cómo Funciona

### En `ListingSection.astro`

```astro
---
import propertiesData from "../data/properties.json";

// Simple filter - no complex imports needed
const featuredProperties = propertiesData.filter(
  (property) => property.featured
);
---
```

### En `PropertyCard.astro`

```astro
---
interface Props {
  image: string; // Simple string path
}
---

<img
  src={image}
  alt={title}
  class="..."
  loading="lazy"
/>
```

---

## 🎯 Ventajas de Este Enfoque

1. **Simplicidad** - No requiere imports complejos
2. **Rendimiento** - Las imágenes se sirven directamente
3. **Facilidad** - Solo arrastra y suelta imágenes en `public/images/`
4. **Compatibilidad** - Funciona con cualquier formato (jpg, png, webp, etc.)

---

## 📦 Cómo Agregar Nuevas Imágenes

### Paso 1: Agregar la imagen

Copia tu imagen a `public/images/`:

```
public/images/property-5.jpg
```

### Paso 2: Actualizar `properties.json`

```json
{
  "id": 5,
  "title": "Nueva Propiedad",
  "location": "Madrid, España",
  "price": 450,
  "image": "/images/property-5.jpg",
  "featured": true
}
```

¡Listo! La imagen aparecerá automáticamente.

---

## 🚀 Próximos Pasos

Para que las imágenes funcionen, necesitas:

1. **Crear la carpeta** (si no existe):

   ```bash
   mkdir public/images
   ```

2. **Copiar las imágenes generadas**:
   He generado 4 imágenes de propiedades que están en:
   - `property_1_estate_*.png`
   - `property_2_hostel_*.png`
   - `property_3_hotel_*.png`
   - `property_4_voxy_*.png`

3. **Renombrar y copiar**:
   ```bash
   # Ejemplo (ajusta las rutas según sea necesario)
   cp path/to/property_1_estate_*.png public/images/property-1.jpg
   cp path/to/property_2_hostel_*.png public/images/property-2.jpg
   cp path/to/property_3_hotel_*.png public/images/property-3.jpg
   cp path/to/property_4_voxy_*.png public/images/property-4.jpg
   ```

---

## 💡 Tips

- **Optimiza las imágenes** antes de subirlas (usa herramientas como TinyPNG)
- **Usa WebP** para mejor rendimiento
- **Nombra consistentemente** (property-1, property-2, etc.)
- **Mantén tamaños razonables** (400x300px es suficiente para las tarjetas)

---

**Última actualización:** 2025-11-21
