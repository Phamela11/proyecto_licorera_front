import { api } from "../api/axios";

export const getTimeRecords = async () => {
    try {
        const response = await api.get('/time-records');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createTimeRecord = async (record: any) => {
    try {
        const response = await api.post('/time-records', record);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateTimeRecord = async (record: any) => {        
    try {
        const response = await api.put(`/time-records/${record.id}`, record);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteTimeRecord = async (id: number) => {
    try {
        const response = await api.delete(`/time-records/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


