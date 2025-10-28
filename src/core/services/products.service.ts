import { api } from "../api/axios";

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createProduct = async (product: any) => {
    try {
        // Convertir id_proveedores a array si viene como string
        const productData = {
            ...product,
            id_proveedores: Array.isArray(product.id_proveedores) 
                ? product.id_proveedores 
                : [product.id_proveedores].filter(Boolean)
        };
        
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateProduct = async (product: any) => {        
    try {
        // Convertir id_proveedores a array si viene como string
        const productData = {
            ...product,
            id_proveedores: Array.isArray(product.id_proveedores) 
                ? product.id_proveedores 
                : [product.id_proveedores].filter(Boolean)
        };
        
        const response = await api.put(`/products/${product.id}`, productData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteProduct = async (id: number) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

