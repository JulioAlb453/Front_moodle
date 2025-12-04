<?php
defined('MOODLE_INTERNAL') || die();

class academicmanager_renderer {
    
    public static function get_programs() {
        global $DB;
        
        // Ejemplo de datos estáticos - luego reemplazar con tu BD
        return [
            ['id' => 1, 'nombre' => 'Ingeniería en Software'],
            ['id' => 2, 'nombre' => 'Administración de Empresas'],
            ['id' => 3, 'nombre' => 'Psicología Organizacional']
        ];
    }
    
    public static function get_semesters() {
        return range(1, 10);
    }
    
    public static function get_subjects($program_id, $semester) {
        // Datos de ejemplo - reemplazar con consultas a tu BD
        return [
            [
                'id' => 1,
                'nombre' => 'Programación Concurrente',
                'grupo_nombre' => 'G1',
                'docente_nombre' => 'Dr. Juan Pérez',
                'alumnos_count' => 25
            ],
            [
                'id' => 2,
                'nombre' => 'Base de Datos Avanzadas',
                'grupo_nombre' => 'G1',
                'docente_nombre' => 'Dra. María García',
                'alumnos_count' => 23
            ]
        ];
    }
    
    public static function render_template($template_name, $data = []) {
        $template_path = __DIR__ . '/templates/' . $template_name . '.mustache';
        
        if (!file_exists($template_path)) {
            return '<div class="alert alert-danger">Template no encontrado: ' . $template_name . '</div>';
        }
        
        $template_content = file_get_contents($template_path);
        
        // Reemplazo simple de variables - para producción usar Mustache PHP
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                // Manejar arrays - simplificado
                $placeholder = '{{#' . $key . '}}.*?{{/' . $key . '}}';
                $template_content = preg_replace('/' . $placeholder . '/s', '', $template_content);
                
                $items_html = '';
                foreach ($value as $item) {
                    $item_html = self::extract_block($template_content, $key);
                    foreach ($item as $item_key => $item_value) {
                        $item_html = str_replace('{{' . $item_key . '}}', $item_value, $item_html);
                    }
                    $items_html .= $item_html;
                }
                
                $template_content = self::replace_block($template_content, $key, $items_html);
            } else {
                $template_content = str_replace('{{' . $key . '}}', $value, $template_content);
            }
        }
        
        // Limpiar placeholders no reemplazados
        $template_content = preg_replace('/{{.*?}}/', '', $template_content);
        
        return $template_content;
    }
    
    private static function extract_block($content, $block_name) {
        preg_match('/{{#' . $block_name . '}}(.*?){{\/' . $block_name . '}}/s', $content, $matches);
        return $matches[1] ?? '';
    }
    
    private static function replace_block($content, $block_name, $replacement) {
        return preg_replace('/{{#' . $block_name . '}}.*?{{\/' . $block_name . '}}/s', $replacement, $content);
    }
}