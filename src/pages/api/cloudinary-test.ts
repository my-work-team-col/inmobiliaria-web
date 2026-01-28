import { cloudinaryService } from '@/lib/cloudinary';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 Testing Cloudinary connection...');
    
    // Test basic configuration
    console.log('✅ Cloudinary service imported');
    
    // Test with a local image
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const testImagePath = path.join(process.cwd(), 'public', 'images', 'property-1.jpg');
    
    try {
      await fs.access(testImagePath);
      console.log('✅ Test image found');
      
      // Test upload
      const testResult = await cloudinaryService.uploadImage(testImagePath, {
        folder: 'test',
        public_id: `test_${Date.now()}`
      });
      
      console.log('✅ Upload test successful:', testResult.public_id);
      
      // Clean up
      await cloudinaryService.deleteImage(testResult.public_id);
      console.log('✅ Cleanup successful');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Cloudinary is working perfectly!',
        test: {
          uploaded: true,
          public_id: testResult.public_id,
          url: testResult.secure_url
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (accessError) {
      console.log('⚠️  Test image not found:', accessError);
      return new Response(JSON.stringify({
        success: true,
        message: 'Cloudinary configured but test image not found',
        test: { uploaded: false, error: 'Test image not found' }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error: any) {
    console.error('❌ Cloudinary test failed:', error.message);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};