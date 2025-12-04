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

// RUTA BASE A TU PROYECTO EXTERNO
// IMPORTANTE: Ajusta esta ruta según cómo se accede desde la web
const BASE_PATH = 'http://18.205.97.225/Front_moodle/academicmanager/js/';
// O si está en el mismo servidor:
// const BASE_PATH = '/Front_moodle/academicmanager/js/';

// Función simple para cargar scripts
function loadScript(src) {
    return new Promise((resolve, reject) => {
        console.log('📦 Cargando:', src);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log('✅ Cargado:', src);
            resolve();
        };
        script.onerror = (error) => {
            console.error('❌ Error:', src, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// Inicializar todo
async function initializeApp() {
    try {
        // 1. Cargar Mustache.js desde CDN (más confiable)
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js');
        console.log('✅ Mustache.js disponible:', typeof Mustache !== 'undefined');
        
        // 2. Cargar tus scripts en orden
        const scripts = [
            'config-manager.js',
            'mustache-renderer.js',
            'ui-renderer.js',
            'routes.js',
            'app.js'
        ];
        
        for (const script of scripts) {
            await loadScript(BASE_PATH + script);
        }
        
        console.log('✅ Todos los scripts cargados');
        
        // 3. Verificar que todo esté disponible
        const requiredClasses = ['ConfigManager', 'MustacheRenderer', 'UIRenderer', 'Router', 'AcademicManager'];
        for (const className of requiredClasses) {
            if (typeof window[className] === 'undefined') {
                console.error('❌ Clase no disponible:', className);
            } else {
                console.log('✓', className, 'OK');
            }
        }
        
        // 4. La aplicación debería inicializarse automáticamente en app.js
        // Si no, puedes forzar la inicialización:
        if (typeof window.academicManager !== 'undefined' && 
            typeof window.academicManager.init === 'function') {
            window.academicManager.init();
        }
        
        console.log('🎉 Academic Manager inicializado');
        
    } catch (error) {
        console.error('❌ Error crítico:', error);
        document.getElementById('loading-message').innerHTML = `
            <div style="color: #d32f2f; padding: 20px; text-align: center;">
                <h3>Error al cargar Academic Manager</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Recargar página
                </button>
            </div>
        `;
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