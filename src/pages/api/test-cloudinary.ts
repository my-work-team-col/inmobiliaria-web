import { cloudinaryService } from '../../src/lib/cloudinary';

export async function GET({ request }: { request: Request }) {
  try {
    // Test Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    return new Response(JSON.stringify({
      success: true,
      env_vars: {
        cloudName: cloudName ? 'SET' : 'MISSING',
        apiKey: apiKey ? 'SET' : 'MISSING',
        apiSecret: apiSecret ? 'SET' : 'MISSING',
      },
      cloudName: cloudName?.substring(0, 8) + '...',
      apiKey: apiKey?.substring(0, 8) + '...'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}