import type { APIRoute } from 'astro';
import { db, Properties } from 'astro:db';

export const GET: APIRoute = async () => {
  try {
    // Test 1: Variables de entorno
    const hasDbUrl = !!process.env.ASTRO_DB_REMOTE_URL;
    const hasDbToken = !!process.env.ASTRO_DB_APP_TOKEN;
    
    // Test 2: Contar propiedades
    let propertyCount = 0;
    let error = null;
    
    try {
      const result = await db.select().from(Properties);
      propertyCount = result.length;
    } catch (e: any) {
      error = e.message;
    }
    
    return new Response(JSON.stringify({
      success: true,
      environment: {
        hasDbUrl,
        hasDbToken,
        dbUrlPrefix: process.env.ASTRO_DB_REMOTE_URL?.substring(0, 20) + '...',
      },
      database: {
        propertyCount,
        error
      }
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
