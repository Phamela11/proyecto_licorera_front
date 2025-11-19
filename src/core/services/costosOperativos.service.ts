import { api } from "../api/axios";

export interface CostoOperativo {
    id_costo?: number;
    categoria: string;
    descripcion: string;
    monto: number;
    fecha: string;
    periodo?: string;
    observaciones?: string;
}

export interface CostoOperativoFilters {
    categoria?: string;
    periodo?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}

export interface ResumenCategoria {
    categoria: string;
    cantidad: number;
    total: number;
    promedio: number;
    minimo: number;
    maximo: number;
}

export const getCostosOperativos = async (filters?: CostoOperativoFilters) => {
    try {
        const params = new URLSearchParams();
        if (filters?.categoria) params.append('categoria', filters.categoria);
        if (filters?.periodo) params.append('periodo', filters.periodo);
        if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
        if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);

        const queryString = params.toString();
        const url = queryString ? `/costos-operativos?${queryString}` : '/costos-operativos';
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener costos operativos:', error);
        throw error;
    }
}

export const getCostoOperativoById = async (id: number) => {
    try {
        const response = await api.get(`/costos-operativos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener costo operativo:', error);
        throw error;
    }
}

export const createCostoOperativo = async (costo: CostoOperativo) => {
    try {
        const response = await api.post('/costos-operativos', costo);
        return response.data;
    } catch (error) {
        console.error('Error al crear costo operativo:', error);
        throw error;
    }
}

export const updateCostoOperativo = async (costo: CostoOperativo) => {
    try {
        const response = await api.put(`/costos-operativos/${costo.id_costo}`, costo);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar costo operativo:', error);
        throw error;
    }
}

export const deleteCostoOperativo = async (id: number) => {
    try {
        const response = await api.delete(`/costos-operativos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar costo operativo:', error);
        throw error;
    }
}

export const getResumenPorCategoria = async (filters?: CostoOperativoFilters) => {
    try {
        const params = new URLSearchParams();
        if (filters?.periodo) params.append('periodo', filters.periodo);
        if (filters?.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
        if (filters?.fecha_fin) params.append('fecha_fin', filters.fecha_fin);

        const queryString = params.toString();
        const url = queryString ? `/costos-operativos/resumen?${queryString}` : '/costos-operativos/resumen';
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener resumen:', error);
        throw error;
    }
}

