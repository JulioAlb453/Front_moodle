# Academic Classroom - Front-end tipo Google Classroom

Interfaz moderna tipo Google Classroom que consume la API REST de Node.js para gestionar cursos, estudiantes, docentes y programas de estudio.

## 🎯 Características

- **Dashboard de Cursos**: Vista en tarjetas coloridas similar a Google Classroom
- **Gestión de Estudiantes**: Lista completa con opciones de crear, editar y eliminar
- **Gestión de Cursos**: CRUD completo de asignaturas
- **Programas de Estudio**: Visualización y gestión de programas académicos
- **Interfaz Responsive**: Adaptable a móviles y tablets
- **Diseño Material**: Inspirado en Material Design de Google

## 📁 Archivos Creados

```
/local/academicmanager/
├── classroom.php              # Punto de entrada principal
├── js/
│   ├── api-client.js         # Cliente para consumir la API REST
│   └── classroom-app.js      # Aplicación principal tipo Classroom
└── styles/
    └── classroom.css         # Estilos tipo Google Classroom
```

## 🚀 Instalación

### 1. Configurar la API

Asegúrate de que tu API de Node.js esté corriendo:

```bash
cd api
npm install
npm run dev
```

La API debería estar disponible en `http://localhost:3000/api`

### 2. Configurar la URL de la API

Edita el archivo `classroom.php` y actualiza la URL de la API:

```php
window.moodleData = {
    // ...
    apiURL: 'http://localhost:3000/api', // Cambiar por tu URL
    // ...
};
```

Si tu API está en producción, usa la URL completa:
```javascript
apiURL: 'https://tu-dominio.com/api'
```

### 3. Configurar CORS en la API

Para que el front-end pueda consumir la API, asegúrate de tener CORS configurado en tu API de Node.js.

En `api/src/app.js`, verifica que tengas:

```javascript
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost', 'http://tu-moodle.com'],
    credentials: true
}));
```

### 4. Acceder a la aplicación

Abre en tu navegador:
```
http://tu-moodle.com/local/academicmanager/classroom.php
```

## 🎨 Características de la Interfaz

### Dashboard
- Vista de tarjetas de cursos con colores distintivos
- Información rápida de estudiantes y tareas
- Botón para crear nuevos cursos

### Gestión de Estudiantes
- Tabla con lista completa de estudiantes
- Avatares con iniciales
- Botones de edición y eliminación
- Formulario modal para crear/editar

### Gestión de Cursos
- Tarjetas visuales por curso
- Información de cuatrimestre
- Acceso rápido a detalles del curso

### Programas de Estudio
- Vista de tarjetas de programas
- Descripción y detalles
- Gestión de asignaturas por programa

## 🔧 Personalización

### Cambiar Colores

Edita las variables CSS en `styles/classroom.css`:

```css
:root {
    --primary-color: #1976d2;    /* Azul principal */
    --secondary-color: #388e3c;  /* Verde */
    --danger-color: #d32f2f;     /* Rojo */
    /* ... más colores */
}
```

### Agregar Nuevas Vistas

1. Agrega un nuevo item en el sidebar en `classroom-app.js`:

```javascript
<a href="#" class="nav-item" data-view="mi-vista">
    <span class="icon">📌</span>
    <span class="label">Mi Vista</span>
</a>
```

2. Crea el método para mostrar la vista:

```javascript
async showMiVista() {
    const container = document.getElementById('viewContainer');
    container.innerHTML = `
        <div class="mi-vista">
            <h2>Mi Vista Personalizada</h2>
            <!-- Tu contenido aquí -->
        </div>
    `;
}
```

3. Agrega el case en el método `showView()`:

```javascript
case 'mi-vista':
    await this.showMiVista();
    break;
```

## 📡 API Client

El archivo `api-client.js` proporciona métodos para todos los endpoints:

### Alumnos
```javascript
await apiClient.getAlumnos();
await apiClient.getAlumno(id);
await apiClient.createAlumno({ nombre: 'Juan Pérez' });
await apiClient.updateAlumno(id, { nombre: 'Juan Pérez' });
await apiClient.deleteAlumno(id);
```

### Asignaturas
```javascript
await apiClient.getAsignaturas();
await apiClient.getAsignatura(id);
await apiClient.createAsignatura({ nombre: 'Matemáticas', cuatrimestre: 1 });
await apiClient.updateAsignatura(id, data);
await apiClient.deleteAsignatura(id);
```

### Docentes
```javascript
await apiClient.getDocentes();
await apiClient.getDocente(id);
await apiClient.createDocente({ nombre: 'Prof. García' });
```

### Programas de Estudio
```javascript
await apiClient.getProgramasEstudio();
await apiClient.getProgramaEstudio(id);
await apiClient.createProgramaEstudio({ nombre: 'Ingeniería' });
```

## 🐛 Solución de Problemas

### Error: "Failed to fetch"

**Problema**: La API no está accesible o CORS no está configurado.

**Solución**:
1. Verifica que la API esté corriendo: `npm run dev` en la carpeta `api`
2. Verifica la URL en `classroom.php`
3. Configura CORS en la API (ver sección de instalación)

### Error: "Cannot read property of undefined"

**Problema**: La API no está devolviendo datos en el formato esperado.

**Solución**:
1. Abre la consola del navegador (F12)
2. Verifica las respuestas de la API en la pestaña Network
3. Asegúrate de que la API devuelve arrays/objetos correctos

### Los estilos no se cargan

**Problema**: La ruta del CSS es incorrecta.

**Solución**:
1. Verifica que `styles/classroom.css` existe
2. Verifica la ruta en `classroom.php`
3. Limpia la caché de Moodle: Administración > Purgar cachés

## 🔐 Seguridad

### Autenticación

La aplicación usa la sesión de Moodle para autenticación:

```php
require_login(); // En classroom.php
```

### Validación de Datos

Siempre valida los datos en el servidor (API):

```javascript
// En la API
if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'Nombre requerido' });
}
```

## 📱 Responsive Design

La interfaz es completamente responsive:

- **Desktop**: Sidebar fijo, vista completa
- **Tablet**: Sidebar colapsable
- **Mobile**: Sidebar oculto por defecto, menú hamburguesa

## 🎯 Próximas Mejoras

- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre estudiantes y profesores
- [ ] Calendario de eventos y tareas
- [ ] Sistema de calificaciones completo
- [ ] Subida de archivos y materiales
- [ ] Foros de discusión
- [ ] Videoconferencias integradas

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la consola del navegador (F12)
2. Verifica los logs de la API
3. Asegúrate de que todos los archivos estén en su lugar
4. Verifica que la API esté corriendo

## 📄 Licencia

Este proyecto es parte del sistema Academic Manager para Moodle.
