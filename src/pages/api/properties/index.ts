import type { APIRoute } from "astro";
import { getAllProperties } from "@/lib/db/propertyQueries";

export const GET: APIRoute = async ({ url }) => {
  try {
    // Get query parameters for pagination and filtering
    const searchParams = new URL(url).searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    
    // Use the new helper function
    const result = await getAllProperties({
      page,
      limit,
      category: category || undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      search: search || undefined
    });
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error) {
    console.error('Error in properties API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};