


import type { APIRoute } from "astro";
import { db, Properties, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ ok: false, error: "Slug requerido" }), {
      status: 400,
    });
  }

  const property = await db
    .select()
    .from(Properties)
    .where(eq(Properties.slug, slug))
    .get();

  if (!property) {
    return new Response(JSON.stringify({ ok: false, error: "Propiedad no encontrada" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ ok: true, property }), {
    status: 200,
  });
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
