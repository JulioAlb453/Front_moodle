class AcademicManager {
    constructor() {
        this.currentView = 'main';
        this.currentProgram = null;
        this.currentSemester = null;
        
        // Inicializar componentes con tus archivos
        this.configManager = new ConfigManager();
        this.mustacheRenderer = new MustacheRenderer();
        this.uiRenderer = new UIRenderer(this.mustacheRenderer, this.configManager);
        this.router = new Router(this);
    }

    async init() {
        console.log('🚀 Inicializando Academic Manager...');
        
        try {
            // 1. Ocultar loading
            this.hideLoading();
            
            // 2. Cargar templates (async)
            await this.mustacheRenderer.loadAllTemplates();
            
            // 3. Cargar configuración
            await this.configManager.loadConfig();
            
            // 4. Renderizar interfaz principal
            await this.renderMainInterface();
            
            // 5. Inicializar router (usa tu archivo routes.js)
            this.router.init();
            
            console.log('✅ Academic Manager inicializado');
            
        } catch (error) {
            console.error('❌ Error en init:', error);
            this.showError('Error inicializando: ' + error.message);
        }
    }

    async renderMainInterface() {
        // Usa tu UIRenderer para renderizar la interfaz principal
        const data = {
            userName: moodleData.userName,
            currentView: this.currentView
        };
        
        await this.uiRenderer.renderMainInterface(data);
        
        // Configurar eventos básicos después de renderizar
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navegación por sidebar
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-view]')) {
                const view = e.target.closest('[data-view]').getAttribute('data-view');
                this.showView(view);
                e.preventDefault();
            }
        });

        // Selección de programa y cuatrimestre
        document.addEventListener('change', (e) => {
            if (e.target.id === 'program-select') {
                this.currentProgram = e.target.value;
                this.handleProgramChange();
            }
            if (e.target.id === 'semester-select') {
                this.currentSemester = e.target.value;
                this.handleSemesterChange();
            }
        });

        // Botón continuar
        document.addEventListener('click', (e) => {
            if (e.target.id === 'continue-selection') {
                this.handleContinueSelection();
            }
        });
    }

    async showView(viewName) {
        console.log(`Mostrando vista: ${viewName}`);
        this.currentView = viewName;
        
        // Actualizar clases activas en menú
        this.updateMenuActiveClass(viewName);
        
        // Ocultar todas las vistas
        this.hideAllViews();
        
        // Mostrar vista solicitada
        switch(viewName) {
            case 'main':
                await this.uiRenderer.renderMainView();
                break;
            case 'admin':
                await this.uiRenderer.renderAdminView();
                break;
            case 'bulk':
                await this.uiRenderer.renderBulkView();
                break;
            default:
                console.warn(`Vista no reconocida: ${viewName}`);
        }
    }

    updateMenuActiveClass(viewName) {
        // Remover clase active de todos
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Agregar clase active al correspondiente
        const activeItem = document.querySelector(`[data-view="${viewName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    hideAllViews() {
        const views = ['main-view', 'admin-view', 'bulk-view'];
        views.forEach(viewId => {
            const view = document.getElementById(viewId);
            if (view) {
                view.style.display = 'none';
            }
        });
    }

    async handleProgramChange() {
        if (this.currentProgram && this.currentSemester) {
            await this.loadAndRenderSubjects();
        }
    }

    async handleSemesterChange() {
        if (this.currentProgram && this.currentSemester) {
            await this.loadAndRenderSubjects();
        }
    }

    async handleContinueSelection() {
        const programSelect = document.getElementById('program-select');
        const semesterSelect = document.getElementById('semester-select');
        
        if (!programSelect.value || !semesterSelect.value) {
            alert('Por favor seleccione programa y cuatrimestre');
            return;
        }
        
        this.currentProgram = programSelect.value;
        this.currentSemester = semesterSelect.value;
        
        await this.loadAndRenderSubjects();
    }

    async loadAndRenderSubjects() {
        if (!this.currentProgram || !this.currentSemester) return;
        
        await this.uiRenderer.loadAndRenderSubjects(
            this.currentProgram, 
            this.currentSemester
        );
    }

    // Métodos que serán llamados por el router
    async renderForm(formType) {
        const data = {
            programs: this.configManager.getPrograms(),
            semesters: this.configManager.getSemesters()
        };
        
        await this.uiRenderer.renderForm(formType, data);
        
        // Mostrar el formulario
        document.getElementById('form-container').style.display = 'block';
    }

    hideForm() {
        const formContainer = document.getElementById('form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
            formContainer.innerHTML = '';
        }
    }

    async renderResults(data) {
        await this.uiRenderer.renderResults(data);
    }

    hideLoading() {
        const loading = document.getElementById('loading-message');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        const appContainer = document.getElementById('academic-manager-app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="error-container">
                    <h3>❌ Error</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
                </div>
            `;
        }
    }
}

// Inicialización global
let academicManager;

document.addEventListener('DOMContentLoaded', function() {
    academicManager = new AcademicManager();
    academicManager.init();
    
    // Hacer disponible globalmente si es necesario
    window.academicManager = academicManager;
});