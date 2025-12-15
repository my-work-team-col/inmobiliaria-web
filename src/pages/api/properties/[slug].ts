


import type { APIRoute } from "astro";
import { db, Properties, PropertiesImages, eq, asc } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ ok: false, error: "Slug requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const property = await db
      .select()
      .from(Properties)
      .where(eq(Properties.slug, slug))
      .get();

    if (!property) {
      return new Response(JSON.stringify({ ok: false, error: "Propiedad no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ✅ Obtener imágenes relacionadas ordenadas
    const images = await db
      .select()
      .from(PropertiesImages)
      .where(eq(PropertiesImages.propertyId, property.id))
      .orderBy(asc(PropertiesImages.order));

    return new Response(JSON.stringify({ 
      ok: true, 
      property: {
        ...property,
        images  // ✅ Incluir imágenes en la respuesta
      }
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return new Response(JSON.stringify({ ok: false, error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};





// firs response draft
// import type { APIRoute } from 'astro';
// export const prerender = false;
// export const GET: APIRoute = async ({params, request}) => {

//     const slug = params.slug;

//     const body = {
//         method:'GET',
//         slug: slug,
//     };

//   return new Response(
//     JSON.stringify({ ok: true,  body}),
//     {
//       status: 200,
//       headers: { "Content-Type": "application/json" }
//     }
//   );
// };


// import type { APIRoute } from 'astro';
// export const prerender = false;
// export const GET: APIRoute = async ({params, request}) => {

//     const slug = params.slug;
    
//     const body = { 
//         method:'GET',
//         slug: slug, 
//     };

//   return new Response(
//     JSON.stringify({ ok: true,  body}),
//     {
//       status: 200,
//       headers: { "Content-Type": "application/json" }
//     }
//   );
// };
