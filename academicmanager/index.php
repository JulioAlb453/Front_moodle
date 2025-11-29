<?php
require_once('/home/yo/Up/7mo/Concurrencia/moodle-latest/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

echo $OUTPUT->header();

// Determinar qué vista mostrar
$action = optional_param('action', 'main', PARAM_TEXT);
?>

<!-- Cargar CSS directamente -->
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/main.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/header.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/cards.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/forms.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/buttons.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/components/tables.css">
<link rel="stylesheet" href="<?php echo $CFG->wwwroot; ?>/local/academicmanager/styles/concurrent.css">

<style>
    /* Estilos básicos para las vistas */
    .view { 
        display: none; 
        animation: fadeIn 0.3s ease-in;
    }
    .view.active { 
        display: block; 
    }
    
    .subjects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .subject-card {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        border-left: 4px solid #3498db;
    }
    
    .subject-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .admin-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .action-group {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .concurrent-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.1rem;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

<!-- Contenedor principal - VACÍO, se llenará con JavaScript -->
<div id="academic-manager-app">
    <!-- La navegación y contenido se renderizarán dinámicamente -->
</div>

<!-- Cargar JS directamente -->
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache.min.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/moodle-api.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/concurrent-actions.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/app.js"></script>

<script>
// Pasar datos de PHP a JavaScript
const moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    sesskey: '<?php echo sesskey(); ?>',
    userId: <?php echo $USER->id; ?>,
    userName: '<?php echo fullname($USER); ?>',
    currentAction: '<?php echo $action; ?>'
};
</script>

<?php
echo $OUTPUT->footer();