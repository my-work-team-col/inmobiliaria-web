import { db, Properties, PropertiesImages, Categories, PropertyCategories } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import data from '@/data/properties.json'; 

const queries: any = [];

export default async function seed() {
  console.log('🌱 Iniciando seed...');
  
  // ============================================
  // PASO 1: Crear Categorías PADRE (Nivel 0)
  // ============================================
  const residencialId = uuidv4();
  const comercialId = uuidv4();
  const terrenosId = uuidv4();
  
  const parentCategories = [
    {
      id: residencialId,
      name: 'Residencial',
      slug: 'residencial',
      parentId: null,
      description: 'Propiedades para vivienda',
      icon: '🏠',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: comercialId,
      name: 'Comercial',
      slug: 'comercial',
      parentId: null,
      description: 'Propiedades para negocios',
      icon: '💼',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: terrenosId,
      name: 'Terrenos',
      slug: 'terrenos',
      parentId: null,
      description: 'Lotes y terrenos',
      icon: '🗺️',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  
  await db.insert(Categories).values(parentCategories);
  console.log('✅ Categorías padre creadas (3)');
  
  // ============================================
  // PASO 2: Crear Categorías HIJAS (Nivel 1)
  // ============================================
  const apartamentoId = uuidv4();
  const casaId = uuidv4();
  const fincaId = uuidv4();
  const localId = uuidv4();
  const oficinaId = uuidv4();
  const bodegaId = uuidv4();
  const loteId = uuidv4();
  const terrenoRuralId = uuidv4();
  
  const childCategories = [
    // Hijas de Residencial
    {
      id: apartamentoId,
      name: 'Apartamento',
      slug: 'apartamento',
      parentId: residencialId,
      description: 'Apartamentos y departamentos',
      icon: '🏢',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: casaId,
      name: 'Casa',
      slug: 'casa',
      parentId: residencialId,
      description: 'Casas unifamiliares',
      icon: '🏡',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: fincaId,
      name: 'Finca',
      slug: 'finca',
      parentId: residencialId,
      description: 'Fincas y casas campestres',
      icon: '🏞️',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Hijas de Comercial
    {
      id: localId,
      name: 'Local Comercial',
      slug: 'local-comercial',
      parentId: comercialId,
      description: 'Locales para negocios',
      icon: '🏪',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: oficinaId,
      name: 'Oficina',
      slug: 'oficina',
      parentId: comercialId,
      description: 'Espacios de oficina',
      icon: '🏢',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: bodegaId,
      name: 'Bodega',
      slug: 'bodega',
      parentId: comercialId,
      description: 'Bodegas y almacenes',
      icon: '📦',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Hijas de Terrenos
    {
      id: loteId,
      name: 'Lote',
      slug: 'lote',
      parentId: terrenosId,
      description: 'Lotes urbanos',
      icon: '📐',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: terrenoRuralId,
      name: 'Terreno Rural',
      slug: 'terreno-rural',
      parentId: terrenosId,
      description: 'Terrenos rurales',
      icon: '🌾',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  
  await db.insert(Categories).values(childCategories);
  console.log('✅ Categorías hijas creadas (8)');
  
  // ============================================
  // PASO 3: Insertar Propiedades e Imágenes
  // ============================================
  console.log('🏠 Insertando propiedades...');
  
  const categoryMap: Record<string, string> = {
    'apartamento': apartamentoId,
    'casa': casaId,
    'finca': fincaId,
    'local': localId,
    'local comercial': localId,
    'oficina': oficinaId,
    'bodega': bodegaId,
    'lote': loteId,
    'terreno': terrenoRuralId,
  };
  
  data.forEach((item) => {
    const property = {
      id: uuidv4(),
      title: item.title,
      slug: item.slug,
      // ❌ Ya no usamos categories JSON
      isActive: item.isActive,
      featured: item.featured,
      gallery: item.gallery,
      location: item.location,
      city: item.city,
      neighborhood: item.neighborhood,
      code: item.code,
      description: item.description,
      area: item.area,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      parking: item.parking,
      price: item.price,
      participation: item.participation,
      address: item.address,
      observations: item.observations,
    };

    queries.push(db.insert(Properties).values(property));

    // Insertar imágenes
    item.gallery.forEach((img) => {
      const image = {
        id: uuidv4(),
        image: img,
        propertyId: property.id,
      };
      queries.push(db.insert(PropertiesImages).values(image));
    });
    
    // Relacionar con categorías (usar la primera categoría del JSON como referencia)
    if (item.categories && item.categories.length > 0) {
      const firstCategory = item.categories[0].toLowerCase();
      const categoryId = categoryMap[firstCategory] || apartamentoId; // default: apartamento
      
      queries.push(db.insert(PropertyCategories).values({
        propertyId: property.id,
        categoryId: categoryId,
        isPrimary: true,
        createdAt: new Date(),
      }));
    }
  });

  await db.batch(queries);
  
  console.log('✅ Propiedades e imágenes insertadas');
  console.log('🎉 Seed completado!');
  console.log('');
  console.log('📊 Resumen:');
  console.log('   - Categorías padre: 3');
  console.log('   - Categorías hijas: 8');
  console.log('   - Total categorías: 11');
  console.log(`   - Propiedades: ${data.length}`);
  console.log('');
  console.log('🏗️ Estructura de Categorías:');
  console.log('   🏠 Residencial');
  console.log('      ├── 🏢 Apartamento');
  console.log('      ├── 🏡 Casa');
  console.log('      └── 🏞️ Finca');
  console.log('   💼 Comercial');
  console.log('      ├── 🏪 Local Comercial');
  console.log('      ├── 🏢 Oficina');
  console.log('      └── 📦 Bodega');
  console.log('   🗺️ Terrenos');
  console.log('      ├── 📐 Lote');
  console.log('      └── 🌾 Terreno Rural');
}
