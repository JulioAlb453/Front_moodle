# 📚 Ejemplos de Uso - Academic Classroom

Ejemplos prácticos de cómo usar y extender la aplicación.

## 🎯 Ejemplos de API Client

### Obtener todos los cursos

```javascript
// Obtener todas las asignaturas
const asignaturas = await apiClient.getAsignaturas();
console.log('Cursos:', asignaturas);

// Resultado:
// [
//   { id: 1, nombre: 'Matemáticas', cuatrimestre: 1 },
//   { id: 2, nombre: 'Física', cuatrimestre: 1 },
//   ...
// ]
```

### Crear un nuevo curso

```javascript
// Crear una nueva asignatura
const nuevoCurso = await apiClient.createAsignatura({
    nombre: 'Programación Web',
    cuatrimestre: 3
});

console.log('Curso creado:', nuevoCurso);
```

### Actualizar un curso

```javascript
// Actualizar una asignatura existente
const cursoActualizado = await apiClient.updateAsignatura(1, {
    nombre: 'Matemáticas Avanzadas',
    cuatrimestre: 2
});

console.log('Curso actualizado:', cursoActualizado);
```

### Eliminar un curso

```javascript
// Eliminar una asignatura
await apiClient.deleteAsignatura(1);
console.log('Curso eliminado');
```

### Trabajar con estudiantes

```javascript
// Obtener todos los estudiantes
const estudiantes = await apiClient.getAlumnos();

// Crear un estudiante
const nuevoEstudiante = await apiClient.createAlumno({
    nombre: 'María García'
});

// Obtener asignaturas de un estudiante
const asignaturasEstudiante = await apiClient.getAlumnoAsignaturas(1);

// Actualizar estudiante
await apiClient.updateAlumno(1, {
    nombre: 'María García López'
});

// Eliminar estudiante
await apiClient.deleteAlumno(1);
```

### Trabajar con programas de estudio

```javascript
// Obtener todos los programas
const programas = await apiClient.getProgramasEstudio();

// Crear un programa
const nuevoPrograma = await apiClient.createProgramaEstudio({
    nombre: 'Ingeniería en Sistemas',
    descripcion: 'Programa de 4 años'
});

// Obtener asignaturas de un programa
const asignaturasPrograma = await apiClient.getProgramaEstudioAsignaturas(1);

// Agregar asignatura a un programa
await apiClient.addAsignaturaToProgramaEstudio(1, 5);
```

## 🎨 Ejemplos de Personalización

### Agregar una nueva vista

```javascript
// En classroom-app.js

// 1. Agregar el método para la nueva vista
async showCalendar() {
    const container = document.getElementById('viewContainer');
    
    container.innerHTML = `
        <div class="calendar-view">
            <div class="view-header">
                <h2>Calendario</h2>
                <button class="btn btn-primary" id="btnNewEvent">
                    Nuevo Evento
                </button>
            </div>
            
            <div class="calendar-grid">
                <!-- Tu calendario aquí -->
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('btnNewEvent')?.addEventListener('click', () => {
        this.showEventForm();
    });
}

// 2. Agregar el case en showView()
async showView(viewName) {
    // ...
    switch (viewName) {
        // ... otros cases
        case 'calendar':
            await this.showCalendar();
            break;
    }
}

// 3. Agregar el item en el sidebar (en renderMainInterface())
<a href="#" class="nav-item" data-view="calendar">
    <span class="icon">📅</span>
    <span class="label">Calendario</span>
</a>
```

### Personalizar colores de cursos

```javascript
// En classroom-app.js, método renderCourseCard()

renderCourseCard(curso) {
    // Usar colores personalizados
    const colors = ClassroomConfig.COURSE_COLORS;
    const color = colors[curso.id % colors.length];
    
    // O asignar color según el cuatrimestre
    const colorPorCuatrimestre = {
        1: '#1976d2',
        2: '#388e3c',
        3: '#d32f2f',
        4: '#f57c00'
    };
    const color = colorPorCuatrimestre[curso.cuatrimestre] || '#1976d2';
    
    // ... resto del código
}
```

### Agregar filtros a la lista de estudiantes

```javascript
async showStudents() {
    const container = document.getElementById('viewContainer');
    
    container.innerHTML = '<div class="loading">Cargando estudiantes...</div>';
    
    try {
        const alumnos = await apiClient.getAlumnos();
        
        container.innerHTML = `
            <div class="students-view">
                <div class="view-header">
                    <h2>Estudiantes</h2>
                    <div class="header-actions">
                        <input type="text" 
                               id="searchStudent" 
                               class="form-control" 
                               placeholder="Buscar estudiante..."
                               style="width: 300px; margin-right: 12px;">
                        <button class="btn btn-primary" id="btnNewStudent">
                            <span class="icon">➕</span> Nuevo Estudiante
                        </button>
                    </div>
                </div>
                
                <div class="students-table" id="studentsTable">
                    ${this.renderStudentsTable(alumnos)}
                </div>
            </div>
        `;
        
        // Event listener para búsqueda
        document.getElementById('searchStudent')?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredAlumnos = alumnos.filter(alumno => 
                alumno.nombre.toLowerCase().includes(searchTerm)
            );
            
            document.getElementById('studentsTable').innerHTML = 
                this.renderStudentsTable(filteredAlumnos);
        });
        
        // ... resto del código
        
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        container.innerHTML = '<div class="error">Error al cargar estudiantes</div>';
    }
}

// Método auxiliar para renderizar la tabla
renderStudentsTable(alumnos) {
    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${alumnos.map(alumno => `
                    <tr>
                        <td>${alumno.id}</td>
                        <td>
                            <div class="student-info">
                                <div class="avatar">${alumno.nombre.charAt(0)}</div>
                                <span>${alumno.nombre}</span>
                            </div>
                        </td>
                        <td>
                            <button class="btn-icon" onclick="classroomApp.editStudent(${alumno.id})">✏️</button>
                            <button class="btn-icon" onclick="classroomApp.deleteStudent(${alumno.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
```

### Agregar paginación

```javascript
class Pagination {
    constructor(items, itemsPerPage = 10) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }
    
    get totalPages() {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }
    
    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }
    
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }
    
    renderPagination() {
        return `
            <div class="pagination">
                <button class="btn-icon" 
                        onclick="pagination.prevPage() && renderCurrentPage()"
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    ←
                </button>
                
                <span class="page-info">
                    Página ${this.currentPage} de ${this.totalPages}
                </span>
                
                <button class="btn-icon" 
                        onclick="pagination.nextPage() && renderCurrentPage()"
                        ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                    →
                </button>
            </div>
        `;
    }
}

// Uso:
const pagination = new Pagination(alumnos, 20);
const currentPageItems = pagination.getCurrentPageItems();
// Renderizar currentPageItems
// Agregar pagination.renderPagination() al HTML
```

### Agregar sistema de notificaciones

```javascript
class NotificationManager {
    constructor() {
        this.notifications = [];
    }
    
    add(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            duration
        };
        
        this.notifications.push(notification);
        this.show(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification.id);
            }, duration);
        }
    }
    
    show(notification) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.id = `toast-${notification.id}`;
        toast.textContent = notification.message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
    }
    
    remove(id) {
        const toast = document.getElementById(`toast-${id}`);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
        
        this.notifications = this.notifications.filter(n => n.id !== id);
    }
    
    success(message) {
        this.add(message, 'success');
    }
    
    error(message) {
        this.add(message, 'error');
    }
    
    warning(message) {
        this.add(message, 'warning');
    }
    
    info(message) {
        this.add(message, 'info');
    }
}

// Uso:
const notifications = new NotificationManager();
notifications.success('Curso creado correctamente');
notifications.error('Error al eliminar estudiante');
```

### Agregar confirmación antes de eliminar

```javascript
async deleteStudent(id) {
    // Crear modal de confirmación personalizado
    const modal = this.createModal({
        title: '⚠️ Confirmar eliminación',
        content: `
            <div style="padding: 20px 0;">
                <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                    ¿Estás seguro de que deseas eliminar este estudiante?
                </p>
                <p style="font-size: 14px; color: #999;">
                    Esta acción no se puede deshacer.
                </p>
            </div>
            <div class="form-actions">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                    Cancelar
                </button>
                <button class="btn" style="background: #d32f2f; color: white;" id="btnConfirmDelete">
                    Eliminar
                </button>
            </div>
        `
    });
    
    document.getElementById('btnConfirmDelete').addEventListener('click', async () => {
        try {
            await apiClient.deleteAlumno(id);
            modal.remove();
            this.showStudents();
            this.showSuccess('Estudiante eliminado correctamente');
        } catch (error) {
            this.showError('Error al eliminar el estudiante');
        }
    });
}
```

## 🎓 Ejemplos Avanzados

### Cargar datos relacionados

```javascript
async showCourseDetail(courseId) {
    const container = document.getElementById('viewContainer');
    
    container.innerHTML = '<div class="loading">Cargando curso...</div>';
    
    try {
        // Cargar datos en paralelo
        const [curso, estudiantes, docentes] = await Promise.all([
            apiClient.getAsignatura(courseId),
            apiClient.getAlumnos(), // Filtrar después
            apiClient.getDocentes()  // Filtrar después
        ]);
        
        // Renderizar con todos los datos
        container.innerHTML = `
            <div class="course-detail-view">
                <h2>${curso.nombre}</h2>
                <p>Cuatrimestre: ${curso.cuatrimestre}</p>
                
                <h3>Estudiantes (${estudiantes.length})</h3>
                <!-- Lista de estudiantes -->
                
                <h3>Docentes (${docentes.length})</h3>
                <!-- Lista de docentes -->
            </div>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="error">Error al cargar el curso</div>';
    }
}
```

### Manejo de errores global

```javascript
// En api-client.js
async request(endpoint, options = {}) {
    try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: this.getHeaders(options.headers)
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ 
                message: response.statusText 
            }));
            
            // Manejo específico por código de error
            switch (response.status) {
                case 401:
                    this.handleUnauthorized();
                    break;
                case 403:
                    this.handleForbidden();
                    break;
                case 404:
                    this.handleNotFound();
                    break;
                case 500:
                    this.handleServerError();
                    break;
            }
            
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error(`Error en ${endpoint}:`, error);
        throw error;
    }
}

handleUnauthorized() {
    console.log('No autorizado - redirigiendo al login');
    // Redirigir al login de Moodle
    window.location.href = '/login/index.php';
}

handleForbidden() {
    console.log('Acceso prohibido');
    // Mostrar mensaje de error
}

handleNotFound() {
    console.log('Recurso no encontrado');
}

handleServerError() {
    console.log('Error del servidor');
}
```

## 🎨 Ejemplos de Estilos

### Agregar tema oscuro

```css
/* En styles/classroom.css */

/* Variables para tema oscuro */
[data-theme="dark"] {
    --bg-primary: #1f1f1f;
    --bg-secondary: #121212;
    --text-primary: #e0e0e0;
    --text-secondary: #a0a0a0;
    --border-color: #333;
}

/* Toggle de tema */
.theme-toggle {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}
```

```javascript
// Toggle de tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

### Animaciones personalizadas

```css
/* Animación de entrada para tarjetas */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.course-card {
    animation: fadeInUp 0.3s ease-out;
}

/* Delay escalonado para múltiples tarjetas */
.course-card:nth-child(1) { animation-delay: 0.1s; }
.course-card:nth-child(2) { animation-delay: 0.2s; }
.course-card:nth-child(3) { animation-delay: 0.3s; }
```

---

¿Necesitas más ejemplos? Revisa la documentación completa en `CLASSROOM_README.md`
