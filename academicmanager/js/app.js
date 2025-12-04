class AcademicManager {
  constructor() {
    // Inicializar gestor de configuración
    this.configManager = new ConfigManager();
    this.config = this.configManager.init();

    // Inicializar renderizador con configuración
    this.renderer = new MustacheRenderer();
    this.currentView = this.config.currentAction;

    this.uiRenderer = null;
    this.router = null;
  }

  async init() {
    console.log("Academic Manager - Inicializando coordinador");

    // 1. CARGAR TEMPLATES PRIMERO
    console.log("Cargando templates Mustache...");
    const templatesLoaded = await this.renderer.loadAllTemplates();

    if (!templatesLoaded) {
      console.error("Error crítico: No se pudieron cargar los templates");
      // Podrías mostrar un error al usuario aquí
      return;
    }

    console.log("Templates cargados exitosamente");

    // 2. Inicializar UI Renderer (ahora con templates cargados)
    await this.initializeUIRenderer();

    // 3. Renderizar interfaz principal
    await this.renderMainInterface();

    this.initializeRouter();

    // 4. Mostrar vista inicial
    await this.showView(this.currentView);

    console.log("Coordinador inicializado correctamente");
  }

  async initializeUIRenderer() {
    if (typeof UIRenderer !== "undefined") {
      this.uiRenderer = new UIRenderer(this.renderer, this.configManager);
      console.log("UI Renderer cargado");
    } else {
      console.warn("UI Renderer no disponible, usando métodos básicos");
    }
  }

  initializeRouter() {
    if (typeof Router !== "undefined") {
      this.router = new Router(this);
      this.router.init();
      console.log("Router cargado");

      // Registrar handlers para acciones específicas
      this.router.on("load-subjects", async (button) => {
        const programId = document.getElementById("program-select")?.value;
        const semester = document.getElementById("semester-select")?.value;

        if (programId && semester) {
          const subjects = this.configManager.getSubjects(programId, semester);
          const programName = this.configManager.getProgramName(programId);

          await this.renderSubjects({
            subjects,
            program_name: programName,
            semester,
          });
        }
      });
    } else {
      console.warn("Router no disponible, usando navegación básica");
      this.setupBasicNavigation();
    }
  }

  setupBasicNavigation() {
    // Método simple de respaldo si no hay router
    document.addEventListener("click", (e) => {
      if (e.target.matches("#nav-main")) {
        e.preventDefault();
        this.showView("main");
      } else if (e.target.matches("#nav-admin")) {
        e.preventDefault();
        this.showView("admin");
      } else if (e.target.matches("#nav-bulk")) {
        e.preventDefault();
        this.showView("bulk");
      }
    });
  }

  // ========== COORDINACIÓN DE RENDERIZADO ==========
  async renderMainInterface() {
    const templateData = {
      userName: this.config.userName,
      views: [
        { id: "main", name: "Inicio" },
        { id: "admin", name: "Administración" },
        { id: "bulk", name: "Acciones Masivas" },
      ],
    };

    // Delegar al UI Renderer o usar Mustache directo
    if (this.uiRenderer) {
      await this.uiRenderer.renderMainInterface(templateData);
    } else {
      const rendered = this.renderer.render(
        "main-interface",
        templateData,
        "academic-manager-app"
      );
      if (!rendered) {
        console.error("No se pudo renderizar la interfaz principal");
      }
    }
  }

  async showView(viewName) {
    this.currentView = viewName;

    // Actualizar clases de vistas
    this.updateViewClasses(viewName);

    // Delegar renderizado de contenido
    if (this.uiRenderer) {
      await this.uiRenderer.renderViewContent(viewName);
    } else {
      await this.renderViewContentBasic(viewName);
    }
  }

  async renderSubjectForm(data) {
    const programs = data.programs || this.configManager.getPrograms();
    const semesters = data.semesters || this.configManager.getSemesters();

    const templateData = {
        programs,
        semesters
    };

    const rendered = this.renderer.render(
        "subject-form",
        templateData,
        "form-container"
    );

    if (!rendered) {
        this.renderSubjectFormFallback(templateData);
    }
}



  
  updateViewClasses(viewName) {
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active");
    });

    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
      targetView.classList.add("active");
    }
  }

  async renderViewContentBasic(viewName) {
    // Método básico si no hay UI Renderer
    switch (viewName) {
      case "main":
        await this.renderMainViewBasic();
        break;
      case "admin":
        this.renderer.render("admin-panel", {}, "admin-container");
        break;
      case "bulk":
        this.renderer.render("bulk-actions", {}, "bulk-actions-container");
        break;
    }
  }

  async renderMainViewBasic() {
    // Obtener datos del configManager
    const programs = this.configManager.getPrograms();
    const semesters = this.configManager.getSemesters();

    this.renderer.renderSelection(programs, semesters);
  }

  // ========== MÉTODOS PÚBLICOS PARA OTROS MÓDULOS ==========
  async renderForm(formType, data = {}) {
    if (this.uiRenderer && this.uiRenderer.renderForm) {
      await this.uiRenderer.renderForm(formType, data);
    } else {
      await this.renderFormBasic(formType, data);
    }
  }

  async renderFormBasic(formType, data) {
    switch (formType) {
      case "program":
        const programs = data.programs || this.configManager.getPrograms();
        const semesters = data.semesters || this.configManager.getSemesters();
        this.renderer.renderProgramForm(programs, semesters);
        break;
      case "subject":
        this.renderer.renderSubjectForm(
          data.programs || this.configManager.getPrograms(),
          data.semesters || this.configManager.getSemesters()
        );
        break;
      case "teacher":
        const subjects = data.subjects || this.configManager.getSubjects();
        this.renderer.renderTeacherForm(subjects);
        break;
    }
  }

  async renderSubjects(data = {}) {
    if (this.uiRenderer && this.uiRenderer.renderSubjects) {
      await this.uiRenderer.renderSubjects(data);
    } else {
      this.renderer.renderSubjects(
        data.subjects || [],
        data.program_name || "",
        data.semester || ""
      );
    }
  }

  async renderResults(data = {}) {
    if (this.uiRenderer && this.uiRenderer.renderResults) {
      await this.uiRenderer.renderResults(data);
    } else {
      this.renderer.renderResults(data.operations || []);
    }
  }

  // ========== MÉTODOS AUXILIARES ==========
  hideForm() {
    const container = document.getElementById("form-container");
    if (container) {
      container.innerHTML = "";
    }
  }

  getCurrentView() {
    return this.currentView;
  }

  getConfigManager() {
    return this.configManager;
  }

  getRenderer() {
    return this.renderer;
  }
}

// Solo crear instancia - se inicializará cuando el DOM esté listo
let academicManager;

document.addEventListener("DOMContentLoaded", async function () {
  academicManager = new AcademicManager();
  await academicManager.init();
});
