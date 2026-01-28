import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Test Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_FOLDER;
    
    return new Response(JSON.stringify({
      success: true,
      env_vars: {
        cloudName: cloudName ? `SET (${cloudName.substring(0, 8)}...)` : 'MISSING',
        apiKey: apiKey ? `SET (${apiKey.substring(0, 8)}...)` : 'MISSING',
        apiSecret: apiSecret ? 'SET' : 'MISSING',
        folder: folder || 'MISSING',
      },
      raw_env: {
        CLOUDINARY_CLOUD_NAME: cloudName ? 'DEFINED' : 'UNDEFINED',
        CLOUDINARY_API_KEY: apiKey ? 'DEFINED' : 'UNDEFINED',
        CLOUDINARY_API_SECRET: apiSecret ? 'DEFINED' : 'UNDEFINED',
        CLOUDINARY_FOLDER: folder ? 'DEFINED' : 'UNDEFINED',
      }
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
};