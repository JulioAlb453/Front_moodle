/**
 * MustacheRenderer - Sistema de templates Mustache para Academic Manager
 */

class MustacheRenderer {
  static instance = null;

  constructor() {
    if (MustacheRenderer.instance) {
      return MustacheRenderer.instance;
    }

    this.templates = {};
    this.templatesLoaded = false;
    this.loadingPromise = null;
    this.templateBasePath = "/local/academicmanager/templates/";

    MustacheRenderer.instance = this;
    console.log("📄 MustacheRenderer creado");
  }

  /**
   * Cargar todos los templates
   */
  static async loadTemplates(templateList = null) {
    const instance = new MustacheRenderer();

    // Si ya están cargados, retornar inmediatamente
    if (instance.templatesLoaded) {
      console.log("✅ Templates ya cargados");
      return instance.templates;
    }

    // Si ya se está cargando, retornar la promesa existente
    if (instance.loadingPromise) {
      console.log("⏳ Templates ya se están cargando...");
      return instance.loadingPromise;
    }

    console.log("📦 Iniciando carga de templates...");

    // Lista de templates por defecto
    const defaultTemplates = templateList || [
      "main-interface",
      "navigation",
      "header",
      "dashboard-view",
      "courses-view",
      "students-view",
      "grades-view",
      "reports-view",
      "bulk-actions-view",
      "admin-view",
      "settings-view",
      "modal",
      "error-view",
      "loading-view",
      "forms/course-form",
      "forms/student-form",
      "forms/grade-form",
      "tables/courses-table",
      "tables/students-table",
      "tables/grades-table",
      "cards/stats-card",
      "cards/info-card",
      "cards/action-card",
    ];

    // Crear promesa de carga
    instance.loadingPromise = new Promise(async (resolve, reject) => {
      try {
        await instance.loadTemplateFiles(defaultTemplates);
        instance.templatesLoaded = true;
        console.log(
          `✅ Todos los templates cargados: ${
            Object.keys(instance.templates).length
          }`
        );
        resolve(instance.templates);
      } catch (error) {
        console.error("❌ Error al cargar templates:", error);
        reject(error);
      } finally {
        instance.loadingPromise = null;
      }
    });

    return instance.loadingPromise;
  }

  /**
   * Cargar archivos de template individualmente
   */
  async loadTemplateFiles(templateNames) {
    const loadPromises = templateNames.map((templateName) =>
      this.loadTemplate(templateName)
    );

    await Promise.all(loadPromises);
  }

  /**
   * Cargar un template específico
   */
  async loadTemplate(templateName) {
    // Verificar si ya está cargado
    if (this.templates[templateName]) {
      console.log(`📁 Template ya cargado: ${templateName}`);
      return this.templates[templateName];
    }

    console.log(`📥 Cargando template: ${templateName}`);

    try {
      // Determinar ruta del template
      const templatePath = this.getTemplatePath(templateName);

      // Cargar template
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const templateContent = await response.text();

      // Guardar template
      this.templates[templateName] = templateContent;
      console.log(`✓ Template "${templateName}" cargado`);

      return templateContent;
    } catch (error) {
      console.error(`❌ Error al cargar template ${templateName}:`, error);

      // Crear template de respaldo
      const fallbackTemplate = this.createFallbackTemplate(templateName);
      this.templates[templateName] = fallbackTemplate;

      console.log(`⚠️ Usando template de respaldo para: ${templateName}`);

      return fallbackTemplate;
    }
  }

  /**
   * Obtener ruta del template
   */
  getTemplatePath(templateName) {
    // Intentar varias estrategias para encontrar el template

    // 1. Ruta específica de Moodle
    if (typeof M !== "undefined" && M.cfg && M.cfg.wwwroot) {
      return `${M.cfg.wwwroot}/local/academicmanager/templates/${templateName}.mustache`;
    }

    // 2. Ruta relativa desde la ubicación actual
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf("/"));

    // 3. Intentar diferentes ubicaciones comunes
    const possiblePaths = [
      `${this.templateBasePath}${templateName}.mustache`,
      `/templates/${templateName}.mustache`,
      `./templates/${templateName}.mustache`,
      `../templates/${templateName}.mustache`,
      `${basePath}/templates/${templateName}.mustache`,
    ];

    // Devolver la primera ruta que probablemente funcione
    return possiblePaths[0];
  }

  /**
   * Crear template de respaldo
   */
  createFallbackTemplate(templateName) {
    const templateMap = {
      "main-interface": `
                <div id="am-header"></div>
                <nav id="am-navigation" class="am-nav"></nav>
                <main id="am-views-container"></main>
                <footer class="mt-4 text-center text-muted">
                    <small>Academic Manager - {{currentDate}}</small>
                </footer>
            `,

      navigation: `
                <ul class="nav">
                    {{#menuItems}}
                    <li class="nav-item">
                        <a class="nav-link {{#active}}active{{/active}}" 
                           href="#{{id}}" 
                           data-route="{{id}}">
                            {{label}}
                        </a>
                    </li>
                    {{/menuItems}}
                </ul>
            `,

      header: `
                <div class="am-header">
                    <h1>{{title}}</h1>
                    {{#subtitle}}<p class="lead">{{subtitle}}</p>{{/subtitle}}
                    
                    {{#showCourseInfo}}
                    <div class="course-info">
                        <strong>Curso:</strong> {{course.fullname}}
                    </div>
                    {{/showCourseInfo}}
                    
                    {{#showUserInfo}}
                    <div class="user-info">
                        <strong>Usuario:</strong> {{user.fullname}}
                    </div>
                    {{/showUserInfo}}
                </div>
            `,

      "dashboard-view": `
                <div class="container-fluid">
                    <h2 class="mb-4">Dashboard</h2>
                    
                    <div class="row">
                        <div class="col-md-3">
                            <div class="am-card">
                                <div class="am-card-header">
                                    <h5>Resumen</h5>
                                </div>
                                <div class="am-card-body">
                                    <p>Bienvenido al Academic Manager</p>
                                    <p>Usuario: {{user.fullname}}</p>
                                    <p>Curso: {{course.fullname}}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-9">
                            <div class="am-card">
                                <div class="am-card-header">
                                    <h5>Acciones Rápidas</h5>
                                </div>
                                <div class="am-card-body">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <a href="#courses" data-route="courses" class="btn btn-primary w-100">
                                                Ver Cursos
                                            </a>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <a href="#students" data-route="students" class="btn btn-primary w-100">
                                                Ver Estudiantes
                                            </a>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <a href="#grades" data-route="grades" class="btn btn-primary w-100">
                                                Ver Calificaciones
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,

      "courses-view": `
                <div class="container-fluid">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Cursos</h2>
                        <button class="btn btn-primary" data-action="create-course">
                            <i class="bi bi-plus-circle"></i> Nuevo Curso
                        </button>
                    </div>
                    
                    <div class="am-card">
                        <div class="am-card-header">
                            <h5>Lista de Cursos</h5>
                        </div>
                        <div class="am-card-body">
                            <div class="table-responsive">
                                <table class="am-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Estudiantes</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {{#courses}}
                                        <tr>
                                            <td>{{id}}</td>
                                            <td>{{name}}</td>
                                            <td>{{students}}</td>
                                            <td>
                                                <span class="badge bg-{{statusColor}}">{{status}}</span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary" data-action="edit-course" data-id="{{id}}">
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                        {{/courses}}
                                        {{^courses}}
                                        <tr>
                                            <td colspan="5" class="text-center">
                                                No hay cursos disponibles
                                            </td>
                                        </tr>
                                        {{/courses}}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `,

      modal: `
                <div class="modal fade" id="{{id}}" tabindex="-1">
                    <div class="modal-dialog {{size}}">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">{{title}}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                {{{content}}}
                            </div>
                            {{#showFooter}}
                            <div class="modal-footer">
                                {{#buttons}}
                                <button type="button" 
                                        class="btn btn-{{type}}"
                                        {{#dismiss}}data-bs-dismiss="modal"{{/dismiss}}
                                        {{#action}}onclick="{{action}}"{{/action}}>
                                    {{label}}
                                </button>
                                {{/buttons}}
                            </div>
                            {{/showFooter}}
                        </div>
                    </div>
                </div>
            `,

      "error-view": `
                <div class="container text-center py-5">
                    <div class="alert alert-danger">
                        <h4>Error</h4>
                        <p>{{message}}</p>
                        <button class="btn btn-primary" onclick="router.navigate('dashboard')">
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            `,

      "loading-view": `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-3">{{message}}</p>
                </div>
            `,
    };

    return (
      templateMap[templateName] ||
      `<div>Template "${templateName}" no disponible</div>`
    );
  }

  /**
   * Renderizar un template con datos
   */
  static async render(templateName, data = {}) {
    const instance = new MustacheRenderer();

    // Asegurar que los templates estén cargados
    if (!instance.templatesLoaded && !instance.loadingPromise) {
      console.warn(`⚠️ Templates no cargados, cargando ${templateName}...`);
      await MustacheRenderer.loadTemplates([templateName]);
    } else if (instance.loadingPromise) {
      // Esperar a que termine la carga
      await instance.loadingPromise;
    }

    // Verificar si el template existe
    if (!instance.templates[templateName]) {
      console.warn(
        `⚠️ Template no encontrado: ${templateName}, intentando cargar...`
      );
      await instance.loadTemplate(templateName);
    }

    // Obtener template
    const template = instance.templates[templateName];
    if (!template) {
      throw new Error(`Template "${templateName}" no disponible`);
    }

    // Renderizar con Mustache
    try {
      const rendered = Mustache.render(template, data);
      return rendered;
    } catch (error) {
      console.error(`❌ Error al renderizar template ${templateName}:`, error);
      return `<div class="alert alert-danger">
                <strong>Error de renderizado:</strong> ${error.message}
            </div>`;
    }
  }

  /**
   * Verificar si un template está cargado
   */
  static isTemplateLoaded(templateName) {
    const instance = new MustacheRenderer();
    return !!instance.templates[templateName];
  }

  /**
   * Obtener lista de templates cargados
   */
  static getLoadedTemplates() {
    const instance = new MustacheRenderer();
    return Object.keys(instance.templates);
  }

  /**
   * Registrar un template manualmente
   */
  static registerTemplate(templateName, templateContent) {
    const instance = new MustacheRenderer();
    instance.templates[templateName] = templateContent;
    console.log(`📝 Template registrado manualmente: ${templateName}`);
  }

  /**
   * Limpiar cache de templates
   */
  static clearCache() {
    const instance = new MustacheRenderer();
    instance.templates = {};
    instance.templatesLoaded = false;
    console.log("🧹 Cache de templates limpiado");
  }

  /**
   * Pre-renderizar templates comunes para mejor performance
   */
  static async preloadCommonTemplates() {
    const commonTemplates = [
      "main-interface",
      "navigation",
      "header",
      "dashboard-view",
      "modal",
      "error-view",
      "loading-view",
    ];

    console.log("⚡ Pre-cargando templates comunes...");
    await MustacheRenderer.loadTemplates(commonTemplates);
    console.log("✅ Templates comunes pre-cargados");
  }
}

// Inicializar Mustache si no está cargado
if (typeof Mustache === "undefined") {
  console.warn("⚠️ Mustache.js no está cargado. Cargando desde CDN...");

  // Cargar Mustache.js desde CDN
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js";
  script.onload = () => {
    console.log("✅ Mustache.js cargado desde CDN");
    // Pre-cargar templates comunes
    MustacheRenderer.preloadCommonTemplates();
  };
  document.head.appendChild(script);
} else {
  // Pre-cargar templates comunes si Mustache ya está cargado
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      MustacheRenderer.preloadCommonTemplates();
    }, 1000);
  });
}

// Exportar para uso global
if (typeof window !== "undefined") {
  window.MustacheRenderer = MustacheRenderer;
}
