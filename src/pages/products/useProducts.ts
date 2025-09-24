import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../../core/services/products.service";

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
const mapProductFromAPI = (apiProduct: ProductFromAPI): Product => ({
    id: apiProduct.id_producto,
    nombre: apiProduct.nombre,
    tipo_licor: apiProduct.tipo_licor,
    precio_compra: Number(apiProduct.precio_compra) || 0,
    precio_venta: Number(apiProduct.precio_venta) || 0,
    fecha: formatDate(apiProduct.fecha)
});

// Interfaz para los datos que vienen del backend
interface ProductFromAPI {
    id_producto: number;
    nombre: string;
    tipo_licor: string;
    precio_compra: number;
    precio_venta: number;
    fecha: string;
}

// Interfaz para el frontend
export interface Product {
    id: number;
    nombre: string;
    tipo_licor: string;
    precio_compra: number;
    precio_venta: number;
    fecha: string;
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
      tipo_licor: "",
      precio_compra: 0,
      precio_venta: 0,
      fecha: "",
    });
    const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

    useEffect(() => {
        getDataProducts();
    }, []);


    const getDataProducts = async () => {
        try {
            const response = await getProducts();
            console.log('Datos del backend:', response.data);
            
            // Mapear los datos del backend al formato del frontend
            const mappedProducts = response.data.map((apiProduct: ProductFromAPI) => mapProductFromAPI(apiProduct));
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
          product.tipo_licor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [products, searchTerm]);
  
    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingProductId(null);
        reset(); // Limpiar el formulario
        setNewProduct({
            nombre: "",
            tipo_licor: "",
            precio_compra: 0,
            precio_venta: 0,
            fecha: "",
        });
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (product: Product) => {
        setIsEditMode(true);
        setEditingProductId(product.id);
        setNewProduct({
            nombre: product.nombre,
            tipo_licor: product.tipo_licor,
            precio_compra: product.precio_compra,
            precio_venta: product.precio_venta,
            fecha: product.fecha,
        });
        // Establecer valores en el formulario
        setValue('nombre', product.nombre);
        setValue('tipo_licor', product.tipo_licor);
        setValue('precio_compra', product.precio_compra);
        setValue('precio_venta', product.precio_venta);
        setIsModalOpen(true);
    };

    // Crear o actualizar producto
        const onSubmit = async (data: any) => {
        try {
            if (isEditMode && editingProductId) {
                // Actualizar producto existente
                const updateData = { 
                    ...data, 
                    id: editingProductId,
                    precio_compra: parseFloat(data.precio_compra),
                    precio_venta: parseFloat(data.precio_venta)
                };
                
                await updateProduct(updateData);
                toast.success("Producto actualizado exitosamente");
            } else {
                // Crear nuevo producto
                const createData = {
                    ...data,
                    precio_compra: parseFloat(data.precio_compra),
                    precio_venta: parseFloat(data.precio_venta),
                    fecha: new Date().toISOString().split('T')[0] // Fecha actual
                };
                await createProduct(createData);
                toast.success("Producto creado exitosamente");
            }
            
            // Limpiar formulario y cerrar modal
            reset();
            setNewProduct({
                nombre: "",
                tipo_licor: "",
                precio_compra: 0,
                precio_venta: 0,
                fecha: "",
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
        handleSubmitForm
    }
}

export default useProducts;