<?php
require_once('/var/www/html/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

$PAGE->requires->js('/local/academicmanager/js/mustache.min.js');


// Cargar CSS
$PAGE->requires->css('/local/academicmanager/styles/main.css');
$PAGE->requires->css('/local/academicmanager/styles/components/buttons.css');
$PAGE->requires->css('/local/academicmanager/styles/components/cards.css');
$PAGE->requires->css('/local/academicmanager/styles/components/forms.css');
$PAGE->requires->css('/local/academicmanager/styles/components/tables.css');
$PAGE->requires->css('/local/academicmanager/styles/components/header.css');

$PAGE->requires->js_call_amd('local_academicmanager/config-manager', 'init');
$PAGE->requires->js_call_amd('local_academicmanager/mustache-renderer', 'init');
$PAGE->requires->js_call_amd('local_academicmanager/ui-renderer', 'init');
$PAGE->requires->js_call_amd('local_academicmanager/routes', 'init');
$PAGE->requires->js_call_amd('local_academicmanager/app', 'init');

echo $OUTPUT->header();
?>

<!-- Datos iniciales para JavaScript -->
<script>
window.moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    sesskey: '<?php echo sesskey(); ?>',
    userId: <?php echo $USER->id; ?>,
    userName: '<?php echo json_encode(fullname($USER)); ?>'
};
</script>

<!-- Solo el contenedor principal -->
<div id="academic-manager-app">
    <div id="loading-message">
        <div class="spinner"></div>
        <p>Cargando Academic Manager...</p>
    </div>
</div>

<style>
/* Mantén tus estilos actuales */
</style>

<script>
// Función para cargar scripts de forma compatible con RequireJS
function loadAcademicScript(src, isRequireJSModule = false) {
    return new Promise((resolve, reject) => {
        if (isRequireJSModule && typeof require !== 'undefined') {
            // Cargar como módulo RequireJS
            require([src.replace(/\.js$/, '')], resolve, reject);
        } else {
            // Cargar como script normal
            console.log(`📦 Cargando: ${src}`);
            const script = document.createElement('script');
            script.src = src;
            
            // IMPORTANTE: Deshabilitar detección automática de AMD
            script.setAttribute('data-amd', '1');
            
            script.onload = () => {
                console.log(`✅ Cargado: ${src}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`❌ Error cargando ${src}:`, error);
                reject(error);
            };
            document.head.appendChild(script);
        }
    });
}

// Cargar scripts en orden
(async () => {
    try {
        // 1. Cargar Mustache.js de forma especial (no como módulo AMD)
        console.log('📦 Cargando Mustache.js...');
        await new Promise((resolve, reject) => {
            // Crear script con configuración para evitar conflicto con RequireJS
            const script = document.createElement('script');
            script.src = '<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache.min.js';
            
            // Configurar para que no se detecte como módulo AMD
            script.setAttribute('data-amd', '1');
            script.setAttribute('data-nomodule', '1');
            
            // Guardar define original
            const originalDefine = window.define;
            window.define = null;
            
            script.onload = () => {
                console.log('✅ Mustache.js cargado');
                // Restaurar define después de cargar Mustache
                window.define = originalDefine;
                resolve();
            };
            
            script.onerror = reject;
            document.head.appendChild(script);
        });
        
        // 2. Cargar tus scripts (sin RequireJS)
        const scripts = [
            '<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/config-manager.js',
            '<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js',
            '<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/ui-renderer.js',
            '<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/routes.js',
            '<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/app.js'
        ];
        
        for (const src of scripts) {
            await loadAcademicScript(src);
        }
        
        console.log('🚀 Todos los scripts cargados');
        
        // Verificar que todo se cargó correctamente
        setTimeout(() => {
            if (typeof Mustache !== 'undefined') {
                console.log('✅ Mustache disponible');
            }
            if (typeof AcademicManager !== 'undefined') {
                console.log('✅ AcademicManager disponible');
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error cargando scripts:', error);
    }
})();
</script>

<?php
echo $OUTPUT->footer();
?>