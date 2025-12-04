<?php
require_once('/var/www/html/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

// Cargar CSS básico INLINE
echo '<style>';
include('styles/main.css'); // Asegúrate de que este archivo existe
echo '</style>';

echo $OUTPUT->header();
?>

<script>
// Datos básicos
window.moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    userName: '<?php echo addslashes(fullname($USER)); ?>'
};
</script>

<!-- Cargar versión simple -->
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache.min.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/config-manager.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/ui-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/routes.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/app.js"></script>
<script>
// Inicializar después de cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM cargado, inicializando...');
    
    if (typeof AcademicManager !== 'undefined') {
        window.academicManager = new AcademicManager();
        window.academicManager.init();
        console.log('✅ Academic Manager inicializado');
    } else {
        console.error('❌ AcademicManager no definido');
        
        // Fallback: mostrar contenido básico
        document.getElementById('academic-manager-app').innerHTML = `
            <div style="padding: 20px;">
                <h2>Academic Manager</h2>
                <p>Error cargando la aplicación. Usando fallback.</p>
                <button onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
});
</script>

<!-- Contenedor principal -->
<div id="academic-manager-app">
    <div id="loading-message" style="padding: 50px; text-align: center;">
        Cargando Academic Manager...
    </div>
</div>

<?php
echo $OUTPUT->footer();