class AcademicManager {
    constructor() {
        console.log('🔨 Creando AcademicManager');
        
        this.currentView = 'main';
        
        // Inicializar componentes
        this.configManager = new ConfigManager();
        this.mustacheRenderer = new MustacheRenderer();
        this.uiRenderer = new UIRenderer(this.mustacheRenderer, this.configManager);
        this.router = new Router(this);
    }

    async init() {
        console.log('🚀 Inicializando Academic Manager...');
        
        try {
            // 1. Inicializar configManager
            this.configManager.init();
            console.log('✅ ConfigManager inicializado');
            
            // 2. Ocultar loading
            this.hideLoading();
            
            // 3. Renderizar interfaz principal
            await this.renderMainInterface();
            
            // 4. Inicializar router
            this.router.init();
            
            // 5. Mostrar vista inicial
            await this.showView('main');
            
            console.log('✅ Academic Manager inicializado');
            
        } catch (error) {
            console.error('❌ Error en init:', error);
            this.showError('Error: ' + error.message);
        }
    }

    async renderMainInterface() {
        const data = {
            userName: this.configManager.config.userName,
            baseUrl: this.configManager.config.baseUrl,
            currentView: this.currentView
        };
        
        await this.uiRenderer.renderMainInterface(data);
        console.log('✅ Interfaz principal renderizada');
    }

    async showView(viewName) {
        console.log(`📱 Cambiando a vista: ${viewName}`);
        
        this.currentView = viewName;
        
        // Ocultar todas las vistas
        this.hideAllViews();
        
        // Renderizar la vista solicitada
        switch(viewName) {
            case 'main':
                await this.uiRenderer.renderMainView();
                break;
            case 'admin':
                await this.uiRenderer.renderAdminView();
                break;
            case 'bulk':
                // Por ahora solo mensaje
                document.getElementById('bulk-actions-container').innerHTML = '<h3>Acciones Masivas</h3><p>Funcionalidad en desarrollo</p>';
                break;
        }
        
        // Actualizar menú
        this.updateActiveMenu();
        
        console.log(`✅ Vista ${viewName} mostrada`);
    }

    hideAllViews() {
        ['main-view', 'admin-view', 'bulk-view'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    updateActiveMenu() {
        // Remover active de todos
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Agregar active al correspondiente
        const activeItem = document.querySelector(`[data-view="${this.currentView}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    async showForm(formType) {
        console.log(`📝 Mostrando formulario: ${formType}`);
        
        const container = document.getElementById('form-container');
        if (container) {
            container.innerHTML = `
                <div style="background: white; padding: 20px; border: 1px solid #ddd; margin: 20px 0;">
                    <h3>Crear ${formType === 'program' ? 'Programa' : formType === 'subject' ? 'Asignatura' : 'Docente'}</h3>
                    <p>Formulario de ${formType} (simulado)</p>
                    <button onclick="window.academicManager.hideForm()">Cancelar</button>
                </div>
            `;
            container.style.display = 'block';
        }
    }

    hideForm() {
        const container = document.getElementById('form-container');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
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
                <div style="padding: 50px; text-align: center; color: #e74c3c;">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Reintentar</button>
                </div>
            `;
        }
    }
}

// Hacer disponible globalmente
console.log('📦 AcademicManager definido globalmente');