#!/usr/bin/env tsx

/**
 * Enhanced Seed CLI with Turso Cloud Synchronization
 * 
 * Usage:
 *   pnpm seed:force           # Force overwrite local database
 *   pnpm seed:force:remote    # Force overwrite remote Turso database
 *   tsx db/scripts/enhanced-seed.ts --force --remote
 */

import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
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
}

<<<<<<< HEAD
import { seed } from '../seed';
=======
import seed from '../seed';
>>>>>>> 1cc2763 (feat: Implement Turso Cloud Data Synchronization Fix)

async function main() {
  console.log('🚀 Enhanced Seed - Turso Cloud Synchronization');
  console.log('='.repeat(50));
  
  try {
    // Check command line arguments
    const forceMode = process.argv.includes('--force');
    const remoteMode = process.argv.includes('--remote');
    
    if (!forceMode) {
      console.log('❌ ERROR: --force flag is required for this enhanced seed');
      console.log('   This script performs a complete database reset with Cloudinary upload.');
      console.log('   Use: pnpm seed:force OR pnpm seed:force:remote');
      process.exit(1);
    }
    
    if (remoteMode) {
      console.log('🌐 REMOTE MODE: Synchronizing with Turso Cloud');
      
      // Validate environment for remote connection
      console.log('🔍 Validando entorno de conexión remota...');
      
      if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
        console.log('❌ ERROR: Missing Turso environment variables');
        console.log('   Required: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN');
        console.log('   Check your .env file or Turso configuration.');
        process.exit(1);
      }
      
      if (!process.env.CLOUDINARY_CLOUD_NAME || 
          !process.env.CLOUDINARY_API_KEY || 
          !process.env.CLOUDINARY_API_SECRET) {
        console.log('❌ ERROR: Missing Cloudinary environment variables');
        console.log('   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
        console.log('   Check your .env file or Cloudinary configuration.');
        process.exit(1);
      }
      
      console.log('✅ Variables de entorno validadas\n');
    } else {
      console.log('📁 LOCAL MODE: Working with local database');
      
      if (!process.env.CLOUDINARY_CLOUD_NAME || 
          !process.env.CLOUDINARY_API_KEY || 
          !process.env.CLOUDINARY_API_SECRET) {
        console.log('❌ ERROR: Missing Cloudinary environment variables');
        console.log('   Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
        console.log('   Check your .env file or Cloudinary configuration.');
        process.exit(1);
      }
      
      console.log('✅ Variables de entorno validadas\n');
    }
    
    // Show warning for force mode
    console.log('⚠️  WARNING: --force mode enabled');
    console.log('   This will completely erase and recreate all data:');
    console.log('   • All Categories will be deleted');
    console.log('   • All Properties will be deleted');
    console.log('   • All Images will be deleted');
    console.log('   • New data will be generated and uploaded to Cloudinary');
    console.log();
    
    if (remoteMode) {
      console.log('🌍 TARGET: Turso Remote Database');
    } else {
      console.log('🏠 TARGET: Local Database');
    }
    console.log();
    
    // Wait for user confirmation (unless we're in CI/non-interactive)
    if (process.stdout.isTTY && !process.env.CI) {
      console.log('⏳ Waiting 5 seconds to cancel... Press Ctrl+C to abort');
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('🚀 Proceeding with seed execution...\n');
    }
    
    // Execute the enhanced seed
    const result = await seed();
    
    if (result.success) {
      console.log('\n🎉 SEED EXECUTION COMPLETED SUCCESSFULLY!');
      
      if (remoteMode) {
        console.log('\n🌐 Turso Cloud Synchronization:');
        console.log('   ✅ Remote database updated');
        console.log('   ✅ All images uploaded to Cloudinary');
        console.log('   ✅ PropertiesImages populated with Cloudinary URLs');
        console.log('\n📝 Next steps:');
        console.log('   1. Verify data in Turso Cloud Dashboard');
        console.log('   2. Test the application with: pnpm dev:remote');
        console.log('   3. Check image loading from Cloudinary CDN');
      } else {
        console.log('\n📁 Local Database Updated:');
        console.log('   ✅ Local database reset');
        console.log('   ✅ All images uploaded to Cloudinary');
        console.log('   ✅ PropertiesImages populated with Cloudinary URLs');
        console.log('\n📝 Next steps:');
        console.log('   1. Test with: pnpm dev');
        console.log('   2. Verify images load from Cloudinary');
        console.log('   3. When ready, sync to remote: pnpm astro db push --remote');
      }
      
      console.log(`\n⏱️  Total execution time: ${result.executionTime}ms`);
      
      if (result.warnings.length > 0) {
        console.log('\n⚠️  Warnings (non-critical):');
<<<<<<< HEAD
        result.warnings.forEach(warning => console.log(`   • ${warning}`));
=======
        result.warnings.forEach((warning: string) => console.log(`   • ${warning}`));
>>>>>>> 1cc2763 (feat: Implement Turso Cloud Data Synchronization Fix)
      }
      
      process.exit(0);
    } else {
      console.log('\n💥 SEED EXECUTION FAILED!');
      console.log('Check the error messages above for details.');
      console.log('\n🔧 Troubleshooting:');
      console.log('   • Check Cloudinary credentials');
      console.log('   • Verify image files exist in public/images/properties/');
      console.log('   • Check network connection');
      console.log('   • Verify Turso connection (if remote mode)');
      
      if (result.errors.length > 0) {
        console.log('\n❌ Errors:');
<<<<<<< HEAD
        result.errors.forEach(error => console.log(`   • ${error}`));
=======
        result.errors.forEach((error: string) => console.log(`   • ${error}`));
>>>>>>> 1cc2763 (feat: Implement Turso Cloud Data Synchronization Fix)
      }
      
      process.exit(1);
    }
    
  } catch (error: any) {
    console.error('\n💥 UNEXPECTED ERROR:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Script crashed:', error);
  process.exit(1);
});