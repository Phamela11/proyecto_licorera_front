import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../../core/services/products.service";
import { getLicorTypes } from "../../core/services/licorType.service";
import { getProviders } from "../../core/services/providers.service";

// Función para formatear fecha
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
};

// Función para mapear datos del backend al frontend
const mapProductFromAPI = (apiProduct: ProductFromAPI, licorTypes: LicorType[], providers: Provider[]): Product => {
    const licorType = licorTypes.find(lt => lt.id_tipo_licor === apiProduct.id_tipo_licor);
    const provider = providers.find(p => p.id_proveedor === apiProduct.id_proveedor);
    return {
        id: apiProduct.id_producto,
        nombre: apiProduct.nombre,
        id_tipo_licor: apiProduct.id_tipo_licor,
        id_proveedor: apiProduct.id_proveedor,
        tipo_licor_nombre: licorType?.nombre || 'Sin tipo',
        proveedor_nombre: provider?.nombre || 'Sin proveedor',
        precio_compra: Number(apiProduct.precio_compra) || 0,
        precio_venta: Number(apiProduct.precio_venta) || 0,
        fecha: formatDate(apiProduct.fecha),
        stock: Number(apiProduct.stock) || 0
    };
};

// Interfaz para los datos que vienen del backend
interface ProductFromAPI {
    id_producto: number;
    nombre: string;
    id_tipo_licor: number;
    id_proveedor: number;
    tipo_licor?: string; // Opcional para compatibilidad
    precio_compra: number;
    precio_venta: number;
    fecha: string;
    stock: number;
}

// Interfaz para el frontend
export interface Product {
    id: number;
    nombre: string;
    id_tipo_licor: number;
    id_proveedor: number;
    tipo_licor_nombre: string;
    proveedor_nombre: string;
    precio_compra: number;
    precio_venta: number;
    fecha: string;
    stock: number;
}

// Interfaz para tipo de licor
export interface LicorType {
    id_tipo_licor: number;
    nombre: string;
}

// Interfaz para proveedor
export interface Provider {
    id_proveedor: number;
    nombre: string;
}
  
  

const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState({
      nombre: "",
      id_tipo_licor: 0,
      id_proveedor: 0,
      precio_compra: 0,
      precio_venta: 0,
      fecha: "",
      stock: 0,
    });

    const [licorTypes, setLicorTypes] = useState<LicorType[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

    useEffect(() => {
        getDataLicorTypes();
        getDataProviders();
    }, []);

    useEffect(() => {
        if (licorTypes.length > 0 && providers.length > 0) {
            getDataProducts();
        }
    }, [licorTypes, providers]);


    // Obtener los tipos de licor
    const getDataLicorTypes = async () => {

        try {
            const response = await getLicorTypes();
            console.log('Datos del backend:', response.data);
            setLicorTypes(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los tipos de licor");
        }
    }

    // Obtener los proveedores
    const getDataProviders = async () => {
        try {
            const response = await getProviders();
            console.log('Proveedores del backend:', response.data);
            setProviders(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los proveedores");
        }
    }

    const getDataProducts = async () => {
        try {
            const response = await getProducts();
            console.log('Datos del backend:', response.data);
            
            // Mapear los datos del backend al formato del frontend
            const mappedProducts = response.data.map((apiProduct: ProductFromAPI) => 
                mapProductFromAPI(apiProduct, licorTypes, providers)
            );
            console.log('Datos mapeados:', mappedProducts);
            
            setProducts(mappedProducts);
            // toast.success("Productos obtenidos exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los productos");
        }
    }


    // Filtrar productos por término de búsqueda
    const filteredProducts = useMemo(() => {
      return products.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tipo_licor_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.proveedor_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [products, searchTerm]);
  
    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingProductId(null);
        reset(); // Limpiar el formulario
        setNewProduct({
            nombre: "",
            id_tipo_licor: 0,
            id_proveedor: 0,
            precio_compra: 0,
            precio_venta: 0,
            fecha: "",
            stock: 0,
        });
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (product: Product) => {
        setIsEditMode(true);
        setEditingProductId(product.id);
        setNewProduct({
            nombre: product.nombre,
            id_tipo_licor: product.id_tipo_licor,
            id_proveedor: product.id_proveedor,
            precio_compra: product.precio_compra,
            precio_venta: product.precio_venta,
            fecha: product.fecha,
            stock: product.stock,
        });
        // Establecer valores en el formulario
        setValue('nombre', product.nombre);
        setValue('id_tipo_licor', product.id_tipo_licor);
        setValue('id_proveedor', product.id_proveedor);
        setValue('precio_compra', product.precio_compra);
        setValue('precio_venta', product.precio_venta);
        setValue('stock', product.stock);
        setIsModalOpen(true);
    };

    // Crear o actualizar producto
        const onSubmit = async (data: any) => {
            console.log(data);
        try {
            if (isEditMode && editingProductId) {
                // Actualizar producto existente
                const updateData = { 
                    ...data, 
                    id: editingProductId,
                    id_tipo_licor: parseInt(data.id_tipo_licor),
                    id_proveedor: parseInt(data.id_proveedor),
                    precio_compra: parseFloat(data.precio_compra),
                    precio_venta: parseFloat(data.precio_venta),
                    stock: parseInt(data.stock)
                };
                
                await updateProduct(updateData);
                toast.success("Producto actualizado exitosamente");
            } else {
                // Crear nuevo producto
                const createData = {
                    ...data,
                    id_tipo_licor: parseInt(data.id_tipo_licor),
                    id_proveedor: parseInt(data.id_proveedor),
                    precio_compra: parseFloat(data.precio_compra),
                    precio_venta: parseFloat(data.precio_venta),
                    stock: parseInt(data.stock),
                    fecha: new Date().toISOString().split('T')[0] // Fecha actual
                };
                await createProduct(createData);
                toast.success("Producto creado exitosamente");
            }
            
            // Limpiar formulario y cerrar modal
            reset();
            setNewProduct({
                nombre: "",
                id_tipo_licor: 0,
                id_proveedor: 0,
                precio_compra: 0,
                precio_venta: 0,
                fecha: "",
                stock: 0,
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingProductId(null);
            await getDataProducts();
            
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? "Error al actualizar el producto" : "Error al crear el producto");
        }
    };
  
    // Abrir modal de confirmación de eliminación
    const openDeleteDialog = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;
        
        try {
            await deleteProduct(productToDelete.id);
            await getDataProducts(); // Recargar la lista
            toast.success("Producto eliminado exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el producto");
        } finally {
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDeleteProduct = () => {
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
    };
  
    return {
        products,
        filteredProducts,
        isModalOpen,
        isEditMode,
        isDeleteDialogOpen,
        productToDelete,
        newProduct,
        setIsModalOpen,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        confirmDeleteProduct,
        cancelDeleteProduct,
        onSubmit,
        searchTerm,
        setSearchTerm,
        register,
        handleSubmitForm,
        licorTypes,
        providers
    }
}

export default useProducts;