import type { APIRoute } from 'astro';
import { db, PropertiesImages, sql } from 'astro:db';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 Investigating duplicate images...');
    
    // Query 1: Count total vs unique
    const allImages = await db.select().from(PropertiesImages).all();
    const totalCount = allImages.length;
    const uniqueImageCount = new Set(allImages.map(img => img.image)).size;
    
    // Query 2: Find duplicates by image path
    const duplicateGroupsQuery = sql`
      SELECT 
        image,
        COUNT(*) as duplicate_count,
        GROUP_CONCAT(id) as duplicate_ids,
        GROUP_CONCAT(propertyId) as property_ids
      FROM ${PropertiesImages}
      GROUP BY image 
      HAVING COUNT(*) > 1 
      ORDER BY duplicate_count DESC
    `;
    const duplicateGroups = await db.run(duplicateGroupsQuery);
    
    // Query 3: Analyze by property
    const propertyAnalysisQuery = sql`
      SELECT 
        propertyId,
        COUNT(*) as total_records,
        COUNT(DISTINCT image) as unique_images
      FROM ${PropertiesImages}
      GROUP BY propertyId 
      HAVING COUNT(*) > COUNT(DISTINCT image)
      ORDER BY (COUNT(*) - COUNT(DISTINCT image)) DESC
    `;
    const propertyAnalysis = await db.run(propertyAnalysisQuery);
    
    return Response.json({
      success: true,
      analysis: {
        summary: {
          total_records: totalCount,
          unique_images: uniqueImageCount,
          duplicate_records: totalCount - uniqueImageCount,
          duplicate_percentage: ((totalCount - uniqueImageCount) / totalCount * 100).toFixed(2) + '%'
        },
        duplicate_groups: duplicateGroups.rows || [],
        property_analysis: propertyAnalysis.rows || [],
        recommendations: {
          immediate: "Run SQL cleanup to remove duplicates",
          prevention: "Check seed script for duplicate generation",
          migration_impact: "44 duplicate uploads will waste Cloudinary storage"
        }
      }
    });
    
  } catch (error: any) {
    console.error('❌ Duplicate investigation failed:', error.message);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🧹 Cleaning duplicate images...');
    
    // Safe cleanup: Keep first occurrence of each image
    const cleanupQuery = sql`
      DELETE FROM ${PropertiesImages} 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM ${PropertiesImages} 
        GROUP BY image
      )
    `;
    const cleanupResult = await db.run(cleanupQuery);
    
    // Verify cleanup
    const remainingCount = await db.select().from(PropertiesImages).all();
    const uniqueRemaining = new Set(remainingCount.map(img => img.image)).size;
    
    return Response.json({
      success: true,
      cleanup_result: {
        deleted_records: cleanupResult.rowsAffected || 0,
        remaining_total: remainingCount.length,
        remaining_unique: uniqueRemaining,
        duplicates_removed: (remainingCount.length - uniqueRemaining),
        is_clean: remainingCount.length === uniqueRemaining
      },
      verification: {
        should_match_files: 60,
        status: uniqueRemaining === 60 ? '✅ PERFECT' : '⚠️ NEEDS INVESTIGATION',
        message: uniqueRemaining === 60 
          ? 'All duplicates removed successfully' 
          : `Still have ${remainingCount.length - uniqueRemaining} duplicates to investigate`
      }
    });
    
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error.message);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
};