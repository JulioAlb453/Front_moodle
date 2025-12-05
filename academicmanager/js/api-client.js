/**
 * API Client - Cliente para consumir la API REST de Node.js
 */

class APIClient {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
        this.token = null;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Configurar URL base de la API
     */
    setBaseURL(url) {
        this.baseURL = url;
        console.log(`🔧 API Base URL configurada: ${url}`);
    }

    /**
     * Configurar token de autenticación
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Obtener headers con autenticación
     */
    getHeaders(customHeaders = {}) {
        const headers = { ...this.defaultHeaders, ...customHeaders };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    /**
     * Realizar petición HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.headers)
        };

        try {
            console.log(`📡 ${options.method || 'GET'} ${url}`);
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ Respuesta recibida:`, data);
            
            return data;
        } catch (error) {
            console.error(`❌ Error en petición a ${url}:`, error);
            throw error;
        }
    }

    // ==================== ALUMNOS ====================
    
    async getAlumnos() {
        return this.request('/alumnos');
    }

    async getAlumno(id) {
        return this.request(`/alumnos/${id}`);
    }

    async createAlumno(data) {
        return this.request('/alumnos', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateAlumno(id, data) {
        return this.request(`/alumnos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteAlumno(id) {
        return this.request(`/alumnos/${id}`, {
            method: 'DELETE'
        });
    }

    async getAlumnoAsignaturas(id) {
        return this.request(`/alumnos/${id}/asignaturas`);
    }

    // ==================== ASIGNATURAS ====================
    
    async getAsignaturas() {
        return this.request('/asignaturas');
    }

    async getAsignatura(id) {
        return this.request(`/asignaturas/${id}`);
    }

    async createAsignatura(data) {
        return this.request('/asignaturas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateAsignatura(id, data) {
        return this.request(`/asignaturas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteAsignatura(id) {
        return this.request(`/asignaturas/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== DOCENTES ====================
    
    async getDocentes() {
        return this.request('/docentes');
    }

    async getDocente(id) {
        return this.request(`/docentes/${id}`);
    }

    async createDocente(data) {
        return this.request('/docentes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateDocente(id, data) {
        return this.request(`/docentes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteDocente(id) {
        return this.request(`/docentes/${id}`, {
            method: 'DELETE'
        });
    }

    async getDocenteAsignaturas(id) {
        return this.request(`/docentes/${id}/asignaturas`);
    }

    // ==================== GRUPOS ====================
    
    async getGrupos() {
        return this.request('/grupos');
    }

    async getGrupo(id) {
        return this.request(`/grupos/${id}`);
    }

    async createGrupo(data) {
        return this.request('/grupos', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateGrupo(id, data) {
        return this.request(`/grupos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteGrupo(id) {
        return this.request(`/grupos/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== PROGRAMAS DE ESTUDIO ====================
    
    async getProgramasEstudio() {
        return this.request('/programas-estudio');
    }

    async getProgramaEstudio(id) {
        return this.request(`/programas-estudio/${id}`);
    }

    async createProgramaEstudio(data) {
        return this.request('/programas-estudio', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateProgramaEstudio(id, data) {
        return this.request(`/programas-estudio/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteProgramaEstudio(id) {
        return this.request(`/programas-estudio/${id}`, {
            method: 'DELETE'
        });
    }

    async getProgramaEstudioAsignaturas(id) {
        return this.request(`/programas-estudio/${id}/asignaturas`);
    }

    async addAsignaturaToProgramaEstudio(programaId, asignaturaId) {
        return this.request(`/programas-estudio/${programaId}/asignaturas`, {
            method: 'POST',
            body: JSON.stringify({ asignatura_id: asignaturaId })
        });
    }
}

// Exportar instancia global
if (typeof window !== 'undefined') {
    window.APIClient = APIClient;
    window.apiClient = new APIClient();
}
