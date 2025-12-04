/**
 * Router - Sistema de enrutamiento para Academic Manager
 */

class Router {
    constructor(container = null) {
        console.log("📍 Router creado");
        
        this.container = container;
        this.routes = {};
        this.currentRoute = null;
        this.currentParams = {};
        this.middlewares = [];
        this.routeHistory = [];
        this.maxHistory = 50;
        
        this.initRoutes();
        this.bindGlobalEvents();
    }
    
    /**
     * Inicializar rutas definidas
     */
    initRoutes() {
        console.log("🗺️ Inicializando rutas...");
        
        // Rutas principales de la aplicación
        this.routes = {
            // Dashboard
            'dashboard': {
                name: 'Dashboard',
                component: 'dashboard-view',
                requiresAuth: true,
                onEnter: this.onEnterDashboard.bind(this),
                onLeave: this.onLeaveDashboard.bind(this)
            },
            
            // Cursos
            'courses': {
                name: 'Cursos',
                component: 'courses-view',
                requiresAuth: true,
                requiresAdmin: false,
                onEnter: this.onEnterCourses.bind(this),
                onLeave: this.onLeaveCourses.bind(this)
            },
            
            // Estudiantes
            'students': {
                name: 'Estudiantes',
                component: 'students-view',
                requiresAuth: true,
                requiresAdmin: false,
                onEnter: this.onEnterStudents.bind(this),
                onLeave: this.onLeaveStudents.bind(this)
            },
            
            // Calificaciones
            'grades': {
                name: 'Calificaciones',
                component: 'grades-view',
                requiresAuth: true,
                requiresAdmin: false,
                onEnter: this.onEnterGrades.bind(this),
                onLeave: this.onLeaveGrades.bind(this)
            },
            
            // Reportes
            'reports': {
                name: 'Reportes',
                component: 'reports-view',
                requiresAuth: true,
                requiresAdmin: false,
                onEnter: this.onEnterReports.bind(this),
                onLeave: this.onLeaveReports.bind(this)
            },
            
            // Acciones Masivas
            'bulk-actions': {
                name: 'Acciones Masivas',
                component: 'bulk-actions-view',
                requiresAuth: true,
                requiresAdmin: true,
                onEnter: this.onEnterBulkActions.bind(this),
                onLeave: this.onLeaveBulkActions.bind(this)
            },
            
            // Administración
            'admin': {
                name: 'Administración',
                component: 'admin-view',
                requiresAuth: true,
                requiresAdmin: true,
                onEnter: this.onEnterAdmin.bind(this),
                onLeave: this.onLeaveAdmin.bind(this)
            },
            
            // Configuración
            'settings': {
                name: 'Configuración',
                component: 'settings-view',
                requiresAuth: true,
                requiresAdmin: false,
                onEnter: this.onEnterSettings.bind(this),
                onLeave: this.onLeaveSettings.bind(this)
            },
            
            // Error 404
            '404': {
                name: 'Página no encontrada',
                component: 'error-view',
                requiresAuth: false,
                onEnter: this.onEnter404.bind(this)
            },
            
            // Error de permisos
            '403': {
                name: 'Acceso denegado',
                component: 'error-view',
                requiresAuth: false,
                onEnter: this.onEnter403.bind(this)
            }
        };
        
        console.log(`✅ ${Object.keys(this.routes).length} rutas inicializadas`);
    }
    
    /**
     * Vincular eventos globales
     */
    bindGlobalEvents() {
        console.log("🔗 Vinculando eventos del router...");
        
        // Manejar cambios en el hash de la URL
        window.addEventListener('hashchange', (e) => {
            const newHash = window.location.hash.slice(1) || 'dashboard';
            const oldHash = e.oldURL ? new URL(e.oldURL).hash.slice(1) || 'dashboard' : 'dashboard';
            
            console.log(`🔀 Hash cambiado: ${oldHash} -> ${newHash}`);
            
            // Solo navegar si el hash realmente cambió
            if (newHash !== this.currentRoute) {
                this.navigate(newHash, {}, false); // false = no actualizar history (ya lo hizo el navegador)
            }
        });
        
        // Manejar carga inicial de página
        window.addEventListener('load', () => {
            const initialRoute = window.location.hash.slice(1) || 'dashboard';
            console.log(`🌐 Carga inicial, navegando a: ${initialRoute}`);
            setTimeout(() => {
                this.navigate(initialRoute, {}, false);
            }, 100);
        });
        
        // Manejar botones de retroceso/avance del navegador
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                console.log(`↩️ Navegación del navegador a: ${e.state.route}`);
                this.navigate(e.state.route, e.state.params || {}, false);
            }
        });
        
        console.log("✅ Eventos del router vinculados");
    }
    
    /**
     * Navegar a una ruta específica
     */
    async navigate(route, params = {}, updateHistory = true) {
        console.log(`📍 Intentando navegar a: ${route}`, params);
        
        // Validar ruta
        if (!this.isValidRoute(route)) {
            console.warn(`⚠️ Ruta inválida: ${route}, redirigiendo a 404`);
            return this.navigate('404', { attemptedRoute: route });
        }
        
        const routeConfig = this.routes[route];
        
        try {
            // Ejecutar middlewares antes de la navegación
            const middlewareResult = await this.executeMiddlewares(route, params, 'before');
            if (middlewareResult === false) {
                console.log("⏹️ Navegación cancelada por middleware");
                return false;
            }
            
            // Verificar autenticación si es requerida
            if (routeConfig.requiresAuth && !this.isAuthenticated()) {
                console.warn("🔒 Usuario no autenticado, redirigiendo...");
                this.showLoginModal();
                return false;
            }
            
            // Verificar permisos de administrador si son requeridos
            if (routeConfig.requiresAdmin && !this.isAdmin()) {
                console.warn("🚫 Permisos insuficientes, redirigiendo a 403");
                return this.navigate('403', { requiredRole: 'admin' });
            }
            
            // Ejecutar hook onLeave de la ruta actual
            if (this.currentRoute && this.routes[this.currentRoute].onLeave) {
                await this.routes[this.currentRoute].onLeave(route, params);
            }
            
            // Actualizar estado actual
            const previousRoute = this.currentRoute;
            const previousParams = this.currentParams;
            
            this.currentRoute = route;
            this.currentParams = params;
            
            // Agregar a historial
            this.addToHistory(route, params);
            
            // Actualizar URL en el navegador
            if (updateHistory) {
                this.updateBrowserURL(route, params);
            }
            
            // Ejecutar hook onEnter de la nueva ruta
            if (routeConfig.onEnter) {
                await routeConfig.onEnter(previousRoute, previousParams, params);
            }
            
            // Mostrar la vista
            await this.showRouteView(route, params);
            
            // Actualizar título de la página
            this.updatePageTitle(routeConfig.name);
            
            // Actualizar navegación activa en la UI
            this.updateActiveNavigation(route);
            
            // Ejecutar middlewares después de la navegación
            await this.executeMiddlewares(route, params, 'after');
            
            // Disparar evento de navegación completada
            this.dispatchNavigationEvent('navigation:complete', {
                route,
                params,
                previousRoute,
                previousParams
            });
            
            console.log(`✅ Navegación completada a: ${route}`);
            
            return true;
            
        } catch (error) {
            console.error(`❌ Error durante navegación a ${route}:`, error);
            
            // Mostrar error
            this.showNavigationError(route, error);
            
            // Disparar evento de error
            this.dispatchNavigationEvent('navigation:error', {
                route,
                params,
                error
            });
            
            return false;
        }
    }
    
    /**
     * Verificar si una ruta es válida
     */
    isValidRoute(route) {
        return route in this.routes;
    }
    
    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        // Verificar con ConfigManager
        if (typeof configManager !== 'undefined') {
            const user = configManager.get('user', {});
            return user && user.id && user.id > 0;
        }
        
        // Fallback: verificar en localStorage
        const token = localStorage.getItem('academicmanager_token');
        return !!token;
    }
    
    /**
     * Verificar si el usuario es administrador
     */
    isAdmin() {
        if (typeof configManager !== 'undefined') {
            return configManager.get('user.isAdmin', false);
        }
        
        // Fallback
        const userRole = localStorage.getItem('academicmanager_role');
        return userRole === 'admin' || userRole === 'teacher';
    }
    
    /**
     * Mostrar modal de login
     */
    showLoginModal() {
        if (typeof uiRenderer !== 'undefined') {
            uiRenderer.showModal(
                'Autenticación requerida',
                '<p>Debes iniciar sesión para acceder a esta sección.</p>',
                {
                    buttons: [
                        {
                            label: 'Iniciar sesión en Moodle',
                            type: 'primary',
                            action: () => {
                                window.location.href = `${configManager.getMoodleURL()}/login/index.php`;
                            }
                        },
                        {
                            label: 'Cancelar',
                            type: 'secondary',
                            dismiss: true
                        }
                    ]
                }
            );
        }
    }
    
    /**
     * Mostrar vista de la ruta
     */
    async showRouteView(route, params) {
        const routeConfig = this.routes[route];
        
        // Verificar que uiRenderer esté disponible
        if (typeof uiRenderer === 'undefined') {
            console.error("❌ uiRenderer no disponible");
            throw new Error('UI Renderer no inicializado');
        }
        
        // Mostrar la vista usando uiRenderer
        await uiRenderer.showView(routeConfig.component, {
            ...params,
            route: route,
            routeName: routeConfig.name,
            timestamp: new Date().toISOString()
        });
        
        console.log(`👁️ Vista mostrada: ${routeConfig.component}`);
    }
    
    /**
     * Actualizar URL del navegador
     */
    updateBrowserURL(route, params) {
        // Crear URL con hash
        let url = `#${route}`;
        
        // Agregar parámetros si existen
        if (Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams(params).toString();
            url += `?${queryParams}`;
        }
        
        // Actualizar history
        window.history.pushState(
            { route, params, timestamp: Date.now() },
            '',
            url
        );
        
        console.log(`🌐 URL actualizada: ${url}`);
    }
    
    /**
     * Actualizar título de la página
     */
    updatePageTitle(routeName) {
        const baseTitle = 'Academic Manager';
        document.title = `${routeName} - ${baseTitle}`;
    }
    
    /**
     * Actualizar navegación activa en la UI
     */
    updateActiveNavigation(route) {
        // Actualizar enlaces con data-route
        document.querySelectorAll('[data-route]').forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === route) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
        
        // También actualizar enlaces con href que terminen en el hash
        document.querySelectorAll(`a[href="#${route}"]`).forEach(link => {
            link.classList.add('active');
        });
    }
    
    /**
     * Agregar a historial interno
     */
    addToHistory(route, params) {
        const historyEntry = {
            route,
            params,
            timestamp: new Date().toISOString()
        };
        
        this.routeHistory.push(historyEntry);
        
        // Limitar tamaño del historial
        if (this.routeHistory.length > this.maxHistory) {
            this.routeHistory = this.routeHistory.slice(-this.maxHistory);
        }
        
        console.log(`📚 Historial: ${this.routeHistory.length} entradas`);
    }
    
    /**
     * Navegar hacia atrás en el historial
     */
    goBack(steps = 1) {
        if (this.routeHistory.length < steps + 1) {
            console.warn("⚠️ No hay suficiente historial para retroceder");
            return false;
        }
        
        const targetIndex = this.routeHistory.length - steps - 1;
        const targetEntry = this.routeHistory[targetIndex];
        
        console.log(`↩️ Retrocediendo ${steps} pasos a: ${targetEntry.route}`);
        
        return this.navigate(targetEntry.route, targetEntry.params);
    }
    
    /**
     * Navegar a la ruta anterior
     */
    goToPrevious() {
        return this.goBack(1);
    }
    
    /**
     * Obtener historial de navegación
     */
    getHistory() {
        return [...this.routeHistory];
    }
    
    /**
     * Limpiar historial
     */
    clearHistory() {
        this.routeHistory = [];
        console.log("🧹 Historial limpiado");
    }
    
    /**
     * Registrar middleware
     */
    registerMiddleware(middleware) {
        if (typeof middleware === 'function') {
            this.middlewares.push({
                fn: middleware,
                type: 'both'
            });
        } else if (middleware.before || middleware.after) {
            this.middlewares.push(middleware);
        }
        
        console.log(`🛡️ Middleware registrado: ${middleware.name || 'anónimo'}`);
    }
    
    /**
     * Ejecutar middlewares
     */
    async executeMiddlewares(route, params, type) {
        console.log(`🛡️ Ejecutando middlewares (${type}) para: ${route}`);
        
        for (const middleware of this.middlewares) {
            try {
                if (middleware.type === 'both' || middleware.type === type) {
                    const middlewareFn = middleware.fn || middleware[type];
                    
                    if (middlewareFn) {
                        const result = await middlewareFn(route, params, this);
                        
                        if (result === false) {
                            console.log(`⏹️ Middleware detuvo la navegación: ${middleware.name || 'anónimo'}`);
                            return false;
                        }
                    }
                }
            } catch (error) {
                console.error(`❌ Error en middleware:`, error);
                // Continuar con otros middlewares
            }
        }
        
        return true;
    }
    
    /**
     * Mostrar error de navegación
     */
    showNavigationError(route, error) {
        const errorMessage = `
            <div class="alert alert-danger">
                <h4>Error de navegación</h4>
                <p>No se pudo cargar la ruta: <strong>${route}</strong></p>
                <p><small>${error.message}</small></p>
                <button class="btn btn-primary" onclick="router.navigate('dashboard')">
                    Volver al Dashboard
                </button>
            </div>
        `;
        
        if (typeof uiRenderer !== 'undefined') {
            uiRenderer.showView('error-view', {
                message: `Error al cargar ${route}: ${error.message}`
            });
        } else {
            // Fallback directo
            const container = document.getElementById('am-views-container');
            if (container) {
                container.innerHTML = errorMessage;
            }
        }
    }
    
    /**
     * Disparar evento personalizado
     */
    dispatchNavigationEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true
        });
        
        document.dispatchEvent(event);
        console.log(`📢 Evento disparado: ${eventName}`, detail);
    }
    
    /**
     * Obtener ruta actual
     */
    getCurrentRoute() {
        return {
            route: this.currentRoute,
            params: this.currentParams,
            config: this.routes[this.currentRoute]
        };
    }
    
    /**
     * Hooks de rutas (pueden ser sobrescritos)
     */
    
    async onEnterDashboard(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Dashboard");
        // Aquí puedes cargar datos del dashboard
    }
    
    async onLeaveDashboard(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Dashboard");
        // Limpiar recursos del dashboard
    }
    
    async onEnterCourses(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Cursos");
        // Cargar datos de cursos
    }
    
    async onLeaveCourses(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Cursos");
    }
    
    async onEnterStudents(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Estudiantes");
    }
    
    async onLeaveStudents(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Estudiantes");
    }
    
    async onEnterGrades(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Calificaciones");
    }
    
    async onLeaveGrades(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Calificaciones");
    }
    
    async onEnterReports(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Reportes");
    }
    
    async onLeaveReports(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Reportes");
    }
    
    async onEnterBulkActions(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Acciones Masivas");
    }
    
    async onLeaveBulkActions(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Acciones Masivas");
    }
    
    async onEnterAdmin(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Administración");
    }
    
    async onLeaveAdmin(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Administración");
    }
    
    async onEnterSettings(previousRoute, previousParams, newParams) {
        console.log("🚪 Entrando a Configuración");
    }
    
    async onLeaveSettings(nextRoute, nextParams) {
        console.log("🚪 Saliendo de Configuración");
    }
    
    async onEnter404(previousRoute, previousParams, newParams) {
        console.log("🚪 Mostrando página 404");
    }
    
    async onEnter403(previousRoute, previousParams, newParams) {
        console.log("🚪 Mostrando página 403 - Acceso denegado");
    }
    
    /**
     * Redirigir a una ruta
     */
    redirect(route, params = {}) {
        console.log(`↪️ Redirigiendo a: ${route}`);
        return this.navigate(route, params);
    }
    
    /**
     * Actualizar parámetros de la ruta actual
     */
    updateParams(newParams, merge = true) {
        if (!this.currentRoute) return;
        
        const updatedParams = merge 
            ? { ...this.currentParams, ...newParams }
            : newParams;
        
        console.log(`🔄 Actualizando parámetros de ${this.currentRoute}:`, updatedParams);
        
        // Navegar a la misma ruta con nuevos parámetros
        return this.navigate(this.currentRoute, updatedParams);
    }
    
    /**
     * Forzar recarga de la ruta actual
     */
    async reload() {
        if (!this.currentRoute) return;
        
        console.log(`🔄 Recargando ruta actual: ${this.currentRoute}`);
        
        // Guardar ruta y parámetros actuales
        const currentRoute = this.currentRoute;
        const currentParams = { ...this.currentParams };
        
        // Navegar a una ruta temporal y luego volver
        await this.navigate('dashboard', {}, false);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return this.navigate(currentRoute, currentParams);
    }
}

// Middlewares de ejemplo
const authMiddleware = {
    name: 'authMiddleware',
    before: async (route, params, router) => {
        console.log(`🛡️ Middleware auth: verificando ruta ${route}`);
        
        // Verificar si la ruta requiere autenticación
        const routeConfig = router.routes[route];
        if (routeConfig && routeConfig.requiresAuth) {
            if (!router.isAuthenticated()) {
                console.log("🔒 Acceso denegado por middleware de auth");
                return false;
            }
        }
        
        return true;
    }
};

const loggingMiddleware = {
    name: 'loggingMiddleware',
    before: async (route, params, router) => {
        console.log(`📝 Log: Navegando a ${route} con params:`, params);
        return true;
    },
    after: async (route, params, router) => {
        console.log(`📝 Log: Navegación a ${route} completada`);
        return true;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Router = Router;
    window.authMiddleware = authMiddleware;
    window.loggingMiddleware = loggingMiddleware;
}