import { api } from "../api/axios";

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createProduct = async (product: any) => {
    try {
        const response = await api.post('/products', product);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateProduct = async (product: any) => {        
    try {
        const response = await api.put(`/products/${product.id}`, product);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteProduct = async (id: number) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
