import type { APIRoute } from "astro";
import { db, Properties, PropertiesImages, asc } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Fetch all properties
    const properties = await db.select().from(Properties);

    // Fetch all images
    const allImages = await db
      .select()
      .from(PropertiesImages)
      .orderBy(asc(PropertiesImages.order));

    // Group images by propertyId
    const imagesByProperty = allImages.reduce((acc, img) => {
      if (!acc[img.propertyId]) {
        acc[img.propertyId] = [];
      }
      acc[img.propertyId].push(img);
      return acc;
    }, {} as Record<string, typeof allImages>);

    // Attach images to each property
    const propertiesWithImages = properties.map(property => ({
      ...property,
      images: imagesByProperty[property.id] || []
    }));

    return new Response(
      JSON.stringify({ properties: propertiesWithImages }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60"
        }
      }
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
    return new Response(
      JSON.stringify({ ok: false, error: "Error interno del servidor" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
