import axios from 'axios';

const api = {
    createCard: async (card: {title: string,  image: string}) => {
        const { data }  = await axios.post('/api/requests/create-card', card);
        return data;
    },

    getMatchHistory: async () => {
        const { data } = await axios.get("/api/requests/get-gamesessions-by-userId");
        return data;
    }
};

export default api;

