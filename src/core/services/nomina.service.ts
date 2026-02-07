import { api } from "../api/axios";

export const getNominas = async () => {
    try {
        const response = await api.get('/nomina');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createNomina = async (nomina: any) => {
    try {
        const response = await api.post('/nomina', nomina);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateNomina = async (nomina: any) => {
    try {
        const response = await api.put(`/nomina/${nomina.id}`, nomina);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteNomina = async (id: number) => {
    try {
        const response = await api.delete(`/nomina/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Calcular horas trabajadas por empleado en un rango de fechas
export const calcularHorasPorEmpleado = async (empleadoId: number, fechaInicio: string, fechaFin: string) => {
    try {
        const response = await api.post('/nomina/calcular-horas', {
            empleado_id: empleadoId,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const generarNomina = async (mes: number, anio: number) => {
    try {
        const response = await api.post('/nomina/generar', { mes, anio });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const marcarPagado = async (id: number) => {
    try {
        const response = await api.put(`/nomina/${id}/marcar-pagado`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
