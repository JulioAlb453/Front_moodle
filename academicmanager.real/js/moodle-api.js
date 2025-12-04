class MoodleAPI {
    constructor(baseURL, token) {
        this.baseURL = baseURL;
        this.token = token;
    }

    async request(endpoint, data = {}) {
        const url = `${this.baseURL}/webservice/rest/server.php?wstoken=${this.token}&wsfunction=${endpoint}&moodlewsrestformat=json`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { error: true, message: error.message };
        }
    }

    async createCourse(courseData) {
        return await this.request('core_course_create_courses', {
            'courses[0][fullname]': courseData.name,
            'courses[0][shortname]': courseData.shortname,
            'courses[0][categoryid]': courseData.category || 1
        });
    }

    async createUser(userData) {
        return await this.request('core_user_create_users', {
            'users[0][username]': userData.username,
            'users[0][firstname]': userData.firstname,
            'users[0][lastname]': userData.lastname,
            'users[0][email]': userData.email,
            'users[0][password]': userData.password || 'Temp123!'
        });
    }
}