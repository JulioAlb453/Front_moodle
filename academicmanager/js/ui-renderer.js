/**
 * UIRenderer - Renderiza la interfaz de usuario en Moodle
 */

class UIRenderer {
    constructor() {
        console.log("🎨 UIRenderer creado");
        this.container = null;
        this.currentView = null;
        this.stylesApplied = false;
        this.components = {};
    }
    
    /**
     * Renderizar interfaz principal en el contenedor de Moodle
     */
    async renderMainInterface(container) {
        console.log("🏠 Renderizando interfaz principal...");
        this.container = container;
        
        try {
            // 1. Aplicar estilos específicos
            this.applyStyles();
            
            // 2. Renderizar estructura principal
            const mainHTML = await MustacheRenderer.render('main-interface', {
                appName: 'Academic Manager',
                user: configManager ? configManager.get('user', {}) : { fullname: 'Usuario' },
                course: configManager ? configManager.get('course', {}) : { fullname: 'Curso' },
                isAdmin: configManager ? configManager.get('user.isAdmin', false) : false,
                currentDate: new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            });
            
            // 3. Insertar en el contenedor
            this.container.innerHTML = mainHTML;
            
            // 4. Renderizar componentes adicionales
            await this.renderNavigation();
            await this.renderHeader();
            await this.renderViewsContainer();
            
            // 5. Inicializar componentes dinámicos
            await this.initializeComponents();
            
            console.log("✅ Interfaz principal renderizada");
            
            // Disparar evento
            this.container.dispatchEvent(new CustomEvent('ui-rendered'));
            
            return true;
            
        } catch (error) {
            console.error("❌ Error al renderizar interfaz principal:", error);
            throw error;
        }
    }
    
    /**
     * Aplicar estilos CSS específicos
     */
    applyStyles() {
        if (this.stylesApplied) return;
        
        console.log("🎨 Aplicando estilos...");
        
        // Crear elemento de estilo si no existe
        let styleElement = document.getElementById('academic-manager-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'academic-manager-styles';
            document.head.appendChild(styleElement);
        }
        
        // CSS específico para integración con Moodle
        const css = `
            /* Contenedor principal */
            .academic-manager-container {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                margin-top: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 20px;
            }
            
            /* Header */
            .am-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 8px 8px 0 0;
                padding: 20px;
                margin: -20px -20px 20px -20px;
            }
            
            /* Navegación */
            .am-nav {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .am-nav .nav-link {
                color: #495057;
                font-weight: 500;
                padding: 10px 15px;
                border-radius: 5px;
                margin-right: 5px;
                transition: all 0.3s;
            }
            
            .am-nav .nav-link:hover {
                background: #e9ecef;
                color: #007bff;
            }
            
            .am-nav .nav-link.active {
                background: #007bff;
                color: white;
            }
            
            /* Vistas */
            .am-view {
                display: none;
                animation: fadeIn 0.3s ease-in;
            }
            
            .am-view.active {
                display: block;
            }
            
            /* Cards */
            .am-card {
                border: 1px solid #e3e6f0;
                border-radius: 8px;
                margin-bottom: 20px;
                transition: transform 0.2s;
            }
            
            .am-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            .am-card-header {
                background: #f8f9fc;
                padding: 15px 20px;
                border-bottom: 1px solid #e3e6f0;
                border-radius: 8px 8px 0 0;
            }
            
            .am-card-body {
                padding: 20px;
            }
            
            /* Botones */
            .am-btn {
                border-radius: 6px;
                padding: 8px 20px;
                font-weight: 500;
                transition: all 0.3s;
            }
            
            .am-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
            }
            
            .am-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            
            /* Tablas */
            .am-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .am-table th {
                background: #f8f9fc;
                padding: 15px;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.85em;
                letter-spacing: 0.5px;
            }
            
            .am-table td {
                padding: 15px;
                border-top: 1px solid #e3e6f0;
            }
            
            .am-table tr:hover {
                background: #f8f9fc;
            }
            
            /* Animaciones */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .academic-manager-container {
                    padding: 15px;
                    margin-top: 10px;
                }
                
                .am-nav {
                    padding: 10px;
                }
                
                .am-nav .nav-link {
                    padding: 8px 12px;
                    font-size: 0.9em;
                    margin-bottom: 5px;
                }
            }
            
            /* Integración con temas de Moodle */
            .path-admin .academic-manager-container {
                background: #fff;
            }
            
            /* Estados de carga */
            .am-loading {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 200px;
            }
            
            .am-loading .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        styleElement.textContent = css;
        this.stylesApplied = true;
        console.log("✅ Estilos aplicados");
    }
    
    /**
     * Renderizar navegación
     */
    async renderNavigation() {
        console.log("🧭 Renderizando navegación...");
        
        const navContainer = this.container.querySelector('#am-navigation');
        if (!navContainer) {
            console.warn("⚠️ Contenedor de navegación no encontrado");
            return;
        }
        
        const isAdmin = configManager ? configManager.get('user.isAdmin', false) : false;
        
        const navData = {
            menuItems: [
                { 
                    id: 'dashboard', 
                    label: 'Dashboard', 
                    icon: 'home', 
                    active: true,
                    badge: null
                },
                { 
                    id: 'courses', 
                    label: 'Cursos', 
                    icon: 'book', 
                    active: false,
                    badge: null
                },
                { 
                    id: 'students', 
                    label: 'Estudiantes', 
                    icon: 'people', 
                    active: false,
                    badge: null
                },
                { 
                    id: 'grades', 
                    label: 'Calificaciones', 
                    icon: 'bar-chart', 
                    active: false,
                    badge: null
                },
                { 
                    id: 'reports', 
                    label: 'Reportes', 
                    icon: 'file-text', 
                    active: false,
                    badge: null
                }
            ]
        };
        
        // Agregar items de administración si es admin
        if (isAdmin) {
            navData.menuItems.push(
                { 
                    id: 'admin', 
                    label: 'Administración', 
                    icon: 'shield', 
                    active: false,
                    badge: null
                },
                { 
                    id: 'settings', 
                    label: 'Configuración', 
                    icon: 'gear', 
                    active: false,
                    badge: null
                }
            );
        }
        
        // Agregar items adicionales del config manager
        const amConfig = configManager ? configManager.get('academicManager.modules', {}) : {};
        if (amConfig.bulkActions) {
            navData.menuItems.splice(4, 0, { 
                id: 'bulk-actions', 
                label: 'Acciones Masivas', 
                icon: 'lightning', 
                active: false,
                badge: null
            });
        }
        
        try {
            const navHTML = await MustacheRenderer.render('navigation', navData);
            navContainer.innerHTML = navHTML;
            console.log("✅ Navegación renderizada");
        } catch (error) {
            console.error("❌ Error al renderizar navegación:", error);
            // Renderizar navegación de respaldo
            navContainer.innerHTML = this.createFallbackNavigation(navData.menuItems);
        }
    }
    
    /**
     * Crear navegación de respaldo
     */
    createFallbackNavigation(menuItems) {
        let html = '<nav class="navbar navbar-expand-lg am-nav"><div class="container-fluid"><ul class="navbar-nav">';
        
        menuItems.forEach(item => {
            html += `
                <li class="nav-item">
                    <a class="nav-link ${item.active ? 'active' : ''}" 
                       href="#${item.id}" 
                       data-route="${item.id}">
                        <i class="bi bi-${item.icon} me-2"></i>
                        ${item.label}
                        ${item.badge ? `<span class="badge bg-danger ms-2">${item.badge}</span>` : ''}
                    </a>
                </li>
            `;
        });
        
        html += '</ul></div></nav>';
        return html;
    }
    
    /**
     * Renderizar header
     */
    async renderHeader() {
        console.log("📝 Renderizando header...");
        
        const headerContainer = this.container.querySelector('#am-header');
        if (!headerContainer) {
            console.warn("⚠️ Contenedor de header no encontrado");
            return;
        }
        
        const headerData = {
            title: 'Academic Manager',
            subtitle: 'Gestión Académica Integrada',
            user: configManager ? configManager.get('user', {}) : {},
            course: configManager ? configManager.get('course', {}) : {},
            showCourseInfo: true,
            showUserInfo: true,
            notifications: 3,
            messages: 2
        };
        
        try {
            const headerHTML = await MustacheRenderer.render('header', headerData);
            headerContainer.innerHTML = headerHTML;
            console.log("✅ Header renderizado");
        } catch (error) {
            console.error("❌ Error al renderizar header:", error);
            headerContainer.innerHTML = this.createFallbackHeader(headerData);
        }
    }
    
    /**
     * Crear header de respaldo
     */
    createFallbackHeader(data) {
        return `
            <div class="am-header">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="h3 mb-1">${data.title}</h1>
                        <p class="mb-0 opacity-75">${data.subtitle}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        ${data.showCourseInfo ? `
                            <div class="me-4">
                                <small class="d-block opacity-75">Curso actual</small>
                                <strong>${data.course.fullname || 'Sin curso'}</strong>
                            </div>
                        ` : ''}
                        ${data.showUserInfo ? `
                            <div>
                                <small class="d-block opacity-75">Usuario</small>
                                <strong>${data.user.fullname || 'Usuario'}</strong>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizar contenedor de vistas
     */
    async renderViewsContainer() {
        console.log("🖼 Renderizando contenedor de vistas...");
        
        const viewsContainer = this.container.querySelector('#am-views-container');
        if (!viewsContainer) {
            console.warn("⚠️ Contenedor de vistas no encontrado");
            return;
        }
        
        // Crear estructura básica de vistas
        viewsContainer.innerHTML = `
            <div id="dashboard-view" class="am-view active"></div>
            <div id="courses-view" class="am-view"></div>
            <div id="students-view" class="am-view"></div>
            <div id="grades-view" class="am-view"></div>
            <div id="reports-view" class="am-view"></div>
            <div id="bulk-actions-view" class="am-view"></div>
            <div id="admin-view" class="am-view"></div>
            <div id="settings-view" class="am-view"></div>
        `;
        
        console.log("✅ Contenedor de vistas creado");
    }
    
    /**
     * Inicializar componentes dinámicos
     */
    async initializeComponents() {
        console.log("⚙️ Inicializando componentes...");
        
        // Inicializar tooltips de Bootstrap si están disponibles
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltips = this.container.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltips.forEach(el => new bootstrap.Tooltip(el));
        }
        
        // Inicializar popovers
        if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
            const popovers = this.container.querySelectorAll('[data-bs-toggle="popover"]');
            popovers.forEach(el => new bootstrap.Popover(el));
        }
        
        // Inicializar dropdowns
        const dropdowns = this.container.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('show');
            });
        });
        
        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.container.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });
        
        console.log("✅ Componentes inicializados");
    }
    
    /**
     * Mostrar una vista específica
     */
    showView(viewId, data = {}) {
        console.log(`👁️ Mostrando vista: ${viewId}`);
        
        // Ocultar todas las vistas
        this.container.querySelectorAll('.am-view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Mostrar la vista solicitada
        const viewElement = this.container.querySelector(`#${viewId}-view`);
        if (viewElement) {
            viewElement.classList.add('active');
            this.currentView = viewId;
            
            // Cargar contenido de la vista
            this.loadViewContent(viewId, viewElement, data);
            
            // Actualizar navegación activa
            this.updateActiveNav(viewId);
            
            // Disparar evento
            viewElement.dispatchEvent(new CustomEvent('view-shown', {
                detail: { viewId, data }
            }));
            
            console.log(`✅ Vista ${viewId} mostrada`);
            
        } else {
            console.error(`❌ Vista no encontrada: ${viewId}`);
            this.showErrorView(`La vista "${viewId}" no existe`);
        }
    }
    
    /**
     * Cargar contenido de una vista
     */
    async loadViewContent(viewId, viewElement, data) {
        console.log(`📦 Cargando contenido para vista: ${viewId}`);
        
        // Mostrar estado de carga
        viewElement.innerHTML = `
            <div class="am-loading">
                <div class="spinner"></div>
                <p class="mt-3">Cargando ${viewId}...</p>
            </div>
        `;
        
        try {
            // Renderizar el template correspondiente
            const templateData = {
                ...data,
                viewId: viewId,
                timestamp: new Date().toISOString(),
                user: configManager ? configManager.get('user', {}) : {},
                course: configManager ? configManager.get('course', {}) : {}
            };
            
            const html = await MustacheRenderer.render(`${viewId}-view`, templateData);
            viewElement.innerHTML = html;
            
            // Inicializar componentes específicos de la vista
            this.initializeViewComponents(viewId, viewElement);
            
            console.log(`✅ Contenido cargado para vista: ${viewId}`);
            
        } catch (error) {
            console.error(`❌ Error al cargar vista ${viewId}:`, error);
            viewElement.innerHTML = this.createErrorContent(viewId, error);
        }
    }
    
    /**
     * Inicializar componentes específicos de una vista
     */
    initializeViewComponents(viewId, viewElement) {
        switch (viewId) {
            case 'dashboard':
                this.initializeDashboardComponents(viewElement);
                break;
            case 'courses':
                this.initializeCoursesComponents(viewElement);
                break;
            case 'students':
                this.initializeStudentsComponents(viewElement);
                break;
            case 'grades':
                this.initializeGradesComponents(viewElement);
                break;
            case 'reports':
                this.initializeReportsComponents(viewElement);
                break;
            case 'admin':
                this.initializeAdminComponents(viewElement);
                break;
        }
    }
    
    /**
     * Inicializar componentes del dashboard
     */
    initializeDashboardComponents(container) {
        console.log("📊 Inicializando componentes del dashboard");
        
        // Aquí puedes agregar lógica específica del dashboard
        // Por ejemplo, cargar estadísticas, gráficos, etc.
        
        // Ejemplo: inicializar gráficos si hay elementos canvas
        const charts = container.querySelectorAll('canvas');
        if (charts.length > 0 && typeof Chart !== 'undefined') {
            this.initializeCharts(charts);
        }
    }
    
    /**
     * Inicializar gráficos
     */
    initializeCharts(canvasElements) {
        canvasElements.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            const chartType = canvas.dataset.chartType || 'bar';
            const chartData = JSON.parse(canvas.dataset.chartData || '{}');
            
            new Chart(ctx, {
                type: chartType,
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: canvas.dataset.chartTitle || 'Gráfico'
                        }
                    }
                }
            });
        });
    }
    
    /**
     * Actualizar navegación activa
     */
    updateActiveNav(activeViewId) {
        const navLinks = this.container.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            const route = link.getAttribute('data-route');
            if (route === activeViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Mostrar vista de error
     */
    showErrorView(message) {
        const errorView = this.container.querySelector('#error-view') || this.createErrorView();
        errorView.innerHTML = this.createErrorContent('error', { message });
        this.showView('error');
    }
    
    /**
     * Crear vista de error
     */
    createErrorView() {
        const errorView = document.createElement('div');
        errorView.id = 'error-view';
        errorView.className = 'am-view';
        this.container.querySelector('#am-views-container').appendChild(errorView);
        return errorView;
    }
    
    /**
     * Crear contenido de error
     */
    createErrorContent(viewId, error) {
        return `
            <div class="alert alert-danger">
                <h4>Error al cargar ${viewId}</h4>
                <p>${error.message || 'Error desconocido'}</p>
                <button class="btn btn-primary" onclick="router.navigate('dashboard')">
                    Volver al Dashboard
                </button>
            </div>
        `;
    }
    
    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info', duration = 5000) {
        // Crear contenedor de notificaciones si no existe
        let notificationContainer = this.container.querySelector('#am-notifications');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'am-notifications';
            notificationContainer.className = 'am-notifications';
            this.container.appendChild(notificationContainer);
        }
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Auto-eliminar después de la duración
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        }
        
        return notification;
    }
    
    /**
     * Mostrar modal
     */
    async showModal(title, content, options = {}) {
        const modalId = options.id || `modal-${Date.now()}`;
        
        const modalHTML = await MustacheRenderer.render('modal', {
            id: modalId,
            title: title,
            content: content,
            size: options.size || 'modal-lg',
            showFooter: options.showFooter !== false,
            buttons: options.buttons || [
                { label: 'Cerrar', type: 'secondary', dismiss: true }
            ]
        });
        
        // Agregar modal al body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Inicializar modal de Bootstrap si está disponible
        const modalElement = document.getElementById(modalId);
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            // Manejar eventos del modal
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
            });
            
            return modal;
        } else {
            // Fallback manual
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
            
            // Cerrar modal
            const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    modalElement.style.display = 'none';
                    modalElement.classList.remove('show');
                    modalElement.remove();
                });
            });
            
            return {
                hide: () => {
                    modalElement.style.display = 'none';
                    modalElement.classList.remove('show');
                    modalElement.remove();
                }
            };
        }
    }
    
    /**
     * Mostrar confirmación
     */
    async showConfirm(message, options = {}) {
        return new Promise((resolve) => {
            const buttons = [
                {
                    label: options.cancelText || 'Cancelar',
                    type: 'secondary',
                    dismiss: true,
                    action: () => resolve(false)
                },
                {
                    label: options.confirmText || 'Confirmar',
                    type: 'primary',
                    action: () => resolve(true)
                }
            ];
            
            this.showModal(
                options.title || 'Confirmar acción',
                `<p>${message}</p>`,
                {
                    ...options,
                    buttons: buttons
                }
            );
        });
    }
    
    /**
     * Actualizar badge en navegación
     */
    updateNavBadge(routeId, count) {
        const navLink = this.container.querySelector(`[data-route="${routeId}"]`);
        if (navLink) {
            let badge = navLink.querySelector('.badge');
            if (!badge && count > 0) {
                badge = document.createElement('span');
                badge.className = 'badge bg-danger ms-2';
                navLink.appendChild(badge);
            }
            
            if (badge) {
                if (count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'inline-block';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.UIRenderer = UIRenderer;
}