# 🍺 Beerzen - Sistema de Gestión de Contactos

Proyecto de prueba para gestión de contactos con autenticación Google y almacenamiento de fotos de tarjetas.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Configuración Inicial](#configuración-inicial)
- [Desarrollo Local](#desarrollo-local)
- [Deployment a Producción](#deployment-a-producción)
- [Variables de Entorno](#variables-de-entorno)
- [Troubleshooting](#troubleshooting)

## ✨ Características

- ✅ Autenticación con Google OAuth (Supabase Auth)
- ✅ CRUD completo de contactos
- ✅ Upload y visualización de fotos de tarjetas
- ✅ Seguridad con Row Level Security (RLS)
- ✅ Diseño responsive
- ✅ API REST con Express.js
- ✅ Frontend moderno con React + Vite

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación
- **Supabase JS Client** - Auth y Database
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Supabase** (self-hosted) - Database y Storage
- **Multer** - File uploads
- **JWT** - Token verification
- **PM2** - Process manager (producción)

### Database
- **PostgreSQL** (via Supabase)
- **Supabase Storage** - Almacenamiento de imágenes

## 📁 Estructura del Proyecto

```
beerzen/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ContactCard.jsx
│   │   │   └── ContactForm.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/        # API services
│   │   │   ├── supabase.js
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.local.example   # Frontend env template
│   ├── vite.config.js
│   └── package.json
│
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── contacts.js
│   │   │   └── upload.js
│   │   └── server.js
│   ├── .env.example         # Backend env template
│   └── package.json
│
├── database-setup.sql       # SQL para setup inicial
├── deploy.sh               # Script de deployment
└── README.md               # Este archivo
```

## 📋 Requisitos Previos

### Para Desarrollo Local:
- Node.js 18+ y npm
- Acceso a Supabase (self-hosted en `db.beerzen.com.ar`)
- Google OAuth credentials

### Para Producción:
- VPS Ubuntu con acceso SSH
- Supabase self-hosted instalado
- PM2 instalado globalmente
- Nginx configurado (proxy reverso)
- Dominio `beerzen.com.ar` apuntando al VPS

## ⚙️ Configuración Inicial

### 1. Configurar Base de Datos Supabase

Ejecutar el archivo `database-setup.sql` en el SQL Editor de Supabase:

```bash
# O ejecutar desde psql
psql -h db.beerzen.com.ar -U postgres -d postgres -f database-setup.sql
```

Esto creará:
- Tabla `contacts` con RLS habilitado
- Storage bucket `contact-cards`
- Políticas de seguridad

### 2. Configurar Google OAuth en Supabase

1. Ir a Supabase Dashboard → Authentication → Providers
2. Habilitar Google provider
3. Agregar tus credenciales de Google Cloud Console:
   - Client ID
   - Client Secret
4. Configurar redirect URL: `https://db.beerzen.com.ar/auth/v1/callback`

### 3. Variables de Entorno

#### Frontend (.env.local)

```bash
cd frontend
cp .env.local.example .env.local
```

Editar `frontend/.env.local`:
```env
VITE_SUPABASE_URL=https://db.beerzen.com.ar
VITE_SUPABASE_ANON_KEY=tu-anon-key-real
VITE_GOOGLE_CLIENT_ID=tu-google-client-id-real
VITE_API_URL=http://localhost:3030/api
```

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:
```env
NODE_ENV=development
PORT=3030
SUPABASE_URL=https://db.beerzen.com.ar
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-real
SUPABASE_JWT_SECRET=tu-jwt-secret-real
FRONTEND_URL=http://localhost:5173
STORAGE_BUCKET=contact-cards
```

### 4. Instalar Dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## 🚀 Desarrollo Local

### Opción 1: Dos terminales separadas

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Abre en: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
API en: http://localhost:3030

### Opción 2: Script combinado (opcional)

Puedes crear un script para correr ambos:

```bash
# En la raíz del proyecto
npm install -g concurrently
```

Crear `package.json` en la raíz:
```json
{
  "scripts": {
    "dev": "concurrently \"cd frontend && npm run dev\" \"cd backend && npm run dev\""
  }
}
```

Luego solo:
```bash
npm run dev
```

## 📦 Deployment a Producción

### 1. Preparar el VPS

```bash
# Conectar al VPS
ssh usuario@beerzen.com.ar

# Crear directorio
sudo mkdir -p /var/www/html/beerzen
sudo chown -R $USER:$USER /var/www/html/beerzen

# Clonar repositorio
cd /var/www/html/beerzen
git clone git@github.com:tu-usuario/beerzen.git .
```

### 2. Configurar Variables de Entorno en Producción

```bash
# Frontend
cd /var/www/html/beerzen/frontend
cp .env.local.example .env.local
nano .env.local
# Configurar con valores de producción

# Backend
cd /var/www/html/beerzen/backend
cp .env.example .env
nano .env
# Configurar con valores de producción
```

**IMPORTANTE:** Cambiar URLs a producción:
- `VITE_API_URL=https://beerzen.com.ar/api`
- `FRONTEND_URL=https://beerzen.com.ar`
- `NODE_ENV=production`

### 3. Dar Permisos al Script de Deploy

```bash
chmod +x /var/www/html/beerzen/deploy.sh
```

### 4. Ejecutar Deployment

```bash
cd /var/www/html/beerzen
./deploy.sh
```

Para forzar actualización (reset a remote):
```bash
./deploy.sh --force
```

### 5. Verificar

```bash
# Ver logs
pm2 logs beerzen.com.ar

# Ver estado
pm2 status

# Monitor en tiempo real
pm2 monit

# Health check
curl http://localhost:3030/health
```

## 🌍 Variables de Entorno

### Frontend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | URL de Supabase | `https://db.beerzen.com.ar` |
| `VITE_SUPABASE_ANON_KEY` | Anon key de Supabase | `eyJhbGc...` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789...` |
| `VITE_API_URL` | URL del backend API | `http://localhost:3030/api` |

### Backend

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `production` |
| `PORT` | Puerto del servidor | `3030` |
| `SUPABASE_URL` | URL de Supabase | `https://db.beerzen.com.ar` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGc...` |
| `SUPABASE_JWT_SECRET` | JWT secret | `tu-jwt-secret` |
| `FRONTEND_URL` | URL del frontend | `https://beerzen.com.ar` |
| `STORAGE_BUCKET` | Nombre del bucket | `contact-cards` |

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solución:** Verificar que `.env.local` (frontend) y `.env` (backend) existan y tengan todas las variables requeridas.

### Error: "Cannot connect to GitHub via SSH"

**Solución:**
```bash
# Configurar SSH key en GitHub
ssh-keygen -t ed25519 -C "tu-email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copiar y agregar en GitHub Settings → SSH Keys
```

### Error: "Port 3030 already in use"

**Solución:**
```bash
# Encontrar y matar proceso
lsof -i :3030
kill -9 [PID]

# O usar el script de deploy que lo hace automáticamente
./deploy.sh
```

### Error: "Authentication failed" en el frontend

**Posibles causas:**
1. Google OAuth no configurado en Supabase
2. Redirect URL incorrecta en Google Console
3. `VITE_GOOGLE_CLIENT_ID` incorrecto

**Solución:** Verificar configuración de Google OAuth en Supabase Dashboard.

### Error: "Token expired"

**Solución:** El token JWT expiró. El usuario debe hacer logout y login nuevamente. Supabase maneja el refresh automáticamente si está bien configurado.

### Frontend no carga en producción

**Solución:**
```bash
# Verificar que el build existe
ls -la /var/www/html/beerzen/frontend/dist

# Rebuild manualmente
cd /var/www/html/beerzen/frontend
npm run build

# Reiniciar PM2
pm2 restart beerzen.com.ar
```

### Imágenes no se suben

**Verificar:**
1. Bucket `contact-cards` existe en Supabase Storage
2. Políticas de storage están configuradas
3. `STORAGE_BUCKET` en backend/.env es correcto
4. Tamaño de imagen < 5MB

## 📝 Comandos Útiles

### PM2
```bash
pm2 status                    # Ver estado de apps
pm2 logs beerzen.com.ar      # Ver logs en tiempo real
pm2 restart beerzen.com.ar   # Reiniciar app
pm2 stop beerzen.com.ar      # Detener app
pm2 delete beerzen.com.ar    # Eliminar app de PM2
pm2 monit                     # Monitor interactivo
pm2 save                      # Guardar configuración
```

### Git
```bash
git status                    # Ver estado
git pull origin main         # Actualizar código
git log --oneline -5         # Ver últimos 5 commits
```

### npm
```bash
npm install                   # Instalar dependencias
npm run dev                   # Desarrollo
npm run build                # Build producción
```

## 🎯 Próximos Pasos (Mejoras Futuras)

- [ ] Búsqueda y filtrado de contactos
- [ ] Paginación
- [ ] Export a CSV/Excel
- [ ] Import masivo de contactos
- [ ] Categorías/etiquetas
- [ ] Campos personalizados
- [ ] Dashboard con estadísticas
- [ ] Tests unitarios
- [ ] CI/CD con GitHub Actions

## 📄 Licencia

Proyecto de prueba - Uso libre

## 👤 Autor

Desarrollado como proyecto de prueba para **beerzen.com.ar**

---

**¡Salud! 🍺**
