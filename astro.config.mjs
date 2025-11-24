// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
<<<<<<< HEAD

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
=======
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
    integrations: [icon()],
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@": "/src"
            }
        }
    }
>>>>>>> yormi
});