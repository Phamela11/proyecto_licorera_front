import { api } from "../api/axios";

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { correo: email, conntrasena: password });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const register = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/register', { correo: email, conntrasena: password });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}