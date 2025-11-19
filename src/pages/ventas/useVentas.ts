import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createSale, getSales, updateSale, deleteSale } from "../../core/services/sales.service";
import { getClients } from "../../core/services/clients.service";
import { getProducts } from "../../core/services/products.service";
import { getUsers } from "../../core/services/users.service";
import { useAuthStore } from "@/store/useAuthStore";

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
        console.error('Error al formatear fecha:', error);
        return dateString;
    }
};

// Función para formatear moneda
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Interfaces
export interface SaleFromAPI {
    id_venta: number;
    id_cliente: number;
    id_usuario: number;
    fecha: string;
    total: number;
    cliente_nombre?: string;
    usuario_nombre?: string;
    productos?: Array<{
        id_producto: number;
        nombre: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>;
}

export interface Sale {
    id: number;
    id_cliente: number;
    id_usuario: number;
    fecha: string;
    total: number;
    cliente_nombre: string;
    usuario_nombre: string;
    productos: Array<{
        id_producto: number;
        nombre: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>;
}

export interface Cliente {
    id_cliente: number;
    nombre: string;
    telefono?: string;
    direccion?: string;
}

export interface Usuario {
    id_usuario: number;
    nombre: string;
    email?: string;
    telefono?: string;
    rol?: string;
}

export interface Product {
    id_producto: number;
    nombre: string;
    precio_venta: number;
    tipo_licor_nombre: string;
}

// Función para mapear datos del backend al frontend
const mapSaleFromAPI = (apiSale: SaleFromAPI, clientes: Cliente[], usuarios: Usuario[]): Sale => {
    const cliente = clientes.find(c => c.id_cliente === apiSale.id_cliente);
    const usuario = usuarios.find(u => u.id_usuario === apiSale.id_usuario);
    
    // Asegurar que productos sea un array
    let productosArray: any[] = [];
    if (Array.isArray(apiSale.productos)) {
        productosArray = apiSale.productos;
    } else if (typeof apiSale.productos === 'string') {
        try {
            productosArray = JSON.parse(apiSale.productos);
        } catch (e) {
            console.error('Error al parsear productos en mapSaleFromAPI:', e);
            productosArray = [];
        }
    }
    
    return {
        id: apiSale.id_venta,
        id_cliente: apiSale.id_cliente,
        id_usuario: apiSale.id_usuario || 0,
        fecha: formatDate(apiSale.fecha),
        total: Number(apiSale.total) || 0,
        cliente_nombre: cliente?.nombre || 'Cliente no encontrado',
        usuario_nombre: apiSale.usuario_nombre || usuario?.nombre || 'Usuario no encontrado',
        productos: productosArray
    };
};

export const useVentas = () => {
    // Obtener el usuario logueado desde Zustand
    const currentUser = useAuthStore((state) => state.user);
    
    const [ventas, setVentas] = useState<Sale[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [productos, setProductos] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingSaleId, setEditingSaleId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const [newSale, setNewSale] = useState({
        id_cliente: 0,
        id_usuario: currentUser?.id_usuario || 0, // Obtener automáticamente del usuario logueado
        productos: [] as Array<{
            id_producto: number;
            cantidad: number;
            precio_unitario: number;
        }>
    });

    // Obtener los datos de ventas
    const getDataSales = async () => {
        try {
            setIsLoading(true);
            const response = await getSales();
            console.log('Ventas del backend:', response.data);
            const mappedSales = response.data.map((sale: SaleFromAPI) => mapSaleFromAPI(sale, clientes, usuarios));
            setVentas(mappedSales);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener las ventas");
        } finally {
            setIsLoading(false);
        }
    }

    // Obtener los clientes
    const getDataClients = async () => {
        try {
            const response = await getClients();
            console.log('Clientes del backend:', response.data);
            setClientes(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los clientes");
        }
    }

    // Obtener los productos
    const getDataProducts = async () => {
        try {
            const response = await getProducts();
            console.log('Productos del backend:', response.data);
            setProductos(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los productos");
        }
    }

    // Obtener los usuarios
    const getDataUsers = async () => {
        try {
            const response = await getUsers();
            console.log('Usuarios del backend:', response.data);
            // Mapear los datos del backend al formato esperado
            const mappedUsers = response.data.map((user: any) => ({
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                email: user.correo,
                telefono: user.telefono,
                rol: user.rol || user.rol_nombre
            }));
            setUsuarios(mappedUsers);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los usuarios");
        }
    }

    useEffect(() => {
        getDataClients();
        getDataProducts();
        getDataUsers();
    }, []);

    useEffect(() => {
        if (clientes.length > 0 && productos.length > 0 && usuarios.length > 0) {
            getDataSales();
        }
    }, [clientes, productos, usuarios]);

    // Filtrar ventas por término de búsqueda
    const filteredSales = useMemo(() => {
        return ventas.filter(
            (sale) =>
                sale.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.fecha.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [ventas, searchTerm]);

    // Calcular totales
    const totalVentas = useMemo(() => {
        return ventas.reduce((sum, sale) => sum + sale.total, 0);
    }, [ventas]);

    const totalClientesAtendidos = useMemo(() => {
        const clientesUnicos = new Set(ventas.map(sale => sale.id_cliente));
        return clientesUnicos.size;
    }, [ventas]);

    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingSaleId(null);
        setNewSale({
            id_cliente: 0,
            id_usuario: currentUser?.id_usuario || 0, // Establecer automáticamente el usuario logueado
            productos: []
        });
        reset();
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (sale: Sale) => {
        setIsEditMode(true);
        setEditingSaleId(sale.id);
        setNewSale({
            id_cliente: sale.id_cliente,
            id_usuario: sale.id_usuario,
            productos: sale.productos.map(p => ({
                id_producto: p.id_producto,
                cantidad: p.cantidad,
                precio_unitario: p.precio_unitario
            }))
        });
        
        setValue('id_cliente', sale.id_cliente);
        setValue('id_usuario', sale.id_usuario);
        setIsModalOpen(true);
    };

    // Función para cerrar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingSaleId(null);
        setNewSale({
            id_cliente: 0,
            id_usuario: currentUser?.id_usuario || 0, // Restablecer con el usuario logueado
            productos: []
        });
        reset();
    };

    // Función para agregar producto a la venta
    const addProductToSale = (productId: number, cantidad: number) => {
        const product = productos.find(p => p.id_producto === productId);
        if (!product) return;

        const existingProductIndex = newSale.productos.findIndex(p => p.id_producto === productId);
        
        if (existingProductIndex >= 0) {
            // Actualizar cantidad del producto existente
            const updatedProductos = [...newSale.productos];
            updatedProductos[existingProductIndex].cantidad += cantidad;
            setNewSale(prev => ({ ...prev, productos: updatedProductos }));
        } else {
            // Agregar nuevo producto
            const newProduct = {
                id_producto: productId,
                cantidad: cantidad,
                precio_unitario: product.precio_venta
            };
            setNewSale(prev => ({ ...prev, productos: [...prev.productos, newProduct] }));
        }
    };

    // Función para remover producto de la venta
    const removeProductFromSale = (productId: number) => {
        setNewSale(prev => ({
            ...prev,
            productos: prev.productos.filter(p => p.id_producto !== productId)
        }));
    };

    // Función para calcular total de la venta
    const calculateTotal = () => {
        return newSale.productos.reduce((sum, product) => {
            return sum + (product.cantidad * product.precio_unitario);
        }, 0);
    };

    // Función para enviar formulario
    const onSubmit = async (data: any) => {
        console.log('Datos del formulario:', data);
        console.log('Productos en newSale:', newSale.productos);
        
        // Validar que hay productos agregados
        if (!newSale.productos || newSale.productos.length === 0) {
            toast.error("Debes agregar al menos un producto a la venta");
            return;
        }
        
        // Validar que hay un cliente seleccionado
        if (!newSale.id_cliente || newSale.id_cliente === 0) {
            toast.error("Debes seleccionar un cliente");
            return;
        }
        
        // Validar que hay un usuario logueado
        if (!currentUser?.id_usuario) {
            toast.error("No se puede crear la venta sin un usuario logueado");
            return;
        }
        
        // Usar siempre el usuario logueado (seguridad)
        const id_usuario = currentUser.id_usuario;
        
        const totalCalculado = calculateTotal();
        
        // Validar que el total sea mayor a 0
        if (totalCalculado <= 0) {
            toast.error("El total de la venta debe ser mayor a 0");
            return;
        }
        
        try {
            if (isEditMode && editingSaleId) {
                // Actualizar venta existente
                const updateData = {
                    ...data,
                    id: editingSaleId,
                    id_cliente: parseInt(newSale.id_cliente.toString()),
                    id_usuario: id_usuario, // Usar siempre el usuario logueado
                    productos: newSale.productos,
                    total: totalCalculado,
                    fecha: data.fecha || new Date().toISOString().split('T')[0]
                };
                
                console.log('Datos a actualizar:', updateData);
                await updateSale(updateData);
                toast.success("Venta actualizada exitosamente");
            } else {
                // Crear nueva venta
                const createData = {
                    id_cliente: parseInt(newSale.id_cliente.toString()),
                    id_usuario: id_usuario, // Usar siempre el usuario logueado
                    productos: newSale.productos,
                    total: totalCalculado,
                    fecha: data.fecha || new Date().toISOString().split('T')[0] // Fecha actual
                };
                
                console.log('Datos a crear:', createData);
                await createSale(createData);
                toast.success("Venta creada exitosamente");
            }
            
            await getDataSales();
            closeModal();
        } catch (error: any) {
            console.error('Error al procesar venta:', error);
            const errorMessage = error?.response?.data?.message || error?.message || "Error al procesar la venta";
            toast.error(errorMessage);
        }
    };

    // Función para eliminar venta
    const handleDeleteSale = async () => {
        if (!saleToDelete) return;
        
        try {
            await deleteSale(saleToDelete.id);
            toast.success("Venta eliminada exitosamente");
            await getDataSales();
            setIsDeleteDialogOpen(false);
            setSaleToDelete(null);
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            toast.error("Error al eliminar la venta");
        }
    };

    // Función para abrir diálogo de eliminación
    const openDeleteDialog = (sale: Sale) => {
        setSaleToDelete(sale);
        setIsDeleteDialogOpen(true);
    };

    return {
        ventas,
        filteredSales,
        clientes,
        usuarios,
        productos,
        isModalOpen,
        isEditMode,
        isDeleteDialogOpen,
        saleToDelete,
        newSale,
        currentUser, // Exportar el usuario logueado
        setIsModalOpen,
        setNewSale,
        setValue,
        searchTerm,
        setSearchTerm,
        isLoading,
        totalVentas,
        totalClientesAtendidos,
        openCreateModal,
        openEditModal,
        closeModal,
        addProductToSale,
        removeProductFromSale,
        calculateTotal,
        onSubmit,
        handleDeleteSale,
        openDeleteDialog,
        setIsDeleteDialogOpen,
        setSaleToDelete,
        register,
        handleSubmit,
        reset,
        watch
    };
};
