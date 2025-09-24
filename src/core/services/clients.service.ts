import { api } from "../api/axios";

export const getClients = async () => {
    try {
        const response = await api.get('/customers');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createClient = async (client: any) => {
    try {
        const response = await api.post('/customers', client);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateClient = async (client: any) => {
    try {
        const response = await api.put(`/customers/${client.id}`, client);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteClient = async (id: number) => {
    try {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
