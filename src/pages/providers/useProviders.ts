import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createProvider, getProviders, updateProvider, deleteProvider } from "../../core/services/providers.service";

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
const mapProviderFromAPI = (apiProvider: ProviderFromAPI): Provider => ({
    id: apiProvider.id_proveedor,
    nombre: apiProvider.nombre,
    telefono: apiProvider.telefono,
    direccion: apiProvider.direccion,
    fecha: formatDate(apiProvider.fecha)
});

// Interfaz para los datos que vienen del backend
interface ProviderFromAPI {
    id_proveedor: number;
    nombre: string;
    telefono: string;
    direccion: string;
    fecha: string;
}

// Interfaz para el frontend
export interface Provider {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string;
    fecha: string;
}

const useProviders = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProviderId, setEditingProviderId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);
    const [newProvider, setNewProvider] = useState({
        nombre: "",
        telefono: "",
        direccion: "",
        fecha: "",
    });

    const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

    useEffect(() => {
        getDataProviders();
    }, []);

    const getDataProviders = async () => {
        try {
            const response = await getProviders();
            console.log('Datos del backend:', response.data);
            
            // Mapear los datos del backend al formato del frontend
            const mappedProviders = response.data.map((apiProvider: ProviderFromAPI) => 
                mapProviderFromAPI(apiProvider)
            );
            console.log('Datos mapeados:', mappedProviders);
            
            setProviders(mappedProviders);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los proveedores");
        }
    }

    // Filtrar proveedores por término de búsqueda
    const filteredProviders = useMemo(() => {
        return providers.filter(
            (provider) =>
                provider.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.direccion.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [providers, searchTerm]);

    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingProviderId(null);
        reset(); // Limpiar el formulario
        setNewProvider({
            nombre: "",
            telefono: "",
            direccion: "",
            fecha: "",
        });
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (provider: Provider) => {
        setIsEditMode(true);
        setEditingProviderId(provider.id);
        setNewProvider({
            nombre: provider.nombre,
            telefono: provider.telefono,
            direccion: provider.direccion,
            fecha: provider.fecha,
        });
        // Establecer valores en el formulario
        setValue('nombre', provider.nombre);
        setValue('telefono', provider.telefono);
        setValue('direccion', provider.direccion);
        setIsModalOpen(true);
    };

    // Crear o actualizar proveedor
    const onSubmit = async (data: any) => {
        console.log(data);
        try {
            if (isEditMode && editingProviderId) {
                // Actualizar proveedor existente
                const updateData = { 
                    ...data, 
                    id: editingProviderId
                };
                
                await updateProvider(updateData);
                toast.success("Proveedor actualizado exitosamente");
            } else {
                // Crear nuevo proveedor
                const createData = {
                    ...data,
                    fecha: new Date().toISOString().split('T')[0] // Fecha actual
                };
                await createProvider(createData);
                toast.success("Proveedor creado exitosamente");
            }
            
            // Limpiar formulario y cerrar modal
            reset();
            setNewProvider({
                nombre: "",
                telefono: "",
                direccion: "",
                fecha: "",
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingProviderId(null);
            await getDataProviders();
            
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? "Error al actualizar el proveedor" : "Error al crear el proveedor");
        }
    };

    // Abrir modal de confirmación de eliminación
    const openDeleteDialog = (provider: Provider) => {
        setProviderToDelete(provider);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDeleteProvider = async () => {
        if (!providerToDelete) return;
        
        try {
            await deleteProvider(providerToDelete.id);
            await getDataProviders(); // Recargar la lista
            toast.success("Proveedor eliminado exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el proveedor");
        } finally {
            setIsDeleteDialogOpen(false);
            setProviderToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDeleteProvider = () => {
        setIsDeleteDialogOpen(false);
        setProviderToDelete(null);
    };

    return {
        providers,
        filteredProviders,
        isModalOpen,
        isEditMode,
        isDeleteDialogOpen,
        providerToDelete,
        newProvider,
        setIsModalOpen,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        confirmDeleteProvider,
        cancelDeleteProvider,
        onSubmit,
        searchTerm,
        setSearchTerm,
        register,
        handleSubmitForm
    }
}

export default useProviders;
