#!/usr/bin/env tsx

/**
 * Force seed script with Cloudinary integration
 * Usage: pnpm tsx db/scripts/force-seed-with-cloudinary.ts [--remote] [--force]
 */

import { seedWithForce } from '../seed-force';

async function main() {
  const args = process.argv.slice(2);
  const isRemote = args.includes('--remote');
  const isForce = args.includes('--force');

  console.log('🚀 Force Seed Script with Cloudinary Integration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Remote mode: ${isRemote ? 'Yes (Turso)' : 'No (Local)'}`);
  console.log(`⚡ Force mode: ${isForce ? 'Yes (will overwrite data)' : 'No (respect existing data)'}`);
  console.log('');

  try {
    const result = await seedWithForce({ remote: isRemote, force: isForce });
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (result.success) {
      console.log('🎉 FORCE SEED COMPLETED SUCCESSFULLY!');
    } else {
      console.log('❌ FORCE SEED COMPLETED WITH ERRORS!');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Execution Summary:');
    console.log(`   • Categories created: ${result.categoriesCreated}`);
    console.log(`   • Properties created: ${result.propertiesCreated}`);
    console.log(`   • Images created: ${result.imagesCreated}`);
    console.log(`   • Images uploaded to Cloudinary: ${result.imagesUploadedToCloudinary}`);
    console.log(`   • Execution time: ${(result.executionTime / 1000).toFixed(2)}s`);
    
    if (result.errors.length > 0) {
      console.log('');
      console.log('❌ Errors encountered:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (result.warnings.length > 0) {
      console.log('');
      console.log('⚠️  Warnings:');
      result.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
    
  } catch (error: any) {
    console.error('💥 Fatal error during force seed:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}