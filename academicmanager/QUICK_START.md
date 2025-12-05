# 🚀 Inicio Rápido - Academic Classroom

Guía rápida para poner en marcha tu plataforma tipo Google Classroom.

## ⚡ Pasos Rápidos

### 1. Iniciar la API (Backend)

```bash
# Navegar a la carpeta de la API
cd api

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar en modo desarrollo
npm run dev
```

✅ La API debería estar corriendo en `http://localhost:3000`

### 2. Configurar la URL de la API

Edita el archivo `js/config.js`:

```javascript
const ClassroomConfig = {
    API_URL: 'http://localhost:3000/api',  // ← Cambiar si es necesario
    // ...
};
```

### 3. Acceder a la Aplicación

Abre tu navegador y ve a:

```
http://tu-moodle.com/local/academicmanager/classroom.php
```

## 🎯 Verificación Rápida

### ¿La API está funcionando?

Abre en tu navegador:
```
http://localhost:3000/api/asignaturas
```

Deberías ver un JSON con las asignaturas.

### ¿CORS está configurado?

Abre la consola del navegador (F12) y busca errores de CORS.

Si ves errores, edita `api/src/app.js`:

```javascript
const cors = require('cors');

app.use(cors({
    origin: '*',  // En desarrollo
    credentials: true
}));
```

## 📋 Checklist de Instalación

- [ ] Node.js instalado (v14 o superior)
- [ ] API corriendo (`npm run dev` en carpeta `api`)
- [ ] Base de datos MySQL configurada
- [ ] Archivo `.env` configurado en la carpeta `api`
- [ ] CORS habilitado en la API
- [ ] URL de la API configurada en `js/config.js`
- [ ] Archivos copiados en `/local/academicmanager/`

## 🎨 Primeros Pasos en la Aplicación

### 1. Ver el Dashboard

Al abrir la aplicación, verás el dashboard con todas las asignaturas en tarjetas coloridas.

### 2. Crear un Curso

1. Click en "Nuevo Curso"
2. Ingresa el nombre y cuatrimestre
3. Click en "Crear"

### 3. Gestionar Estudiantes

1. Click en "Estudiantes" en el sidebar
2. Click en "Nuevo Estudiante"
3. Ingresa el nombre
4. Click en "Crear"

### 4. Ver Programas

1. Click en "Programas" en el sidebar
2. Verás todos los programas de estudio disponibles

## 🔧 Configuración de Producción

### 1. Cambiar URL de la API

En `js/config.js`:

```javascript
const ClassroomConfig = {
    API_URL: 'https://tu-dominio.com/api',  // URL de producción
    DEBUG: false,  // Desactivar modo debug
    // ...
};
```

### 2. Configurar CORS en Producción

En `api/src/app.js`:

```javascript
app.use(cors({
    origin: ['https://tu-moodle.com'],  // Solo tu dominio
    credentials: true
}));
```

### 3. Variables de Entorno

Edita `api/.env`:

```env
DB_HOST=tu-servidor-mysql
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_NAME=tu-base-de-datos
PORT=3000
NODE_ENV=production
```

## 🐛 Solución Rápida de Problemas

### Error: "Failed to fetch"

```bash
# 1. Verifica que la API esté corriendo
cd api
npm run dev

# 2. Verifica la URL en js/config.js
# 3. Verifica CORS en api/src/app.js
```

### Error: "Cannot GET /api/..."

```bash
# La API no está corriendo o la ruta es incorrecta
cd api
npm run dev
```

### Los estilos no se ven

```bash
# Verifica que el archivo CSS existe
ls styles/classroom.css

# Limpia la caché de Moodle
# Administración > Purgar cachés
```

## 📱 Probar en Móvil

1. Obtén tu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. Accede desde tu móvil:
   ```
   http://TU-IP/local/academicmanager/classroom.php
   ```

3. Asegúrate de que la API también sea accesible desde la red local.

## 🎓 Funcionalidades Principales

### Dashboard
- ✅ Ver todos los cursos
- ✅ Crear nuevos cursos
- ✅ Acceder a detalles de curso

### Estudiantes
- ✅ Lista completa de estudiantes
- ✅ Crear estudiante
- ✅ Editar estudiante
- ✅ Eliminar estudiante

### Cursos
- ✅ CRUD completo de asignaturas
- ✅ Vista de detalles
- ✅ Información de cuatrimestre

### Programas
- ✅ Lista de programas de estudio
- ✅ Ver detalles de programa
- ✅ Gestionar asignaturas por programa

## 📚 Recursos Adicionales

- **Documentación API**: `api/README.md`
- **Documentación Completa**: `CLASSROOM_README.md`
- **Swagger API Docs**: `http://localhost:3000/api-docs`

## 💡 Tips

1. **Usa la consola del navegador** (F12) para ver logs y errores
2. **Revisa la pestaña Network** para ver las peticiones a la API
3. **Activa DEBUG en config.js** durante el desarrollo
4. **Usa Postman** para probar los endpoints de la API

## 🎉 ¡Listo!

Tu plataforma tipo Google Classroom está lista para usar. Explora las diferentes secciones y personaliza según tus necesidades.

## 📞 ¿Necesitas Ayuda?

1. Revisa `CLASSROOM_README.md` para documentación completa
2. Verifica los logs de la consola del navegador
3. Revisa los logs de la API en la terminal
4. Asegúrate de que todos los servicios estén corriendo

---

**¡Disfruta tu nueva plataforma Academic Classroom! 🎓**
