<?php
require_once('/home/yo/Up/7mo/Concurrencia/moodle-latest/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

echo $OUTPUT->header();

$action = optional_param('action', 'main', PARAM_TEXT);
?>

<!-- Cargar CSS -->
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/main.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/header.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/cards.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/forms.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/buttons.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/tables.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/concurrent.css">

<style>
    /* Estilos básicos para las vistas */
    .view { display: none; }
    .view.active { display: block; }
</style>

<!-- Contenedor principal -->
<div id="academic-manager-app">
    <!-- Cargando... -->
    <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando Academic Manager...</p>
    </div>
</div>

<!-- 1. moodleData debe definirse ANTES de cualquier script -->
<script>
// moodleData debe estar disponible globalmente
window.moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    sesskey: '<?php echo sesskey(); ?>',
    userId: <?php echo $USER->id; ?>,
    userName: '<?php echo addslashes(fullname($USER)); ?>',
    currentAction: '<?php echo $action; ?>'
};
console.log('moodleData definido:', window.moodleData);
</script>

<!-- 2. Cargar Mustache primero -->
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache.min.js"></script>

<!-- 3. Cargar nuestros módulos en ORDEN -->
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/config-manager.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/ui-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/app.js"></script>

<!-- 4. Punto de entrada principal -->
<script>
// Inicializar cuando TODO esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, verificando dependencias...');
    
    // Verificar que Mustache está cargado
    if (typeof Mustache === 'undefined') {
        console.error('Mustache.js no cargado');
        return;
    }
    
    // Verificar que moodleData está disponible
    if (!window.moodleData) {
        console.warn('moodleData no definido, usando valores por defecto');
        window.moodleData = {
            baseUrl: 'http://localhost/moodle',
            sesskey: 'demo',
            userId: 1,
            userName: 'Usuario Demo',
            currentAction: 'main'
        };
    }
    
    // Inicializar la aplicación
    if (typeof AcademicManager !== 'undefined') {
        console.log('Inicializando Academic Manager...');
        window.academicManager = new AcademicManager();
        window.academicManager.init().then(() => {
            console.log('Academic Manager inicializado correctamente');
        }).catch(error => {
            console.error('Error inicializando Academic Manager:', error);
        });
    } else {
        console.error('AcademicManager no está definido');
    }
});
</script>

<?php
echo $OUTPUT->footer();