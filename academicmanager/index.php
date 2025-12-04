<?php
require_once('/var/www/html/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

// Cargar CSS - CORREGIDO
$PAGE->requires->css('/local/academicmanager/styles/main.css');
$PAGE->requires->css('/local/academicmanager/styles/components/buttons.css');
$PAGE->requires->css('/local/academicmanager/styles/components/cards.css');
$PAGE->requires->css('/local/academicmanager/styles/components/forms.css');
$PAGE->requires->css('/local/academicmanager/styles/components/tables.css');
$PAGE->requires->css('/local/academicmanager/styles/components/header.css');

echo $OUTPUT->header();
?>

<!-- Datos iniciales para JavaScript -->
<script>
window.moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    sesskey: '<?php echo sesskey(); ?>',
    userId: <?php echo $USER->id; ?>,
    userName: '<?php echo addslashes(fullname($USER)); ?>'
};
</script>

<!-- Cargar Mustache.js primero -->
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache.min.js"></script>

<!-- Cargar tus archivos JavaScript -->
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/config-manager.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/ui-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/routes.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/app.js"></script>

<!-- Solo el contenedor principal - NO MÁS HTML -->
<div id="academic-manager-app">
    <div id="loading-message">
        <div class="spinner"></div>
        <p>Cargando Academic Manager...</p>
    </div>
</div>

<?php
echo $OUTPUT->footer();