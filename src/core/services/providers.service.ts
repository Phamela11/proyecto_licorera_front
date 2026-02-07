import { api } from "../api/axios";

export const getProviders = async () => {
    try {
        const response = await api.get('/providers');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createProvider = async (provider: any) => {
    try {
        const response = await api.post('/providers', provider);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateProvider = async (provider: any) => {        
    try {
        const response = await api.put(`/providers/${provider.id}`, provider);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteProvider = async (id: number) => {
    try {
        const response = await api.delete(`/providers/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
