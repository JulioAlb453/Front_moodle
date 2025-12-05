/**
 * Academic Manager - Aplicación principal
 * Integración con Moodle
 */

// Variables globales
let academicManager;
let uiRenderer;
let configManager;
let router;
let isInitialized = false;

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("📋 DOM cargado de Academic Manager");

  // Verificar si ya estamos en Moodle
  if (window.M && window.M.cfg) {
    console.log("✅ Moodle detectado, integrando Academic Manager");
  }

  // Crear instancia del AcademicManager
  academicManager = new AcademicManager();

  // Inicializar la aplicación
  initAcademicManager();
});

/**
 * Inicialización principal de Academic Manager
 */
async function initAcademicManager() {
  console.log("🚀 Iniciando Academic Manager...");

  try {
    configManager = new ConfigManager();
    await configManager.loadConfig();
    console.log("✅ ConfigManager inicializado");

    // 1.1 Registrar datos de Moodle DESPUÉS de crear configManager
    if (window.moodleData) {
      console.log(
        "Registrando usuario de Moodle en ConfigManager:",
        window.moodleData
      );

      configManager.set("user", {
        id: window.moodleData.userId,
        name: window.moodleData.userName,
        sesskey: window.moodleData.sesskey,
        baseUrl: window.moodleData.baseUrl,
      });
    } else {
      console.warn("⚠️ No existe window.moodleData");
    }

    // 1. Inicializar ConfigManager (carga configuración de Moodle)
    configManager = new ConfigManager();
    await configManager.loadConfig();
    console.log("✅ ConfigManager inicializado");

    // 2. CARGAR TEMPLATES PRIMERO (esto es crucial)
    console.log("📦 Cargando templates Mustache...");
    await MustacheRenderer.loadTemplates();
    console.log("✅ Templates cargados");

    // 3. Inicializar UI Renderer
    uiRenderer = new UIRenderer();
    console.log("🎨 UIRenderer creado");

    // 4. Buscar o crear contenedor en Moodle
    const container = findOrCreateContainer();
    if (!container) {
      throw new Error("No se pudo encontrar contenedor en Moodle");
    }

    // 5. Renderizar interfaz principal en el contenedor
    console.log("🏠 Renderizando interfaz en Moodle...");
    // await uiRenderer.renderMainInterface(container);
    console.log("✅ Interfaz renderizada");

    // 6. Inicializar Router
    router = new Router(container);
    console.log("📡 Router inicializado");

    // 7. Configurar eventos de navegación
    setupNavigationEvents();

    // 8. Navegar a la vista inicial
    const initialRoute = getInitialRoute();
    console.log(`📍 Navegando a ruta inicial: ${initialRoute}`);
    await router.navigate(initialRoute);

    isInitialized = true;
    console.log("🎉 Academic Manager completamente inicializado en Moodle");

    // Disparar evento de inicialización completa
    document.dispatchEvent(new CustomEvent("academicmanager:ready"));
  } catch (error) {
    console.error("❌ Error al inicializar Academic Manager:", error);
    showMoodleError("Error al cargar Academic Manager. Recarga la página.");
  }
}

/**
 * Encontrar o crear contenedor en la interfaz de Moodle
 */
function findOrCreateContainer() {
  // Estrategia 1: Buscar contenedor existente por ID
  let container = document.getElementById("academic-manager-container");

  if (!container) {
    // Estrategia 2: Buscar contenedor por clase
    container = document.querySelector(".academic-manager-container");
  }

  if (!container) {
    // Estrategia 3: Buscar región principal de Moodle
    const moodleMain =
      document.getElementById("region-main") ||
      document.querySelector(".main-content") ||
      document.getElementById("page-content");

    if (moodleMain) {
      console.log("🔍 Creando contenedor en región principal de Moodle");
      container = document.createElement("div");
      container.id = "academic-manager-container";
      container.className = "academic-manager-container container-fluid mt-3";
      moodleMain.appendChild(container);
    }
  }

  if (!container) {
    // Estrategia 4: Crear en el body
    console.log("🔍 Creando contenedor en body");
    container = document.createElement("div");
    container.id = "academic-manager-container";
    container.className = "academic-manager-container container-fluid";
    document.body.appendChild(container);
  }

  return container;
}

/**
 * Configurar eventos de navegación
 */
function setupNavigationEvents() {
  console.log("🔗 Configurando eventos de navegación...");

  // Delegación de eventos para toda la aplicación
  document.addEventListener("click", (e) => {
    // Navegación por data-route
    const routeElement = e.target.closest("[data-route]");
    if (routeElement) {
      e.preventDefault();
      const route = routeElement.getAttribute("data-route");
      const params = routeElement.getAttribute("data-params");
      const parsedParams = params ? JSON.parse(params) : {};

      console.log(`📍 Click en ruta: ${route}`, parsedParams);
      router.navigate(route, parsedParams);
      return;
    }

    // Navegación por href con hash
    if (
      e.target.tagName === "A" &&
      e.target.getAttribute("href")?.startsWith("#")
    ) {
      e.preventDefault();
      const route = e.target.getAttribute("href").slice(1);
      router.navigate(route);
      return;
    }
  });

  // Manejar botones de navegación del navegador
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.route) {
      router.navigate(event.state.route, event.state.params || {});
    } else {
      const route = window.location.hash.slice(1) || "dashboard";
      router.navigate(route);
    }
  });

  // Integrar con navegación de Moodle si existe
  if (typeof M !== "undefined" && M.navigation && M.navigation.update) {
    console.log("🔗 Integrando con navegación de Moodle");
    // Puedes agregar integración adicional aquí
  }
}

/**
 * Determinar ruta inicial basada en URL o configuración
 */
function getInitialRoute() {
  // 1. Verificar hash en URL
  if (window.location.hash) {
    const route = window.location.hash.slice(1);
    if (router && router.isValidRoute(route)) {
      return route;
    }
  }

  // 2. Verificar parámetros de URL
  const urlParams = new URLSearchParams(window.location.search);
  const routeParam = urlParams.get("route");
  if (routeParam && router && router.isValidRoute(routeParam)) {
    return routeParam;
  }

  // 3. Ruta por defecto
  return "dashboard";
}

/**
 * Mostrar error integrado con estilos de Moodle
 */
function showMoodleError(message) {
  const errorHtml = `
        <div class="alert alert-danger alert-block fade in">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <strong>Error en Academic Manager</strong>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()">
                Recargar aplicación
            </button>
        </div>
    `;

  const container =
    document.getElementById("academic-manager-container") ||
    document.querySelector(".academic-manager-container");

  if (container) {
    container.innerHTML = errorHtml;
  } else {
    // Crear contenedor de error
    const errorContainer = document.createElement("div");
    errorContainer.className = "academic-manager-error container mt-4";
    errorContainer.innerHTML = errorHtml;
    document.body.appendChild(errorContainer);
  }
}

/**
 * Verificar si la aplicación está inicializada
 */
function isAcademicManagerReady() {
  return isInitialized;
}

/**
 * Obtener instancia del router (para uso externo)
 */
function getRouter() {
  return router;
}

/**
 * Obtener instancia del ConfigManager
 */
function getConfigManager() {
  return configManager;
}

/**
 * Obtener instancia del UIRenderer
 */
function getUIRenderer() {
  return uiRenderer;
}

// AcademicManager Class
class AcademicManager {
  constructor() {
    console.log("👨‍🏫 AcademicManager creado");
    this.modules = {};
    this.data = {};
    this.isReady = false;
  }

  /**
   * Inicializar módulos del Academic Manager
   */
  async initModules() {
    console.log("🔧 Inicializando módulos...");

    // Inicializar módulos aquí
    this.modules.courses = new CoursesModule();
    this.modules.users = new UsersModule();
    this.modules.grades = new GradesModule();

    await Promise.all([
      this.modules.courses.init(),
      this.modules.users.init(),
      this.modules.grades.init(),
    ]);

    this.isReady = true;
    console.log("✅ Módulos inicializados");
  }

  /**
   * Obtener datos del curso actual de Moodle
   */
  getCurrentCourse() {
    if (window.M && window.M.course) {
      return window.M.course;
    }

    // Intentar extraer de la URL o página de Moodle
    const courseMatch = window.location.pathname.match(
      /course\/view\.php\?id=(\d+)/
    );
    if (courseMatch) {
      return {
        id: parseInt(courseMatch[1]),
        fullname: document.title || "Curso desconocido",
      };
    }

    return null;
  }

  /**
   * Sincronizar datos con Moodle
   */
  async syncWithMoodle() {
    console.log("🔄 Sincronizando con Moodle...");

    try {
      // Aquí implementarías la sincronización real
      const moodleData = await this.fetchMoodleData();
      this.data = { ...this.data, ...moodleData };

      console.log("✅ Sincronización completada");
      return true;
    } catch (error) {
      console.error("❌ Error en sincronización:", error);
      return false;
    }
  }

  /**
   * Obtener datos de Moodle via AJAX
   */
  async fetchMoodleData() {
    return new Promise((resolve, reject) => {
      if (typeof M !== "undefined" && M.util && M.util.ajax) {
        // Usar AJAX de Moodle
        M.util.ajax.call(
          [
            {
              methodname: "local_academicmanager_get_data",
              args: {},
            },
          ],
          {
            done: (data) => resolve(data),
            fail: (error) => reject(error),
          }
        );
      } else {
        // Fallback a fetch API
        fetch(`${window.M.cfg.wwwroot}/local/academicmanager/ajax.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "get_data" }),
        })
          .then((response) => response.json())
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      }
    });
  }
}

// Módulos de ejemplo
class CoursesModule {
  async init() {
    console.log("📚 Inicializando módulo de cursos");
  }
}

class UsersModule {
  async init() {
    console.log("👥 Inicializando módulo de usuarios");
  }
}

class GradesModule {
  async init() {
    console.log("📊 Inicializando módulo de calificaciones");
  }
}

// Exportar para uso global (compatible con Moodle)
if (typeof window !== "undefined") {
  window.AcademicManagerApp = {
    init: initAcademicManager,
    getRouter: getRouter,
    getConfigManager: getConfigManager,
    getUIRenderer: getUIRenderer,
    isReady: isAcademicManagerReady,
    showError: showMoodleError,
  };

  // También como global individual para compatibilidad
  window.academicManager = academicManager;
  window.uiRenderer = uiRenderer;
  window.configManager = configManager;
  window.router = router;
}

console.log("📦 Academic Manager cargado y listo para inicializar");
