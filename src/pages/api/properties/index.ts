import type { APIRoute } from "astro";
import { db, Properties } from "astro:db";

export const GET: APIRoute = async () => {
  const properties = await db.select().from(Properties);

  return new Response(
    JSON.stringify({ properties}),
    { status: 200 }
  );
};
