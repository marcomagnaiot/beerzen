# 🚀 Comandos Rápidos - Beerzen

## ⚡ Quick Start

### Desarrollo Local (2 terminales)

**Terminal 1 - Backend:**
```bash
cd C:\Users\NOTEBOOK\Documents\ServerWasap\beerzen\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\NOTEBOOK\Documents\ServerWasap\beerzen\frontend
npm run dev
```

Luego abrir: http://localhost:5173

---

## 📦 Instalación

### Primera vez (Instalar dependencias)

```bash
# Frontend
cd C:\Users\NOTEBOOK\Documents\ServerWasap\beerzen\frontend
npm install

# Backend
cd C:\Users\NOTEBOOK\Documents\ServerWasap\beerzen\backend
npm install
```

---

## 🔧 Comandos por Carpeta

### Frontend (beerzen/frontend/)

```bash
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Backend (beerzen/backend/)

```bash
# Desarrollo (con auto-restart)
npm run dev

# Producción
npm start
```

---

## 🐛 Troubleshooting

### Error: "Cannot find package.json"

**Problema:** Estás en la carpeta equivocada

**Solución:** Navegar a la carpeta correcta:
- Para frontend: `cd beerzen/frontend`
- Para backend: `cd beerzen/backend`

### Error: "Port 3030 already in use"

```bash
# Windows - Encontrar el proceso
netstat -ano | findstr :3030

# Matar el proceso
taskkill /PID [número_del_pid] /F
```

### Error: "Port 5173 already in use"

```bash
# Windows - Encontrar el proceso
netstat -ano | findstr :5173

# Matar el proceso
taskkill /PID [número_del_pid] /F
```

### Limpiar cache de npm

```bash
# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 🗄️ Base de Datos

### Ejecutar Setup SQL

**Desde Supabase Dashboard:**
1. Ir a: https://db.beerzen.com.ar
2. SQL Editor
3. Copiar contenido de `database-setup.sql`
4. Ejecutar

**O desde línea de comandos:**
```bash
psql -h db.beerzen.com.ar -U postgres -d postgres -f database-setup.sql
```

---

## 🚀 Deployment (Producción)

### En el VPS

```bash
# Conectar al VPS
ssh usuario@beerzen.com.ar

# Ir al directorio
cd /var/www/html/beerzen

# Pull latest changes
git pull origin main

# Ejecutar deploy
./deploy.sh
```

### Deploy forzado (reset completo)

```bash
./deploy.sh --force
```

---

## 📊 PM2 (Producción)

```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs beerzen.com.ar

# Reiniciar
pm2 restart beerzen.com.ar

# Detener
pm2 stop beerzen.com.ar

# Monitor interactivo
pm2 monit

# Guardar configuración
pm2 save
```

---

## 🔍 Verificar que todo funcione

### Health Check del Backend

```bash
# Desarrollo
curl http://localhost:3030/health

# Producción
curl https://beerzen.com.ar/health
```

### Verificar Frontend

```bash
# Desarrollo
# Abrir http://localhost:5173

# Producción
# Abrir https://beerzen.com.ar
```

---

## 🌐 URLs Importantes

| Servicio | URL |
|----------|-----|
| Frontend (dev) | http://localhost:5173 |
| Backend (dev) | http://localhost:3030 |
| Supabase Dashboard | https://db.beerzen.com.ar |
| Producción | https://beerzen.com.ar |
| Google Cloud Console | https://console.cloud.google.com |

---

## 📝 Variables de Entorno

### Verificar que existan los archivos:

```bash
# Frontend
ls frontend/.env.local

# Backend
ls backend/.env
```

### Si no existen, copiar desde los ejemplos:

```bash
# Frontend
cp frontend/.env.local.example frontend/.env.local
# Luego editar con tus credenciales

# Backend
cp backend/.env.example backend/.env
# Luego editar con tus credenciales
```

---

## 🔄 Flujo de Trabajo Típico

### Cada vez que trabajes en el proyecto:

1. **Abrir 2 terminales**

2. **Terminal 1 - Backend:**
   ```bash
   cd C:\Users\NOTEBOOK\Documents\ServerWasap\beerzen\backend
   npm run dev
   ```

3. **Terminal 2 - Frontend:**
   ```bash
   cd C:\Users\NOTEBOOK\Documents\ServerWasap\beerzen\frontend
   npm run dev
   ```

4. **Navegar a:** http://localhost:5173

5. **Trabajar normalmente** (los cambios se refrescan automáticamente)

6. **Para detener:** `Ctrl + C` en ambas terminales

---

## 🎨 Editar Código

### Frontend:
- Componentes: `frontend/src/components/`
- Páginas: `frontend/src/pages/`
- Servicios: `frontend/src/services/`
- Estilos: Archivos `.css` en cada carpeta

### Backend:
- Rutas API: `backend/src/routes/`
- Middleware: `backend/src/middleware/`
- Config: `backend/src/config/`

---

## ⚠️ Errores Comunes

### "Missing Supabase environment variables"

✅ **Solución:** Verificar que existen:
- `frontend/.env.local` ✅ (ya existe con tus credenciales)
- `backend/.env` ✅ (ya existe con tus credenciales)

### "Authentication failed"

✅ **Solución:**
1. Verificar que Google OAuth esté configurado en Supabase
2. Verificar credenciales en `.env.local`

### "Cannot connect to database"

✅ **Solución:**
1. Verificar que `SUPABASE_URL` sea correcto
2. Verificar que el VPS de Supabase esté corriendo

---

## 💾 Git

### Inicializar repositorio

```bash
cd C:\Users\NOTEBOOK\Documents\ServerWasap\beerzen

git init
git add .
git commit -m "Initial commit - Beerzen project"
```

### Conectar con GitHub

```bash
# Crear repo en GitHub primero, luego:
git remote add origin git@github.com:tu-usuario/beerzen.git
git branch -M main
git push -u origin main
```

### Workflow normal

```bash
# Antes de trabajar
git pull origin main

# Después de trabajar
git add .
git commit -m "Descripción de cambios"
git push origin main
```

---

## 🆘 Ayuda Rápida

| Problema | Comando |
|----------|---------|
| Ver procesos en puerto 3030 | `netstat -ano \| findstr :3030` |
| Ver procesos en puerto 5173 | `netstat -ano \| findstr :5173` |
| Reinstalar dependencias | `rm -rf node_modules && npm install` |
| Ver logs de PM2 | `pm2 logs beerzen.com.ar` |
| Health check | `curl http://localhost:3030/health` |

---

**¡Todo listo para desarrollar! 🍺**
