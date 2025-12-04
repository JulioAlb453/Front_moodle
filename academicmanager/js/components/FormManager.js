class FormManager {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        return Object.fromEntries(formData);
    }

    showLoading() {
        this.form.classList.add('loading');
    }

    hideLoading() {
        this.form.classList.remove('loading');
    }

    reset() {
        this.form.reset();
    }
}