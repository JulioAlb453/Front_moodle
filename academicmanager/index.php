<?php
require_once('/var/www/html/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

echo $OUTPUT->header();
?>

<!-- Datos iniciales para JavaScript -->
<script>
window.moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    sesskey: '<?php echo sesskey(); ?>',
    userId: <?php echo $USER->id; ?>,
    userName: <?php echo json_encode(fullname($USER)); ?>
};
</script>

<!-- Contenedor principal -->
<div id="academic-manager-app">
    <div id="loading-message">
        <div class="spinner"></div>
        <p>Cargando Academic Manager...</p>
    </div>
</div>

<style>
/* Estilos básicos */
#academic-manager-app * {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

#loading-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

<script>
console.log('=== ACADEMIC MANAGER - INICIALIZACIÓN ===');

// RUTA BASE - Ajusta según sea necesario
// Opción A: Si está en el mismo servidor (probablemente esta)
const BASE_PATH = '/local/academicmanager/js/';

// Opción B: Si está en tu home (necesita configuración especial)
// const BASE_PATH = '/front_moodle/academicmanager/js/';

// Función mejorada para cargar scripts
function loadScript(src, type = 'text/javascript') {
    return new Promise((resolve, reject) => {
        console.log('📦 Cargando:', src);
        const script = document.createElement('script');
        script.src = src;
        script.type = type;
        
        script.onload = () => {
            console.log('✅ Cargado:', src);
            resolve();
        };
        
        script.onerror = (error) => {
            console.error('❌ Error cargando:', src, error);
            reject(new Error(`Failed to load ${src}`));
        };
        
        document.head.appendChild(script);
    });
}

// Inicializar todo
async function initializeApp() {
    try {
        // 1. Cargar Mustache.js - versión UMD (no módulo ES6)
        await loadScript('https://unpkg.com/mustache@4.2.0/mustache.js');
        // O usa esta URL alternativa:
        // await loadScript('https://cdn.jsdelivr.net/npm/mustache@4.2.0/mustache.js');
        
        if (typeof Mustache === 'undefined') {
            throw new Error('Mustache.js no se cargó correctamente');
        }
        console.log('✅ Mustache.js disponible');
        
        // 2. Cargar tus scripts
        // PRIMERO: Verifica que los archivos existan en Moodle
        // Copia tus archivos a: /var/www/html/moodle/local/academicmanager/js/
        const scripts = [
            BASE_PATH + 'config-manager.js',
            BASE_PATH + 'mustache-renderer.js',
            BASE_PATH + 'ui-renderer.js',
            BASE_PATH + 'routes.js',
            BASE_PATH + 'app.js'
        ];
        
        for (const scriptUrl of scripts) {
            await loadScript(scriptUrl);
        }
        
        console.log('✅ Todos los scripts cargados');
        
        // 3. Inicializar la aplicación
        // Opción A: Si usas el sistema antiguo con init() global
        if (typeof initAcademicManager === 'function') {
            initAcademicManager();
        }
        // Opción B: Si usas la clase AcademicManager
        else if (typeof AcademicManager !== 'undefined') {
            window.academicManager = new AcademicManager();
            console.log('🎉 Academic Manager instanciado');
        }
        // Opción C: Si la inicialización es automática
        else {
            console.log('⚠️ Esperando inicialización automática...');
        }
        
        // Ocultar mensaje de carga después de un tiempo
        setTimeout(() => {
            const loadingMsg = document.getElementById('loading-message');
            if (loadingMsg) {
                loadingMsg.style.display = 'none';
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error crítico:', error.message);
        
        // Mostrar error al usuario
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.innerHTML = `
                <div style="color: #d32f2f; padding: 20px; text-align: center; max-width: 600px; margin: 0 auto;">
                    <h3>Error al cargar Academic Manager</h3>
                    <p><strong>${error.message}</strong></p>
                    <p style="font-size: 14px; margin-top: 20px;">
                        Verifica que los archivos JavaScript estén en:<br>
                        <code>/var/www/html/moodle/local/academicmanager/js/</code>
                    </p>
                    <div style="margin-top: 30px;">
                        <button onclick="location.reload()" style="padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
                            Recargar página
                        </button>
                        <button onclick="initializeApp()" style="padding: 10px 20px; background: #388e3c; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px;">
                            Reintentar
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
</script>

<?php
echo $OUTPUT->footer();