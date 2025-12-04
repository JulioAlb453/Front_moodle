#!/bin/bash
echo "🔄 Copiando cambios a Moodle..."
sudo cp -r /home/ubuntu/Front_moodle/academicmanager/* /var/www/html/moodle/local/academicmanager/
sudo chown -R www-data:www-data /var/www/html/moodle/local/academicmanager
cd /var/www/html/moodle
php admin/cli/purge_caches.php
echo "✅ Cambios aplicados en Moodle"
