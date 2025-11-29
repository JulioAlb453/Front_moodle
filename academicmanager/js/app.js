class AcademicManager {
  constructor() {
    this.renderer = new MustacheRenderer();
    this.moodleAPI = new MoodleAPI(moodleData.baseUrl, moodleData.sesskey);
    this.concurrentActions = new ConcurrentActions(this.moodleAPI);
  }

  async init() {
    console.log("Academic Manager iniciado");

    // Cargar templates primero
    await this.renderer.loadAllTemplates();

    // Renderizar toda la interfaz
    this.renderInterface();

    this.setupNavigation();
    this.setupEventListeners();
    await this.loadInitialData();

    // Mostrar vista según la acción actual
    this.showView(moodleData.currentAction);
  }

  renderInterface() {
    const appContainer = document.getElementById("academic-manager-app");
    if (!appContainer) return;

    appContainer.innerHTML = `
            <!-- Navegación -->
            <nav class="header">
                <div class="nav-bar">
                    <div class="logo">Academic Manager</div>
                    <ul class="nav-links">
                        <li><a href="#" id="nav-main">Inicio</a></li>
                        <li><a href="#" id="nav-admin">Administración</a></li>
                        <li><a href="#" id="nav-bulk">Acciones Masivas</a></li>
                    </ul>
                    <div class="user-info">
                        ${moodleData.userName}
                    </div>
                </div>
            </nav>

            <div class="container">
                <!-- Vista principal -->
                <div id="main-view" class="view">
                    <div id="selection-container"></div>
                    <div id="subjects-container"></div>
                </div>

                <!-- Vista de administración -->
                <div id="admin-view" class="view">
                    <div id="admin-container">
                        <div class="card">
                            <div class="card-header">
                                <h3>Panel de Administración</h3>
                            </div>
                            <div class="admin-actions">
                                <div class="action-group">
                                    <h4>Acciones Individuales</h4>
                                    <button class="btn btn-primary" onclick="academicManager.showCreateProgramForm()">
                                        Crear Programa
                                    </button>
                                    <button class="btn btn-primary" onclick="academicManager.showCreateSubjectForm()">
                                        Crear Asignatura
                                    </button>
                                    <button class="btn btn-primary" onclick="academicManager.showCreateTeacherForm()">
                                        Crear Docente
                                    </button>
                                </div>
                                
                                <div class="action-group">
                                    <h4>Acciones Masivas</h4>
                                    <button class="btn btn-warning" onclick="academicManager.bulkVerifyCourses()">
                                        Verificar Cursos (Todos)
                                    </button>
                                    <button class="btn btn-success" onclick="academicManager.bulkCreateCourses()">
                                        Crear Cursos (Todos)
                                    </button>
                                    <button class="btn btn-success" onclick="academicManager.bulkCreateUsers()">
                                        Crear Usuarios (Todos)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="form-container"></div>
                </div>

                <!-- Vista de acciones masivas -->
                <div id="bulk-view" class="view">
                    <div id="bulk-actions-container">
                        <div class="card">
                            <div class="card-header">
                                <h3>Acciones Concurrentes Masivas</h3>
                            </div>
                            <div class="concurrent-actions">
                                <button class="btn btn-warning btn-lg" onclick="academicManager.startBulkVerification()">
                                    ⚡ Verificar Todos los Cursos
                                </button>
                                <button class="btn btn-success btn-lg" onclick="academicManager.startBulkCreation()">
                                    🚀 Crear Todos los Cursos
                                </button>
                                <button class="btn btn-primary btn-lg" onclick="academicManager.startBulkEnrollment()">
                                    👥 Matricular Todos los Estudiantes
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="results-container"></div>
                </div>
            </div>
        `;
  }

  setupNavigation() {
    console.log("Configurando navegación...");

    // Navegación entre vistas
    document.getElementById("nav-main").addEventListener("click", (e) => {
      e.preventDefault();
      this.showView("main");
    });

    document.getElementById("nav-admin").addEventListener("click", (e) => {
      e.preventDefault();
      this.showView("admin");
    });

    document.getElementById("nav-bulk").addEventListener("click", (e) => {
      e.preventDefault();
      this.showView("bulk");
    });
  }

  setupEventListeners() {
    console.log("Configurando event listeners...");

    // Los event listeners para selects se configurarán cuando se rendericen los templates
  }

  async loadInitialData() {
    console.log("Cargando datos iniciales...");

    // Datos de ejemplo
    const programs = [
      { id: 1, nombre: "Ingeniería en Software" },
      { id: 2, nombre: "Administración de Empresas" },
      { id: 3, nombre: "Psicología Organizacional" },
    ];

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    this.renderer.renderSelection(programs, semesters);
  }

  showView(viewName) {
    console.log("Mostrando vista:", viewName);

    // Ocultar todas las vistas
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active");
    });

    // Mostrar vista seleccionada
    document.getElementById(`${viewName}-view`).classList.add("active");

    // Actualizar URL sin recargar la página
    history.pushState({}, "", `?action=${viewName}`);
  }

  // ... el resto de los métodos igual que antes ...
}

// Hacer academicManager global
let academicManager;

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM cargado, inicializando Academic Manager...");
  academicManager = new AcademicManager();
  await academicManager.init();
  console.log("Academic Manager inicializado correctamente");
});
