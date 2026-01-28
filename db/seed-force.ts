import { db, Properties, PropertiesImages, Categories, PropertyCategories } from 'astro:db';
import { v4 as uuidv4 } from "uuid";
import { faker } from '@faker-js/faker';
import { SeedOptions, SeedResult } from '@/types/seed';
import { cloudinaryBatchUploader } from '@/lib/cloudinary/batch-upload';
import { databaseUtils } from '@/lib/db/database-utils';
import fs from 'fs/promises';
import path from 'path';

/**
 * Enhanced seed function with force flag and Cloudinary integration
 */
export async function seedWithForce(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const result: SeedResult = {
    success: false,
    categoriesCreated: 0,
    propertiesCreated: 0,
    imagesCreated: 0,
    imagesUploadedToCloudinary: 0,
    errors: [],
    warnings: [],
    executionTime: 0
  };

  try {
    console.log('🌱 Starting enhanced seed with force and Cloudinary support...\n');

    // ============================================
    // STEP 0: Connection diagnostics and validation
    // ============================================
    console.log('🔍 Step 0: Connection diagnostics');
    const diagnostics = await databaseUtils.runConnectionDiagnostics();
    
    if (!diagnostics.isConnected) {
      throw new Error('Database connection failed');
    }

    if (options.remote && !diagnostics.isRemote) {
      result.warnings.push('Expected remote connection but got local database');
    }

    console.log(`✅ Connection verified: ${diagnostics.databaseType} (${diagnostics.responseTime}ms)\n`);

    // ============================================
    // STEP 1: Cloudinary validation (if needed)
    // ============================================
    if (options.remote || options.force) {
      console.log('☁️  Step 1: Cloudinary configuration validation');
      const cloudinaryValidation = await cloudinaryBatchUploader.validateConfiguration();
      
      if (!cloudinaryValidation.valid) {
        throw new Error(`Cloudinary configuration error: ${cloudinaryValidation.error}`);
      }
      
      console.log('✅ Cloudinary configuration validated\n');
    }

    // ============================================
    // STEP 2: Handle existing data based on force flag
    // ============================================
    console.log('📊 Step 2: Existing data check');
    const existingCategories = await db.select().from(Categories);
    const existingProperties = await db.select().from(Properties);
    const existingImages = await db.select().from(PropertiesImages);
    
    console.log(`   • Categories: ${existingCategories.length}`);
    console.log(`   • Properties: ${existingProperties.length}`);
    console.log(`   • Images: ${existingImages.length}`);

    if (options.force) {
      console.log('⚡ Force mode enabled - clearing all existing data...');
      await databaseUtils.clearAllData();
      console.log('✅ Data cleared successfully\n');
    } else if (existingCategories.length > 0 || existingProperties.length > 0) {
      console.log('ℹ️  Data exists and force mode is disabled - skipping seed');
      console.log('   Use --force flag to overwrite existing data');
      result.success = true;
      result.executionTime = Date.now() - startTime;
      return result;
    }

    // ============================================
    // STEP 3: Create Categories (11 total - 3 padres + 8 hijas)
    // ============================================
    console.log('📦 Step 3: Creating categories...');
    
    // Create parent categories
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
    console.log('   ✓ 3 parent categories created');

    // Create child categories
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
    console.log('   ✓ 8 child categories created');
    result.categoriesCreated = 11;
    console.log('✅ Categories creation completed\n');

    // ============================================
    // STEP 4: Prepare category metadata
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
    // STEP 5: Generate Properties and prepare for Cloudinary upload
    // ============================================
    console.log('🏠 Step 5: Generating 60 properties and preparing images...');
    
    const propertyQueries = [];
    const categoryQueries = [];
    const imageRecords = [];
    const imagesForCloudinary = [];
    
    // Colombian neighborhoods data
    const neighborhoods: Record<string, string[]> = {
      'Bogotá': ['Chapinero', 'Usaquén', 'Suba', 'Engativá', 'Teusaquillo', 'Santa Bárbara', 'Chicó', 'Cedritos', 'La Candelaria', 'Rosales'],
      'Medellín': ['El Poblado', 'Laureles', 'Envigado', 'Sabaneta', 'Belén', 'Estadio', 'Manila', 'Prado', 'Boston', 'La América'],
      'Cali': ['Granada', 'San Fernando', 'El Peñón', 'Ciudad Jardín', 'Versalles', 'Santa Rita', 'Alameda', 'Santa Mónica', 'Tequendama', 'El Refugio'],
      'Barranquilla': ['El Prado', 'Alto Prado', 'Riomar', 'Villa Country', 'Boston', 'El Golf', 'Altos del Prado', 'Villa Santos', 'Paraíso', 'Bellavista'],
      'Cartagena': ['Bocagrande', 'Castillogrande', 'Manga', 'Crespo', 'El Laguito', 'Chambacú', 'Pie de la Popa', 'Centro', 'Getsemaní', 'Cabrero'],
      'Bucaramanga': ['Cabecera del Llano', 'Altos de Cabecera', 'Sotomayor', 'La Aurora', 'El Prado', 'Campo Madrid', 'San Francisco', 'Los Alpes', 'Provenza', 'Lagos del Cacique'],
      'Pereira': ['Circunvalar', 'Álamos', 'Ciudad Jardín', 'Pinares', 'El Poblado', 'La Julita', 'Cuba', 'San Nicolás', 'El Jardín', 'Centro'],
    };

    for (let i = 0; i < 60; i++) {
      const propertyId = uuidv4();
      const randomCategory = faker.helpers.arrayElement(categoriesWithMeta);
      
      // Generate property data
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
      
      const city = faker.helpers.arrayElement(['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira']);
      const neighborhood = faker.helpers.arrayElement(neighborhoods[city]);
      
      const property = {
        id: propertyId,
        title: `${randomCategory.name} en ${neighborhood}, ${city}`,
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
        featured: faker.datatype.boolean(0.2),
        isActive: true,
        gallery: JSON.stringify([]),
      };
      
      propertyQueries.push(db.insert(Properties).values(property));
      
      categoryQueries.push(
        db.insert(PropertyCategories).values({
          propertyId,
          categoryId: randomCategory.id,
          isPrimary: true,
          createdAt: new Date(),
        })
      );

      // Prepare images (3 per property)
      const baseImageNum = ((i % 20) + 1);
      for (let j = 1; j <= 3; j++) {
        const imageId = uuidv4();
        const imageFilename = `property-${baseImageNum}-${j}.jpg`;
        const localPath = path.join(process.cwd(), 'public', 'images', 'properties', imageFilename);
        
        // Create database record for image
        imageRecords.push({
          id: imageId,
          image: `/images/properties/${imageFilename}`,
          propertyId,
          cloudinaryPublicId: null,
          cloudinaryUrl: null,
          cloudinaryMetadata: null,
          isMigrated: false,
        });

        // Prepare for Cloudinary upload
        imagesForCloudinary.push({
          id: imageId,
          propertyId,
          imageIndex: j,
          localPath,
        });
      }
      
      // Progress logging
      if ((i + 1) % 10 === 0) {
        console.log(`   ✓ ${i + 1} properties prepared...`);
      }
    }

    // Execute property and category queries
    await db.batch(propertyQueries);
    console.log('✅ 60 properties inserted');
    
    await db.batch(categoryQueries);
    console.log('✅ 60 property-category relations created');
    
    await db.insert(PropertiesImages).values(imageRecords);
    console.log(`✅ ${imageRecords.length} image records created`);
    
    result.propertiesCreated = 60;
    result.imagesCreated = imageRecords.length;
    console.log('✅ Properties and image records creation completed\n');

    // ============================================
    // STEP 6: Cloudinary batch upload
    // ============================================
    if (imagesForCloudinary.length > 0) {
      console.log('☁️  Step 6: Uploading images to Cloudinary...');
      
      // Check if we have Cloudinary credentials
      if (process.env.CLOUDINARY_CLOUD_NAME && 
          process.env.CLOUDINARY_API_KEY && 
          process.env.CLOUDINARY_API_SECRET) {
        
        const cloudinaryResult = await cloudinaryBatchUploader.uploadImages(imagesForCloudinary);
        
        if (cloudinaryResult.successfulUploads > 0) {
          // Update database with Cloudinary URLs
          for (const uploaded of cloudinaryResult.uploadedUrls) {
            await db
              .update(PropertiesImages)
              .set({
                cloudinaryUrl: uploaded.url,
                cloudinaryPublicId: uploaded.publicId,
                cloudinaryMetadata: JSON.stringify({
                  uploadedAt: new Date().toISOString(),
                  source: 'seed-force'
                }),
                isMigrated: true,
              })
              .where(require('astro:db').eq(PropertiesImages.id, uploaded.id));
          }
          
          result.imagesUploadedToCloudinary = cloudinaryResult.successfulUploads;
          console.log(`✅ ${cloudinaryResult.successfulUploads} images uploaded to Cloudinary`);
        }
        
        if (cloudinaryResult.failedUploads > 0) {
          result.errors.push(...cloudinaryResult.errors.map(e => `Cloudinary upload failed for image ${e.imageId}: ${e.error}`));
          console.log(`⚠️  ${cloudinaryResult.failedUploads} images failed to upload`);
        }
        
      } else {
        const warning = 'Cloudinary credentials not found - skipping image upload';
        result.warnings.push(warning);
        console.log(`⚠️  ${warning}`);
      }
      
      console.log('✅ Cloudinary processing completed\n');
    }

    // ============================================
    // STEP 7: Final verification
    // ============================================
    console.log('🔍 Step 7: Final verification...');
    
    const verificationResult = await databaseUtils.verifyDataWritten();
    console.log('✅ Data verification completed');
    
    if (options.remote) {
      const cloudinaryVerification = await databaseUtils.verifyCloudinaryUrls();
      if (!cloudinaryVerification.success) {
        result.warnings.push('Some images were not uploaded to Cloudinary');
      }
    }

    // ============================================
    // SUCCESS
    // ============================================
    result.success = true;
    result.executionTime = Date.now() - startTime;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SEED WITH FORCE COMPLETED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary:');
    console.log(`   • Categories created: ${result.categoriesCreated}`);
    console.log(`   • Properties created: ${result.propertiesCreated}`);
    console.log(`   • Image records created: ${result.imagesCreated}`);
    console.log(`   • Images uploaded to Cloudinary: ${result.imagesUploadedToCloudinary}`);
    console.log(`   • Execution time: ${(result.executionTime / 1000).toFixed(2)}s`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error: any) {
    result.success = false;
    result.errors.push(`Seed failed: ${error.message}`);
    result.executionTime = Date.now() - startTime;
    
    console.error('\n❌ SEED FAILED:');
    console.error(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }

  return result;
}