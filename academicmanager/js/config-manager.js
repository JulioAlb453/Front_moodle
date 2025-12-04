class ConfigManager {
    constructor() {
        this.config = {
            baseUrl: '',
            sesskey: '',
            userId: 0,
            userName: '',
            currentAction: 'main'
        };
        
        this.programs = [];
        this.semesters = [];
        this.subjects = [];
    }

    init() {
        // Intentar obtener datos de moodleData (definido en index.php)
        if (typeof moodleData !== 'undefined') {
            this.config = {
                baseUrl: moodleData.baseUrl || '',
                sesskey: moodleData.sesskey || '',
                userId: moodleData.userId || 0,
                userName: moodleData.userName || '',
                currentAction: moodleData.currentAction || 'main'
            };
            console.log('Configuración cargada desde moodleData');
        } else {
            console.warn('moodleData no definido, usando valores por defecto');
            this.loadDefaultConfig();
        }
        
        // Cargar datos de ejemplo
        this.loadSampleData();
        
        return this.config;
    }

    loadDefaultConfig() {
        this.config = {
            baseUrl: 'http://localhost/moodle',
            sesskey: 'default_sesskey',
            userId: 1,
            userName: 'Usuario Demo',
            currentAction: 'main'
        };
    }

    loadSampleData() {
        // Programas de ejemplo
        this.programs = [
            { id: 1, nombre: "Ingeniería en Software", cuatrimestres: 10 },
            { id: 2, nombre: "Administración de Empresas", cuatrimestres: 8 },
            { id: 3, nombre: "Psicología Organizacional", cuatrimestres: 9 }
        ];

        // Semestres de ejemplo
        this.semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // Asignaturas de ejemplo
        this.subjects = [
            {
                id: 1,
                nombre: 'Programación Concurrente',
                cuatrimestre: 5,
                grupo_nombre: 'G1',
                docente_nombre: 'Dr. Juan Pérez',
                alumnos_count: 25,
                programa_id: 1
            },
            {
                id: 2,
                nombre: 'Base de Datos Avanzadas',
                cuatrimestre: 4,
                grupo_nombre: 'G1',
                docente_nombre: 'Dra. María García',
                alumnos_count: 23,
                programa_id: 1
            }
        ];
    }

    // Métodos para obtener datos
    getConfig() {
        return this.config;
    }

    getPrograms() {
        return this.programs;
    }

    getSemesters() {
        return this.semesters;
    }

    getSubjects(programId = null, semester = null) {
        let filtered = this.subjects;
        
        if (programId) {
            filtered = filtered.filter(subject => subject.programa_id == programId);
        }
        
        if (semester) {
            filtered = filtered.filter(subject => subject.cuatrimestre == semester);
        }
        
        return filtered;
    }

    getProgramName(programId) {
        const program = this.programs.find(p => p.id == programId);
        return program ? program.nombre : 'Programa';
    }

    // Métodos para simular respuestas de API
    async simulateApiCall(delay = 1000, data = null) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(data || { success: true, timestamp: new Date().toISOString() });
            }, delay);
        });
    }

    async getProgramsFromApi() {
        console.log('Simulando API: Obteniendo programas...');
        return await this.simulateApiCall(500, { programs: this.programs });
    }

    async getSubjectsFromApi(programId, semester) {
        console.log(`Simulando API: Obteniendo asignaturas para programa ${programId}, semestre ${semester}`);
        const subjects = this.getSubjects(programId, semester);
        return await this.simulateApiCall(300, { subjects });
    }
}