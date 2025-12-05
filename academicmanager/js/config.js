const ClassroomConfig = {
    API_URL: 'http://localhost:3000/api',
    REQUEST_TIMEOUT: 30000,
    ITEMS_PER_PAGE: 20,
    COURSE_COLORS: [
        '#1976d2',
        '#388e3c',
        '#d32f2f',
        '#f57c00',
        '#7b1fa2',
        '#0097a7',
        '#c2185b',
        '#5d4037',
    ],
    TOAST_DURATION: 3000,
    DEBUG: true,
    VERSION: '1.0.0'
};

if (typeof window !== 'undefined') {
    window.ClassroomConfig = ClassroomConfig;
}
