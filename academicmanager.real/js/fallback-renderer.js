class FallbackRenderer {
    constructor() {
    }

    renderSelection(programs, semesters, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3>Selección de Programa</h3>
                </div>
                <div class="form-group">
                    <label class="form-label">Programa de Estudio</label>
                    <select class="form-control" id="program-select">
                        <option value="">Seleccione un programa</option>`;

        if (programs && programs.length > 0) {
            programs.forEach((program) => {
                html += `<option value="${program.id}">${program.nombre}</option>`;
            });
        }

        html += `</select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Cuatrimestre</label>
                    <select class="form-control" id="semester-select">
                        <option value="">Seleccione cuatrimestre</option>`;

        if (semesters && semesters.length > 0) {
            semesters.forEach((semester) => {
                html += `<option value="${semester}">Cuatrimestre ${semester}</option>`;
            });
        }

        html += `</select>
                </div>
            </div>`;

        container.innerHTML = html;
        return true;
    }

    renderSubjects(subjects, programName, semester, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3>Asignaturas - ${programName || ""} - Cuatrimestre ${semester || ""}</h3>
                </div>
                <div class="subjects-grid">`;

        if (subjects && subjects.length > 0) {
            subjects.forEach((subject) => {
                html += `
                    <div class="subject-card" data-subject-id="${subject.id}">
                        <h4>${subject.nombre}</h4>
                        <div class="subject-info">
                            <p><strong>Grupo:</strong> ${subject.grupo_nombre}</p>
                            <p><strong>Docente:</strong> ${subject.docente_nombre}</p>
                            <p><strong>Alumnos:</strong> ${subject.alumnos_count}/25</p>
                        </div>
                        <div class="subject-actions">
                            <button class="btn btn-sm btn-primary" data-action="check-course" data-id="${subject.id}">
                                Verificar Curso
                            </button>
                            <button class="btn btn-sm btn-success" data-action="create-course" data-id="${subject.id}">
                                Crear Curso
                            </button>
                        </div>
                    </div>`;
            });
        } else {
            html += "<p>No hay asignaturas disponibles para este cuatrimestre.</p>";
        }

        html += `</div></div>`;
        container.innerHTML = html;
        return true;
    }

    renderGenericFallback(message, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;
        
        container.innerHTML = `<div class="alert alert-warning">${message}</div>`;
        return true;
    }
}