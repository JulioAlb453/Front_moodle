// routes.js
class Router {
    constructor(academicManager) {
        this.academicManager = academicManager;
        this.routes = {
            'main': () => this.academicManager.showView('main'),
            'admin': () => this.academicManager.showView('admin'),
            'bulk': () => this.academicManager.showView('bulk'),
            'form-program': () => this.academicManager.renderForm('program'),
            'form-subject': () => this.academicManager.renderForm('subject'),
            'form-teacher': () => this.academicManager.renderForm('teacher'),
            'cancel-form': () => this.academicManager.hideForm()
        };
        
        this.actionHandlers = {};
    }

    init() {
        // Escuchar clicks en enlaces de navegación
        this.setupNavigation();
        
        // Escuchar clicks en botones de acción
        this.setupActionButtons();
        
        // Manejar cambios en URL (hash routing opcional)
        this.setupHashRouting();
        
        console.log("Router inicializado");
    }

    setupNavigation() {
        // Delegación de eventos para la navegación principal
        document.addEventListener('click', (e) => {
            // Navegación principal
            if (e.target.matches('#nav-main, [data-route="main"]')) {
                e.preventDefault();
                this.navigate('main');
            }
            else if (e.target.matches('#nav-admin, [data-route="admin"]')) {
                e.preventDefault();
                this.navigate('admin');
            }
            else if (e.target.matches('#nav-bulk, [data-route="bulk"]')) {
                e.preventDefault();
                this.navigate('bulk');
            }
        });
    }

    setupActionButtons() {
        // Delegación de eventos para botones de acción
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            this.handleAction(action, button);
        });

        // Manejar envío de formularios
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.id === 'program-form') {
                e.preventDefault();
                this.handleProgramFormSubmit(form);
            }
            else if (form.id === 'subject-form') {
                e.preventDefault();
                this.handleSubjectFormSubmit(form);
            }
            else if (form.id === 'teacher-form') {
                e.preventDefault();
                this.handleTeacherFormSubmit(form);
            }
        });
    }

    setupHashRouting() {
        // Manejar cambios en el hash de la URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && this.routes[hash]) {
                this.navigate(hash);
            }
        });

        // Verificar hash inicial
        const initialHash = window.location.hash.substring(1);
        if (initialHash && this.routes[initialHash]) {
            setTimeout(() => this.navigate(initialHash), 100);
        }
    }

    navigate(route, params = {}) {
        console.log(`Navegando a: ${route}`, params);
        
        if (this.routes[route]) {
            this.routes[route](params);
            
            // Actualizar estado activo en navegación
            this.updateActiveNav(route);
            
            // Actualizar URL (opcional)
            history.pushState({ route }, '', `#${route}`);
            
            return true;
        }
        
        console.warn(`Ruta no encontrada: ${route}`);
        return false;
    }

    updateActiveNav(route) {
        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar clase active al enlace correspondiente
        const activeLink = document.querySelector(`#nav-${route}`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    handleAction(action, element) {
        console.log(`Acción detectada: ${action}`, element);
        
        // Acciones de navegación
        if (action === 'show-program-form') {
            this.navigate('form-program');
        }
        else if (action === 'show-subject-form') {
            this.navigate('form-subject');
        }
        else if (action === 'show-teacher-form') {
            this.navigate('form-teacher');
        }
        else if (action === 'cancel-form') {
            this.navigate('cancel-form');
        }
        // Acciones masivas
        else if (action === 'start-bulk-verification') {
            this.handleBulkAction('verification');
        }
        else if (action === 'start-bulk-creation') {
            this.handleBulkAction('creation');
        }
        else if (action === 'start-bulk-enrollment') {
            this.handleBulkAction('enrollment');
        }
        else if (action === 'bulk-verify') {
            this.handleBulkAction('verification');
        }
        else if (action === 'bulk-create-courses') {
            this.handleBulkAction('creation');
        }
        else if (action === 'bulk-create-users') {
            this.handleBulkAction('user-creation');
        }
        // Acciones personalizadas registradas
        else if (this.actionHandlers[action]) {
            this.actionHandlers[action](element);
        }
        else {
            console.warn(`Acción no manejada: ${action}`);
        }
    }

    // Registrar handlers personalizados
    on(action, handler) {
        this.actionHandlers[action] = handler;
    }

    // Handlers para formularios
    async handleProgramFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Enviando formulario de programa:', data);
        
        // Aquí llamarías a la API de Moodle
        // const result = await this.academicManager.moodleApi.createProgram(data);
        
        // Por ahora solo mostramos un mensaje
        alert('Programa creado (simulación)');
        this.navigate('cancel-form');
    }

    async handleSubjectFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Enviando formulario de asignatura:', data);
        alert('Asignatura creada (simulación)');
        this.navigate('cancel-form');
    }

    async handleTeacherFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Enviando formulario de docente:', data);
        alert('Docente creado (simulación)');
        this.navigate('cancel-form');
    }

    async handleBulkAction(actionType) {
        console.log(`Iniciando acción masiva: ${actionType}`);
        
        // Mostrar indicador de carga
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3>Ejecutando acción masiva...</h3>
                    </div>
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Procesando, por favor espere...</p>
                    </div>
                </div>
            `;
        }
        
        // Simular acción asíncrona
        setTimeout(async () => {
            // Aquí llamarías a concurrent-actions.js
            // const results = await this.academicManager.bulkActions[actionType]();
            
            // Resultados simulados
            const mockResults = {
                operations: [
                    { operation: 'Curso 1', status: 'success', message: 'Creado exitosamente' },
                    { operation: 'Curso 2', status: 'success', message: 'Creado exitosamente' },
                    { operation: 'Curso 3', status: 'warning', message: 'Ya existía' }
                ]
            };
            
            await this.academicManager.renderResults(mockResults);
        }, 2000);
    }
}