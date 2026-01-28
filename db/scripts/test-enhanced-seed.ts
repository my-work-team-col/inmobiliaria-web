#!/usr/bin/env tsx

/**
 * Test script for Enhanced Seed functionality
 * 
 * This script validates that all the components are working properly
 * before running the full seed.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file BEFORE any other imports
const envPath = join(process.cwd(), '.env');
if (readFileSync) {
  try {
    const envContent = readFileSync(envPath, 'utf8');
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
    console.log('🔍 Debug: CLOUDINARY_CLOUD_NAME =', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET');
    console.log('🔍 Debug: CLOUDINARY_API_KEY =', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
    console.log('🔍 Debug: CLOUDINARY_API_SECRET =', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
  } catch (error) {
    console.log('⚠️  Could not load .env file');
  }
}

import { readFile, readdir } from 'fs/promises';
import { cloudinaryBatchUploader } from '../../src/lib/cloudinary/batch-upload';

// Simple inline environment check to avoid import issues
function checkCloudinaryEnvironment() {
  return {
    valid: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    missing: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter(v => !process.env[v])
  };
}

function checkTursoEnvironment() {
  return {
    valid: !!(process.env.ASTRO_DB_REMOTE_URL && process.env.ASTRO_DB_APP_TOKEN),
    missing: ['ASTRO_DB_REMOTE_URL', 'ASTRO_DB_APP_TOKEN'].filter(v => !process.env[v])
  };
}

async function testEnhancedSeed() {
  console.log('🧪 Testing Enhanced Seed Components');
  console.log('='.repeat(40));
  
  const tests = [];
  
  // Test 1: Environment Variables
  console.log('\n📋 1. Testing Environment Variables...');
  const cloudinaryCheck = checkCloudinaryEnvironment();
  const tursoCheck = checkTursoEnvironment();
  
  if (cloudinaryCheck.valid) {
    console.log('✅ Cloudinary environment OK');
    tests.push({ name: 'Cloudinary Environment', status: 'PASS' });
  } else {
    console.log('❌ Cloudinary environment failed:');
    cloudinaryCheck.missing.forEach(v => console.log(`   • Missing: ${v}`));
    tests.push({ name: 'Cloudinary Environment', status: 'FAIL', error: 'Missing variables' });
  }
  
  if (tursoCheck.valid) {
    console.log('✅ Turso environment OK');
    tests.push({ name: 'Turso Environment', status: 'PASS' });
  } else {
    console.log('❌ Turso environment failed:');
    tursoCheck.missing.forEach(v => console.log(`   • Missing: ${v}`));
    tests.push({ name: 'Turso Environment', status: 'FAIL', error: 'Missing variables' });
  }
  
  // Test 2: Cloudinary Configuration
  console.log('\n☁️  2. Testing Cloudinary Configuration...');
  try {
    const cloudinaryConfig = await cloudinaryBatchUploader.validateConfiguration();
    if (cloudinaryConfig.valid) {
      console.log('✅ Cloudinary configuration OK');
      tests.push({ name: 'Cloudinary Configuration', status: 'PASS' });
    } else {
      console.log(`❌ Cloudinary configuration failed: ${cloudinaryConfig.error}`);
      tests.push({ name: 'Cloudinary Configuration', status: 'FAIL', error: cloudinaryConfig.error });
    }
  } catch (error: any) {
    console.log(`❌ Cloudinary configuration test crashed: ${error.message}`);
    tests.push({ name: 'Cloudinary Configuration', status: 'FAIL', error: error.message });
  }
  
  // Test 3: Image Files Exist
  console.log('\n📸 3. Testing Image Files...');
  try {
    const imagesDir = join(process.cwd(), 'public', 'images', 'properties');
    const files = await readdir(imagesDir);
    const propertyImages = files.filter(f => f.startsWith('property-') && f.endsWith('.jpg'));
    
    if (propertyImages.length >= 60) { // At least 20 properties x 3 images
      console.log(`✅ Found ${propertyImages.length} property images`);
      tests.push({ name: 'Image Files', status: 'PASS' });
    } else {
      console.log(`❌ Not enough images: found ${propertyImages.length}, need at least 60`);
      tests.push({ name: 'Image Files', status: 'FAIL', error: 'Insufficient images' });
    }
  } catch (error: any) {
    console.log(`❌ Image test failed: ${error.message}`);
    tests.push({ name: 'Image Files', status: 'FAIL', error: error.message });
  }
  
  // Test 4: Test Upload to Cloudinary (small sample)
  console.log('\n🚀 4. Testing Cloudinary Upload...');
  try {
    // Look for a test image
    const testImagePath = join(process.cwd(), 'public', 'images', 'properties', 'property-1-1.jpg');
    
    try {
      await readFile(testImagePath);
    } catch (error) {
      console.log('❌ Test image not found');
      tests.push({ name: 'Cloudinary Upload Test', status: 'FAIL', error: 'Test image not found' });
      return;
    }

    // Use batch uploader for test upload
    const testUploadData = [{
      id: 'test-image-' + Date.now(),
      propertyId: 'test-property',
      imageIndex: 1,
      localPath: testImagePath
    }];

    console.log('   🚀 Uploading test image...');
    const testBatchResult = await cloudinaryBatchUploader.uploadImages(testUploadData);
    
    if (testBatchResult.successfulUploads > 0) {
      console.log(`✅ Test upload successful: ${testBatchResult.uploadedUrls[0].publicId}`);
      tests.push({ name: 'Cloudinary Upload Test', status: 'PASS' });
    } else {
      const errorMsg = testBatchResult.errors[0]?.error || 'Unknown upload error';
      console.log(`❌ Cloudinary upload test failed: ${errorMsg}`);
      tests.push({ name: 'Cloudinary Upload Test', status: 'FAIL', error: errorMsg });
    }
  } catch (error: any) {
    console.log(`❌ Cloudinary upload test crashed: ${error.message}`);
    console.log('🔍 Full error:', error);
    tests.push({ name: 'Cloudinary Upload Test', status: 'FAIL', error: error.message });
  }
  
  // Results Summary
  console.log('\n' + '='.repeat(40));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(40));
  
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });
  
  console.log(`\n📈 Total: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n❌ Some tests failed. Please fix issues before running the enhanced seed.');
    console.log('\n🔧 Recommended actions:');
    
    const cloudinaryFailed = tests.find(t => t.name.includes('Cloudinary') && t.status === 'FAIL');
    if (cloudinaryFailed) {
      console.log('   • Check your .env file for Cloudinary credentials');
      console.log('   • Verify Cloudinary account is active');
    }
    
    const tursoFailed = tests.find(t => t.name.includes('Turso') && t.status === 'FAIL');
    if (tursoFailed) {
      console.log('   • Check your .env file for Turso credentials');
      console.log('   • Verify Turso database exists');
    }
    
    const imagesFailed = tests.find(t => t.name.includes('Image') && t.status === 'FAIL');
    if (imagesFailed) {
      console.log('   • Ensure property images exist in public/images/properties/');
      console.log('   • Images should follow pattern: property-{1-20}-{1-3}.jpg');
    }
    
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Enhanced seed is ready to run.');
    console.log('\n🚀 Run the enhanced seed:');
    console.log('   Local:    pnpm seed:force');
    console.log('   Remote:   pnpm seed:force:remote');
    process.exit(0);
  }
}

// Run tests
testEnhancedSeed().catch(error => {
  console.error('💥 Test script crashed:', error);
  process.exit(1);
});