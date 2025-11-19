import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { 
    getCostosOperativos, 
    createCostoOperativo, 
    updateCostoOperativo, 
    deleteCostoOperativo,
    type CostoOperativo,
    type CostoOperativoFilters
} from "../../core/services/costosOperativos.service";

// Función para formatear fecha
const formatDate = (dateString: string): string => {
    try {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error('Fecha inválida:', dateString);
            return dateString;
        }
        
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

// Función para formatear monto
const formatMonto = (monto: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(monto);
};

// Interfaz para los datos que vienen del backend
interface CostoOperativoFromAPI {
    id_costo: number;
    categoria: string;
    descripcion: string;
    monto: string | number;
    fecha: string;
    periodo?: string;
    observaciones?: string;
}

// Interfaz para el frontend
export interface CostoOperativoUI {
    id: number;
    categoria: string;
    descripcion: string;
    monto: number;
    montoFormateado: string;
    fecha: string;
    fechaFormateada: string;
    periodo?: string;
    observaciones?: string;
}

// Función para mapear datos del backend al frontend
const mapCostoFromAPI = (apiCosto: CostoOperativoFromAPI): CostoOperativoUI => {
    const monto = typeof apiCosto.monto === 'string' ? parseFloat(apiCosto.monto) : apiCosto.monto;
    return {
        id: apiCosto.id_costo,
        categoria: apiCosto.categoria,
        descripcion: apiCosto.descripcion,
        monto: monto,
        montoFormateado: formatMonto(monto),
        fecha: apiCosto.fecha,
        fechaFormateada: formatDate(apiCosto.fecha),
        periodo: apiCosto.periodo || '',
        observaciones: apiCosto.observaciones || ''
    };
};

const useCostosOperativos = () => {
    const [costosOperativos, setCostosOperativos] = useState<CostoOperativoUI[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCostoId, setEditingCostoId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [costoToDelete, setCostoToDelete] = useState<CostoOperativoUI | null>(null);
    const [filters, setFilters] = useState<CostoOperativoFilters>({});
    const [loading, setLoading] = useState(false);
    
    const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

    useEffect(() => {
        getDataCostosOperativos();
    }, []);

    const getDataCostosOperativos = async (appliedFilters?: CostoOperativoFilters) => {
        try {
            setLoading(true);
            const response = await getCostosOperativos(appliedFilters);
            console.log('Datos del backend:', response.data);
            
            // Mapear los datos del backend al formato del frontend
            const mappedCostos = response.data.map((apiCosto: CostoOperativoFromAPI) => mapCostoFromAPI(apiCosto));
            console.log('Datos mapeados:', mappedCostos);
            
            setCostosOperativos(mappedCostos);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los costos operativos");
        } finally {
            setLoading(false);
        }
    }

    // Aplicar filtros
    const applyFilters = async (newFilters: CostoOperativoFilters) => {
        setFilters(newFilters);
        await getDataCostosOperativos(newFilters);
    };

    // Limpiar filtros
    const clearFilters = async () => {
        setFilters({});
        await getDataCostosOperativos();
    };

    // Filtrar costos por término de búsqueda
    const filteredCostos = useMemo(() => {
        return costosOperativos.filter(
            (costo) =>
                costo.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                costo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (costo.periodo && costo.periodo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (costo.observaciones && costo.observaciones.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [costosOperativos, searchTerm]);

    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingCostoId(null);
        reset();
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (costo: CostoOperativoUI) => {
        setIsEditMode(true);
        setEditingCostoId(costo.id);
        
        // Formatear fecha para input type="date" (YYYY-MM-DD)
        const fechaFormatted = costo.fecha.split('T')[0];
        
        setValue('categoria', costo.categoria);
        setValue('descripcion', costo.descripcion);
        setValue('monto', costo.monto);
        setValue('fecha', fechaFormatted);
        setValue('periodo', costo.periodo);
        setValue('observaciones', costo.observaciones);
        setIsModalOpen(true);
    };

    // Crear o actualizar costo operativo
    const onSubmit = async (data: any) => {
        try {
            // Validar que el monto sea un número válido
            const monto = parseFloat(data.monto);
            if (isNaN(monto) || monto <= 0) {
                toast.error("El monto debe ser un número válido mayor a 0");
                return;
            }

            const costoData: CostoOperativo = {
                categoria: data.categoria,
                descripcion: data.descripcion,
                monto: monto,
                fecha: data.fecha,
                periodo: data.periodo || null,
                observaciones: data.observaciones || null
            };

            if (isEditMode && editingCostoId) {
                // Actualizar costo operativo existente
                await updateCostoOperativo({ ...costoData, id_costo: editingCostoId });
                toast.success("Costo operativo actualizado exitosamente");
            } else {
                // Crear nuevo costo operativo
                await createCostoOperativo(costoData);
                toast.success("Costo operativo creado exitosamente");
            }
            
            // Limpiar formulario y cerrar modal
            reset();
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingCostoId(null);
            await getDataCostosOperativos(filters);
            
        } catch (error: any) {
            console.log(error);
            const errorMessage = error?.response?.data?.message || 
                (isEditMode ? "Error al actualizar el costo operativo" : "Error al crear el costo operativo");
            toast.error(errorMessage);
        }
    };

    // Abrir modal de confirmación de eliminación
    const openDeleteDialog = (costo: CostoOperativoUI) => {
        setCostoToDelete(costo);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDeleteCosto = async () => {
        if (!costoToDelete) return;
        
        try {
            await deleteCostoOperativo(costoToDelete.id);
            await getDataCostosOperativos(filters);
            toast.success("Costo operativo eliminado exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el costo operativo");
        } finally {
            setIsDeleteDialogOpen(false);
            setCostoToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDeleteCosto = () => {
        setIsDeleteDialogOpen(false);
        setCostoToDelete(null);
    };

    // Calcular estadísticas
    const estadisticas = useMemo(() => {
        const total = filteredCostos.reduce((sum, costo) => sum + costo.monto, 0);
        const cantidad = filteredCostos.length;
        const promedio = cantidad > 0 ? total / cantidad : 0;
        
        return {
            total: formatMonto(total),
            cantidad,
            promedio: formatMonto(promedio)
        };
    }, [filteredCostos]);

    return {
        costosOperativos: filteredCostos,
        loading,
        isModalOpen,
        isEditMode,
        isDeleteDialogOpen,
        costoToDelete,
        filters,
        estadisticas,
        setIsModalOpen,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        confirmDeleteCosto,
        cancelDeleteCosto,
        onSubmit,
        searchTerm,
        setSearchTerm,
        applyFilters,
        clearFilters,
        register,
        handleSubmitForm
    }
}

export default useCostosOperativos;

