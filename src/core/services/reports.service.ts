import { api } from "../api/axios";

// Obtener estadísticas del dashboard
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/reports/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener ventas por período
export const getSalesByPeriod = async (days: number = 30) => {
    try {
        const response = await api.get(`/reports/sales-by-period?days=${days}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener top productos más vendidos
export const getTopProducts = async (limit: number = 10, periodo: string = 'mensual') => {
    try {
        const response = await api.get(`/reports/top-products?limit=${limit}&periodo=${periodo}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener ventas por cliente
export const getSalesByClient = async (limit: number = 10) => {
    try {
        const response = await api.get(`/reports/sales-by-client?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener estado del inventario
export const getInventoryStatus = async () => {
    try {
        const response = await api.get('/reports/inventory-status');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener ventas por usuario
export const getSalesByUser = async () => {
    try {
        const response = await api.get('/reports/sales-by-user');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener ventas por tipo de licor
export const getSalesByLicorType = async () => {
    try {
        const response = await api.get('/reports/sales-by-licor-type');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Obtener análisis de utilidad
export const getProfitAnalysis = async () => {
    try {
        const response = await api.get('/reports/profit-analysis');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

