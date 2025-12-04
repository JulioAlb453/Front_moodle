<?php
require_once('../../config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

// Cargar CSS
$PAGE->requires->css('/local/academicmanager/styles/main.css');
$PAGE->requires->css('/local/academicmanager/styles/concurrent.css');
$PAGE->requires->css('/local/academicmanager/styles/components/button.css');
$PAGE->requires->css('/local/academicmanager/styles/components/card.css');
$PAGE->requires->css('/local/academicmanager/styles/components/form.css');
$PAGE->requires->css('/local/academicmanager/styles/components/table.css');
$PAGE->requires->css('/local/academicmanager/styles/components/header.css');



echo $OUTPUT->header();
?>

<!-- 1. DEFINIR moodleData PRIMERO -->
<script>
window.moodleData = {
    baseUrl: '<?php echo $CFG->wwwroot; ?>',
    sesskey: '<?php echo sesskey(); ?>',
    userId: <?php echo $USER->id; ?>,
    userName: '<?php echo addslashes(fullname($USER)); ?>',
    currentAction: 'main'
};
console.log('moodleData definido:', window.moodleData);
</script>

<!-- 2. Cargar scripts -->
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache.min.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/config-manager.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/ui-renderer.js"></script>
<script src="<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/app.js"></script>

<!-- 3. Contenedor principal CON ID CORRECTO -->
<div id="academic-manager-app">
    <div id="loading-message">Cargando Academic Manager...</div>
</div>

<script>
console.log('=== INICIALIZACIÓN ===');

// Función segura para obtener elementos
function getElement(id) {
    var elem = document.getElementById(id);
    if (!elem) {
        console.warn('Elemento no encontrado:', id);
        return null;
    }
    return elem;
}

// Función para mostrar/ocultar loading
function hideLoading() {
    var loadingElem = getElement('loading-message');
    if (loadingElem) {
        loadingElem.style.display = 'none';
    }
}

function showError(message) {
    var appElem = getElement('academic-manager-app');
    if (appElem) {
        appElem.innerHTML = '<div class="error-message">' + message + '</div>';
    } else {
        console.error('No se puede mostrar error, app no encontrada');
    }
}

// Inicialización principal
function initAcademicManager() {
    console.log('Iniciando Academic Manager...');
    
    // Verificar dependencias
    if (typeof Mustache === 'undefined') {
        showError('Error: Mustache.js no disponible');
        return;
    }
    
    if (typeof AcademicManager === 'undefined') {
        showError('Error: AcademicManager no encontrado. Verifica la consola.');
        return;
    }
    
    // Asegurar que moodleData existe
    if (!window.moodleData) {
        console.warn('moodleData recreado');
        window.moodleData = {
            baseUrl: '<?php echo $CFG->wwwroot; ?>',
            sesskey: '<?php echo sesskey(); ?>',
            userId: <?php echo $USER->id; ?>,
            userName: '<?php echo addslashes(fullname($USER)); ?>',
            currentAction: 'main'
        };
    }
    
    try {
        // Crear instancia
        window.academicManager = new AcademicManager();
        
        // Inicializar
        window.academicManager.init().then(function() {
            console.log('✅ Academic Manager inicializado');
            hideLoading();
        }).catch(function(error) {
            console.error('Error en init():', error);
            showError('Error inicializando: ' + error.message);
        });
    } catch (error) {
        console.error('Error creando AcademicManager:', error);
        showError('Error crítico: ' + error.message);
    }
}

// Iniciar cuando esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded - iniciando');
        initAcademicManager();
    });
} else {
    console.log('DOM ya listo - iniciando');
    setTimeout(initAcademicManager, 100);
}

// Backup: también iniciar en window.load
window.addEventListener('load', function() {
    console.log('window.load - verificando estado');
    if (!window.academicManager) {
        setTimeout(initAcademicManager, 500);
    }
});
</script>

<style>
.error-message {
    background: #fee;
    border: 2px solid #c00;
    padding: 20px;
    margin: 20px;
    border-radius: 5px;
    color: #c00;
}
#loading-message {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    background: #eef;
    margin: 20px;
    border-radius: 5px;
}
</style>

<?php
echo $OUTPUT->footer();
