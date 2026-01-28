import { db, Properties, PropertiesImages, Categories, PropertyCategories } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import { faker } from '@faker-js/faker';

export default async function seed() {
  console.log('🌱 Iniciando seed completo...\n');
  
  // ============================================
  // PASO 1: Crear Categorías PADRE (Nivel 0)
  // ============================================
  console.log('📦 Creando categorías padre...');
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
  console.log('✅ 3 categorías padre creadas\n');
  
  // ============================================
  // PASO 2: Crear Categorías HIJAS (Nivel 1)
  // ============================================
  console.log('📦 Creando categorías hijas...');
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
  console.log('✅ 8 categorías hijas creadas\n');
  
  // ============================================
  // PASO 3: Crear array de categorías con metadata para Faker
  // ============================================
  const categoriesWithMeta = [
    { id: apartamentoId, name: 'Apartamento', slug: 'apartamento', keywords: ['apartamento', 'apto', 'penthouse'], bedroomsRange: [1, 4], areaRange: [40, 200] },
    { id: casaId, name: 'Casa', slug: 'casa', keywords: ['casa', 'vivienda'], bedroomsRange: [2, 5], areaRange: [80, 300] },
    { id: fincaId, name: 'Finca', slug: 'finca', keywords: ['finca', 'campestre'], bedroomsRange: [3, 8], areaRange: [200, 5000] },
    { id: localId, name: 'Local Comercial', slug: 'local-comercial', keywords: ['local', 'comercial'], bedroomsRange: [0, 0], areaRange: [30, 200] },
    { id: oficinaId, name: 'Oficina', slug: 'oficina', keywords: ['oficina', 'consultorio'], bedroomsRange: [0, 2], areaRange: [20, 150] },
    { id: bodegaId, name: 'Bodega', slug: 'bodega', keywords: ['bodega', 'almacén'], bedroomsRange: [0, 0], areaRange: [50, 500] },
    { id: loteId, name: 'Lote', slug: 'lote', keywords: ['lote', 'terreno'], bedroomsRange: [0, 0], areaRange: [100, 1000] },
    { id: terrenoRuralId, name: 'Terreno Rural', slug: 'terreno-rural', keywords: ['terreno rural'], bedroomsRange: [0, 0], areaRange: [500, 10000] },
  ];
  
  // ============================================
  // PASO 4: Generar 60 propiedades con Faker
  // ============================================
  console.log('🏠 Generando 60 propiedades con Faker...\n');
  
  const propertyQueries = [];
  const categoryQueries = [];
  const imageQueries = [];
  
  for (let i = 0; i < 60; i++) {
    const propertyId = uuidv4();
    
    // Seleccionar categoría aleatoria
    const randomCategory = faker.helpers.arrayElement(categoriesWithMeta);
    
    // Generar datos coherentes según la categoría
    const bedrooms = randomCategory.bedroomsRange[0] === 0 
      ? 0 
      : faker.number.int({ min: randomCategory.bedroomsRange[0], max: randomCategory.bedroomsRange[1] });
    
    const bathrooms = bedrooms > 0 
      ? faker.number.int({ min: 1, max: Math.max(1, bedrooms) })
      : 0;
    
    const area = faker.number.int({ 
      min: randomCategory.areaRange[0], 
      max: randomCategory.areaRange[1] 
    });
    
    const parking = bedrooms > 2 
      ? faker.number.int({ min: 1, max: 3 })
      : faker.number.int({ min: 0, max: 2 });
    
    // Barrios reales de Colombia por ciudad
    const neighborhoods: Record<string, string[]> = {
      'Bogotá': ['Chapinero', 'Usaquén', 'Suba', 'Engativá', 'Teusaquillo', 'Santa Bárbara', 'Chicó', 'Cedritos', 'La Candelaria', 'Rosales'],
      'Medellín': ['El Poblado', 'Laureles', 'Envigado', 'Sabaneta', 'Belén', 'Estadio', 'Manila', 'Prado', 'Boston', 'La América'],
      'Cali': ['Granada', 'San Fernando', 'El Peñón', 'Ciudad Jardín', 'Versalles', 'Santa Rita', 'Alameda', 'Santa Mónica', 'Tequendama', 'El Refugio'],
      'Barranquilla': ['El Prado', 'Alto Prado', 'Riomar', 'Villa Country', 'Boston', 'El Golf', 'Altos del Prado', 'Villa Santos', 'Paraíso', 'Bellavista'],
      'Cartagena': ['Bocagrande', 'Castillogrande', 'Manga', 'Crespo', 'El Laguito', 'Chambacú', 'Pie de la Popa', 'Centro', 'Getsemaní', 'Cabrero'],
      'Bucaramanga': ['Cabecera del Llano', 'Altos de Cabecera', 'Sotomayor', 'La Aurora', 'El Prado', 'Campo Madrid', 'San Francisco', 'Los Alpes', 'Provenza', 'Lagos del Cacique'],
      'Pereira': ['Circunvalar', 'Álamos', 'Ciudad Jardín', 'Pinares', 'El Poblado', 'La Julita', 'Cuba', 'San Nicolás', 'El Jardín', 'Centro'],
    };
    
    const city = faker.helpers.arrayElement(['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira']);
    const neighborhood = faker.helpers.arrayElement(neighborhoods[city]);
    
    // Crear título descriptivo
    const title = `${randomCategory.name} en ${neighborhood}, ${city}`;
    
    // Generar propiedad
    const property = {
      id: propertyId,
      title,
      slug: faker.helpers.slugify(`${randomCategory.slug}-${neighborhood}-${i}`).toLowerCase(),
      location: `${neighborhood}, ${city}`,
      city,
      neighborhood,
      code: `PROP-${faker.string.alphanumeric(6).toUpperCase()}`,
      description: faker.lorem.paragraphs(2),
      area,
      bedrooms,
      bathrooms,
      parking,
      price: faker.number.int({ min: 100_000_000, max: 1_500_000_000 }),
      participation: faker.helpers.arrayElement(['Venta', 'Arriendo', 'Venta o Arriendo']),
      transactionType: faker.helpers.arrayElement(['sale', 'rent', 'both']),
      address: faker.location.streetAddress(),
      observations: faker.lorem.sentence(),
      featured: faker.datatype.boolean(0.2), // 20% destacadas
      isActive: true,
      gallery: JSON.stringify([]), // Las imágenes van en PropertiesImages
    };
    
    propertyQueries.push(db.insert(Properties).values(property));
    
    // Asignar categoría
    categoryQueries.push(
      db.insert(PropertyCategories).values({
        propertyId,
        categoryId: randomCategory.id,
        isPrimary: true,
        createdAt: new Date(),
      })
    );
    
    // Generar 3 imágenes por propiedad usando imágenes reales (property-1-1.jpg hasta property-20-3.jpg)
    const baseImageNum = ((i % 20) + 1); // Cada propiedad usa set diferente
    for (let j = 1; j <= 3; j++) {
      imageQueries.push(
        db.insert(PropertiesImages).values({
          id: uuidv4(),
          image: `/images/properties/property-${baseImageNum}-${j}.jpg`,
          propertyId,
        })
      );
    }
    
    // Log cada 10 propiedades
    if ((i + 1) % 10 === 0) {
      console.log(`   ✓ ${i + 1} propiedades generadas...`);
    }
  }
  
  // Ejecutar todas las queries en batch
  await db.batch(propertyQueries);
  console.log('✅ 60 propiedades insertadas');
  
  await db.batch(categoryQueries);
  console.log('✅ 60 relaciones property-category creadas');
  
  await db.batch(imageQueries);
  console.log(`✅ ${imageQueries.length} imágenes insertadas\n`);
  
  // ============================================
  // Resumen final
  // ============================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SEED COMPLETADO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Resumen:');
  console.log('   • 3 categorías padre');
  console.log('   • 8 categorías hijas');
  console.log('   • 60 propiedades generadas');
  console.log(`   • ${imageQueries.length} imágenes`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🏗️ Árbol de Categorías:');
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
  console.log('      └── 🌾 Terreno Rural\n');
  console.log('💡 Para cambiar categorías de propiedades manualmente:');
  console.log('   1. pnpm astro db studio  (GUI visual)');
  console.log('   2. pnpm tsx db/scripts/change-category.ts  (CLI interactivo)');
  console.log('   3. Ver helpers en: src/lib/db/categoryQueries.ts\n');
}
