# 🚀 Guía de Deployment a Cloudflare Pages

Guía paso a paso para desplegar la aplicación Inmobiliaria Web a Cloudflare Pages con Turso Database.

**Fecha:** 28 de enero de 2026  
**Entorno:** Cloudflare Pages + Turso (SQLite remoto)

---

## 📋 Pre-requisitos

Antes de comenzar, verifica que tienes:

- ✅ Cuenta de Cloudflare (gratuita)
- ✅ Cuenta de Turso con BD creada (`inmobiliaria-db-criba833`)
- ✅ Variables de entorno en `.env` configuradas
- ✅ Proyecto funcionando localmente con `pnpm dev`
- ✅ Cloudinary configurado con imágenes subidas
- ✅ Git instalado y repositorio en GitHub (opcional para auto-deploy)

---

## 🔍 Verificación Inicial

```bash
# 1. Verificar que no hay errores TypeScript
pnpm astro check

# 2. Verificar que el proyecto compila
pnpm build:remote

# 3. Si hay errores, corregir antes de continuar
```

**Resultado esperado:** `0 errors, 0 warnings`

---

## 📊 PASO 1: Poblar Base de Datos Turso

Antes de desplegar, necesitas subir los datos a Turso Cloud.

### Opción A: Push Schema + Seed Automático (Recomendado)

```bash
# Resetear BD remota y ejecutar seed
pnpm astro db push --remote --force-reset
```

**Esto hará:**
1. Conectar a Turso (`inmobiliaria-db-criba833`)
2. Eliminar datos existentes (si hay)
3. Crear schema (7 tablas)
4. Ejecutar `db/seed.ts` automáticamente
5. Crear 11 categorías + 60 propiedades + 180 imágenes

**Tiempo estimado:** 3-5 minutos

### Opción B: Verificar Datos Existentes

Si ya tienes datos en Turso y solo quieres verificar:

```bash
# Abrir GUI de BD remota
pnpm astro db studio --remote
```

**Verificar:**
- `Categories`: 11 registros
- `Properties`: 60 registros
- `PropertiesImages`: 180 registros

---

## 🏗️ PASO 2: Build para Producción

```bash
# Build con base de datos remota
pnpm build:remote
```

**Esto generará:**
- Carpeta `dist/` con archivos optimizados
- Worker de Cloudflare (`dist/_worker.js/`)
- Assets estáticos en `dist/_astro/`

**Resultado esperado:**
```
✓ Built in XXXms
✓ Checking for errors...
```

### Verificación del Build

```bash
# Ver contenido generado
ls -la dist/

# Debe contener:
# - _worker.js/       → Cloudflare Worker
# - _astro/           → CSS, JS optimizados
# - index.html        → Páginas HTML
```

---

## 🌐 PASO 3A: Deploy via Wrangler CLI (Opción Rápida)

### Instalar Wrangler

```bash
# Instalar globalmente
npm install -g wrangler

# Verificar instalación
wrangler --version
```

### Login a Cloudflare

```bash
wrangler login
```

Esto abrirá tu navegador para autorizar. Acepta el permiso.

### Deploy

```bash
# Desde la raíz del proyecto
wrangler pages deploy dist/
```

**Primera vez preguntará:**
```
? Enter the name of your new project: 
```

Responde: `inmobiliaria-web` (o el nombre que prefieras)

**Resultado esperado:**
```
✨ Success! Uploaded X files
✨ Deployment complete!
🌍 View your site at: https://inmobiliaria-web-xxx.pages.dev
```

**⚠️ IMPORTANTE:** Guarda la URL generada, la necesitarás para agregar variables de entorno.

---

## 🌐 PASO 3B: Deploy via GitHub (Recomendado para CI/CD)

Esta opción permite deploy automático cada vez que haces push a GitHub.

### 1. Push a GitHub

```bash
# Si no tienes repo remoto, créalo en github.com primero
git remote add origin https://github.com/tu-usuario/inmobiliaria-web.git

# Commitear cambios pendientes
git add .
git commit -m "Configure for Cloudflare deployment"

# Push
git push -u origin main
```

### 2. Conectar Cloudflare con GitHub

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navega a: **Workers & Pages** → **Create Application**
3. Click: **Pages** → **Connect to Git**
4. Autoriza Cloudflare en GitHub
5. Selecciona tu repositorio: `inmobiliaria-web`

### 3. Configurar Build Settings

En la página de configuración, ingresa:

| Campo | Valor |
|-------|-------|
| **Project name** | `inmobiliaria-web` |
| **Production branch** | `main` |
| **Framework preset** | Astro |
| **Build command** | `pnpm build:remote` |
| **Build output directory** | `dist` |

### 4. NO hagas deploy todavía

Click en **Save and Deploy** pero CANCELA inmediatamente. Primero necesitas agregar variables de entorno.

---

## 🔐 PASO 4: Configurar Variables de Entorno

**Cloudflare Dashboard:**
1. Ve a tu proyecto: **Workers & Pages** → `inmobiliaria-web`
2. Click en **Settings** → **Environment Variables**
3. Agregar las siguientes variables:

### Variables Requeridas

| Variable | Valor | Entorno |
|----------|-------|---------|
| `ASTRO_DB_REMOTE_URL` | `libsql://inmobiliaria-db-criba833.aws-us-east-1.turso.io` | Production |
| `ASTRO_DB_APP_TOKEN` | `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...` (tu token completo) | Production |
| `CLOUDINARY_CLOUD_NAME` | `criba833` | Production |
| `CLOUDINARY_API_KEY` | `699845276937428` | Production |
| `CLOUDINARY_API_SECRET` | `1ulKPV4R0boXUGSqStF1VNtQNFM` | Production |
| `CLOUDINARY_FOLDER` | `inmobiliaria/properties` | Production |
| `NODE_ENV` | `production` | Production |

**⚠️ IMPORTANTE:** 
- Marca todas como **Production** environment
- **NO** marques **Preview** a menos que necesites testing
- Guarda cada variable después de agregarla

### Copiar desde Terminal (Rápido)

```bash
# Ver variables en .env
cat .env | grep -E "ASTRO_DB|CLOUDINARY"
```

---

## 🎯 PASO 5: Ejecutar Deployment

### Si usaste Wrangler CLI:

Ya está deployado, pero necesitas agregar las variables:

```bash
# Agregar variables via CLI
wrangler pages secret put ASTRO_DB_REMOTE_URL
# Pega el valor cuando pregunte

wrangler pages secret put ASTRO_DB_APP_TOKEN
# Pega el token

# Repetir para cada variable...
```

### Si usaste GitHub:

1. Ve a **Deployments** en Cloudflare Dashboard
2. Click en **Retry deployment** (ahora que tienes las variables)
3. O simplemente haz un nuevo push:

```bash
git commit --allow-empty -m "Trigger deployment"
git push
```

**Tiempo de build:** 2-3 minutos

---

## ✅ PASO 6: Verificación del Deployment

### 1. Verificar Build Exitoso

En Cloudflare Dashboard:
- **Deployments** → Ver estado: **Success** ✅
- Click en el deployment para ver logs

### 2. Abrir tu Aplicación

URL de producción:
```
https://inmobiliaria-web-xxx.pages.dev
```

O si configuraste dominio custom:
```
https://tu-dominio.com
```

### 3. Verificar Funcionalidades

**Checklist:**
- ✅ Página principal carga correctamente
- ✅ Listado de propiedades muestra 60 items
- ✅ Imágenes de Cloudinary cargan
- ✅ Filtros por categoría funcionan
- ✅ Detalle de propiedad funciona
- ✅ Sin errores en consola del navegador

### 4. Verificar Base de Datos

```bash
# Ver logs de Cloudflare Worker (si hay errores de BD)
wrangler pages deployment tail
```

---

## 🔧 Troubleshooting

### Error: "Failed to connect to database"

**Causa:** Variables de entorno no configuradas correctamente

**Solución:**
```bash
# Verificar que las variables existan
wrangler pages secret list

# Actualizar si es necesario
wrangler pages secret put ASTRO_DB_REMOTE_URL
```

### Error: "Module not found"

**Causa:** Build incorrecto o falta `pnpm install`

**Solución:**
```bash
# Limpiar y rebuild
rm -rf dist/ node_modules/.astro
pnpm install
pnpm build:remote
wrangler pages deploy dist/
```

### Error: "Image not loading from Cloudinary"

**Causa:** Variables de Cloudinary incorrectas o URLs mal formadas

**Solución:**
1. Verificar variables en Cloudflare Dashboard
2. Verificar que las URLs en BD tengan formato:
   ```
   https://res.cloudinary.com/criba833/image/upload/v1234567890/inmobiliaria/properties/xxx.jpg
   ```

### Error: "Database locked" o timeout

**Causa:** Turso tiene límite de conexiones concurrentes

**Solución:**
```bash
# Verificar estado de Turso
turso db show inmobiliaria-db-criba833

# Reiniciar BD si es necesario (sin perder datos)
turso db wakeup inmobiliaria-db-criba833
```

### Las propiedades no aparecen

**Causa:** BD remota vacía o sin seed

**Solución:**
```bash
# Re-ejecutar seed en remoto
pnpm astro db push --remote --force-reset
```

---

## 🔄 Workflow Post-Deploy

### Hacer cambios y re-deployar

```bash
# 1. Hacer cambios en código
# 2. Commitear
git add .
git commit -m "Update: descripción del cambio"
git push

# GitHub auto-deployará a Cloudflare en 2-3 minutos
```

### Actualizar solo datos (sin re-deploy)

```bash
# Ejecutar seed en remoto
pnpm astro db push --remote --force-reset
```

### Ver logs en tiempo real

```bash
wrangler pages deployment tail
```

### Rollback a versión anterior

En Cloudflare Dashboard:
1. **Deployments** → Seleccionar deployment antiguo
2. Click en **Rollback to this deployment**

---

## 📊 Monitoreo y Analytics

### Cloudflare Analytics

En Dashboard → **Analytics**:
- Requests por día
- Bandwidth usage
- Error rate
- Response time

### Database Analytics (Turso)

```bash
# Via CLI de Turso
turso db inspect inmobiliaria-db-criba833
```

---

## 🎉 ¡Deployment Completado!

Tu aplicación ahora está en producción con:
- ✅ Cloudflare Pages (CDN global)
- ✅ Turso Database (SQLite distribuido)
- ✅ Cloudinary (180 imágenes optimizadas)
- ✅ SSL/HTTPS automático
- ✅ Auto-deploy desde GitHub

**URLs importantes:**
- Producción: `https://inmobiliaria-web-xxx.pages.dev`
- Dashboard: `https://dash.cloudflare.com/`
- DB Studio: `pnpm astro db studio --remote`

---

## 📚 Recursos Adicionales

- [Documentación Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Documentación Astro DB](https://docs.astro.build/en/guides/astro-db/)
- [Documentación Turso](https://docs.turso.tech/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Mantenedores:** Didier Méndez, Yormi Altamiranda  
**Última actualización:** 28 de enero de 2026
