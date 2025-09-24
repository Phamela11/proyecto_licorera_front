import { api } from "../api/axios";

export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createUser = async (user: any) => {
    try {
        const response = await api.post('/users', user);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateUser = async (user: any) => {        
    try {
        const response = await api.put(`/users/${user.id}`, user);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteUser = async (id: number) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}