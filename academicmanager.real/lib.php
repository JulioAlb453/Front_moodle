<?php
defined('MOODLE_INTERNAL') || die();

function local_academicmanager_get_programs() {
    // Datos de ejemplo - luego conectarás a BD
    return [
        ['id' => 1, 'name' => 'Ingeniería de Software'],
        ['id' => 2, 'name' => 'Administración de Empresas'],
        ['id' => 3, 'name' => 'Derecho'],
        ['id' => 4, 'name' => 'Medicina'],
        ['id' => 5, 'name' => 'Psicología'],
    ];
}

// Función para instalar el plugin (si es necesario)
function xmldb_local_academicmanager_install() {
    return true;
}
