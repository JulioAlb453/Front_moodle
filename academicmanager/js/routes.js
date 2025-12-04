class Router {
    constructor(academicManager) {
        this.academicManager = academicManager;
        console.log("🛣️ Router creado");
    }

    init() {
        console.log("🚦 Inicializando router...");
        
        this.setupNavigation();
        this.setupActionButtons();
        
        console.log("✅ Router listo");
    }

    setupNavigation() {
        // Usar event delegation específica
        document.addEventListener('click', (e) => {
            // Solo manejar clics dentro de academic-manager-app
            const isInApp = e.target.closest('#academic-manager-app');
            if (!isInApp) return;
            
            // Buscar elementos con data-view
            const menuItem = e.target.closest('[data-view]');
            if (menuItem) {
                e.preventDefault();
                const view = menuItem.getAttribute('data-view');
                console.log(`📱 Navegando a: ${view}`);
                this.academicManager.showView(view);
            }
        });
    }

    setupActionButtons() {
        document.addEventListener('click', (e) => {
            const isInApp = e.target.closest('#academic-manager-app');
            if (!isInApp) return;
            
            const button = e.target.closest('[data-action]');
            if (!button) return;
            
            const action = button.getAttribute('data-action');
            console.log(`🎯 Acción: ${action}`);
            
            this.handleAction(action, button);
        });
    }

    handleAction(action, element) {
        switch(action) {
            case 'show-program-form':
                this.academicManager.showForm('program');
                break;
            case 'show-subject-form':
                this.academicManager.showForm('subject');
                break;
            case 'show-teacher-form':
                this.academicManager.showForm('teacher');
                break;
            default:
                console.log(`Acción no manejada: ${action}`);
        }
    }
}