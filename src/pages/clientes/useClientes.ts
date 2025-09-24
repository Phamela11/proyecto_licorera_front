import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createClient, getClients, updateClient, deleteClient } from "../../core/services/clients.service";

// Función para formatear fecha
const formatDate = (dateString: string): string => {
    try {
        if (!dateString) {
            console.warn('Fecha vacía recibida');
            return '';
        }
        
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

// Función para mapear datos del backend al frontend
const mapClientFromAPI = (apiClient: ClientFromAPI): Cliente => ({
    id: apiClient.id_cliente,
    nombre: apiClient.nombre,
    telefono: apiClient.telefono,
    direccion: apiClient.direccion,
    fechaRegistro: formatDate(apiClient.fecha)
});

// Interfaz para los datos que vienen del backend
interface ClientFromAPI {
    id_cliente: number;
    nombre: string;
    telefono: string;
    fecha: string;
    direccion: string;
}

// Interfaz para el frontend
export interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string;
    fechaRegistro: string;
}

const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingClienteId, setEditingClienteId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
    const [newCliente, setNewCliente] = useState({
      nombre: "",
      telefono: "",
      direccion: "",
    });
    const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

    useEffect(() => {
        getDataClientes();
    }, []);

    const getDataClientes = async () => {
        try {
            const response = await getClients();
            console.log('Datos del backend:', response.data);
            
            // Mapear los datos del backend al formato del frontend
            const mappedClientes = response.data.map((apiClient: ClientFromAPI) => mapClientFromAPI(apiClient));
            console.log('Datos mapeados:', mappedClientes);
            
            setClientes(mappedClientes);
            // toast.success("Clientes obtenidos exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los clientes");
        }
    }

    // Filtrar clientes por término de búsqueda
    const filteredClientes = useMemo(() => {
      return clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefono.includes(searchTerm) ||
          cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [clientes, searchTerm]);
  
    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingClienteId(null);
        reset(); // Limpiar el formulario
        setNewCliente({
            nombre: "",
            telefono: "",
            direccion: "",
        });
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (cliente: Cliente) => {
        setIsEditMode(true);
        setEditingClienteId(cliente.id);
        setNewCliente({
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            direccion: cliente.direccion,
        });
        // Establecer valores en el formulario
        setValue('nombre', cliente.nombre);
        setValue('telefono', cliente.telefono);
        setValue('direccion', cliente.direccion);
        setIsModalOpen(true);
    };

    // Crear o actualizar cliente
    const onSubmit = async (data: any) => {
        try {
            if (isEditMode && editingClienteId) {
                // Actualizar cliente existente
                const updateData = { 
                    ...data, 
                    id: editingClienteId
                };
                
                await updateClient(updateData);
                toast.success("Cliente actualizado exitosamente");
            } else {
                // Crear nuevo cliente (el backend genera automáticamente la fecha)
                await createClient(data);
                toast.success("Cliente creado exitosamente");
            }
            
            // Limpiar formulario y cerrar modal
            reset();
            setNewCliente({
                nombre: "",
                telefono: "",
                direccion: "",
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingClienteId(null);
            await getDataClientes();
            
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? "Error al actualizar el cliente" : "Error al crear el cliente");
        }
    };
  
    // Abrir modal de confirmación de eliminación
    const openDeleteDialog = (cliente: Cliente) => {
        setClienteToDelete(cliente);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDeleteClient = async () => {
        if (!clienteToDelete) return;
        
        try {
            await deleteClient(clienteToDelete.id);
            await getDataClientes(); // Recargar la lista
            toast.success("Cliente eliminado exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el cliente");
        } finally {
            setIsDeleteDialogOpen(false);
            setClienteToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDeleteClient = () => {
        setIsDeleteDialogOpen(false);
        setClienteToDelete(null);
    };
  
    return {
        clientes,
        filteredClientes,
        isModalOpen,
        isEditMode,
        isDeleteDialogOpen,
        clienteToDelete,
        newCliente,
        setIsModalOpen,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        confirmDeleteClient,
        cancelDeleteClient,
        onSubmit,
        searchTerm,
        setSearchTerm,
        register,
        handleSubmitForm
    }
}

export default useClientes;
