# Astro Migration Guide: From SSG to SSR

This document summarizes the architectural shift made in the project, moving from **Static Site Generation (SSG)** to **Server-Side Rendering (SSR)** for property listings and detail pages. It also describes the reasoning, implementation steps, and future direction toward **Astro Actions**.

---

## 📌 Overview

The project previously relied on:

* **SSG** via `getStaticPaths()` for property detail pages.
* **Local JSON mock data** for listing and detail rendering.

We have now migrated to:

* **SSR dynamically rendered pages**.
* **Astro DB** as the source of truth.
* **Dynamic API endpoints**: `/api/properties`, `/api/properties/[slug]`, `/api/properties/[propertyId]`.

This enables:

* Real‑time DB queries.
* No need for pre‑generated static paths.
* Ability to manage large datasets without build‑time indexing.
* Cleaner and predictable URL structure.

---

## 🔄 What Changed?

### 1. **Removed `getStaticPaths()` usage**

Instead of generating pages at build time, route files now use **SSR** (default in Astro when `prerender = false`).

**Before:**

```ts
export const getStaticPaths = async () => {
  return listings.map((listing) => ({
    params: { slug: listing.slug },
    props: { listing },
  }));
};
```

**Now:**

* Property detail pages fetch their data at runtime from a real endpoint.
* No pre-generation.

---

### 2. **Enabled SSR per route**

Inside API routes we set:

```ts
export const prerender = false;
```

This ensures:

* Page is rendered on-the-fly.
* Data stays synchronized with the database.

---

### 3. **New API Endpoints**

The following endpoints were created:

#### **`GET /api/properties`**

Returns all properties from Astro DB.

#### **`GET /api/properties/[propertyId]`**

Fetches property by numerical ID.

#### **`GET /api/properties/[slug]`**

Fetches property by slug.

Example implementation:

```ts
import type { APIRoute } from "astro";
import { db, Properties, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  const property = await db
    .select()
    .from(Properties)
    .where(eq(Properties.slug, slug))
    .get();

  return new Response(JSON.stringify({ ok: true, property }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

---

## 🧩 Frontend Adjustments

### Listing Page: `/listing/index.astro`

Now fetching from DB via API:

```ts
const res = await fetch("http://localhost:4321/api/properties");
const { properties } = await res.json();
```

### Property Page: `/listing/[slug].astro`

SSR load:

```ts
const res = await fetch(`http://localhost:4321/api/properties/${Astro.params.slug}`);
const { property } = await res.json();
```

Then render:

```astro
<PropertyDetails property={property} />
```

---

## 🔮 Future Direction: Migrating to Astro Actions

We plan to replace API endpoints with **Astro Actions**, which would:

* Remove the need to fetch via network calls.
* Provide server‑validated schemas.
* Automatically integrate with forms.
* Improve DX with type safety.

### Example (future syntax):

```ts
export const actions = {
  getProperty: defineAction({
    input: z.string(),
    handler: async (slug) => {
      return db.select().from(Properties).where(eq(Properties.slug, slug)).get();
    }
  })
};
```

This transition will be implemented after stabilizing the SSR workflow.

---

## 📁 File Structure Summary

```
/api
  /properties
    index.ts
    [slug].ts
    [propertyId].ts
/listing
  index.astro
  [slug].astro
```

---

## ✅ Conclusion

This migration:

* Simplifies data flow.
* Enables real-time, DB-backed rendering.
* Prepares the project for a smooth transition to **Astro Actions**.

SSG is no longer required, and the system now relies fully on SSR + Astro DB.

If you'd like, I can also prepare:

* A visual architecture diagram
* Migration checklist
* Developer onboarding doc
