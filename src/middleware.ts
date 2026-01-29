import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // En Netlify, process.env funciona normalmente
  // Este middleware ya no es necesario pero lo dejamos por compatibilidad
  return next();
});
