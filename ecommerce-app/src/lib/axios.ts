import axios from "axios";

const api =  {
    getAllCategories: async () => {
        const { data }  = await axios.get('https://dummyjson.com/products/categories');
        return data;
    },

    getAllProducts: async () => {
        const { data } = await axios.get('https://dummyjson.com/products');
        return data;
    },

    getProductsByCategory: async (category: string) => {
        const { data } = await axios.get(`https://dummyjson.com/products/category/${category}`);
        return data;
    },

    getProductById: async (productId: string) => {
        const { data } = await axios.get(`https://dummyjson.com/products/${productId}`);
        return data;
    },
    
    searchProducts: async (searchProduct: string) => {
        const { data } = await axios.get(`https://dummyjson.com/products/search?q=${searchProduct}`);
        return data;
    },

    addToCart: async (productData: { productId: string, quantity: number }) => {
        const { data } = await axios.post('/api/requests/add-to-cart', productData);
        return data;
    },

    addToWishlist: async (productData: { productId: string, quantity: number }) => {
        const { data } = await axios.post('/api/requests/add-to-wishlist', productData);
        return data;
    },

    getCurrentUser: async () => {
        const { data } = await axios.get('/api/requests/get-current-user');
        return data;
    },

    deleteCartItem: async (itemId: string) => {
        const { data } = await axios.post('/api/requests/delete-cart-item', itemId);
        return data;
    },

    deleteWishListItem: async (itemId: string) => {
        const { data } = await axios.post('/api/requests/delete-wishlist-item', itemId);
        return data;
    },
    
}

export default api;