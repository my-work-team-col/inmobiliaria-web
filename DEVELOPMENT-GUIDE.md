# Guía de Desarrollo - Inmobiliaria Web

## 🚀 Inicio Rápido

### Desarrollo Local (SIN subir a Cloudinary)

```bash
# 1. Instalar dependencias
pnpm install

# 2. Servidor de desarrollo (solo datos locales, NO crea seed)
pnpm dev
# → http://localhost:4321
```

**En modo desarrollo (`pnpm dev`):**
- ✅ NO ejecuta seed automáticamente
- ✅ NO sube imágenes a Cloudinary
- ✅ Usa base de datos SQLite local
- ✅ Consume datos existentes en `db.sqlite`

---

## 📦 Gestión de Datos

### Crear Seed con Cloudinary (Local)

```bash
# Crear 60 propiedades + subir 180 imágenes a Cloudinary
pnpm seed:force
```

**Esto hace:**
1. Crea base de datos local `db.sqlite`
2. Genera 11 categorías
3. Genera 60 propiedades con Faker
4. Sube 180 imágenes a Cloudinary (3 por propiedad)
5. Guarda URLs de Cloudinary en la BD

### Crear Seed en Turso (Remoto)

```bash
# Seed en base de datos remota Turso
pnpm seed:force:remote
```

**Requiere configurar:**
```env
ASTRO_DB_REMOTE_URL=libsql://tu-db.turso.io
ASTRO_DB_APP_TOKEN=tu-token
```

---

## 🗄️ Comandos de Base de Datos

```bash
# Ver datos en GUI (Drizzle Studio)
pnpm db:studio

# Push schema a BD local (con reset)
pnpm db:push

# Push schema a Turso remoto
pnpm astro db push --remote

# Cambiar categorías de propiedades
pnpm db:change-category

# Buscar y cambiar datos
pnpm db:search-change
```

---

## 🏗️ Build y Deploy

### Build para Producción (Turso + Cloudinary)

```bash
# Build con base de datos remota
pnpm build:remote
```

**Configuración requerida en `.env`:**
```env
ASTRO_DB_REMOTE_URL=libsql://inmobiliaria-db-xxxxx.turso.io
ASTRO_DB_APP_TOKEN=eyJhbGciOiJFZERTQSI...

CLOUDINARY_CLOUD_NAME=tu-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=tu-secret
```

### Preview del Build

```bash
pnpm preview
```

---

## 🌐 Configuración de Entornos

### `.env` - Desarrollo Local

```env
NODE_ENV=development

# Base de datos local
ASTRO_DATABASE_FILE=./db.sqlite
DATABASE_URL=sqlite:./db.sqlite

# Cloudinary (solo para seed)
CLOUDINARY_CLOUD_NAME=tu-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=tu-secret
CLOUDINARY_FOLDER=inmobiliaria/properties
```

### `.env` - Producción (Turso)

```env
NODE_ENV=production

# Turso Database
ASTRO_DB_REMOTE_URL=libsql://tu-db.turso.io
ASTRO_DB_APP_TOKEN=eyJhbGciOiJFZERTQSI...

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=tu-secret
```

---

## 📋 Workflow Recomendado

### 1. Desarrollo sin datos (primera vez)

```bash
pnpm install
pnpm dev
# ⚠️ No hay datos aún, la app mostrará vacío
```

### 2. Crear datos locales con Cloudinary

```bash
# Ejecutar seed UNA VEZ
pnpm seed:force

# Reiniciar servidor (opcional, si ya estaba corriendo)
pnpm dev
```

### 3. Desarrollo normal

```bash
# Siempre usar esto para desarrollo
pnpm dev
```

### 4. Deploy a producción

```bash
# 1. Seed en Turso remoto (una vez)
pnpm seed:force:remote

# 2. Build con conexión remota
pnpm build:remote

# 3. Deploy a Cloudflare Pages
# (configurar en Cloudflare con las variables de entorno)
```

---

## ⚠️ Importante

### ❌ NO HACER

- ❌ NO ejecutar `pnpm seed:force` en cada desarrollo
- ❌ NO commitear `db.sqlite` a git (está en `.gitignore`)
- ❌ NO usar `pnpm dev:remote` sin necesidad (consume Turso quota)

### ✅ SÍ HACER

- ✅ Ejecutar seed solo cuando necesites datos nuevos
- ✅ Usar `pnpm dev` para desarrollo normal
- ✅ Configurar variables de entorno según el ambiente
- ✅ Usar Turso solo en producción o cuando necesites compartir datos

---

## 🔧 Troubleshooting

### "No hay propiedades para mostrar"

**Solución:** Ejecuta `pnpm seed:force` para crear datos locales

### "ActionsCantBeLoaded error"

**Solución:** Verifica que `.env` no tenga comillas en las rutas:
```env
# ✅ Correcto
ASTRO_DATABASE_FILE=./db.sqlite

# ❌ Incorrecto
ASTRO_DATABASE_FILE="./db.sqlite"
```

### Imágenes no se ven

**Solución:** 
1. Verifica que `CLOUDINARY_*` esté configurado en `.env`
2. Ejecuta `pnpm seed:force` para subir imágenes

---

## 📚 Documentación Adicional

- **AGENTS.md** - Guía para AI agents
- **docs/BASE-DE-DATOS.md** - Schema completo y migraciones
- **docs/ASTRO.md** - Framework y SSR
- **docs/VUE.md** - Integración Vue
