<?php
require_once('/var/www/html/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/classroom.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Classroom');
$PAGE->set_heading('Academic Classroom');

$PAGE->requires->css('/local/academicmanager/styles/classroom.css');

echo $OUTPUT->header();
?>

<script>
window.moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    sesskey: '<?php echo sesskey(); ?>',
    userId: <?php echo $USER->id; ?>,
    userName: '<?php echo addslashes(fullname($USER)); ?>'
};
</script>

<script src="https://unpkg.com/mustache@4.2.0/mustache.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/config.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/api-client.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/classroom-app.js"></script>

<div id="academic-manager-app">
    <div class="loading">Cargando Academic Classroom...</div>
</div>

<script>
document.addEventListener('DOMContentLoaded', async function() {
    try {
        window.classroomApp = new ClassroomApp();
        await classroomApp.init();
    } catch (error) {
        document.getElementById('academic-manager-app').innerHTML = `
            <div class="error">
                <h3>Error al cargar la aplicación</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
});
</script>

<?php
echo $OUTPUT->footer();
