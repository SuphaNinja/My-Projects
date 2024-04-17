import axios from 'axios';

const api = {
    getCurrentUser: async () => {
        const { data }  = await axios.get('/api/requests/get-current-user');
        return data;
    },

    getUser: async ( userId: string) => {
        const { data } = await axios.get("/api/requests/get-user/" + userId);
        return data;
    },

    followUser: async (userId: string) => {
        const { data } = await axios.post("/api/requests/follow-user/" + userId);
        return data;
    },

    createPost: async (postData: {title: string, description: string, postImage: string}) => {
        const { data } = await axios.post("/api/requests/create-post", postData);
        return data;
    },

    getPosts: async () => {
        const { data } = await axios.get("/api/requests/get-posts");
        return data;
    },

    getUserPosts: async (userId: string) => {
        const { data } = await axios.get("/api/requests/get-user-posts/" + userId);
        return data;
    },

    getPost: async (postId: string) => {
        const { data } = await axios.get("/api/requests/get-post/" + postId);
        return data;
    },

    likePost: async (postId: string) => {
        const { data } = await axios.post("/api/requests/like-post/" + postId);
        return data;
    },

    replyToPost: async (postId: string, content: { content: string }) => {
        const { data } = await axios.post("/api/requests/reply-to-post/" + postId, content);
        return data;
    },

    searchUsers: async (content: {content: string}) => {
        const { data } = await axios.post("/api/requests/search-users",  content );
        return data;
    },

    getNotifications: async () => {
        const { data } = await axios.get("/api/requests/get-notifications");
        return data;
    },

    readNotifications: async () => {
        const { data } = await axios.post("/api/requests/read-notifications");
        return data;
    },

    getUnreadNotifications: async () => {
        const { data } = await axios.get("/api/requests/get-unread-notifications");
        return data;
    }
};

export default api;

