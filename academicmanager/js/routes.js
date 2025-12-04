class Router {
  constructor(academicManager) {
    this.academicManager = academicManager;
    this.routes = {
      main: () => this.academicManager.showView("main"),
      admin: () => this.academicManager.showView("admin"),
      bulk: () => this.academicManager.showView("bulk"),
      "form-program": () => this.academicManager.showForm("program"),
      "form-subject": () => this.academicManager.showForm("subject"),
      "form-teacher": () => this.academicManager.showForm("teacher"),
      "cancel-form": () => this.academicManager.hideForm(),
    };

    this.actionHandlers = {};
  }

init() {
    console.log("✅ Router inicializado");
    
    // DEPURACIÓN: Verificar estructura del DOM
    setTimeout(() => {
        console.log('=== DEPURACIÓN DE NAVEGACIÓN ===');
        const menuItems = document.querySelectorAll('[data-view]');
        console.log(`Elementos con data-view encontrados: ${menuItems.length}`);
        
        menuItems.forEach((item, index) => {
            console.log(`${index + 1}. data-view="${item.getAttribute('data-view')}"`);
            console.log(`   Texto: ${item.textContent.trim()}`);
            console.log(`   Clases: ${item.className}`);
            
            // Verificar que tiene event listener
            item.style.border = '2px solid red';
            setTimeout(() => {
                item.style.border = '';
            }, 2000);
        });
    }, 1000);
    
    // Escuchar clicks en enlaces de navegación (CORREGIDO)
    this.setupNavigation();
    
    // Escuchar clicks en botones de acción
    this.setupActionButtons();
    
    // Manejar cambios en URL (hash routing opcional)
    this.setupHashRouting();
    
    // Manejar selección de programa/semestre
    this.setupSelectionHandlers();
}
setupNavigation() {
    console.log('🔧 Configurando navegación específica...');
    
    // Delegación de eventos solo para elementos dentro de tu aplicación
    document.addEventListener('click', (e) => {
        // Verificar si el clic ocurrió DENTRO de academic-manager-app
        const isInAcademicManager = e.target.closest('#academic-manager-app');
        
        if (!isInAcademicManager) {
            return; // Ignorar clics fuera de tu aplicación
        }
        
        // Buscar elemento del menú
        const menuItem = e.target.closest('[data-view]');
        
        if (menuItem && menuItem.closest('.am-menu')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // IMPORTANTE: Detener propagación
            
            const view = menuItem.getAttribute('data-view');
            console.log(`📱 CLIC EN MENÚ ACADEMIC MANAGER: ${view}`);
            
            // Navegar a la vista
            this.navigate(view);
            return false;
        }
    }, true); // Usar CAPTURE phase para atrapar el evento primero
    
    console.log('✅ Navegación específica configurada');
}

  setupSelectionHandlers() {
    // Manejar cambios en selects
    document.addEventListener("change", (e) => {
      if (e.target.id === "program-select") {
        this.handleProgramChange(e.target.value);
      }
      if (e.target.id === "semester-select") {
        this.handleSemesterChange(e.target.value);
      }
    });

    // Manejar botón continuar
    document.addEventListener("click", (e) => {
      if (
        e.target.id === "continue-selection" ||
        e.target.closest("#continue-selection")
      ) {
        e.preventDefault();
        this.handleContinueSelection();
      }
    });
  }

  handleProgramChange(programId) {
    if (this.academicManager.handleProgramChange) {
      this.academicManager.handleProgramChange(programId);
    }
  }

  handleSemesterChange(semester) {
    if (this.academicManager.handleSemesterChange) {
      this.academicManager.handleSemesterChange(semester);
    }
  }

  async handleContinueSelection() {
    const programSelect = document.getElementById("program-select");
    const semesterSelect = document.getElementById("semester-select");

    if (!programSelect || !semesterSelect) {
      console.warn("Selects no encontrados");
      return;
    }

    const programId = programSelect.value;
    const semester = semesterSelect.value;

    if (!programId || !semester) {
      alert("Por favor seleccione programa y cuatrimestre");
      return;
    }

    console.log(
      `📋 Continuar con: programa ${programId}, semestre ${semester}`
    );

    // Guardar selección en academicManager
    this.academicManager.selectedProgram = programId;
    this.academicManager.selectedSemester = semester;

    // Cargar asignaturas
    await this.academicManager.loadAndRenderSubjects();
  }

  setupActionButtons() {
    // Delegación de eventos para botones de acción
    document.addEventListener("click", (e) => {
      const button = e.target.closest("[data-action]");
      if (!button) return;

      const action = button.getAttribute("data-action");
      this.handleAction(action, button);
    });

    // Manejar envío de formularios
    document.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;

      if (form.id === "program-form") {
        this.handleProgramFormSubmit(form);
      } else if (form.id === "subject-form") {
        this.handleSubjectFormSubmit(form);
      } else if (form.id === "teacher-form") {
        this.handleTeacherFormSubmit(form);
      }
    });
  }

  setupHashRouting() {
    // Manejar cambios en el hash de la URL
    window.addEventListener("hashchange", () => {
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
    console.log(`🔄 Navegando a: ${route}`, params);
    
    if (this.routes[route]) {
        console.log(`✅ Ruta encontrada, ejecutando...`);
        this.routes[route](params);
        
        // Actualizar estado activo en navegación
        this.updateActiveNav(route);
        
        // Actualizar URL (opcional)
        history.pushState({ route }, '', `#${route}`);
        
        return true;
    }
    
    console.warn(`❌ Ruta no encontrada en routes: ${route}`);
    console.log('Rutas disponibles:', Object.keys(this.routes));
    return false;
}

  updateActiveNav(route) {
    // Remover clase active de todos los items del menú
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Agregar clase active al item correspondiente
    const activeItem = document.querySelector(`[data-view="${route}"]`);
    if (activeItem) {
      activeItem.classList.add("active");
    }
  }

  handleAction(action, element) {
    console.log(`🎯 Acción detectada: ${action}`, element);

    // Acciones de navegación
    if (action === "show-program-form") {
      this.navigate("form-program");
    } else if (action === "show-subject-form") {
      this.navigate("form-subject");
    } else if (action === "show-teacher-form") {
      this.navigate("form-teacher");
    } else if (action === "cancel-form") {
      this.navigate("cancel-form");
    }
    // Acciones masivas
    else if (action === "start-bulk-verification") {
      this.handleBulkAction("verification");
    } else if (action === "start-bulk-creation") {
      this.handleBulkAction("creation");
    } else if (action === "start-bulk-enrollment") {
      this.handleBulkAction("enrollment");
    } else if (action === "bulk-verify") {
      this.handleBulkAction("verification");
    } else if (action === "bulk-create-courses") {
      this.handleBulkAction("creation");
    } else if (action === "bulk-create-users") {
      this.handleBulkAction("user-creation");
    }
    // Acciones personalizadas registradas
    else if (this.actionHandlers[action]) {
      this.actionHandlers[action](element);
    } else {
      console.warn(`⚠️ Acción no manejada: ${action}`);
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

    console.log("📝 Enviando formulario de programa:", data);

    // Aquí llamarías a la API de Moodle
    // const result = await this.academicManager.moodleApi.createProgram(data);

    // Por ahora solo mostramos un mensaje
    alert("Programa creado (simulación)");
    this.navigate("cancel-form");
  }

  async handleSubjectFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log("📝 Enviando formulario de asignatura:", data);
    alert("Asignatura creada (simulación)");
    this.navigate("cancel-form");
  }

  async handleTeacherFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log("📝 Enviando formulario de docente:", data);
    alert("Docente creado (simulación)");
    this.navigate("cancel-form");
  }

  async handleBulkAction(actionType) {
    console.log(`⚡ Iniciando acción masiva: ${actionType}`);

    // Mostrar indicador de carga
    const resultsContainer = document.getElementById("results-container");
    if (resultsContainer) {
      resultsContainer.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3>Ejecutando acción masiva...</h3>
                    </div>
                    <div class="card-body">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <p>Procesando, por favor espere...</p>
                        </div>
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
          {
            operation: "Curso 1",
            status: "success",
            message: "Creado exitosamente",
          },
          {
            operation: "Curso 2",
            status: "success",
            message: "Creado exitosamente",
          },
          { operation: "Curso 3", status: "warning", message: "Ya existía" },
        ],
      };

      if (this.academicManager.renderResults) {
        await this.academicManager.renderResults(mockResults);
      }
    }, 2000);
  }
}
