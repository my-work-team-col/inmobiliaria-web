# 🖼️ Sistema de Imágenes - Dummy Images

## 📐 Tamaños de Imágenes

### Galería (Detalles de Propiedad)
- **Tamaño:** 1200x500
- **URL:** `https://dummyimage.com/1200x500/e3e3e3/262626&text=...`
- **Uso:** PropertyDetails, sliders, lightbox
- **Aspecto:** Panorámico para mostrar más detalles

### Cards (Listado de Propiedades)
- **Tamaño:** 600x400  
- **URL:** `https://dummyimage.com/600x400/e3e3e3/262626&text=...`
- **Uso:** ListingCard, thumbnails
- **Aspecto:** Más cuadrado para cards

---

## 🎨 Implementación Actual

### Base de Datos
Todas las imágenes en la DB usan **1200x500** (galería):
```json
{
  "image": "https://dummyimage.com/1200x500/e3e3e3/262626&text=Propiedad+1+-+Imagen+1",
  "order": 1,
  "isPrimary": true,
  "alt": "Apartamento en Santa Bárbara Central - Imagen 1"
}
```

### Componentes Frontend

#### ListingCard.astro
**Opción 1:** Usar imagen de galería tal cual
```astro
const primaryImage = images.find(img => img.isPrimary);
const image = primaryImage?.image || images[0]?.image || "/images/default.jpg";
```

**Opción 2:** Convertir URL a tamaño card (600x400)
```astro
const primaryImage = images.find(img => img.isPrimary);
const galleryImage = primaryImage?.image || images[0]?.image || "/images/default.jpg";

// Convertir 1200x500 a 600x400 para cards
const image = galleryImage.includes('dummyimage.com') 
  ? galleryImage.replace('1200x500', '600x400')
  : galleryImage;
```

#### PropertyDetails.astro
Usa imágenes de galería directamente (1200x500):
```astro
<img 
  src={property.images?.[0]?.image || 'https://via.placeholder.com/1200x600'} 
  alt={property.images?.[0]?.alt || property.title}
/>
```

---

## 🔄 Opción Recomendada

### Almacenar Solo URL Base
En lugar de almacenar URLs completas, almacenar solo el identificador:

**En properties.json:**
```json
"gallery": [
  "property-1-1",
  "property-1-2", 
  "property-1-3"
]
```

**En componentes, generar URL según necesidad:**
```typescript
// Helper function
function getImageUrl(imageId: string, size: 'card' | 'gallery' = 'gallery') {
  const sizes = {
    card: '600x400',
    gallery: '1200x500'
  };
  
  return `https://dummyimage.com/${sizes[size]}/e3e3e3/262626&text=${imageId}`;
}

// Uso en ListingCard
const image = getImageUrl('property-1-1', 'card');

// Uso en PropertyDetails
const image = getImageUrl('property-1-1', 'gallery');
```

---

## ✅ Implementación Actual (Más Simple)

Por ahora, usamos la **Opción 2** que es más simple:

1. **DB almacena:** URLs de galería (1200x500)
2. **ListingCard:** Convierte a 600x400 si es dummyimage
3. **PropertyDetails:** Usa 1200x500 directamente

**Ventajas:**
- ✅ Simple de implementar
- ✅ No requiere cambios en DB
- ✅ Funciona con imágenes reales también

**Código en ListingCard.astro:**
```astro
---
const primaryImage = images.find(img => img.isPrimary);
const galleryImage = primaryImage?.image || images[0]?.image || "/images/default.jpg";

// Auto-resize para cards si es dummy image
const image = galleryImage.includes('dummyimage.com') 
  ? galleryImage.replace('1200x500', '600x400')
  : galleryImage;
---

<img src={image} alt={primaryImage?.alt || title} />
```

---

## 🚀 Próximos Pasos

1. [ ] Implementar conversión de tamaño en ListingCard
2. [ ] Crear helper function para generar URLs
3. [ ] (Opcional) Migrar a almacenar solo IDs en lugar de URLs completas

---

**Estado Actual:** ✅ Imágenes dummy funcionando con 1200x500  
**Próximo:** Implementar resize automático para cards
