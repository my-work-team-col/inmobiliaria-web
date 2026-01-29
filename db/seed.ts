import { db, Properties, PropertiesImages, Categories, PropertyCategories } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file BEFORE any other imports
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key] = valueParts.join('=');
      }
    }
  });
  console.log('✅ Environment variables loaded from .env');
}

import { cloudinaryBatchUploader } from '../src/lib/cloudinary/batch-upload';
import type { SeedOptions, SeedResult, ConnectionDiagnostics } from '../src/types/seed';
import fsAsync from 'fs/promises';

// Usamos las interfaces importadas de types/seed

/**
 * Enhanced seed function with force flag support and Cloudinary integration
 */
export default async function seed(): Promise<SeedResult> {
  const startTime = Date.now();
  const result: SeedResult = {
    success: true,
    categoriesCreated: 0,
    propertiesCreated: 0,
    imagesCreated: 0,
    imagesUploadedToCloudinary: 0,
    executionTime: 0,
    errors: [],
    warnings: []
  };

  try {
    // Parse command line arguments
    const options = parseCommandLineArgs();
    
    // Get current data state
    const existingData = await getCurrentDataState();
    
    // 🚫 SKIP SI YA HAY DATOS (a menos que use --force)
    if (existingData.properties.length > 0 && !options.force) {
      console.log('⏭️  SEED OMITIDO - Ya existen datos en la base de datos');
      console.log(`📊 Estado actual: ${existingData.properties.length} propiedades, ${existingData.images.length} imágenes`);
      console.log('💡 Para recrear datos: pnpm db:push (confirmar reset cuando pregunte)\n');
      
      result.warnings.push('Seed omitido - datos ya existen');
      return finalizeResult(result, startTime);
    }
    
    console.log('🌱 Iniciando seed completo...\n');
    console.log('📋 Opciones:');
    console.log(`   • Force mode: ${options.force ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   • Remote database: ${options.remote ? '✅ SÍ' : '❌ NO'}\n`);

    // Validate environment and connection
    if (options.remote) {
      const diagnostics = await validateRemoteConnection();
      if (!diagnostics.isConnected) {
        throw new Error(`Remote connection failed: ${diagnostics.error || 'Unknown error'}`);
      }
      console.log('✅ Conexión a Turso remota validada\n');
    }

    // Validate Cloudinary configuration
    console.log('☁️  Validando configuración de Cloudinary...');
    const cloudinaryConfig = await cloudinaryBatchUploader.validateConfiguration();
    if (!cloudinaryConfig.valid) {
      throw new Error(`Cloudinary configuration error: ${cloudinaryConfig.error}`);
    }
    console.log('✅ Cloudinary configurado correctamente\n');

    // Clear existing data if force mode is enabled
    if (options.force) {
      console.log('🧹 LIMPIANDO DATOS EXISTENTES (--force)');
      await clearAllData();
      console.log('✅ Datos existentes eliminados\n');
    }
  
// ============================================
// PASO 1: Crear Categorías PADRE (Nivel 0)
// ============================================
    console.log('📦 Creando categorías padre...');
    const categoryIds = await createParentCategories();
    result.categoriesCreated += 3;
    console.log('✅ 3 categorías padre creadas\n');

    // ============================================
    // PASO 2: Crear Categorías HIJAS (Nivel 1)
    // ============================================
    console.log('📦 Creando categorías hijas...');
    const childCategoryIds = await createChildCategories(categoryIds);
    result.categoriesCreated += 8;
    console.log('✅ 8 categorías hijas creadas\n');

    // ============================================
    // PASO 3: Crear array de categorías con metadata para Faker
    // ============================================
    const categoriesWithMeta: Array<{
      id: string;
      name: string;
      slug: string;
      keywords: string[];
      bedroomsRange: [number, number];
      areaRange: [number, number];
    }> = [
      { id: childCategoryIds.apartamentoId, name: 'Apartamento', slug: 'apartamento', keywords: ['apartamento', 'apto', 'penthouse'], bedroomsRange: [1, 4], areaRange: [40, 200] },
      { id: childCategoryIds.casaId, name: 'Casa', slug: 'casa', keywords: ['casa', 'vivienda'], bedroomsRange: [2, 5], areaRange: [80, 300] },
      { id: childCategoryIds.fincaId, name: 'Finca', slug: 'finca', keywords: ['finca', 'campestre'], bedroomsRange: [3, 8], areaRange: [200, 5000] },
      { id: childCategoryIds.localId, name: 'Local Comercial', slug: 'local-comercial', keywords: ['local', 'comercial'], bedroomsRange: [0, 0], areaRange: [30, 200] },
      { id: childCategoryIds.oficinaId, name: 'Oficina', slug: 'oficina', keywords: ['oficina', 'consultorio'], bedroomsRange: [0, 2], areaRange: [20, 150] },
      { id: childCategoryIds.bodegaId, name: 'Bodega', slug: 'bodega', keywords: ['bodega', 'almacén'], bedroomsRange: [0, 0], areaRange: [50, 500] },
      { id: childCategoryIds.loteId, name: 'Lote', slug: 'lote', keywords: ['lote', 'terreno'], bedroomsRange: [0, 0], areaRange: [100, 1000] },
      { id: childCategoryIds.terrenoRuralId, name: 'Terreno Rural', slug: 'terreno-rural', keywords: ['terreno rural'], bedroomsRange: [0, 0], areaRange: [500, 10000] },
    ];

    // ============================================
    // PASO 4: Generar 60 propiedades con Faker
    // ============================================
    console.log('🏠 Generando 60 propiedades con Faker...\n');
    const propertyData = await generateProperties(categoriesWithMeta);
    result.propertiesCreated = propertyData.properties.length;
    console.log('✅ 60 propiedades generadas\n');

    // ============================================
    // PASO 5: Upload images to Cloudinary and create PropertiesImages records
    // ============================================
    console.log('📸 Procesando imágenes y subiendo a Cloudinary...');
    const imageData = await processImagesToCloudinary(propertyData.properties);
    result.imagesCreated = imageData.imageRecords.length;
    result.imagesUploadedToCloudinary = imageData.cloudinaryResult.successfulUploads;
    
    if (imageData.cloudinaryResult.failedUploads > 0) {
      result.warnings.push(`${imageData.cloudinaryResult.failedUploads} imágenes fallaron al subir a Cloudinary`);
    }
    
    console.log(`✅ ${imageData.cloudinaryResult.successfulUploads}/${imageData.cloudinaryResult.totalImages} imágenes subidas a Cloudinary\n`);

    // ============================================
    // PASO 6: Insert all data in transaction
    // ============================================
    console.log('💾 Insertando datos en la base de datos...');
    await insertDataInTransaction(propertyData, imageData);
    console.log('✅ Todos los datos insertados exitosamente\n');

    // ============================================
    // PASO 7: Final verification
    // ============================================
    await verifyDataInsertion();

    return finalizeResult(result, startTime);

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Seed execution failed: ${error.message}`);
    console.error(`🚨 ERROR EN SEED: ${error.message}`);
    return finalizeResult(result, startTime);
  }
}

/**
 * Parse command line arguments
 */
function parseCommandLineArgs(): SeedOptions {
  return {
    force: process.argv.includes('--force'),
    remote: process.argv.includes('--remote')
  };
}

/**
 * Validate remote database connection
 */
async function validateRemoteConnection(): Promise<ConnectionDiagnostics> {
  try {
    const startTime = Date.now();
    await db.select().from(Categories).limit(1);
    const responseTime = Date.now() - startTime;

    return {
      isConnected: true,
      isRemote: true,
      databaseType: 'turso',
      responseTime
    };
  } catch (error: any) {
    return {
      isConnected: false,
      isRemote: true,
      databaseType: 'turso',
      responseTime: 0,
      error: error.message
    };
  }
}

/**
 * Get current data state
 */
async function getCurrentDataState() {
  const [categories, properties, images] = await Promise.all([
    db.select().from(Categories),
    db.select().from(Properties),
    db.select().from(PropertiesImages)
  ]);

  return { categories, properties, images };
}

/**
 * Clear all existing data
 */
async function clearAllData() {
  try {
    // Clear in order of dependencies
    await db.delete(PropertiesImages);
    console.log('   • PropertiesImages eliminada');
    
    await db.delete(PropertyCategories);
    console.log('   • PropertyCategories eliminada');
    
    await db.delete(Properties);
    console.log('   • Properties eliminada');
    
    await db.delete(Categories);
    console.log('   • Categories eliminada');
  } catch (error: any) {
    throw new Error(`Failed to clear data: ${error.message}`);
  }
}

/**
 * Create parent categories
 */
async function createParentCategories() {
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
  
  return { residencialId, comercialId, terrenosId };
}

/**
 * Create child categories
 */
async function createChildCategories(parentIds: { residencialId: string; comercialId: string; terrenosId: string }) {
  const childCategoryIds = {
    apartamentoId: uuidv4(),
    casaId: uuidv4(),
    fincaId: uuidv4(),
    localId: uuidv4(),
    oficinaId: uuidv4(),
    bodegaId: uuidv4(),
    loteId: uuidv4(),
    terrenoRuralId: uuidv4(),
  };

  const childCategories = [
    // Hijas de Residencial
    {
      id: childCategoryIds.apartamentoId,
      name: 'Apartamento',
      slug: 'apartamento',
      parentId: parentIds.residencialId,
      description: 'Apartamentos y departamentos',
      icon: '🏢',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: childCategoryIds.casaId,
      name: 'Casa',
      slug: 'casa',
      parentId: parentIds.residencialId,
      description: 'Casas unifamiliares',
      icon: '🏡',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: childCategoryIds.fincaId,
      name: 'Finca',
      slug: 'finca',
      parentId: parentIds.residencialId,
      description: 'Fincas y casas campestres',
      icon: '🏞️',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Hijas de Comercial
    {
      id: childCategoryIds.localId,
      name: 'Local Comercial',
      slug: 'local-comercial',
      parentId: parentIds.comercialId,
      description: 'Locales para negocios',
      icon: '🏪',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: childCategoryIds.oficinaId,
      name: 'Oficina',
      slug: 'oficina',
      parentId: parentIds.comercialId,
      description: 'Espacios de oficina',
      icon: '🏢',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: childCategoryIds.bodegaId,
      name: 'Bodega',
      slug: 'bodega',
      parentId: parentIds.comercialId,
      description: 'Bodegas y almacenes',
      icon: '📦',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Hijas de Terrenos
    {
      id: childCategoryIds.loteId,
      name: 'Lote',
      slug: 'lote',
      parentId: parentIds.terrenosId,
      description: 'Lotes urbanos',
      icon: '📐',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: childCategoryIds.terrenoRuralId,
      name: 'Terreno Rural',
      slug: 'terreno-rural',
      parentId: parentIds.terrenosId,
      description: 'Terrenos rurales',
      icon: '🌾',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.insert(Categories).values(childCategories);
  
  return childCategoryIds;
}
  
/**
 * Generate properties with Faker
 */
async function generateProperties(categoriesWithMeta: Array<{
  id: string;
  name: string;
  slug: string;
  keywords: string[];
  bedroomsRange: [number, number];
  areaRange: [number, number];
}>) {
  const properties = [];
  const categoryRelations = [];
  
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
    
    properties.push(property);
    
    // Asignar categoría
    categoryRelations.push({
      propertyId,
      categoryId: randomCategory.id,
      isPrimary: true,
      createdAt: new Date(),
    });
    
    // Log cada 10 propiedades
    if ((i + 1) % 10 === 0) {
      console.log(`   ✓ ${i + 1} propiedades generadas...`);
    }
  }
  
  return { properties, categoryRelations };
}

/**
 * Process images and upload to Cloudinary
 */
async function processImagesToCloudinary(properties: Array<any>) {
  const imageData = [];
  const imageUploadData = [];
  
  // Generate image records for Cloudinary upload
  for (let i = 0; i < properties.length; i++) {
    const propertyId = properties[i].id;
    const baseImageNum = ((i % 20) + 1); // Cada propiedad usa set diferente
    
    for (let j = 1; j <= 3; j++) {
      const imageId = uuidv4();
      const localPath = path.join(process.cwd(), 'public', 'images', 'properties', `property-${baseImageNum}-${j}.jpg`);
      
      imageData.push({
        id: imageId,
        propertyId,
        imageIndex: j,
        image: `/images/properties/property-${baseImageNum}-${j}.jpg`,
        localPath,
        cloudinaryUrl: null,
        cloudinaryPublicId: null
      });
      
      imageUploadData.push({
        id: imageId,
        propertyId,
        imageIndex: j,
        localPath
      });
    }
  }
  
  // Upload all images to Cloudinary in batch
  console.log(`📸 Subiendo ${imageUploadData.length} imágenes a Cloudinary...`);
  const cloudinaryResult = await cloudinaryBatchUploader.uploadImages(imageUploadData);
  
  // Update image data with Cloudinary URLs
  const uploadedUrlsMap = new Map(
    cloudinaryResult.uploadedUrls.map(url => [url.id, { url: url.url, publicId: url.publicId }])
  );
  
  const imageRecords = imageData.map(img => {
    const cloudinaryData = uploadedUrlsMap.get(img.id);
    return {
      id: img.id,
      propertyId: img.propertyId,
      image: img.image,
      cloudinaryUrl: cloudinaryData?.url || null,
      cloudinaryPublicId: cloudinaryData?.publicId || null,
      cloudinaryMetadata: cloudinaryData ? JSON.stringify({
        uploadedAt: new Date().toISOString(),
        source: 'seed-script'
      }) : null,
      isMigrated: !!cloudinaryData
    };
  });
  
  return { imageRecords, cloudinaryResult };
}

/**
 * Insert all data in transaction
 */
async function insertDataInTransaction(propertyData: any, imageData: any) {
  try {
    // Insert properties
    console.log('   • Insertando properties...');
    await db.batch(propertyData.properties.map((p: any) => db.insert(Properties).values(p)));
    
    // Insert category relations
    console.log('   • Insertando property-categories...');
    await db.batch(propertyData.categoryRelations.map((r: any) => db.insert(PropertyCategories).values(r)));
    
    // Insert images
    console.log('   • Insertando properties-images...');
    await db.batch(imageData.imageRecords.map((img: any) => db.insert(PropertiesImages).values(img)));
    
  } catch (error: any) {
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

/**
 * Verify data insertion
 */
async function verifyDataInsertion() {
  const dataState = await getCurrentDataState();
  const categories = dataState.categories;
  const properties = dataState.properties;
  const images = dataState.images;
  
  console.log('📊 Verificación final:');
  console.log(`   • Categorías: ${categories.length} ✅`);
  console.log(`   • Propiedades: ${properties.length} ✅`);
  console.log(`   • Imágenes: ${images.length} ✅`);
  console.log(`   • Imágenes con Cloudinary: ${images.filter((img: any) => img.cloudinaryUrl).length} ✅`);
  
  if (categories.length !== 11) {
    throw new Error(`Expected 11 categories, got ${categories.length}`);
  }
  
  if (properties.length !== 60) {
    throw new Error(`Expected 60 properties, got ${properties.length}`);
  }
  
  if (images.length !== 180) {
    throw new Error(`Expected 180 images, got ${images.length}`);
  }
}

/**
 * Finalize and return result
 */
function finalizeResult(result: SeedResult, startTime: number): SeedResult {
  result.executionTime = Date.now() - startTime;
  
  console.log('\n' + '='.repeat(60));
  if (result.success) {
    console.log('🎉 SEED COMPLETADO EXITOSAMENTE');
    console.log('=' .repeat(60));
    console.log('📊 Resumen:');
    console.log(`   • Categorías creadas: ${result.categoriesCreated}`);
    console.log(`   • Propiedades creadas: ${result.propertiesCreated}`);
    console.log(`   • Imágenes creadas: ${result.imagesCreated}`);
    console.log(`   • Imágenes subidas a Cloudinary: ${result.imagesUploadedToCloudinary}`);
    console.log(`   • Tiempo de ejecución: ${result.executionTime}ms`);
  } else {
    console.log('❌ SEED FALLÓ');
    console.log('=' .repeat(60));
    console.log('Errores:');
    result.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Advertencias:');
    result.warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  console.log('='.repeat(60));
  
  return result;
}
