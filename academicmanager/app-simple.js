class AcademicManager {
    constructor() {
        console.log('🔨 Constructor de AcademicManager llamado');
        this.currentView = 'main';
    }

    async init() {
        console.log('🚀 SIMPLE: Inicializando Academic Manager');
        
        try {
            // Ocultar loading
            this.hideLoading();
            
            // Crear HTML básico directamente
            this.createBasicHTML();
            
            console.log('✅ SIMPLE: Academic Manager listo');
            
        } catch (error) {
            console.error('❌ SIMPLE: Error:', error);
        }
    }

    createBasicHTML() {
        const appContainer = document.getElementById('academic-manager-app');
        if (!appContainer) {
            console.error('❌ Contenedor no encontrado');
            return;
        }
        
        appContainer.innerHTML = `
            <div class="academic-manager">
                <header class="am-header">
                    <h1>Academic Manager</h1>
                    <div class="user-info">
                        <span>${window.moodleData?.userName || 'Usuario'}</span>
                    </div>
                </header>
                
                <div class="am-container">
                    <nav class="am-sidebar">
                        <ul class="am-menu">
                            <li><a href="#" class="menu-item active" onclick="window.academicManager.showView('main'); return false;">Inicio</a></li>
                            <li><a href="#" class="menu-item" onclick="window.academicManager.showView('admin'); return false;">Administración</a></li>
                            <li><a href="#" class="menu-item" onclick="window.academicManager.showView('bulk'); return false;">Acciones Masivas</a></li>
                        </ul>
                    </nav>
                    
                    <main class="am-main">
                        <div id="main-view" class="view" style="display: block;">
                            <h2>Vista Principal</h2>
                            <p>Selección de programa y cuatrimestre</p>
                        </div>
                        
                        <div id="admin-view" class="view" style="display: none;">
                            <h2>Panel de Administración</h2>
                            <button onclick="window.academicManager.showForm('program')">Crear Programa</button>
                            <div id="form-container" style="display: none;"></div>
                        </div>
                        
                        <div id="bulk-view" class="view" style="display: none;">
                            <h2>Acciones Masivas</h2>
                            <p>Acciones concurrentes</p>
                        </div>
                    </main>
                </div>
            </div>
        `;
        
        console.log('✅ HTML básico creado');
    }

    showView(viewName) {
        console.log(`📱 Mostrando vista: ${viewName}`);
        
        // Ocultar todas
        ['main-view', 'admin-view', 'bulk-view'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        
        // Mostrar seleccionada
        const target = document.getElementById(`${viewName}-view`);
        if (target) {
            target.style.display = 'block';
            console.log(`✅ Vista ${viewName} mostrada`);
        }
    }

    showForm(formType) {
        console.log(`📝 Mostrando formulario: ${formType}`);
        
        const container = document.getElementById('form-container');
        if (container) {
            container.innerHTML = `
                <div style="background: white; padding: 20px; border: 1px solid #ccc; margin-top: 20px;">
                    <h3>Formulario de ${formType}</h3>
                    <p>Formulario simulado</p>
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
}

// Hacer disponible globalmente
console.log('📦 AcademicManager definido');