<?php
require_once('../../config.php');
require_once($CFG->dirroot . '/local/academicmanager/lib.php');

require_login();

$PAGE->set_url(new moodle_url('/local/academicmanager/index.php'));
$PAGE->set_context(context_system::instance());
$PAGE->set_title(get_string('title', 'local_academicmanager'));
$PAGE->set_heading(get_string('title', 'local_academicmanager'));

// Cargar CSS y JS
$PAGE->requires->css('/local/academicmanager/styles/main.css');
$PAGE->requires->css('/local/academicmanager/styles/concurrent.css');
$PAGE->requires->js('/local/academicmanager/js/app.js', true);
$PAGE->requires->js('/local/academicmanager/js/concurrent-actions.js', true);
$PAGE->requires->js('/local/academicmanager/js/moodle-api.js', true);

// Cargar datos iniciales
$programs = local_academicmanager_get_programs();
$semesters = range(1, 10);

$templatecontext = [
    'programs' => $programs,
    'semesters' => array_map(function($num) {
        return ['number' => $num];
    }, $semesters)
];

echo $OUTPUT->header();
echo $OUTPUT->render_from_template('local_academicmanager/selection', $templatecontext);
echo $OUTPUT->footer();