const BASE_URL = 'https://testing-masai-default-rtdb.firebaseio.com';

const api = {
    async createPost(postData) {
        const response = await fetch(`${BASE_URL}/posts.json`, {
            method: 'POST',
            body: JSON.stringify(postData)
        });
        return response.json();
    },

    async getAllPosts() {
        const response = await fetch(`${BASE_URL}/posts.json`);
        const data = await response.json();
        return data ? Object.entries(data).map(([id, post]) => ({...post, id})) : [];
    },

    async getUserPosts(userId) {
        const response = await fetch(`${BASE_URL}/posts.json`);
        const data = await response.json();
        if (!data) return [];
        return Object.entries(data)
            .map(([id, post]) => ({...post, id}))
            .filter(post => post.userId === userId);
    }
};

export default api;
