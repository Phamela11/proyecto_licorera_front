import { api } from "../api/axios";

// Servicios de Inventario
export const getInventory = async () => {
    try {
        const response = await api.get('/inventory');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createInventoryEntry = async (entry: any) => {
    try {
        const response = await api.post('/inventory', entry);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getInventoryByProduct = async (productId: number) => {
    try {
        const response = await api.get(`/inventory/product/${productId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateInventoryEntry = async (entry: any) => {        
    try {
        const response = await api.put(`/inventory/${entry.id}`, entry);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteInventoryEntry = async (id: number) => {
    try {
        const response = await api.delete(`/inventory/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
