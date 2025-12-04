/**
 * ConfigManager - Maneja configuración y datos de Moodle
 */

class ConfigManager {
  constructor() {
    this.config = {
      moodle: {},
      academicManager: {},
      user: {},
      course: {},
    };
    if (typeof window !== "undefined" && !window.ConfigManager) {
      window.ConfigManager = ConfigManager;
    }
    this.isLoaded = false;
  }

  /**
   * Cargar configuración desde Moodle
   */
  async loadConfig() {
    console.log("⚙️ Cargando configuración desde Moodle...");

    try {
      // 1. Cargar configuración de Moodle
      this.loadMoodleConfig();

      // 2. Cargar configuración del usuario
      this.loadUserConfig();

      // 3. Cargar configuración del curso
      this.loadCourseConfig();

      // 4. Cargar configuración específica de Academic Manager
      await this.loadAcademicManagerConfig();

      // 5. Cargar preferencias del usuario
      await this.loadUserPreferences();

      this.isLoaded = true;
      console.log("✅ Configuración cargada:", this.config);

      return this.config;
    } catch (error) {
      console.error("❌ Error al cargar configuración:", error);
      throw error;
    }
  }

  /**
   * Cargar configuración global de Moodle
   */
  loadMoodleConfig() {
    if (typeof M !== "undefined" && M.cfg) {
      this.config.moodle = {
        wwwroot: M.cfg.wwwroot || "",
        sesskey: M.cfg.sesskey || "",
        lang: M.cfg.lang || "es",
        theme: M.cfg.theme || "",
      };
      console.log("🌐 Configuración de Moodle cargada");
    } else {
      console.warn(
        "⚠️ No se encontró configuración de Moodle, usando valores por defecto"
      );
      this.config.moodle = {
        wwwroot: window.location.origin,
        sesskey: "",
        lang: "es",
        theme: "boost",
      };
    }
  }

  /**
   * Cargar información del usuario actual
   */
  loadUserConfig() {
    // Intentar obtener del objeto M de Moodle
    if (typeof M !== "undefined" && M.cfg && M.cfg.user) {
      this.config.user = {
        id: M.cfg.user.id || 0,
        fullname: M.cfg.user.fullname || "Usuario",
        email: M.cfg.user.email || "",
        roles: M.cfg.user.roles || ["user"],
        isAdmin: this.checkIfAdmin(M.cfg.user.roles),
      };
    } else {
      // Fallback: intentar extraer de la página
      this.config.user = this.extractUserFromPage();
    }

    console.log("👤 Configuración de usuario cargada:", this.config.user);
  }

  /**
   * Verificar si el usuario es administrador
   */
  checkIfAdmin(roles) {
    if (!roles) return false;
    const adminRoles = [
      "administrator",
      "manager",
      "coursecreator",
      "editingteacher",
    ];
    return roles.some((role) => adminRoles.includes(role.toLowerCase()));
  }

  /**
   * Extraer información del usuario de la página HTML
   */
  extractUserFromPage() {
    const user = {
      id: 0,
      fullname: "Usuario",
      email: "",
      roles: ["user"],
      isAdmin: false,
    };

    // Intentar encontrar información del usuario en la página
    try {
      // Buscar en menú de usuario
      const userMenu = document.querySelector(".usermenu .usertext");
      if (userMenu) {
        user.fullname = userMenu.textContent.trim();
      }

      // Buscar en enlaces de administración
      const adminLinks = document.querySelectorAll('a[href*="admin"]');
      user.isAdmin = adminLinks.length > 0;

      if (user.isAdmin) {
        user.roles.push("administrator");
      }
    } catch (error) {
      console.warn("⚠️ No se pudo extraer información del usuario:", error);
    }

    return user;
  }

  /**
   * Cargar configuración del curso actual
   */
  loadCourseConfig() {
    // Intentar obtener del objeto M de Moodle
    if (typeof M !== "undefined" && M.course) {
      this.config.course = {
        id: M.course.id || 0,
        fullname: M.course.fullname || "Curso",
        shortname: M.course.shortname || "",
        category: M.course.category || 0,
      };
    } else {
      // Intentar extraer de la URL
      this.config.course = this.extractCourseFromURL();
    }

    console.log("📚 Configuración de curso cargada:", this.config.course);
  }

  /**
   * Extraer información del curso de la URL
   */
  extractCourseFromURL() {
    const course = {
      id: 0,
      fullname: "Curso actual",
      shortname: "",
      category: 0,
    };

    try {
      // Buscar ID de curso en la URL
      const urlParams = new URLSearchParams(window.location.search);
      const courseId = urlParams.get("id");

      if (courseId) {
        course.id = parseInt(courseId);

        // Intentar obtener nombre del curso del título
        const pageTitle = document.title;
        if (pageTitle) {
          course.fullname = pageTitle.replace(":", "|").split("|")[0].trim();
        }
      }

      // Buscar nombre corto en breadcrumbs
      const breadcrumbs = document.querySelector(".breadcrumb");
      if (breadcrumbs) {
        const lastCrumb = breadcrumbs.lastElementChild;
        if (lastCrumb) {
          course.shortname = lastCrumb.textContent.trim();
        }
      }
    } catch (error) {
      console.warn("⚠️ No se pudo extraer información del curso:", error);
    }

    return course;
  }

  /**
   * Cargar configuración específica de Academic Manager
   */
  async loadAcademicManagerConfig() {
    console.log("🔧 Cargando configuración de Academic Manager...");

    try {
      // Intentar cargar desde localStorage
      const savedConfig = localStorage.getItem("academicManagerConfig");
      if (savedConfig) {
        this.config.academicManager = JSON.parse(savedConfig);
        console.log("📁 Configuración cargada desde localStorage");
      }

      // Configuración por defecto
      const defaultConfig = {
        theme: "moodle",
        language: "es",
        notifications: true,
        autoSave: true,
        showTutorial: false,
        modules: {
          courses: true,
          users: true,
          grades: true,
          reports: true,
        },
        permissions: this.getDefaultPermissions(),
      };

      // Fusionar con configuración guardada
      this.config.academicManager = {
        ...defaultConfig,
        ...this.config.academicManager,
      };

      // Cargar configuración del servidor si está disponible
      await this.loadServerConfig();

      console.log("✅ Configuración de Academic Manager cargada");
    } catch (error) {
      console.error("❌ Error al cargar configuración:", error);
      this.config.academicManager = this.getDefaultConfig();
    }
  }

  /**
   * Obtener permisos por defecto basados en rol
   */
  getDefaultPermissions() {
    const isAdmin = this.config.user.isAdmin;

    return {
      canEditCourses: isAdmin,
      canEditUsers: isAdmin,
      canViewGrades: true,
      canEditGrades: isAdmin || this.config.user.roles.includes("teacher"),
      canGenerateReports: isAdmin || this.config.user.roles.includes("teacher"),
      canManageSettings: isAdmin,
    };
  }

  /**
   * Configuración por defecto
   */
  getDefaultConfig() {
    return {
      theme: "moodle",
      language: "es",
      notifications: true,
      autoSave: true,
      showTutorial: false,
      modules: {
        courses: true,
        users: true,
        grades: true,
        reports: true,
      },
    };
  }

  /**
   * Cargar configuración del servidor
   */
  async loadServerConfig() {
    try {
      // Usar AJAX de Moodle si está disponible
      if (typeof M !== "undefined" && M.util && M.util.ajax) {
        const response = await this.moodleAjaxCall(
          "local_academicmanager_get_config",
          {}
        );
        if (response && response.config) {
          this.config.academicManager = {
            ...this.config.academicManager,
            ...response.config,
          };
          console.log("🌐 Configuración del servidor cargada");
        }
      }
    } catch (error) {
      console.warn("⚠️ No se pudo cargar configuración del servidor:", error);
    }
  }

  /**
   * Cargar preferencias del usuario
   */
  async loadUserPreferences() {
    try {
      // Cargar de localStorage
      const prefs = localStorage.getItem(
        `academicManager_prefs_${this.config.user.id}`
      );
      if (prefs) {
        this.config.userPreferences = JSON.parse(prefs);
        console.log("💾 Preferencias de usuario cargadas");
      } else {
        this.config.userPreferences = {};
      }
    } catch (error) {
      console.warn("⚠️ Error al cargar preferencias:", error);
      this.config.userPreferences = {};
    }
  }

  /**
   * Guardar configuración
   */
  async saveConfig() {
    try {
      // Guardar en localStorage
      localStorage.setItem(
        "academicManagerConfig",
        JSON.stringify(this.config.academicManager)
      );

      // Guardar preferencias del usuario
      localStorage.setItem(
        `academicManager_prefs_${this.config.user.id}`,
        JSON.stringify(this.config.userPreferences)
      );

      console.log("💾 Configuración guardada");
      return true;
    } catch (error) {
      console.error("❌ Error al guardar configuración:", error);
      return false;
    }
  }

  /**
   * Obtener valor de configuración
   */
  get(key, defaultValue = null) {
    const keys = key.split(".");
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value !== undefined ? value : defaultValue;
  }

  /**
   * Establecer valor de configuración
   */
  set(key, value) {
    const keys = key.split(".");
    let config = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in config)) {
        config[k] = {};
      }
      config = config[k];
    }

    config[keys[keys.length - 1]] = value;

    // Auto-guardar si está habilitado
    if (this.get("academicManager.autoSave", true)) {
      this.saveConfig();
    }
  }

  /**
   * Obtener URL de Moodle
   */
  getMoodleURL(path = "") {
    const wwwroot = this.get("moodle.wwwroot", window.location.origin);
    return `${wwwroot}/${path.replace(/^\//, "")}`;
  }

  /**
   * Obtener sesskey de Moodle
   */
  getSesskey() {
    return this.get("moodle.sesskey", "");
  }

  /**
   * Llamada AJAX a Moodle
   */
  async moodleAjaxCall(methodname, args) {
    return new Promise((resolve, reject) => {
      if (typeof M !== "undefined" && M.util && M.util.ajax) {
        M.util.ajax.call(
          [
            {
              methodname: methodname,
              args: args,
            },
          ],
          {
            done: (data) => resolve(data),
            fail: (error) => reject(error),
          }
        );
      } else {
        // Fallback a fetch
        fetch(this.getMoodleURL("/lib/ajax/service.php"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              methodname: methodname,
              args: args,
            },
          ]),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data && data[0] && !data[0].error) {
              resolve(data[0].data);
            } else {
              reject(data ? data[0].error : "Unknown error");
            }
          })
          .catch((error) => reject(error));
      }
    });
  }

  /**
   * Resetear configuración a valores por defecto
   */
  async resetToDefaults() {
    this.config.academicManager = this.getDefaultConfig();
    await this.saveConfig();
    console.log("🔄 Configuración resetada a valores por defecto");
  }
}

// Exportar para uso global
if (typeof window !== "undefined") {
  window.ConfigManager = ConfigManager;
}
