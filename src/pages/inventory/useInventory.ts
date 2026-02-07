import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createInventoryEntry, getInventory, updateInventoryEntry, deleteInventoryEntry } from "../../core/services/inventory.service";
import { createInventoryMovement, getInventoryMovementSummary, getAllInventoryMovements } from "../../core/services/inventoryMovements.service";
import { getProducts } from "../../core/services/products.service";
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
const mapInventoryFromAPI = (apiEntry: InventoryFromAPI, products: Product[]): InventoryEntry => {
    const product = products.find(p => p.id_producto === apiEntry.id_producto);
    return {
        id: apiEntry.id_inventario,
        id_producto: apiEntry.id_producto,
        producto_nombre: product?.nombre || 'Sin producto',
        categoria: product?.tipo_licor_nombre || 'Sin categoría',
        cantidad: Number(apiEntry.cantidad) || 0,
        estado: apiEntry.estado,
        fecha_actualizacion: formatDate(apiEntry.fecha_actualizacion),
        precio_venta: product?.precio_venta || 0
    };
};

// Interfaz para los datos que vienen del backend (tabla inventario)
interface InventoryFromAPI {
    id_inventario: number;
    id_producto: number;
    cantidad: number;
    estado: string;
    fecha_actualizacion: string;
}

// Interfaz para el frontend (inventario)
export interface InventoryEntry {
    id: number;
    id_producto: number;
    producto_nombre: string;
    categoria: string;
    cantidad: number;
    estado: string;
    fecha_actualizacion: string;
    precio_venta?: number; // Se obtiene del producto
}

// Interfaz para producto
export interface Product {
    id_producto: number;
    nombre: string;
    tipo_licor_nombre: string;
    tipo_licor_iva?: number; // IVA del tipo de licor
    precio_venta: number;
    precio_compra?: number;
    id_proveedores?: number[]; // Array de IDs de proveedores
    proveedores_nombres?: string; // Nombres de todos los proveedores
}

// Interfaz para proveedor
export interface Provider {
    id_proveedor: number;
    nombre: string;
}

// Interfaz para movimientos de inventario (tabla movimiento_inventario)
export interface InventoryMovement {
    id: number;
    id_inventario: number;
    id_proveedor?: number;
    proveedor_nombre?: string;
    tipo_movimiento: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    precio_unitario: number;
    total: number;
    fecha_movimiento: string;
}

// Interfaz para resumen de movimientos
export interface MovementSummary {
    total_entradas: number;
    total_salidas: number;
    stock_actual: number;
    ultimo_movimiento: string;
    movimientos_por_mes: Array<{
        mes: string;
        entradas: number;
        salidas: number;
    }>;
}

const useInventory = () => {
    const [inventory, setInventory] = useState<InventoryEntry[]>([]);
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [movementSummary, setMovementSummary] = useState<MovementSummary | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<InventoryEntry | null>(null);
    const [newMovement, setNewMovement] = useState({
        id_inventario: 0,
        tipo_movimiento: 'ENTRADA' as 'ENTRADA' | 'SALIDA',
        cantidad: 0,
        precio_unitario: 0,
        id_proveedor: 0,
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const { register, handleSubmit: handleSubmitForm, setValue } = useForm();

    useEffect(() => {
        getDataProducts();
        getDataProviders();
    }, []);

    useEffect(() => {
        if (products.length > 0 && providers.length > 0) {
            getDataInventory();
            getDataMovements();
        }
    }, [products, providers]);

    // Obtener los productos
    const getDataProducts = async () => {
        try {
            const response = await getProducts();
            console.log('Productos del backend:', response.data);
            // Normalizar proveedores_ids para asegurar que sea un array
            const normalizedProducts = response.data.map((product: any) => {
                let proveedoresIds = product.proveedores_ids || [];
                // Si viene como array de PostgreSQL (con posibles nulls), filtrar y convertir
                if (Array.isArray(proveedoresIds)) {
                    proveedoresIds = proveedoresIds.filter((id: any) => id !== null && id !== undefined);
                } else if (proveedoresIds) {
                    // Si viene como string o número único, convertirlo a array
                    proveedoresIds = [proveedoresIds].filter(Boolean);
                } else {
                    proveedoresIds = [];
                }
                return {
                    ...product,
                    id_proveedores: proveedoresIds,
                    proveedores_ids: proveedoresIds // Mantener compatibilidad
                };
            });
            setProducts(normalizedProducts);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los productos");
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

    const getDataInventory = async () => {
        try {
            const response = await getInventory();
            console.log('Datos del inventario:', response.data);
            
            // Mapear los datos del backend al formato del frontend
            const mappedInventory = response.data.map((apiEntry: InventoryFromAPI) => 
                mapInventoryFromAPI(apiEntry, products)
            );
            console.log('Datos mapeados:', mappedInventory);
            
            setInventory(mappedInventory);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener el inventario");
        }
    }

    // Obtener movimientos de inventario
    const getDataMovements = async () => {
        try {
            const response = await getAllInventoryMovements();
            console.log('Movimientos del inventario:', response.data);
            setMovements(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los movimientos");
        }
    }

    // Obtener resumen de movimientos para un inventario específico
    const getMovementSummary = async (inventoryId: number) => {
        try {
            const response = await getInventoryMovementSummary(inventoryId);
            console.log('Resumen de movimientos:', response.data);
            setMovementSummary(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener el resumen de movimientos");
        }
    }

    // Filtrar inventario por término de búsqueda
    const filteredInventory = useMemo(() => {
        return inventory.filter(
            (entry) =>
                entry.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.categoria.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inventory, searchTerm]);


    // Función para abrir modal de movimiento
    const openMovementModal = (inventoryEntry: InventoryEntry) => {
        setNewMovement({
            id_inventario: inventoryEntry.id,
            tipo_movimiento: 'ENTRADA',
            cantidad: 0,
            precio_unitario: inventoryEntry.precio_venta || 0,
            id_proveedor: 0,
        });
        setIsMovementModalOpen(true);
        
        // Resetear el formulario después de un breve delay para que se actualice
        setTimeout(() => {
            setValue('cantidad', '');
            setValue('precio_unitario', inventoryEntry.precio_venta || 0);
            setValue('id_proveedor', '');
            if (inventoryEntry.id === 0) {
                setValue('id_producto', '');
            }
        }, 100);
    };

    // Función para abrir modal de edición (ya no se usa directamente)
    const openEditModal = () => {
        // Esta función ya no se usa, las entradas se gestionan desde movimientos
        console.log("Las entradas de inventario se gestionan a través de movimientos");
    };

    // Crear o actualizar entrada de inventario (ya no se usa directamente)
    const onSubmit = async () => {
        // Esta función ya no se usa, las entradas se crean desde movimientos
        console.log("Las entradas de inventario se crean automáticamente desde los movimientos");
    };

    // Crear movimiento de inventario (solo entradas)
    const onSubmitMovement = async (data: any) => {
        console.log(data);
        try {
            let inventoryId = newMovement.id_inventario;
            const productId = parseInt(data.id_producto);
            const cantidad = parseInt(data.cantidad);
            const precioUnitario = parseFloat(data.precio_unitario);
            const tipoMovimiento = 'ENTRADA'; // Siempre es entrada desde el formulario
            const idProveedor = parseInt(data.id_proveedor);
            
            // Si no hay id_inventario (movimiento general), buscar o crear entrada de inventario
            if (inventoryId === 0 && productId) {
                // Buscar si ya existe una entrada de inventario para este producto
                const existingEntry = inventory.find(entry => entry.id_producto === productId);
                
                if (existingEntry) {
                    inventoryId = existingEntry.id;
                } else {
                    // Crear nueva entrada de inventario si no existe
                    const newInventoryEntry = {
                        id_producto: productId,
                        cantidad: 0 // Se actualizará con el movimiento
                    };
                    const createdEntry = await createInventoryEntry(newInventoryEntry);
                    inventoryId = createdEntry.data.id_inventario;
                }
            }
            
            // Crear el movimiento (siempre es ENTRADA)
            const movementData = {
                id_inventario: inventoryId,
                tipo_movimiento: 'ENTRADA',
                cantidad: cantidad,
                precio_unitario: precioUnitario,
                id_proveedor: idProveedor
            };
            
            await createInventoryMovement(movementData);
            
            // El backend actualiza automáticamente el inventario
            
            toast.success("Movimiento de inventario registrado exitosamente");
            
            // Limpiar formulario y cerrar modal
            setNewMovement({
                id_inventario: 0,
                tipo_movimiento: 'ENTRADA',
                cantidad: 0,
                precio_unitario: 0,
                id_proveedor: 0,
            });
            setIsMovementModalOpen(false);
            
            // Resetear el formulario
            setValue('cantidad', '');
            setValue('precio_unitario', 0);
            setValue('id_producto', '');
            setValue('id_proveedor', '');
            
            // Recargar datos
            await getDataInventory();
            await getDataMovements();
            
        } catch (error) {
            console.log(error);
            toast.error("Error al registrar el movimiento");
        }
    };

    // Abrir modal de confirmación de eliminación
    const openDeleteDialog = (entry: InventoryEntry) => {
        setEntryToDelete(entry);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDeleteEntry = async () => {
        if (!entryToDelete) return;
        
        try {
            await deleteInventoryEntry(entryToDelete.id);
            await getDataInventory(); // Recargar la lista
            toast.success("Entrada de inventario eliminada exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar la entrada");
        } finally {
            setIsDeleteDialogOpen(false);
            setEntryToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDeleteEntry = () => {
        setIsDeleteDialogOpen(false);
        setEntryToDelete(null);
    };

    return {
        inventory,
        movements,
        movementSummary,
        filteredInventory,
        isMovementModalOpen,
        isDeleteDialogOpen,
        entryToDelete,
        newMovement,
        setIsMovementModalOpen,
        openMovementModal,
        openEditModal,
        openDeleteDialog,
        confirmDeleteEntry,
        cancelDeleteEntry,
        onSubmit,
        onSubmitMovement,
        getDataMovements,
        getMovementSummary,
        searchTerm,
        setSearchTerm,
        register,
        handleSubmitForm,
        setValue,
        products,
        providers
    }
}

export default useInventory;
