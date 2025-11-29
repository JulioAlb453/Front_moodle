<?php
// SOLUCIÓN: Ruta absoluta directa al config.php de Moodle
require_once('/home/yo/Up/7mo/Concurrencia/moodle-latest/moodle/config.php');

require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title('Academic Manager');
$PAGE->set_heading('Academic Manager - ¡Funcionando!');

echo $OUTPUT->header();
echo '<div class="alert alert-success">';
echo '<h1>🎉 ¡Módulo Conectado Correctamente!</h1>';
echo '<p>El enlace simbólico está funcionando con rutas absolutas.</p>';
echo '<p><strong>Archivo actual:</strong> ' . __FILE__ . '</p>';
echo '<p><strong>Moodle path:</strong> ' . $CFG->wwwroot . '</p>';
echo '</div>';

// Información del usuario
echo '<div class="card mt-3">';
echo '<div class="card-header">';
echo '<h3>Información del Sistema</h3>';
echo '</div>';
echo '<div class="card-body">';
echo '<p><strong>Usuarioaaaaaaaaaaaaaaaaaa:</strong> ' . fullname($USER) . '</p>';
echo '<p><strong>Email:</strong> ' . $USER->email . '</p>';
echo '<p><strong>Ruta de datos:</strong> ' . $CFG->dataroot . '</p>';
echo '</div>';
echo '</div>';

echo $OUTPUT->footer();
