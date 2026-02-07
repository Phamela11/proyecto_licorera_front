import { api } from "../api/axios";

// Servicios de Movimientos de Inventario

// Registrar entrada/salida de stock
export const createInventoryMovement = async (movement: any) => {
    try {
        const response = await api.post('/inventory-movements', movement);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Obtener resumen estadístico de movimientos por inventario
export const getInventoryMovementSummary = async (inventoryId: number) => {
    try {
        const response = await api.get(`/inventory-movements/inventory/${inventoryId}/summary`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Obtener todos los movimientos de inventario
export const getAllInventoryMovements = async () => {
    try {
        const response = await api.get('/inventory-movements');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Obtener movimientos por producto
export const getMovementsByProduct = async (productId: number) => {
    try {
        const response = await api.get(`/inventory-movements/product/${productId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
