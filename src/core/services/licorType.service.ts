import { api } from "../api/axios";

export const getLicorTypes = async () => {
    try {
        const response = await api.get('/licor-type');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createLicorType = async (licorType: any) => {
    try {
        const response = await api.post('/licor-type', licorType);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateLicorType = async (licorType: any) => {
    try {
        const response = await api.put(`/licor-type/${licorType.id}`, licorType);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteLicorType = async (id: number) => {  
    try {
        const response = await api.delete(`/licor-type/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}