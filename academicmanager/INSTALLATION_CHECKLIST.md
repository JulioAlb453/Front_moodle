# ✅ Checklist de Instalación - Academic Classroom

Usa este checklist para asegurarte de que todo esté configurado correctamente.

## 📋 Pre-requisitos

- [ ] Node.js instalado (v14 o superior)
  ```bash
  node --version
  ```

- [ ] npm instalado
  ```bash
  npm --version
  ```

- [ ] MySQL instalado y corriendo
  ```bash
  mysql --version
  ```

- [ ] Moodle instalado (opcional, para integración)

- [ ] Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🗄️ Configuración de Base de Datos

- [ ] Base de datos MySQL creada
  ```sql
  CREATE DATABASE moodle_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

- [ ] Usuario de base de datos creado
  ```sql
  CREATE USER 'moodle_user'@'localhost' IDENTIFIED BY 'tu_password';
  GRANT ALL PRIVILEGES ON moodle_db.* TO 'moodle_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

- [ ] Script SQL ejecutado
  ```bash
  cd api
  mysql -u moodle_user -p moodle_db < database.sql
  ```

- [ ] Tablas creadas correctamente
  ```sql
  USE moodle_db;
  SHOW TABLES;
  -- Deberías ver: alumnos, asignaturas, docentes, grupos, programas_estudio, etc.
  ```

## 🔧 Configuración de la API

- [ ] Dependencias instaladas
  ```bash
  cd api
  npm install
  ```

- [ ] Archivo `.env` creado
  ```bash
  cp .env.example .env
  ```

- [ ] Variables de entorno configuradas en `.env`
  ```env
  DB_HOST=localhost
  DB_USER=moodle_user
  DB_PASSWORD=tu_password
  DB_NAME=moodle_db
  PORT=3000
  NODE_ENV=development
  ```

- [ ] API inicia correctamente
  ```bash
  npm run dev
  ```

- [ ] API responde en el navegador
  ```
  http://localhost:3000/api/asignaturas
  ```

- [ ] Swagger docs accesible
  ```
  http://localhost:3000/api-docs
  ```

## 🎨 Configuración del Frontend

- [ ] Archivos copiados a Moodle
  ```
  /var/www/html/moodle/local/academicmanager/
  ```

- [ ] Permisos correctos
  ```bash
  chmod -R 755 /var/www/html/moodle/local/academicmanager/
  ```

- [ ] URL de API configurada en `js/config.js`
  ```javascript
  API_URL: 'http://localhost:3000/api'
  ```

- [ ] CSS cargando correctamente
  - Abre `classroom.php` en el navegador
  - Inspecciona (F12) y verifica que `classroom.css` se carga sin errores

- [ ] JavaScript cargando correctamente
  - Abre la consola (F12)
  - Verifica que no hay errores de carga de scripts

## 🔌 Configuración de CORS

- [ ] CORS habilitado en la API
  ```javascript
  // En api/src/app.js
  const cors = require('cors');
  app.use(cors({
      origin: ['http://localhost', 'http://tu-moodle.com'],
      credentials: true
  }));
  ```

- [ ] Sin errores de CORS en la consola
  - Abre `classroom.php`
  - Abre la consola (F12)
  - Verifica que no hay errores de CORS

## 🧪 Pruebas Funcionales

### API

- [ ] GET /api/alumnos funciona
  ```bash
  curl http://localhost:3000/api/alumnos
  ```

- [ ] POST /api/alumnos funciona
  ```bash
  curl -X POST http://localhost:3000/api/alumnos \
    -H "Content-Type: application/json" \
    -d '{"nombre":"Test Student"}'
  ```

- [ ] GET /api/asignaturas funciona
  ```bash
  curl http://localhost:3000/api/asignaturas
  ```

- [ ] POST /api/asignaturas funciona
  ```bash
  curl -X POST http://localhost:3000/api/asignaturas \
    -H "Content-Type: application/json" \
    -d '{"nombre":"Test Course","cuatrimestre":1}'
  ```

### Frontend

- [ ] Dashboard carga correctamente
  - Abre `classroom.php`
  - Verifica que ves las tarjetas de cursos

- [ ] Crear curso funciona
  - Click en "Nuevo Curso"
  - Completa el formulario
  - Verifica que el curso se crea

- [ ] Ver estudiantes funciona
  - Click en "Estudiantes" en el sidebar
  - Verifica que ves la lista de estudiantes

- [ ] Crear estudiante funciona
  - Click en "Nuevo Estudiante"
  - Completa el formulario
  - Verifica que el estudiante se crea

- [ ] Editar estudiante funciona
  - Click en el botón de editar (✏️)
  - Modifica el nombre
  - Verifica que se actualiza

- [ ] Eliminar estudiante funciona
  - Click en el botón de eliminar (🗑️)
  - Confirma la eliminación
  - Verifica que se elimina

- [ ] Navegación funciona
  - Click en cada item del sidebar
  - Verifica que cada vista carga correctamente

- [ ] Responsive funciona
  - Redimensiona la ventana del navegador
  - Verifica que la interfaz se adapta

## 🔍 Verificación de Logs

### API Logs

- [ ] Sin errores en la consola de la API
  ```bash
  # En la terminal donde corre npm run dev
  # No deberías ver errores en rojo
  ```

- [ ] Peticiones HTTP se registran
  ```bash
  # Deberías ver logs como:
  # GET /api/alumnos 200
  # POST /api/asignaturas 201
  ```

### Frontend Logs

- [ ] Sin errores en la consola del navegador
  - Abre la consola (F12)
  - Pestaña "Console"
  - No deberías ver errores en rojo

- [ ] Peticiones a la API exitosas
  - Abre la consola (F12)
  - Pestaña "Network"
  - Filtra por "XHR"
  - Verifica que las peticiones tienen status 200

## 🎯 Verificación de Funcionalidades

### Dashboard
- [ ] Tarjetas de cursos se muestran
- [ ] Colores diferentes por curso
- [ ] Botón "Nuevo Curso" funciona
- [ ] Click en tarjeta abre detalles

### Estudiantes
- [ ] Lista de estudiantes se muestra
- [ ] Avatares con iniciales se muestran
- [ ] Botón "Nuevo Estudiante" funciona
- [ ] Editar estudiante funciona
- [ ] Eliminar estudiante funciona

### Cursos
- [ ] Lista de cursos se muestra
- [ ] Crear curso funciona
- [ ] Editar curso funciona
- [ ] Eliminar curso funciona

### Programas
- [ ] Lista de programas se muestra
- [ ] Detalles de programa se muestran

### UI/UX
- [ ] Sidebar se colapsa en móvil
- [ ] Modales se abren y cierran
- [ ] Toasts se muestran correctamente
- [ ] Formularios validan datos
- [ ] Loading spinners se muestran

## 🔒 Verificación de Seguridad

- [ ] Autenticación de Moodle funciona
  ```php
  // En classroom.php
  require_login(); // Debe estar presente
  ```

- [ ] Variables de entorno no expuestas
  - `.env` no debe estar en el repositorio
  - `.env` debe estar en `.gitignore`

- [ ] Credenciales de BD seguras
  - Password fuerte en `.env`
  - Usuario de BD con permisos limitados

- [ ] CORS configurado correctamente
  - Solo dominios permitidos en `origin`

## 📱 Verificación Responsive

### Desktop (1920x1080)
- [ ] Sidebar visible
- [ ] Grid de cursos: 3-4 columnas
- [ ] Todos los elementos visibles

### Tablet (768x1024)
- [ ] Sidebar colapsable
- [ ] Grid de cursos: 2 columnas
- [ ] Navegación funcional

### Mobile (375x667)
- [ ] Sidebar oculto por defecto
- [ ] Menú hamburguesa funciona
- [ ] Grid de cursos: 1 columna
- [ ] Botones accesibles

## 🌐 Verificación de Navegadores

- [ ] Chrome
  - Abre `classroom.php` en Chrome
  - Verifica que todo funciona

- [ ] Firefox
  - Abre `classroom.php` en Firefox
  - Verifica que todo funciona

- [ ] Safari (si disponible)
  - Abre `classroom.php` en Safari
  - Verifica que todo funciona

- [ ] Edge
  - Abre `classroom.php` en Edge
  - Verifica que todo funciona

## 📊 Verificación de Rendimiento

- [ ] Carga inicial < 3 segundos
  - Abre la consola (F12)
  - Pestaña "Network"
  - Recarga la página
  - Verifica el tiempo de carga

- [ ] Peticiones a API < 1 segundo
  - Verifica en la pestaña "Network"
  - Las peticiones XHR deben ser rápidas

- [ ] Sin memory leaks
  - Usa la aplicación por varios minutos
  - Abre la pestaña "Memory" en DevTools
  - Verifica que la memoria no crece indefinidamente

## 🎓 Verificación de Documentación

- [ ] README.md leído
- [ ] QUICK_START.md seguido
- [ ] EXAMPLES.md revisado
- [ ] PROJECT_STRUCTURE.md entendido

## ✅ Checklist Final

- [ ] API corriendo sin errores
- [ ] Frontend cargando correctamente
- [ ] Base de datos conectada
- [ ] CORS configurado
- [ ] Todas las funcionalidades probadas
- [ ] Sin errores en consola
- [ ] Responsive funcionando
- [ ] Documentación revisada

## 🎉 ¡Instalación Completa!

Si todos los items están marcados, ¡felicidades! Tu plataforma Academic Classroom está lista para usar.

## 🆘 Si algo no funciona

1. **Revisa los logs**
   - Consola del navegador (F12)
   - Terminal de la API

2. **Verifica la configuración**
   - `js/config.js`
   - `api/.env`

3. **Revisa la documentación**
   - `CLASSROOM_README.md`
   - `QUICK_START.md`

4. **Prueba el demo standalone**
   - Abre `demo.html` en el navegador
   - Si funciona, el problema es con Moodle

5. **Verifica la API directamente**
   - Abre `http://localhost:3000/api/asignaturas`
   - Si no funciona, el problema es con la API

## 📞 Soporte

Si después de revisar todo sigues teniendo problemas:

1. Revisa los logs detalladamente
2. Busca el error específico en Google
3. Verifica que todas las dependencias estén instaladas
4. Asegúrate de que los puertos no estén ocupados

---

**¡Buena suerte con tu instalación! 🚀**
