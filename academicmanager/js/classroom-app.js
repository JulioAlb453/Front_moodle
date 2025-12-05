class ClassroomApp {
    constructor() {
        this.currentView = null;
        this.currentCourse = null;
        this.userData = null;
        this.colors = ['#1976d2', '#388e3c', '#d32f2f', '#f57c00', '#7b1fa2', '#0097a7'];
    }

    async init() {
        try {
            this.setupAPIClient();
            await this.loadUserData();
            await this.loadTemplates();
            await this.renderMainInterface();
            await this.showDashboard();
            this.setupEventListeners();
        } catch (error) {
            this.showError('Error al inicializar la aplicación');
        }
    }

    async loadTemplates() {
        await MustacheRenderer.loadTemplates([
            'classroom-main',
            'classroom-dashboard',
            'classroom-students',
            'classroom-programs',
            'classroom-modal',
            'forms/course-form',
            'forms/student-form'
        ]);
    }

    setupAPIClient() {
        const apiURL = window.ClassroomConfig?.API_URL || 'http://localhost:3000/api';
        apiClient.setBaseURL(apiURL);
    }

    async loadUserData() {
        if (window.moodleData) {
            this.userData = {
                id: window.moodleData.userId,
                name: window.moodleData.userName,
                role: 'teacher'
            };
        } else {
            this.userData = {
                id: 1,
                name: 'Usuario Demo',
                role: 'teacher'
            };
        }
    }

    async renderMainInterface() {
        const container = document.getElementById('academic-manager-app');
        const html = await MustacheRenderer.render('classroom-main', {
            userName: this.userData.name,
            userInitial: this.userData.name.charAt(0)
        });
        container.innerHTML = html;
    }

    setupEventListeners() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                await this.showView(view);
            });
        });

        document.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            if (action) {
                this.handleAction(action, e.target);
            }
        });
    }

    async showView(viewName) {
        this.currentView = viewName;
        
        switch (viewName) {
            case 'dashboard':
                await this.showDashboard();
                break;
            case 'courses':
                await this.showCourses();
                break;
            case 'students':
                await this.showStudents();
                break;
            case 'grades':
                await this.showGrades();
                break;
            case 'programs':
                await this.showPrograms();
                break;
            default:
                this.showError('Vista no encontrada');
        }
    }

    async handleAction(action, element) {
        const id = element.getAttribute('data-id');
        
        switch (action) {
            case 'edit':
                await this.editStudent(id);
                break;
            case 'delete':
                await this.deleteStudent(id);
                break;
            case 'close-modal':
                this.closeModal();
                break;
            case 'view-program':
                await this.showProgramDetail(id);
                break;
        }
    }

    async showDashboard() {
        const container = document.getElementById('viewContainer');
        container.innerHTML = '<div class="loading">Cargando...</div>';
        
        try {
            const asignaturas = await apiClient.getAsignaturas();
            
            const courses = asignaturas.map((curso, index) => ({
                ...curso,
                color: this.colors[index % this.colors.length],
                studentCount: 0,
                taskCount: 0
            }));
            
            const html = await MustacheRenderer.render('classroom-dashboard', { courses });
            container.innerHTML = html;
            
            document.getElementById('btnNewCourse')?.addEventListener('click', () => {
                this.showCourseForm();
            });
            
            document.querySelectorAll('.course-card').forEach(card => {
                card.addEventListener('click', () => {
                    const courseId = card.getAttribute('data-id');
                    this.showCourseDetail(courseId);
                });
            });
            
        } catch (error) {
            container.innerHTML = '<div class="error">Error al cargar los cursos</div>';
        }
    }

    async showCourseDetail(courseId) {
        const container = document.getElementById('viewContainer');
        container.innerHTML = '<div class="loading">Cargando curso...</div>';
        
        try {
            const curso = await apiClient.getAsignatura(courseId);
            
            container.innerHTML = `
                <div class="course-detail-view">
                    <div class="view-header">
                        <button class="btn-back" id="btnBack">← Volver</button>
                        <h2>${curso.nombre}</h2>
                    </div>
                    
                    <div class="course-tabs">
                        <button class="tab-btn active" data-tab="stream">Novedades</button>
                        <button class="tab-btn" data-tab="students">Estudiantes</button>
                        <button class="tab-btn" data-tab="grades">Calificaciones</button>
                    </div>
                    
                    <div class="tab-content" id="tabContent">
                        <div class="stream-view">
                            <div class="announcement-card">
                                <h3>Bienvenido a ${curso.nombre}</h3>
                                <p>Cuatrimestre ${curso.cuatrimestre}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('btnBack')?.addEventListener('click', () => {
                this.showDashboard();
            });
            
        } catch (error) {
            container.innerHTML = '<div class="error">Error al cargar el curso</div>';
        }
    }

    async showCourses() {
        await this.showDashboard();
    }

    async showStudents() {
        const container = document.getElementById('viewContainer');
        container.innerHTML = '<div class="loading">Cargando estudiantes...</div>';
        
        try {
            const alumnos = await apiClient.getAlumnos();
            
            const students = alumnos.map(alumno => ({
                ...alumno,
                initial: alumno.nombre.charAt(0)
            }));
            
            const html = await MustacheRenderer.render('classroom-students', { students });
            container.innerHTML = html;
            
            document.getElementById('btnNewStudent')?.addEventListener('click', () => {
                this.showStudentForm();
            });
            
        } catch (error) {
            container.innerHTML = '<div class="error">Error al cargar estudiantes</div>';
        }
    }

    async showGrades() {
        const container = document.getElementById('viewContainer');
        
        container.innerHTML = `
            <div class="grades-view">
                <div class="view-header">
                    <h2>Calificaciones</h2>
                </div>
                <div class="info-message">
                    <p>Selecciona un curso para ver las calificaciones</p>
                </div>
            </div>
        `;
    }

    async showPrograms() {
        const container = document.getElementById('viewContainer');
        container.innerHTML = '<div class="loading">Cargando programas...</div>';
        
        try {
            const programs = await apiClient.getProgramasEstudio();
            const html = await MustacheRenderer.render('classroom-programs', { programs });
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = '<div class="error">Error al cargar programas</div>';
        }
    }

    async showCourseForm(course = null) {
        const isEdit = course !== null;
        
        const formData = {
            nombre: course?.nombre || '',
            cuatrimestre: course?.cuatrimestre || 1,
            isEdit: isEdit
        };
        
        const formHtml = await MustacheRenderer.render('forms/course-form', formData);
        await this.showModal(isEdit ? 'Editar Curso' : 'Nuevo Curso', formHtml);
        
        document.getElementById('courseForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                if (isEdit) {
                    await apiClient.updateAsignatura(course.id, data);
                } else {
                    await apiClient.createAsignatura(data);
                }
                
                this.closeModal();
                this.showDashboard();
                this.showSuccess(isEdit ? 'Curso actualizado' : 'Curso creado');
            } catch (error) {
                this.showError('Error al guardar el curso');
            }
        });
    }

    async showStudentForm(student = null) {
        const isEdit = student !== null;
        
        const formData = {
            nombre: student?.nombre || '',
            isEdit: isEdit
        };
        
        const formHtml = await MustacheRenderer.render('forms/student-form', formData);
        await this.showModal(isEdit ? 'Editar Estudiante' : 'Nuevo Estudiante', formHtml);
        
        document.getElementById('studentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                if (isEdit) {
                    await apiClient.updateAlumno(student.id, data);
                } else {
                    await apiClient.createAlumno(data);
                }
                
                this.closeModal();
                this.showStudents();
                this.showSuccess(isEdit ? 'Estudiante actualizado' : 'Estudiante creado');
            } catch (error) {
                this.showError('Error al guardar el estudiante');
            }
        });
    }

    async editStudent(id) {
        try {
            const student = await apiClient.getAlumno(id);
            this.showStudentForm(student);
        } catch (error) {
            this.showError('Error al cargar el estudiante');
        }
    }

    async deleteStudent(id) {
        if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;
        
        try {
            await apiClient.deleteAlumno(id);
            this.showStudents();
            this.showSuccess('Estudiante eliminado');
        } catch (error) {
            this.showError('Error al eliminar el estudiante');
        }
    }

    async showProgramDetail(id) {
        const container = document.getElementById('viewContainer');
        container.innerHTML = '<div class="loading">Cargando programa...</div>';
        
        try {
            const programa = await apiClient.getProgramaEstudio(id);
            const asignaturas = await apiClient.getProgramaEstudioAsignaturas(id);
            
            container.innerHTML = `
                <div class="program-detail-view">
                    <div class="view-header">
                        <button class="btn-back" id="btnBack">← Volver</button>
                        <h2>${programa.nombre}</h2>
                    </div>
                    <p>${programa.descripcion || 'Sin descripción'}</p>
                    <h3>Asignaturas</h3>
                    <div class="courses-grid">
                        ${asignaturas.map((asig, index) => `
                            <div class="course-card" style="border-top: 4px solid ${this.colors[index % this.colors.length]}">
                                <div class="course-header" style="background: ${this.colors[index % this.colors.length]}">
                                    <h3 class="course-title">${asig.nombre}</h3>
                                    <p class="course-subtitle">Cuatrimestre ${asig.cuatrimestre}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.getElementById('btnBack')?.addEventListener('click', () => {
                this.showPrograms();
            });
            
        } catch (error) {
            container.innerHTML = '<div class="error">Error al cargar el programa</div>';
        }
    }

    async showModal(title, content) {
        const html = await MustacheRenderer.render('classroom-modal', { title, content });
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = html;
        document.body.appendChild(modalDiv.firstElementChild);
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

if (typeof window !== 'undefined') {
    window.ClassroomApp = ClassroomApp;
}
