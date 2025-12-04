class AcademicManager {
  constructor() {
    this.currentView = "main";
    this.selectedProgram = null;
    this.selectedSemester = null;

    // Inicializar componentes
    this.configManager = new ConfigManager();
    this.mustacheRenderer = new MustacheRenderer();
    this.uiRenderer = new UIRenderer(this.mustacheRenderer, this.configManager);
    this.router = new Router(this);
  }

  async init() {
    console.log("🚀 Inicializando Academic Manager...");

    try {
      // 1. Inicializar configManager
      this.configManager.init();

      // 2. Cargar templates
      await this.mustacheRenderer.loadAllTemplates();

      // 3. Renderizar interfaz principal
      await this.renderMainInterface();

      // 4. Inicializar router
      this.router.init();

      // 5. Mostrar vista inicial
      this.setupDirectNavigation();

      // 6. Ocultar loading
      this.hideLoading();

      console.log("✅ Academic Manager inicializado");
    } catch (error) {
        console.error('❌ Error en init:', error);
        this.showError('Error inicializando: ' + error.message);
    }
  }

  // En app.js, después de renderMainInterface
  async renderMainInterface() {
    const data = {
      userName: this.configManager.config.userName,
      baseUrl: this.configManager.config.baseUrl,
      currentView: this.currentView,
      activeMain: this.currentView === "main",
      activeAdmin: this.currentView === "admin",
      activeBulk: this.currentView === "bulk",
    };

    console.log("🎨 Renderizando interfaz principal con datos:", data);

    await this.uiRenderer.renderMainInterface(data);

    // Verificar HTML generado
    setTimeout(() => {
      const appContainer = document.getElementById("academic-manager-app");
      console.log("📄 HTML generado (primeros 1000 caracteres):");
      console.log(appContainer.innerHTML.substring(0, 1000));

      // Verificar elementos del menú
      const menuItems = appContainer.querySelectorAll("[data-view]");
      console.log(`🔗 Elementos del menú encontrados: ${menuItems.length}`);

      menuItems.forEach((item) => {
        console.log(`   - data-view="${item.getAttribute("data-view")}"`);
        console.log(`     Clases: "${item.className}"`);
        console.log(`     HTML: ${item.outerHTML.substring(0, 150)}`);
      });
    }, 500);
  }
  async showView(viewName) {
    console.log(`📱 ACADEMIC MANAGER: Mostrando vista: ${viewName}`);
    console.log(`   ConfigManager disponible: ${!!this.configManager}`);
    console.log(`   UIRenderer disponible: ${!!this.uiRenderer}`);

    this.currentView = viewName;

    // Ocultar todas las vistas primero
    console.log("   Ocultando todas las vistas...");
    this.hideAllViews();

    // Mostrar solo la vista solicitada
    console.log(`   Renderizando vista ${viewName}...`);
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
      default:
        console.warn(`   Vista no reconocida: ${viewName}`);
    }

    // Actualizar menú activo
    console.log("   Actualizando menú activo...");
    this.updateActiveMenu();

    console.log(`✅ Vista ${viewName} mostrada`);
  }

  async renderMainView() {
    const programs = this.configManager.getPrograms();
    const semesters = this.configManager.getSemesters();

    await this.uiRenderer.renderMainView(programs, semesters);

    // Mostrar contenedor de vista main
    const mainView = document.getElementById("main-view");
    if (mainView) {
      mainView.style.display = "block";
    }
  }

  async renderAdminView() {
    await this.uiRenderer.renderAdminView();

    // Mostrar contenedor de vista admin
    const adminView = document.getElementById("admin-view");
    if (adminView) {
      adminView.style.display = "block";
    }
  }

  setupDirectNavigation() {
    console.log("🔗 Configurando navegación directa...");

    // Esperar a que el DOM se actualice
    setTimeout(() => {
      // Buscar elementos del menú dentro de tu aplicación
      const menuItems = document.querySelectorAll(
        "#academic-manager-app [data-view]"
      );

      console.log(`📌 Encontrados ${menuItems.length} elementos del menú`);

      menuItems.forEach((item) => {
        // Remover listeners existentes
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);

        // Agregar listener directo
        newItem.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const view = newItem.getAttribute("data-view");
            console.log(`🎯 CLIC DIRECTO en: ${view}`);

            // Usar showView directamente
            this.showView(view);
          },
          true
        ); // Capturar en fase de captura

        console.log(
          `✅ Listener directo para: ${newItem.getAttribute("data-view")}`
        );
      });
    }, 1000);
  }
  async renderBulkView() {
    await this.uiRenderer.renderBulkView();

    // Mostrar contenedor de vista bulk
    const bulkView = document.getElementById("bulk-view");
    if (bulkView) {
      bulkView.style.display = "block";
    }
  }

  hideAllViews() {
    // Ocultar todas las vistas
    ["main-view", "admin-view", "bulk-view"].forEach((viewId) => {
      const view = document.getElementById(viewId);
      if (view) {
        view.style.display = "none";
      }
    });
  }

  updateActiveMenu() {
    // Remover 'active' de todos los items
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Agregar 'active' al item correspondiente
    const activeItem = document.querySelector(
      `[data-view="${this.currentView}"]`
    );
    if (activeItem) {
      activeItem.classList.add("active");
    }
  }

  // Métodos para manejar selecciones
  async handleProgramChange(programId) {
    this.selectedProgram = programId;
    if (this.selectedProgram && this.selectedSemester) {
      await this.loadAndRenderSubjects();
    }
  }

  async handleSemesterChange(semester) {
    this.selectedSemester = semester;
    if (this.selectedProgram && this.selectedSemester) {
      await this.loadAndRenderSubjects();
    }
  }

  async loadAndRenderSubjects() {
    if (!this.selectedProgram || !this.selectedSemester) return;

    const programName = this.configManager.getProgramName(this.selectedProgram);
    const subjects = this.configManager.getSubjects(
      this.selectedProgram,
      this.selectedSemester
    );

    await this.uiRenderer.loadAndRenderSubjects(
      subjects,
      programName,
      this.selectedSemester
    );
  }

  // Métodos para formularios
  async showForm(formType) {
    console.log(`📝 Mostrando formulario: ${formType}`);

    // Obtener datos del configManager
    const data = {
      programs: this.configManager.getPrograms(),
      semesters: this.configManager.getSemesters(),
      subjects: this.configManager.getSubjects(),
    };

    // Usar el uiRenderer para renderizar el formulario
    await this.uiRenderer.renderForm(formType, data);

    // Mostrar el contenedor de formulario
    const formContainer = document.getElementById("form-container");
    if (formContainer) {
      formContainer.style.display = "block";

      // Hacer scroll al formulario
      formContainer.scrollIntoView({ behavior: "smooth" });

      console.log("✅ Formulario mostrado");
    } else {
      console.error("❌ Contenedor de formulario no encontrado");
    }
  }

  // En el método hideForm
  hideForm() {
    console.log("❌ Ocultando formulario");

    const formContainer = document.getElementById("form-container");
    if (formContainer) {
      formContainer.style.display = "none";
      formContainer.innerHTML = "";
    }
  }
  hideForm() {
    console.log("❌ Ocultando formulario");

    const formContainer = document.getElementById("form-container");
    if (formContainer) {
      formContainer.style.display = "none";
      formContainer.innerHTML = "";
    }
  }

  hideForm() {
    const formContainer = document.getElementById("form-container");
    if (formContainer) {
      formContainer.style.display = "none";
      formContainer.innerHTML = "";
    }
  }

  async renderResults(data) {
    await this.uiRenderer.renderResults(data);
  }

  hideLoading() {
    const loading = document.getElementById("loading-message");
    if (loading) {
      loading.style.display = "none";
    }
  }

  showError(message) {
    const appContainer = document.getElementById("academic-manager-app");
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

// DEPURACIÓN: Encontrar y corregir botones con onclick problemáticos
function fixProblematicButtons() {
  console.log("🔍 Buscando botones con onclick problemáticos...");

  // Buscar TODOS los botones en la página
  const allButtons = document.querySelectorAll("button");
  let foundProblems = false;

  allButtons.forEach((button) => {
    const onclick = button.getAttribute("onclick");

    if (onclick && onclick.includes("showCreate")) {
      console.warn("⚠️ Botón con onclick problemático encontrado:", button);
      console.log("  - onclick:", onclick);
      console.log("  - HTML:", button.outerHTML);
      console.log(
        "  - Padre:",
        button.parentElement?.outerHTML?.substring(0, 100)
      );

      foundProblems = true;

      // Reemplazar onclick con data-action
      if (onclick.includes("showCreateProgramForm")) {
        button.setAttribute("data-action", "show-program-form");
        console.log('  → Corregido: data-action="show-program-form"');
      } else if (onclick.includes("showCreateSubjectForm")) {
        button.setAttribute("data-action", "show-subject-form");
        console.log('  → Corregido: data-action="show-subject-form"');
      } else if (onclick.includes("showCreateTeacherForm")) {
        button.setAttribute("data-action", "show-teacher-form");
        console.log('  → Corregido: data-action="show-teacher-form"');
      }

      // Remover el atributo onclick
      button.removeAttribute("onclick");
    }
  });

  if (!foundProblems) {
    console.log("✅ No se encontraron botones con onclick problemáticos");
  }
}

// Ejecutar después de que se renderice todo
setTimeout(fixProblematicButtons, 2000);

// Inicialización
// Depuración de clics
document.addEventListener('click', function(e) {
    const academicManagerApp = document.getElementById('academic-manager-app');
    const isInApp = academicManagerApp && academicManagerApp.contains(e.target);
    
    if (isInApp) {
        console.log('🎯 CLIC DENTRO DE ACADEMIC MANAGER:', {
            target: e.target.tagName,
            class: e.target.className,
            id: e.target.id,
            dataView: e.target.getAttribute('data-view'),
            dataAction: e.target.getAttribute('data-action'),
            path: e.composedPath().map(el => el.tagName).slice(0, 5)
        });
    }
}, true); // true para fase de captura

window.showCreateProgramForm = function () {
  console.log("📝 showCreateProgramForm llamado");
  if (window.academicManager && window.academicManager.router) {
    window.academicManager.router.navigate("form-program");
  } else {
    console.error("Academic Manager o Router no disponibles");
  }
};

window.showCreateSubjectForm = function () {
  console.log("📝 showCreateSubjectForm llamado");
  if (window.academicManager && window.academicManager.router) {
    window.academicManager.router.navigate("form-subject");
  } else {
    console.error("Academic Manager o Router no disponibles");
  }
};

window.showCreateTeacherForm = function () {
  console.log("📝 showCreateTeacherForm llamado");
  if (window.academicManager && window.academicManager.router) {
    window.academicManager.router.navigate("form-teacher");
  } else {
    console.error("Academic Manager o Router no disponibles");
  }
};

console.log("✅ Funciones globales definidas temporalmente");
