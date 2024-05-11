import axios from 'axios';

const api = {
    createCard: async (card: {title: string,  image: string}) => {
        const { data }  = await axios.post('/api/requests/create-card', card);
        return data;
    },

    getMatchHistory: async () => {
        const { data } = await axios.get("/api/requests/get-gamesessions-by-userId");
        return data;
    },

    searchUsers: async (content: {content: string}) => {
        const { data } = await axios.post("/api/requests/search-users",  content );
        return data;
    },

    followUser: async (userId: string) => {
        const { data } = await axios.post("/api/requests/follow-user/" + userId);
        return data;
    },

    getCurrentUser: async () => {
        const { data } = await axios.get("/api/requests/get-current-user");
        return data;
    },
    
    getAllUsers: async () => {
        const { data } = await axios.get("/api/requests/get-all-users");
        return data;
    },

    getFriendList: async () => {
        const { data } = await axios.get("/api/requests/get-friendlist");
        return data;
    }
};

export default api;

