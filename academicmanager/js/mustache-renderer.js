class MustacheRenderer {
    constructor() {
        this.templates = {};
        this.loadingPromise = null;
    }

    async loadAllTemplates() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        
        this.loadingPromise = (async () => {
            console.log("📦 Cargando templates...");
            
            // Solo los templates esenciales para empezar
            const essentialTemplates = [
                "main-interface",
                "selection",
                "admin-panel"
            ];
            
            try {
                for (const name of essentialTemplates) {
                    const response = await fetch(
                        `${window.moodleData.baseUrl}/local/academicmanager/templates/${name}.mustache`
                    );
                    
                    if (response.ok) {
                        this.templates[name] = await response.text();
                        console.log(`✅ Template "${name}" cargado`);
                    } else {
                        console.warn(`⚠️ Template "${name}" no encontrado`);
                        this.templates[name] = ""; // Template vacío como fallback
                    }
                }
                
                console.log("🎯 Templates cargados:", Object.keys(this.templates));
                return true;
                
            } catch (error) {
                console.error("❌ Error cargando templates:", error);
                return false;
            }
        })();
        
        return this.loadingPromise;
    }

    async render(templateName, data, containerId) {
        // Asegurarse de que los templates estén cargados
        if (!this.templates[templateName]) {
            console.warn(`⏳ Template "${templateName}" no cargado, cargando ahora...`);
            const loaded = await this.loadAllTemplates();
            if (!loaded) {
                console.error(`❌ No se pudo cargar el template "${templateName}"`);
                return false;
            }
        }
        
        if (!this.templates[templateName]) {
            console.error(`❌ Template "${templateName}" no disponible después de cargar`);
            console.log("Templates disponibles:", Object.keys(this.templates));
            return false;
        }
        
        try {
            const html = Mustache.render(this.templates[templateName], data);
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = html;
                console.log(`✅ Template "${templateName}" renderizado en "${containerId}"`);
                return true;
            } else {
                console.error(`❌ Contenedor "${containerId}" no encontrado`);
                return false;
            }
            
        } catch (error) {
            console.error(`❌ Error renderizando template "${templateName}":`, error);
            return false;
        }
    }
}