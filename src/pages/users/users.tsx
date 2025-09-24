import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TableGlobal, { type TableColumn } from "@/components/ui/tableGlobal";
import useUsers, { type User } from "./useUsers";

// Función para obtener colores específicos por rol
const getRoleStyles = (rol: string) => {
  const rolUpper = rol?.toUpperCase();
  
  switch (rolUpper) {
    case "ADMINISTRADOR":
    case "ADMIN":
      return {
        backgroundColor: "#ff758f",
        color: "#c9184a",
        hoverColor: "#ff4d6d",
        label: "Admin"
      };
    case "EMPLEADO":
      return {
        backgroundColor: "#e0aaff",
        color: "#3c096c",
        hoverColor: "#d084ff",
        label: "Empleado"
      };
    case "CAJERO":
      return {
        backgroundColor: "#fcefb4",
        color: "#c36f09",
        hoverColor: "#f9e79f",
        label: "Cajero"
      };
    default:
      return {
        backgroundColor: "#e5e7eb", // Gris neutro
        color: "#374151",
        hoverColor: "#d1d5db",
        label: rol || "Sin rol"
      };
  }
};

const Users = () => {
  const { 
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
    searchTerm,
    setSearchTerm,
    register,
    handleSubmitForm
  } = useUsers();

  // Configuración de columnas para TableGlobal
  const userColumns: TableColumn<User>[] = [
    {
      key: "nombre",
      title: "Nombre",
      width: "200px",
    },
    {
      key: "email",
      title: "Email",
      width: "250px",
    },
    {
      key: "telefono",
      title: "Teléfono",
      align: "center",
      width: "150px",
    },
    {
      key: "rol",
      title: "Rol",
      align: "center",
      render: (rol: string) => {
        const styles = getRoleStyles(rol);
        return (
          <div
            className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium transition-all duration-200 border-0"
            style={{
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              minWidth: '60px',
              textAlign: 'center',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = styles.hoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = styles.backgroundColor;
            }}
          >
            {styles.label}
          </div>
        );
      },
    },
    {
      key: "fecha_creacion",
      title: "Fecha de Creación",
      align: "center",
    },
    {
      key: "actions",
      title: "Acciones",
      align: "right",
      render: (_, record: User) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
            title="Editar usuario"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(record)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar usuario"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Modifica los datos del usuario seleccionado."
                  : "Completa los datos para crear un nuevo usuario en el sistema."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  defaultValue={newUser.nombre}
                  {...register('nombre')}
                  placeholder="Ingresa el nombre completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={newUser.email || ""}
                  {...register('email')}
                  placeholder="usuario@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  defaultValue={newUser.telefono || ""}
                  {...register('telefono')}
                  placeholder="1234567890"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rol">Rol *</Label>
                <select
                  id="rol"
                  defaultValue={newUser.rol}
                  {...register('rol')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona un rol</option>
                  <option value={1}>Administrador</option>
                  <option value={2}>Empleado</option>
                  <option value={3}>Cajero</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contrasena">
                  Contraseña {isEditMode ? "(opcional - dejar vacío para mantener actual)" : "*"}
                </Label>
                <Input
                  id="contrasena"
                  type="password"
                  defaultValue={newUser.contrasena || ""}
                  {...register('contrasena')}
                  placeholder={isEditMode ? "Dejar vacío para mantener contraseña actual" : "Ingresa la contraseña"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmitForm(onSubmit)}>
                {isEditMode ? "Actualizar Usuario" : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabla de usuarios con TableGlobal */}
      <TableGlobal
        data={filteredUsers}
        columns={userColumns}
        emptyMessage={
          searchTerm
            ? "No se encontraron usuarios con ese criterio de búsqueda"
            : "No hay usuarios registrados"
        }
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          showTotal: true,
        }}
      />

      {/* Resumen */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Total de usuarios: {users.length}
          {searchTerm && ` | Filtrados: ${filteredUsers.length}`}
        </div>
        <div>
          Administradores: {users.filter((u) => u.rol === "ADMINISTRADOR").length} |
          Empleados: {users.filter((u) => u.rol === "EMPLEADO").length}
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteUser}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{" "}
              <strong>{userToDelete?.nombre}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteUser}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;