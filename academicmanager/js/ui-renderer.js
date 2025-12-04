class UIRenderer {
    constructor(mustacheRenderer, configManager) {
        this.renderer = mustacheRenderer;
        this.configManager = configManager;
        console.log("🎨 UIRenderer creado");
    }

    async renderMainInterface(data) {
        console.log("🏠 Renderizando interfaz principal...");
        
        // Agregar flags para la vista actual
        const enhancedData = {
            ...data,
            showMainView: data.currentView === 'main',
            showAdminView: data.currentView === 'admin',
            showBulkView: data.currentView === 'bulk'
        };
        
        const rendered = await this.renderer.render('main-interface', enhancedData, 'academic-manager-app');
        
        if (!rendered) {
            console.warn("⚠️ Fallback a HTML básico");
            this.renderMainInterfaceFallback(data);
        }
        
        return rendered;
    }

    renderMainInterfaceFallback(data) {
        const appContainer = document.getElementById('academic-manager-app');
        if (!appContainer) return;

        appContainer.innerHTML = `
            <div class="academic-manager">
                <header class="am-header">
                    <h1>Academic Manager</h1>
                    <div class="user-info">
                        <span>${data.userName}</span>
                    </div>
                </header>
                
                <div class="am-container">
                    <nav class="am-sidebar">
                        <ul class="am-menu">
                            <li><a href="#" class="menu-item ${data.currentView === 'main' ? 'active' : ''}" data-view="main">Inicio</a></li>
                            <li><a href="#" class="menu-item ${data.currentView === 'admin' ? 'active' : ''}" data-view="admin">Administración</a></li>
                            <li><a href="#" class="menu-item ${data.currentView === 'bulk' ? 'active' : ''}" data-view="bulk">Acciones Masivas</a></li>
                        </ul>
                    </nav>
                    
                    <main class="am-main">
                        <div id="main-view" class="view" style="display: ${data.currentView === 'main' ? 'block' : 'none'}">
                            <div id="selection-container"></div>
                        </div>
                        
                        <div id="admin-view" class="view" style="display: ${data.currentView === 'admin' ? 'block' : 'none'}">
                            <div id="admin-container"></div>
                            <div id="form-container" style="display: none;"></div>
                        </div>
                        
                        <div id="bulk-view" class="view" style="display: ${data.currentView === 'bulk' ? 'block' : 'none'}">
                            <div id="bulk-actions-container"></div>
                        </div>
                    </main>
                </div>
            </div>
        `;
    }

    async renderMainView() {
        console.log("📋 Renderizando vista principal");
        
        const programs = this.configManager.getPrograms();
        const semesters = this.configManager.getSemesters();
        
        const rendered = await this.renderer.render('selection', {
            programs: programs,
            semesters: semesters
        }, 'selection-container');
        
        if (!rendered) {
            this.renderSelectionFallback(programs, semesters);
        }
    }

    renderSelectionFallback(programs, semesters) {
        const container = document.getElementById('selection-container');
        if (!container) return;
        
        let html = '<h3>Selección de Programa</h3>';
        html += '<select id="program-select"><option value="">Seleccione programa</option>';
        
        programs.forEach(p => {
            html += `<option value="${p.id}">${p.nombre}</option>`;
        });
        
        html += '</select><br><br>';
        
        html += '<select id="semester-select"><option value="">Seleccione cuatrimestre</option>';
        semesters.forEach(s => {
            html += `<option value="${s}">${s}</option>`;
        });
        
        html += '</select>';
        
        container.innerHTML = html;
    }

    async renderAdminView() {
        console.log("⚙️ Renderizando panel de administración");
        
        const rendered = await this.renderer.render('admin-panel', {}, 'admin-container');
        
        if (!rendered) {
            this.renderAdminPanelFallback();
        }
    }

    renderAdminPanelFallback() {
        const container = document.getElementById('admin-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="card">
                <h3>Panel de Administración</h3>
                <div>
                    <button data-action="show-program-form">Crear Programa</button>
                    <button data-action="show-subject-form">Crear Asignatura</button>
                    <button data-action="show-teacher-form">Crear Docente</button>
                </div>
            </div>
        `;
    }
}