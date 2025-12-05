# 📁 Estructura del Proyecto - Academic Classroom

## Estructura Completa

```
/local/academicmanager/
│
├── 📄 classroom.php              # Punto de entrada principal (Moodle)
├── 📄 demo.html                  # Demo standalone (sin Moodle)
├── 📄 index.php                  # Interfaz anterior (legacy)
│
├── 📂 js/                        # JavaScript
│   ├── api-client.js            # Cliente HTTP para consumir API REST
│   ├── classroom-app.js         # Aplicación principal tipo Classroom
│   ├── config.js                # Configuración centralizada
│   ├── app.js                   # Aplicación legacy
│   ├── routes.js                # Sistema de rutas legacy
│   ├── config-manager.js        # Gestor de configuración legacy
│   ├── mustache-renderer.js     # Renderizador Mustache legacy
│   ├── ui-renderer.js           # Renderizador UI legacy
│   ├── moodle-api.js            # API Moodle legacy
│   └── 📂 components/           # Componentes reutilizables
│
├── 📂 styles/                    # Estilos CSS
│   ├── classroom.css            # Estilos tipo Google Classroom ⭐
│   ├── main.css                 # Estilos principales legacy
│   ├── concurrent.css           # Estilos concurrentes legacy
│   └── 📂 components/           # Estilos de componentes
│
├── 📂 templates/                 # Templates Mustache legacy
│   ├── main-interface.mustache
│   ├── admin-panel.mustache
│   ├── bulk-actions.mustache
│   ├── results.mustache
│   ├── selection.mustache
│   ├── subjects.mustache
│   └── 📂 forms/
│
├── 📂 mustache/                  # Templates Mustache legacy
│   └── (archivos .mustache)
│
├── 📂 api/                       # Backend API REST (Node.js)
│   ├── 📄 package.json
│   ├── 📄 .env
│   ├── 📄 .env.example
│   ├── 📄 database.sql
│   ├── 📄 README.md
│   │
│   └── 📂 src/
│       ├── app.js               # Punto de entrada de la API
│       ├── 📂 config/           # Configuración
│       ├── 📂 controllers/      # Controladores
│       ├── 📂 services/         # Lógica de negocio
│       ├── 📂 repositories/     # Acceso a datos
│       ├── 📂 routes/           # Rutas de la API
│       └── 📂 middlewares/      # Middlewares
│
├── 📂 db/                        # Base de datos legacy
│   └── access.php
│
├── 📂 lang/                      # Traducciones
│   └── 📂 en/
│
├── 📄 lib.php                    # Funciones de Moodle
├── 📄 version.php                # Versión del plugin
├── 📄 test.php                   # Archivo de pruebas
│
└── 📚 Documentación
    ├── CLASSROOM_README.md       # Documentación completa ⭐
    ├── QUICK_START.md            # Guía de inicio rápido ⭐
    ├── EXAMPLES.md               # Ejemplos de uso ⭐
    └── PROJECT_STRUCTURE.md      # Este archivo ⭐
```

## 🎯 Archivos Principales del Nuevo Sistema

### Frontend (Classroom)

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| `classroom.php` | Punto de entrada para Moodle | ⭐⭐⭐ |
| `demo.html` | Demo standalone sin Moodle | ⭐⭐ |
| `js/classroom-app.js` | Aplicación principal | ⭐⭐⭐ |
| `js/api-client.js` | Cliente HTTP para API | ⭐⭐⭐ |
| `js/config.js` | Configuración | ⭐⭐⭐ |
| `styles/classroom.css` | Estilos tipo Classroom | ⭐⭐⭐ |

### Backend (API)

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| `api/src/app.js` | Servidor Express | ⭐⭐⭐ |
| `api/src/routes/` | Definición de endpoints | ⭐⭐⭐ |
| `api/src/controllers/` | Lógica de controladores | ⭐⭐⭐ |
| `api/src/services/` | Lógica de negocio | ⭐⭐⭐ |
| `api/src/repositories/` | Acceso a base de datos | ⭐⭐⭐ |
| `api/.env` | Variables de entorno | ⭐⭐⭐ |

### Documentación

| Archivo | Descripción | Para quién |
|---------|-------------|------------|
| `CLASSROOM_README.md` | Documentación completa | Todos |
| `QUICK_START.md` | Inicio rápido | Principiantes |
| `EXAMPLES.md` | Ejemplos de código | Desarrolladores |
| `PROJECT_STRUCTURE.md` | Estructura del proyecto | Desarrolladores |

## 🔄 Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  classroom.php (Moodle)         │
│  o demo.html (Standalone)       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  classroom-app.js               │
│  (Lógica de la aplicación)      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  api-client.js                  │
│  (Cliente HTTP)                 │
└──────┬──────────────────────────┘
       │
       ▼ HTTP Request
┌─────────────────────────────────┐
│  API REST (Node.js)             │
│  http://localhost:3000/api      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Base de Datos MySQL            │
└─────────────────────────────────┘
```

## 🎨 Componentes de la Interfaz

### Vistas Principales

1. **Dashboard** (`showDashboard()`)
   - Grid de tarjetas de cursos
   - Botón para crear nuevo curso
   - Colores distintivos por curso

2. **Estudiantes** (`showStudents()`)
   - Tabla de estudiantes
   - Búsqueda y filtros
   - CRUD completo

3. **Cursos** (`showCourses()`)
   - Lista de asignaturas
   - Detalles de curso
   - Gestión de contenido

4. **Calificaciones** (`showGrades()`)
   - Tabla de calificaciones
   - Filtros por curso
   - Exportación de datos

5. **Programas** (`showPrograms()`)
   - Lista de programas de estudio
   - Asignaturas por programa
   - Gestión de relaciones

### Componentes Reutilizables

- **Modal** (`createModal()`)
- **Toast Notifications** (`showToast()`)
- **Forms** (Formularios dinámicos)
- **Tables** (Tablas de datos)
- **Cards** (Tarjetas de información)

## 🔌 Endpoints de la API

### Alumnos
```
GET    /api/alumnos              # Listar todos
GET    /api/alumnos/:id          # Obtener uno
POST   /api/alumnos              # Crear
PUT    /api/alumnos/:id          # Actualizar
DELETE /api/alumnos/:id          # Eliminar
GET    /api/alumnos/:id/asignaturas  # Asignaturas del alumno
```

### Asignaturas
```
GET    /api/asignaturas          # Listar todas
GET    /api/asignaturas/:id      # Obtener una
POST   /api/asignaturas          # Crear
PUT    /api/asignaturas/:id      # Actualizar
DELETE /api/asignaturas/:id      # Eliminar
```

### Docentes
```
GET    /api/docentes             # Listar todos
GET    /api/docentes/:id         # Obtener uno
POST   /api/docentes             # Crear
PUT    /api/docentes/:id         # Actualizar
DELETE /api/docentes/:id         # Eliminar
GET    /api/docentes/:id/asignaturas  # Asignaturas del docente
```

### Grupos
```
GET    /api/grupos               # Listar todos
GET    /api/grupos/:id           # Obtener uno
POST   /api/grupos               # Crear
PUT    /api/grupos/:id           # Actualizar
DELETE /api/grupos/:id           # Eliminar
```

### Programas de Estudio
```
GET    /api/programas-estudio    # Listar todos
GET    /api/programas-estudio/:id  # Obtener uno
POST   /api/programas-estudio    # Crear
PUT    /api/programas-estudio/:id  # Actualizar
DELETE /api/programas-estudio/:id  # Eliminar
GET    /api/programas-estudio/:id/asignaturas  # Asignaturas del programa
POST   /api/programas-estudio/:id/asignaturas  # Agregar asignatura
```

## 🎯 Configuración por Entorno

### Desarrollo

```javascript
// js/config.js
const ClassroomConfig = {
    API_URL: 'http://localhost:3000/api',
    DEBUG: true,
    // ...
};
```

```env
# api/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=moodle_db
PORT=3000
NODE_ENV=development
```

### Producción

```javascript
// js/config.js
const ClassroomConfig = {
    API_URL: 'https://api.tu-dominio.com/api',
    DEBUG: false,
    // ...
};
```

```env
# api/.env
DB_HOST=tu-servidor-mysql.com
DB_USER=usuario_produccion
DB_PASSWORD=password_seguro
DB_NAME=moodle_produccion
PORT=3000
NODE_ENV=production
```

## 📦 Dependencias

### Frontend
- Ninguna dependencia externa (Vanilla JS)
- Compatible con navegadores modernos
- Responsive design

### Backend (API)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.15.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

## 🚀 Comandos Útiles

### Desarrollo
```bash
# Iniciar API en modo desarrollo
cd api && npm run dev

# Ver logs de la API
cd api && npm start

# Abrir demo en navegador
open demo.html
```

### Producción
```bash
# Iniciar API en producción
cd api && npm start

# Usar PM2 para mantener la API corriendo
pm2 start api/src/app.js --name "academic-api"
pm2 save
pm2 startup
```

## 🔒 Seguridad

### Frontend
- Validación de datos en formularios
- Sanitización de inputs
- Autenticación vía Moodle

### Backend
- Validación de datos en controladores
- Prepared statements (SQL injection prevention)
- CORS configurado
- Variables de entorno para credenciales

## 📱 Compatibilidad

### Navegadores
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (375x667+)

## 🎓 Próximos Pasos

1. ✅ Sistema base implementado
2. ⏳ Sistema de autenticación JWT
3. ⏳ Subida de archivos
4. ⏳ Sistema de notificaciones
5. ⏳ Chat en tiempo real
6. ⏳ Calendario de eventos
7. ⏳ Reportes avanzados
8. ⏳ Integración con Zoom/Meet

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Autor**: Academic Manager Team
