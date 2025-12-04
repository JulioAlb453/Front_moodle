class UIRenderer {
    
    constructor(mustacheRenderer, configManager) {
        this.renderer = mustacheRenderer;
        this.configManager = configManager;
    }
    // ========== RENDERIZADO DE INTERFAZ PRINCIPAL ==========
    async renderMainInterface(templateData) {
        // Intentar con Mustache primero
        const rendered = this.renderer.render('main-interface', templateData, 'academic-manager-app');
        
        if (!rendered) {
            // Fallback con HTML directo
            this.renderMainInterfaceFallback(templateData);
        }
    }

    renderMainInterfaceFallback(data) {
        const appContainer = document.getElementById('academic-manager-app');
        if (!appContainer) return;

        appContainer.innerHTML = `
            <nav class="header">
                <div class="nav-bar">
                    <div class="logo">Academic Manager</div>
                    <ul class="nav-links">
                        <li><a href="#" id="nav-main">Inicio</a></li>
                        <li><a href="#" id="nav-admin">Administración</a></li>
                        <li><a href="#" id="nav-bulk">Acciones Masivas</a></li>
                    </ul>
                    <div class="user-info">${data.userName}</div>
                </div>
            </nav>
            <div class="container">
                <div id="main-view" class="view">
                    <div id="selection-container"></div>
                    <div id="subjects-container"></div>
                </div>
                <div id="admin-view" class="view">
                    <div id="admin-container"></div>
                    <div id="form-container"></div>
                </div>
                <div id="bulk-view" class="view">
                    <div id="bulk-actions-container"></div>
                    <div id="results-container"></div>
                </div>
            </div>
        `;
    }

    // ========== RENDERIZADO DE CONTENIDO DE VISTAS ==========
    async renderViewContent(viewName) {
        switch(viewName) {
            case 'main':
                await this.renderMainView();
                break;
            case 'admin':
                await this.renderAdminView();
                break;
            case 'bulk':
                await this.renderBulkView();
                break;
        }
    }

    async renderMainView() {
        const programs = this.configManager.getPrograms();
        const semesters = this.configManager.getSemesters();
        
        const rendered = this.renderer.renderSelection(programs, semesters);
        if (!rendered) {
            this.renderSelectionFallback(programs, semesters);
        }
    }

    async loadAndRenderSubjects(programId, semester) {
        const subjects = this.configManager.getSubjects(programId, semester);
        const programName = this.configManager.getProgramName(programId);
        
        const rendered = this.renderer.renderSubjects(subjects, programName, semester);
        if (!rendered) {
            this.renderSubjectsFallback(subjects, programName, semester);
        }
    }



    renderSelectionFallback(programs, semesters) {
        const container = document.getElementById('selection-container');
        if (!container) return;

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3>Selección de Programa</h3>
                </div>
                <div class="form-group">
                    <label class="form-label">Programa de Estudio</label>
                    <select class="form-control" id="program-select">
                        <option value="">Seleccione un programa</option>`;

        programs.forEach((program) => {
            html += `<option value="${program.id}">${program.nombre}</option>`;
        });

        html += `</select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Cuatrimestre</label>
                    <select class="form-control" id="semester-select">
                        <option value="">Seleccione cuatrimestre</option>`;

        semesters.forEach((semester) => {
            html += `<option value="${semester}">Cuatrimestre ${semester}</option>`;
        });

        html += `</select>
                </div>
            </div>`;

        container.innerHTML = html;
    }

    async renderAdminView() {
        const rendered = this.renderer.render('admin-panel', {}, 'admin-container');
        if (!rendered) {
            this.renderAdminPanelFallback();
        }
    }

    renderAdminPanelFallback() {
        const container = document.getElementById('admin-container');
        if (!container) return;

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Panel de Administración</h3>
                </div>
                <div class="admin-actions">
                    <div class="action-group">
                        <h4>Acciones Individuales</h4>
                        <button class="btn btn-primary" data-action="show-program-form">
                            Crear Programa
                        </button>
                        <button class="btn btn-primary" data-action="show-subject-form">
                            Crear Asignatura
                        </button>
                        <button class="btn btn-primary" data-action="show-teacher-form">
                            Crear Docente
                        </button>
                    </div>
                    
                    <div class="action-group">
                        <h4>Acciones Masivas</h4>
                        <button class="btn btn-warning" data-action="bulk-verify">
                            Verificar Cursos (Todos)
                        </button>
                        <button class="btn btn-success" data-action="bulk-create-courses">
                            Crear Cursos (Todos)
                        </button>
                        <button class="btn btn-success" data-action="bulk-create-users">
                            Crear Usuarios (Todos)
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async renderBulkView() {
        const rendered = this.renderer.render('bulk-actions', {}, 'bulk-actions-container');
        if (!rendered) {
            this.renderBulkActionsFallback();
        }
    }

    renderBulkActionsFallback() {
        const container = document.getElementById('bulk-actions-container');
        if (!container) return;

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Acciones Concurrentes Masivas</h3>
                </div>
                <div class="concurrent-actions">
                    <button class="btn btn-warning btn-lg" data-action="start-bulk-verification">
                        ⚡ Verificar Todos los Cursos
                    </button>
                    <button class="btn btn-success btn-lg" data-action="start-bulk-creation">
                        🚀 Crear Todos los Cursos
                    </button>
                    <button class="btn btn-primary btn-lg" data-action="start-bulk-enrollment">
                        👥 Matricular Todos los Estudiantes
                    </button>
                </div>
            </div>
        `;
    }

    // ========== RENDERIZADO DE FORMULARIOS ==========
    async renderForm(formType, data = {}) {
        switch(formType) {
            case 'program':
                await this.renderProgramForm(data);
                break;
            case 'subject':
                await this.renderSubjectForm(data);
                break;
            case 'teacher':
                await this.renderTeacherForm(data);
                break;
        }
    }

    async renderProgramForm(data) {
        const rendered = this.renderer.renderProgramForm(data.programs || [], data.semesters || []);
        if (!rendered) {
            this.renderProgramFormFallback(data);
        }
    }

    renderProgramFormFallback(data) {
        const container = document.getElementById('form-container');
        if (!container) return;

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Crear Programa de Estudio</h3>
                    <button class="btn btn-sm btn-secondary" data-action="cancel-form">Cancelar</button>
                </div>
                <form id="program-form">
                    <div class="form-group">
                        <label class="form-label">Nombre del Programa *</label>
                        <input type="text" class="form-control" name="program_name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Número de Cuatrimestres *</label>
                        <input type="number" class="form-control" name="semesters_count" min="1" max="20" value="10" required>
                    </div>
                    <button type="submit" class="btn btn-success">Crear Programa</button>
                </form>
            </div>
        `;
    }

    // ... métodos similares para subject-form y teacher-form ...

    // ========== RENDERIZADO DE RESULTADOS ==========
    async renderResults(data) {
        const rendered = this.renderer.renderResults(data.operations || []);
        if (!rendered) {
            this.renderResultsFallback(data);
        }
    }

    renderResultsFallback(data) {
        const container = document.getElementById('results-container');
        if (!container) return;

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3>Resultados de Operaciones</h3>
                </div>
                <div class="results-container">`;

        if (data.operations && data.operations.length > 0) {
            data.operations.forEach(op => {
                html += `
                    <div class="thread-status ${op.status}">
                        <div class="thread-info">
                            <strong>${op.operation}</strong>
                            <span class="thread-message">${op.message}</span>
                        </div>
                    </div>`;
            });
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }
}