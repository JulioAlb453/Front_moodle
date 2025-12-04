class UIRenderer {
  constructor(mustacheRenderer, configManager) {
    this.renderer = mustacheRenderer;
    this.configManager = configManager;
    this.currentView = "main";
  }

  setCurrentView(view) {
    this.currentView = view;
  }

  // ========== RENDERIZADO DE INTERFAZ PRINCIPAL ==========
  async renderMainInterface(templateData) {
    // Agregar flags de vista activa
    const enhancedData = {
      ...templateData,
      isMainView: this.currentView === "main",
      isAdminView: this.currentView === "admin",
      isBulkView: this.currentView === "bulk",
      activeMain: this.currentView === "main",
      activeAdmin: this.currentView === "admin",
      activeBulk: this.currentView === "bulk",
    };

    // Intentar con Mustache primero
    const rendered = await this.renderer.render(
      "main-interface",
      enhancedData,
      "academic-manager-app"
    );

    if (!rendered) {
      console.warn("Usando fallback para main interface");
      this.renderMainInterfaceFallback(enhancedData);
    }
  }

  renderMainInterfaceFallback(data) {
    const appContainer = document.getElementById("academic-manager-app");
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
    switch (viewName) {
      case "main":
        await this.renderMainView();
        break;
      case "admin":
        await this.renderAdminView();
        break;
      case "bulk":
        await this.renderBulkView();
        break;
    }
  }

  async renderMainView() {
    const programs = this.configManager.getPrograms();
    const semesters = this.configManager.getSemesters();

    // Renderizar selección
    const rendered = await this.renderer.renderSelection(programs, semesters);
    if (!rendered) {
      this.renderSelectionFallback(programs, semesters);
    }
  }
  async loadAndRenderSubjects(programId, semester) {
    const subjects = this.configManager.getSubjects(programId, semester);
    const programName = this.configManager.getProgramName(programId);

    const rendered = this.renderer.renderSubjects(
      subjects,
      programName,
      semester
    );
    if (!rendered) {
      this.renderSubjectsFallback(subjects, programName, semester);
    }
  }

  renderSelectionFallback(programs, semesters) {
    const container = document.getElementById("selection-container");
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
    const rendered = this.renderer.render("admin-panel", {}, "admin-container");
    if (!rendered) {
      this.renderAdminPanelFallback();
    }
  }

  renderAdminPanelFallback() {
    const container = document.getElementById("admin-container");
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
    const rendered = this.renderer.render(
      "bulk-actions",
      {},
      "bulk-actions-container"
    );
    if (!rendered) {
      this.renderBulkActionsFallback();
    }
  }

  renderBulkActionsFallback() {
    const container = document.getElementById("bulk-actions-container");
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
    switch (formType) {
      case "program":
        await this.renderProgramForm(data);
        break;
      case "subject":
        await this.renderSubjectForm(data);
        break;
      case "teacher":
        await this.renderTeacherForm(data);
        break;
    }
  }

  async renderProgramForm(data) {
    const rendered = this.renderer.renderProgramForm(
      data.programs || [],
      data.semesters || []
    );
    if (!rendered) {
      this.renderProgramFormFallback(data);
    }
  }

  async renderSubjectForm(data) {
    const rendered = this.renderer.render(
      "forms/subject-form",
      data,
      "form-container"
    );

    if (!rendered) {
      this.renderSubjectFormFallback(data);
    }
  }

  renderProgramFormFallback(data) {
    const container = document.getElementById("form-container");
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

  renderSubjectFormFallback(data) {
    const container = document.getElementById("form-container");
    if (!container) return;

    let html = `
        <div class="card">
            <div class="card-header">
                <h3>Crear Asignatura</h3>
                <button class="btn btn-sm btn-secondary" data-action="cancel-form">Cancelar</button>
            </div>
            <form id="subject-form">
                <div class="form-group">
                    <label class="form-label">Nombre de la Asignatura</label>
                    <input type="text" class="form-control" name="subject_name" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Programa</label>
                    <select class="form-control" name="program_id" required>
                        <option value="">Seleccione programa</option>`;

    data.programs.forEach((p) => {
      html += `<option value="${p.id}">${p.nombre}</option>`;
    });

    html += `
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Cuatrimestre</label>
                    <select class="form-control" name="semester" required>
                        <option value="">Seleccione cuatrimestre</option>`;

    data.semesters.forEach((s) => {
      html += `<option value="${s}">${s}</option>`;
    });

    html += `
                    </select>
                </div>

                <button type="submit" class="btn btn-success">Crear Asignatura</button>
            </form>
        </div>
    `;

    container.innerHTML = html;
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
    const container = document.getElementById("results-container");
    if (!container) return;

    let html = `
            <div class="card">
                <div class="card-header">
                    <h3>Resultados de Operaciones</h3>
                </div>
                <div class="results-container">`;

    if (data.operations && data.operations.length > 0) {
      data.operations.forEach((op) => {
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
  // ========== MÉTODOS PARA VISTAS SEPARADAS ==========

  async renderMainView(programs, semesters) {
    console.log("📋 Renderizando vista principal (solo selección)");

    const rendered = await this.renderer.render(
      "selection",
      {
        programs,
        semesters,
      },
      "selection-container"
    );

    if (!rendered) {
      this.renderSelectionFallback(programs, semesters);
    }

    // Limpiar contenedor de asignaturas cuando se muestra la selección
    const subjectsContainer = document.getElementById("subjects-container");
    if (subjectsContainer) {
      subjectsContainer.innerHTML = "";
    }
  }

  async renderAdminView() {
    console.log("⚙️ Renderizando vista de administración");

    const rendered = await this.renderer.render(
      "admin-panel",
      {},
      "admin-container"
    );
    if (!rendered) {
      this.renderAdminPanelFallback();
    }
  }

  async renderBulkView() {
    console.log("⚡ Renderizando vista de acciones masivas");

    const rendered = await this.renderer.render(
      "bulk-actions",
      {},
      "bulk-actions-container"
    );
    if (!rendered) {
      this.renderBulkActionsFallback();
    }
  }

  // Modificar el renderMainInterface para que solo cree la estructura
  async renderMainInterface(templateData) {
    const enhancedData = {
      ...templateData,
      // Datos para determinar qué vista mostrar
      showMainView: this.currentView === "main",
      showAdminView: this.currentView === "admin",
      showBulkView: this.currentView === "bulk",
    };

    const rendered = await this.renderer.render(
      "main-interface",
      enhancedData,
      "academic-manager-app"
    );

    if (!rendered) {
      this.renderMainInterfaceFallback(enhancedData);
    }

    return rendered;
  }

  // Actualizar el fallback de main interface
  renderMainInterfaceFallback(data) {
    const appContainer = document.getElementById("academic-manager-app");
    if (!appContainer) return;

    appContainer.innerHTML = `
        <div class="academic-manager">
            <header class="am-header">
                <h1><i class="fa fa-graduation-cap"></i> Academic Manager</h1>
                <div class="user-info">
                    <span class="user-name">${data.userName}</span>
                    <a href="${
                      data.baseUrl
                    }/login/logout.php" class="btn-logout">
                        <i class="fa fa-sign-out"></i> Salir
                    </a>
                </div>
            </header>

            <div class="am-container">
                <nav class="am-sidebar">
                    <ul class="am-menu">
                        <li>
                            <a href="#" class="menu-item ${
                              data.currentView === "main" ? "active" : ""
                            }" data-view="main">
                                <i class="fa fa-home"></i> Inicio
                            </a>
                        </li>
                        <li>
                            <a href="#" class="menu-item ${
                              data.currentView === "admin" ? "active" : ""
                            }" data-view="admin">
                                <i class="fa fa-cog"></i> Administración
                            </a>
                        </li>
                        <li>
                            <a href="#" class="menu-item ${
                              data.currentView === "bulk" ? "active" : ""
                            }" data-view="bulk">
                                <i class="fa fa-bolt"></i> Acciones Masivas
                            </a>
                        </li>
                    </ul>
                </nav>

                <main class="am-main">
                    <!-- Vista Principal (se muestra solo cuando se selecciona) -->
                    <div id="main-view" class="view" style="display: ${
                      data.showMainView ? "block" : "none"
                    }">
                        <div id="selection-container"></div>
                        <div id="subjects-container"></div>
                    </div>

                    <!-- Vista Administración (se muestra solo cuando se selecciona) -->
                    <div id="admin-view" class="view" style="display: ${
                      data.showAdminView ? "block" : "none"
                    }">
                        <div id="admin-container"></div>
                        <div id="form-container" style="display: none;"></div>
                    </div>

                    <!-- Vista Acciones Masivas (se muestra solo cuando se selecciona) -->
                    <div id="bulk-view" class="view" style="display: ${
                      data.showBulkView ? "block" : "none"
                    }">
                        <div id="bulk-actions-container"></div>
                        <div id="results-container"></div>
                    </div>
                </main>
            </div>
        </div>
    `;
  }
}
