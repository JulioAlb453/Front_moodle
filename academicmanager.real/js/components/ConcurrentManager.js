class ConcurrentManager {
    constructor() {
        this.threads = new Map();
    }

    async executeThread(threadId, action, callback) {
        this.threads.set(threadId, { status: 'running', progress: 0 });
        
        try {
            const result = await action();
            this.threads.set(threadId, { status: 'completed', progress: 100 });
            callback(null, result);
        } catch (error) {
            this.threads.set(threadId, { status: 'error', progress: 0 });
            callback(error);
        }
    }

    getThreadStatus(threadId) {
        return this.threads.get(threadId);
    }

    updateProgress(threadId, progress) {
        const thread = this.threads.get(threadId);
        if (thread) {
            thread.progress = progress;
        }
    }
}