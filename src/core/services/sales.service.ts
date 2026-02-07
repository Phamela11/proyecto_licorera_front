import { api } from "../api/axios";

export const getSales = async () => {
    try {
        const response = await api.get('/sales');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createSale = async (sale: any) => {
    try {
        const response = await api.post('/sales', sale);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateSale = async (sale: any) => {
    try {
        const response = await api.put(`/sales/${sale.id}`, sale);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteSale = async (id: number) => {
    try {
        const response = await api.delete(`/sales/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getSaleById = async (id: number) => {
    try {
        const response = await api.get(`/sales/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

