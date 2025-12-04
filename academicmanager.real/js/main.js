// Punto de entrada principal
document.addEventListener("DOMContentLoaded", async function () {
    console.log('Aplicación Academic Manager - Iniciando...');
    
    try {
        // Todas las dependencias deberían estar cargadas ahora
        if (typeof AcademicManager === 'undefined') {
            throw new Error('AcademicManager no está definido');
        }
        
        // Crear e inicializar la aplicación
        window.academicManager = new AcademicManager();
        await window.academicManager.init();
        
        console.log('Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('Error inicializando la aplicación:', error);
        
        // Mostrar error al usuario
        const appContainer = document.getElementById('academic-manager-app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Error de inicialización</h4>
                    <p>No se pudo cargar la aplicación: ${error.message}</p>
                    <p>Verifica que todos los archivos JavaScript estén cargados correctamente.</p>
                </div>
            `;
        }
    }
});