<?php
require_once('/var/www/html/moodle/config.php');
require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager');

// Cargar CSS
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

<!-- Solo el contenedor principal -->
<div id="academic-manager-app">
    <div id="loading-message">
        <div class="spinner"></div>
        <p>Cargando Academic Manager...</p>
    </div>
</div>
<style>
/* ESTILOS TEMPORALES DE DIAGNÓSTICO */
#academic-manager-app * {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

/* Header */
.am-header {
    background: linear-gradient(135deg, #2c3e50, #34495e);
    color: white;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.am-header h1 {
    margin: 0;
    font-size: 1.5rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.btn-logout {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 8px 15px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 14px;
}

/* Layout principal */
.am-container {
    display: flex;
    min-height: calc(100vh - 70px);
}

/* Sidebar */
.am-sidebar {
    width: 250px;
    background: white;
    border-right: 1px solid #e1e5eb;
    padding: 20px 0;
}

.am-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 25px;
    color: #555;
    text-decoration: none;
    transition: all 0.3s;
    border-left: 4px solid transparent;
}

.menu-item:hover {
    background: #f8f9fa;
    color: #3498db;
    border-left-color: #3498db;
}

.menu-item.active {
    background: #e3f2fd;
    color: #3498db;
    border-left-color: #3498db;
    font-weight: bold;
}

/* Área principal */
.am-main {
    flex: 1;
    padding: 25px;
    background: #f8f9fa;
}

/* Cards */
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    margin-bottom: 20px;
    overflow: hidden;
}

.card-header {
    background: #f8f9fa;
    padding: 18px 25px;
    border-bottom: 1px solid #eaeaea;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h3 {
    color: #2c3e50;
    font-size: 1.2rem;
    margin: 0;
}

.card-body {
    padding: 25px;
}

/* Formularios */
.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
}

.form-control {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

/* Botones */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: #3498db;
    color: white;
}

.btn-success {
    background: #27ae60;
    color: white;
}

.btn-warning {
    background: #f39c12;
    color: white;
}

.btn-action {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    padding: 12px 25px;
    text-align: left;
    display: block;
    width: 100%;
    margin-bottom: 10px;
    border-radius: 6px;
}

.btn-action:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

/* Grid de acciones */
.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 20px;
}

/* Loading spinner */
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

/* Responsive */
@media (max-width: 768px) {
    .am-container {
        flex-direction: column;
    }
    
    .am-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e1e5eb;
    }
}
</style>
<script>
console.log('=== CARGA DE SCRIPTS ===');

// Función para cargar scripts con verificación
function loadScript(src) {
    return new Promise((resolve, reject) => {
        console.log(`📦 Cargando: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`✅ Cargado: ${src}`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`❌ Error cargando ${src}:`, error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// Cargar scripts en orden
(async () => {
    try {
        // 1. Mustache.js
        await loadScript('<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache.min.js');
        
        // 2. Tus scripts
        await loadScript('<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/config-manager.js');
        console.log('ConfigManager disponible:', typeof ConfigManager !== 'undefined');
        
        await loadScript('<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/mustache-renderer.js');
        console.log('MustacheRenderer disponible:', typeof MustacheRenderer !== 'undefined');
        
        await loadScript('<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/ui-renderer.js');
        console.log('UIRenderer disponible:', typeof UIRenderer !== 'undefined');
        
        await loadScript('<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/routes.js');
        console.log('Router disponible:', typeof Router !== 'undefined');
        
        await loadScript('<?php echo $CFG->wwwroot; ?>/local/academicmanager/js/app.js');
        console.log('AcademicManager disponible:', typeof AcademicManager !== 'undefined');
        
        // 3. Inicializar después de que todo esté cargado
        setTimeout(() => {
            console.log('🚀 Iniciando Academic Manager...');
            if (typeof AcademicManager !== 'undefined') {
                window.academicManager = new AcademicManager();
                window.academicManager.init();
                console.log('✅ Academic Manager inicializado');
            } else {
                console.error('❌ AcademicManager no definido');
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ Error cargando scripts:', error);
    }
})();
</script>
<?php


echo $OUTPUT->footer();