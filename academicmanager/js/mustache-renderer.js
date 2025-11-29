class MustacheRenderer {
    constructor() {
        this.templates = {};
        this.templatesLoaded = false;
    }

    async loadAllTemplates() {
        const templateNames = ['selection', 'subjects', 'admin-panel', 'results'];
        
        try {
            for (const name of templateNames) {
                const response = await fetch(`${moodleData.baseUrl}/local/academicmanager/templates/${name}.mustache`);
                if (response.ok) {
                    this.templates[name] = await response.text();
                } else {
                    console.warn(`Template ${name} not found`);
                    this.templates[name] = ''; // Template vacío como fallback
                }
            }
            this.templatesLoaded = true;
            return true;
        } catch (error) {
            console.error('Error loading templates:', error);
            return false;
        }
    }

    render(templateName, data, containerId) {
        if (!this.templates[templateName]) {
            console.warn(`Template ${templateName} not loaded`);
            
            // Fallback: mostrar datos básicos en HTML
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = this.generateFallbackHTML(templateName, data);
            }
            return;
        }
        
        try {
            const html = Mustache.render(this.templates[templateName], data);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
            }
        } catch (error) {
            console.error('Error rendering template:', error);
        }
    }

    generateFallbackHTML(templateName, data) {
        switch(templateName) {
            case 'selection':
                return this.generateFallbackSelection(data);
            case 'subjects':
                return this.generateFallbackSubjects(data);
            default:
                return `<div class="alert alert-warning">Template ${templateName} no disponible</div>`;
        }
    }

    generateFallbackSelection(data) {
        let html = `
            <div class="card">
                <div class="card-header">
                    <h3>Selección de Programa</h3>
                </div>
                <div class="form-group">
                    <label class="form-label">Programa de Estudio</label>
                    <select class="form-control" id="program-select">
                        <option value="">Seleccione un programa</option>`;
        
        if (data.programs && data.programs.length > 0) {
            data.programs.forEach(program => {
                html += `<option value="${program.id}">${program.nombre}</option>`;
            });
        }
        
        html += `</select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Cuatrimestre</label>
                    <select class="form-control" id="semester-select">
                        <option value="">Seleccione cuatrimestre</option>`;
        
        if (data.semesters && data.semesters.length > 0) {
            data.semesters.forEach(semester => {
                html += `<option value="${semester}">Cuatrimestre ${semester}</option>`;
            });
        }
        
        html += `</select>
                </div>
            </div>`;
        
        return html;
    }

    generateFallbackSubjects(data) {
        let html = `
            <div class="card">
                <div class="card-header">
                    <h3>Asignaturas - ${data.program_name || ''} - Cuatrimestre ${data.semester || ''}</h3>
                </div>
                <div class="subjects-grid">`;
        
        if (data.subjects && data.subjects.length > 0) {
            data.subjects.forEach(subject => {
                html += `
                    <div class="subject-card" data-subject-id="${subject.id}">
                        <h4>${subject.nombre}</h4>
                        <div class="subject-info">
                            <p><strong>Grupo:</strong> ${subject.grupo_nombre}</p>
                            <p><strong>Docente:</strong> ${subject.docente_nombre}</p>
                            <p><strong>Alumnos:</strong> ${subject.alumnos_count}/25</p>
                        </div>
                        <div class="subject-actions">
                            <button class="btn btn-sm btn-primary" onclick="academicManager.checkCourse('${subject.id}')">
                                Verificar Curso
                            </button>
                            <button class="btn btn-sm btn-success" onclick="academicManager.createCourse('${subject.id}')">
                                Crear Curso
                            </button>
                        </div>
                    </div>`;
            });
        } else {
            html += '<p>No hay asignaturas disponibles para este cuatrimestre.</p>';
        }
        
        html += `</div></div>`;
        return html;
    }

    renderSelection(programs, semesters) {
        this.render('selection', { programs, semesters }, 'selection-container');
    }

    renderSubjects(subjects, programName, semester) {
        this.render('subjects', { 
            subjects, 
            program_name: programName, 
            semester 
        }, 'subjects-container');
    }

    renderAdminPanel() {
        this.render('admin-panel', {}, 'admin-container');
    }

    renderResults(operations) {
        this.render('results', { operations }, 'results-container');
    }
}