import axios from 'axios';

const api = {
    createCard: async (card: {title: string,  image: string}) => {
        const { data }  = await axios.post('/api/requests/create-card', card);
        return data;
    },

    getAllCards: async () => {
        const { data }  = await axios.get('/api/requests/get-all-cards');
        return data;
    },
    getCard: async (title:any) => {
        const { data }  = await axios.get(`/api/requests/get-card/${title}`);
        return data;
    },
};

export default api;

