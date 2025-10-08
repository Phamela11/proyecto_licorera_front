import { api } from "../api/axios";

export const getTipoLicores = async () => {
  try {
    // Ajusta la ruta según tu backend
    const response = await api.get('/tipo-licores');
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createTipoLicor = async (tipoLicor: any) => {
  try {
    const response = await api.post('/tipo-licores', tipoLicor);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTipoLicor = async (tipoLicor: any) => {
  try {
    const response = await api.put(`/tipo-licores/${tipoLicor.id}`, tipoLicor);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteTipoLicor = async (id: number) => {
  try {
    const response = await api.delete(`/tipo-licores/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};