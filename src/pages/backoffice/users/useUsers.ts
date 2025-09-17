import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { createUser, getUsers, updateUser, deleteUser } from "@/core/services/users.service";

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
const mapUserFromAPI = (apiUser: UserFromAPI): User => ({
    id: apiUser.id_usuario,
    nombre: apiUser.nombre,
    email: apiUser.correo,
    telefono: apiUser.telefono,
    rol: apiUser.rol,
    fecha_creacion: formatDate(apiUser.fecha_creacion),
    contrasena: apiUser.contrasena
});

// Interfaz para los datos que vienen del backend
interface UserFromAPI {
    id_usuario: number;
    nombre: string;
    correo: string;
    telefono: string;
    rol: string;
    fecha_creacion: string;
    contrasena?: string;
}

// Interfaz para el frontend
export interface User {
    id: number;
    nombre: string;
    contrasena?: string;
    email: string;
    rol: string;
    telefono: string;
    fecha_creacion: string;
}
  
  

const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [newUser, setNewUser] = useState({
      nombre: "",
      contrasena: "",
      email: "",
      rol: "",
      telefono: "",
      fecha_creacion: "",
    });
    const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

    useEffect(() => {
        getDataUsers();
    }, [newUser]);


    const getDataUsers = async () => {
        try {
            const response = await getUsers();
            console.log('Datos del backend:', response.data);
            
            // Mapear los datos del backend al formato del frontend
            const mappedUsers = response.data.map((apiUser: UserFromAPI) => mapUserFromAPI(apiUser));
            console.log('Datos mapeados:', mappedUsers);
            
            setUsers(mappedUsers);
            toast.success("Usuarios obtenidos exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los usuarios");
        }
    }


    // Filtrar usuarios por término de búsqueda
    const filteredUsers = useMemo(() => {
      return users.filter(
        (user) =>
          user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.rol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [users, searchTerm]);
  
    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingUserId(null);
        reset(); // Limpiar el formulario
        setNewUser({
            nombre: "",
            contrasena: "",
            email: "",
            rol: "",
            telefono: "",
            fecha_creacion: "",
        });
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (user: User) => {
        setIsEditMode(true);
        setEditingUserId(user.id);
        setNewUser({
            nombre: user.nombre,
            contrasena: user.contrasena || "",
            email: user.email,
            rol: user.rol,
            telefono: user.telefono,
            fecha_creacion: user.fecha_creacion,
        });
        // Establecer valores en el formulario
        setValue('nombre', user.nombre);
        setValue('email', user.email);
        setValue('telefono', user.telefono);
        setValue('rol', user.rol);
        setValue('contrasena', ''); // Campo vacío en edición - opcional cambiar
        setIsModalOpen(true);
    };

    // Crear o actualizar usuario
    const onSubmit = async (data: any) => {
        try {
            if (isEditMode && editingUserId) {
                // Actualizar usuario existente
                const updateData = { ...data, id: editingUserId };
                
                // Si la contraseña está vacía en modo edición, no la incluir en la actualización
                if (!data.contrasena || data.contrasena.trim() === '') {
                    delete updateData.contrasena;
                }
                
                await updateUser(updateData);
                toast.success("Usuario actualizado exitosamente");
            } else {
                // Crear nuevo usuario - validar que tenga contraseña
                if (!data.contrasena || data.contrasena.trim() === '') {
                    toast.error("La contraseña es obligatoria para crear un usuario");
                    return;
                }
                await createUser(data);
                toast.success("Usuario creado exitosamente");
            }
            
            // Limpiar formulario y cerrar modal
            reset();
            setNewUser({
                nombre: "",
                contrasena: "",
                email: "",
                rol: "",
                telefono: "",
                fecha_creacion: "",
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingUserId(null);
            await getDataUsers();
            
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? "Error al actualizar el usuario" : "Error al crear el usuario");
        }
    };
  
    // Abrir modal de confirmación de eliminación
    const openDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        
        try {
            await deleteUser(userToDelete.id);
            await getDataUsers(); // Recargar la lista
            toast.success("Usuario eliminado exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el usuario");
        } finally {
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDeleteUser = () => {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
    };
  
    // Cambiar estado del usuario
    const toggleUserStatus = (id: number) => {
      setUsers(
        users.map((user) =>
          user.id === id
            ? {
                ...user,
                telefono: "",
                fecha_creacion: "",
              }
            : user
        )
      );
      toast.success("Estado del usuario actualizado");
    };
    return {
        users,
        filteredUsers,
        isModalOpen,
        isEditMode,
        isDeleteDialogOpen,
        userToDelete,
        newUser,
        setIsModalOpen,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        confirmDeleteUser,
        cancelDeleteUser,
        onSubmit,
        toggleUserStatus,
        searchTerm,
        setSearchTerm,
        register,
        handleSubmitForm
    }
}

export default useUsers;