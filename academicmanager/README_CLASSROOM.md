# 🎓 Academic Classroom - Plataforma tipo Google Classroom

> Sistema de gestión académica moderno con interfaz tipo Google Classroom que consume una API REST de Node.js

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## 📸 Vista Previa

```
┌─────────────────────────────────────────────────────────────┐
│  🎓 Academic Classroom                    👤 Usuario Demo   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌─────────────────────────────────────────┐ │
│  │ 🏠 Inicio │  │                                         │ │
│  │ 📚 Cursos │  │  ┌──────────┐  ┌──────────┐  ┌──────┐ │ │
│  │ 👥 Alumnos│  │  │ Matemát. │  │  Física  │  │ Quím.│ │ │
│  │ 📊 Notas  │  │  │ Cuatr. 1 │  │ Cuatr. 1 │  │ Cua. │ │ │
│  │ 📋 Progr. │  │  └──────────┘  └──────────┘  └──────┘ │ │
│  └──────────┘  │                                         │ │
│                │  ┌──────────┐  ┌──────────┐  ┌──────┐ │ │
│                │  │ Program. │  │ Historia │  │ Arte │ │ │
│                │  │ Cuatr. 2 │  │ Cuatr. 2 │  │ Cua. │ │ │
│                │  └──────────┘  └──────────┘  └──────┘ │ │
│                └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Características Principales

- ✅ **Interfaz Moderna**: Diseño tipo Google Classroom
- ✅ **Responsive**: Funciona en desktop, tablet y móvil
- ✅ **API REST**: Backend con Node.js y Express
- ✅ **CRUD Completo**: Gestión de cursos, estudiantes, docentes
- ✅ **Sin Dependencias**: Frontend en Vanilla JavaScript
- ✅ **Integración Moodle**: Se integra perfectamente con Moodle
- ✅ **Demo Standalone**: Prueba sin necesidad de Moodle

## 🚀 Inicio Rápido (5 minutos)

### 1. Clonar e Instalar

```bash
# Instalar dependencias de la API
cd api
npm install
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE moodle_db;

# Importar estructura
mysql -u root -p moodle_db < database.sql
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

### 4. Iniciar API

```bash
npm run dev
```

### 5. Abrir en el Navegador

```
# Con Moodle
http://tu-moodle.com/local/academicmanager/classroom.php

# Demo standalone
Abre: demo.html
```

## 📁 Archivos Creados

### Frontend
```
js/
├── classroom-app.js      # Aplicación principal (23 KB)
├── api-client.js         # Cliente HTTP (6 KB)
└── config.js             # Configuración (1 KB)

styles/
└── classroom.css         # Estilos tipo Classroom (13 KB)

classroom.php             # Punto de entrada Moodle
demo.html                 # Demo standalone
```

### Documentación
```
📚 CLASSROOM_README.md           # Documentación completa
🚀 QUICK_START.md                # Guía de inicio rápido
💡 EXAMPLES.md                   # Ejemplos de código
📁 PROJECT_STRUCTURE.md          # Estructura del proyecto
✅ INSTALLATION_CHECKLIST.md     # Checklist de instalación
```

## 🎯 Funcionalidades

### Dashboard
- Vista de tarjetas de cursos con colores distintivos
- Información rápida de estudiantes y tareas
- Creación rápida de nuevos cursos

### Gestión de Estudiantes
- Lista completa con avatares
- Búsqueda y filtros
- CRUD completo (Crear, Leer, Actualizar, Eliminar)

### Gestión de Cursos
- Tarjetas visuales por curso
- Detalles de cada curso
- Asignación de estudiantes y docentes

### Programas de Estudio
- Vista de programas académicos
- Gestión de asignaturas por programa
- Relaciones entre entidades

## 🔧 Configuración

### Cambiar URL de la API

Edita `js/config.js`:

```javascript
const ClassroomConfig = {
    API_URL: 'http://localhost:3000/api',  // ← Cambiar aquí
    // ...
};
```

### Habilitar CORS

Edita `api/src/app.js`:

```javascript
app.use(cors({
    origin: ['http://localhost', 'http://tu-moodle.com'],
    credentials: true
}));
```

## 📡 API Endpoints

```
Alumnos
  GET    /api/alumnos
  POST   /api/alumnos
  PUT    /api/alumnos/:id
  DELETE /api/alumnos/:id

Asignaturas
  GET    /api/asignaturas
  POST   /api/asignaturas
  PUT    /api/asignaturas/:id
  DELETE /api/asignaturas/:id

Docentes
  GET    /api/docentes
  POST   /api/docentes
  PUT    /api/docentes/:id
  DELETE /api/docentes/:id

Programas
  GET    /api/programas-estudio
  POST   /api/programas-estudio
  PUT    /api/programas-estudio/:id
  DELETE /api/programas-estudio/:id
```

## 🎨 Personalización

### Cambiar Colores

```css
/* En styles/classroom.css */
:root {
    --primary-color: #1976d2;    /* Azul */
    --secondary-color: #388e3c;  /* Verde */
    --danger-color: #d32f2f;     /* Rojo */
}
```

### Agregar Nueva Vista

```javascript
// 1. Crear método en classroom-app.js
async showMiVista() {
    const container = document.getElementById('viewContainer');
    container.innerHTML = `<div>Mi Vista</div>`;
}

// 2. Agregar case en showView()
case 'mi-vista':
    await this.showMiVista();
    break;

// 3. Agregar item en sidebar
<a href="#" class="nav-item" data-view="mi-vista">
    <span class="icon">📌</span>
    <span class="label">Mi Vista</span>
</a>
```

## 🐛 Solución de Problemas

### Error: "Failed to fetch"

```bash
# 1. Verifica que la API esté corriendo
cd api && npm run dev

# 2. Verifica la URL en js/config.js
# 3. Verifica CORS en api/src/app.js
```

### Los estilos no se cargan

```bash
# Verifica que el archivo existe
ls styles/classroom.css

# Limpia la caché de Moodle
# Administración > Purgar cachés
```

## 📚 Documentación Completa

- **[CLASSROOM_README.md](CLASSROOM_README.md)** - Documentación detallada
- **[QUICK_START.md](QUICK_START.md)** - Guía de inicio rápido
- **[EXAMPLES.md](EXAMPLES.md)** - Ejemplos de código
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Estructura del proyecto
- **[INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)** - Checklist de instalación

## 🔒 Seguridad

- ✅ Autenticación vía Moodle
- ✅ Validación de datos en frontend y backend
- ✅ Prepared statements (prevención SQL injection)
- ✅ CORS configurado
- ✅ Variables de entorno para credenciales

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

## 🎓 Tecnologías

### Frontend
- Vanilla JavaScript (ES6+)
- CSS3 (Variables, Grid, Flexbox)
- HTML5

### Backend
- Node.js
- Express
- MySQL
- Swagger (Documentación API)

## 📊 Estadísticas del Proyecto

```
Archivos JavaScript:  3 archivos (30 KB)
Archivos CSS:         1 archivo  (13 KB)
Archivos PHP:         1 archivo  (2 KB)
Documentación:        6 archivos (50 KB)
Total:                11 archivos
```

## 🎯 Roadmap

- [x] Sistema base implementado
- [x] CRUD completo de entidades
- [x] Interfaz tipo Classroom
- [x] Documentación completa
- [ ] Sistema de autenticación JWT
- [ ] Subida de archivos
- [ ] Sistema de notificaciones
- [ ] Chat en tiempo real
- [ ] Calendario de eventos
- [ ] Videoconferencias

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Autores

- **Academic Manager Team** - *Trabajo inicial*

## 🙏 Agradecimientos

- Inspirado en Google Classroom
- Construido para la comunidad de Moodle
- Gracias a todos los contribuidores

## 📞 Soporte

¿Necesitas ayuda?

1. Revisa la [documentación completa](CLASSROOM_README.md)
2. Consulta los [ejemplos](EXAMPLES.md)
3. Sigue el [checklist de instalación](INSTALLATION_CHECKLIST.md)
4. Abre un issue en GitHub

---

**¡Disfruta tu nueva plataforma Academic Classroom! 🎓**

Hecho con ❤️ para la comunidad educativa
