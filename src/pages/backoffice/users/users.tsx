import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TableGlobal, { type TableColumn } from "@/components/ui/tableGlobal";
import { toast } from "sonner";

// Interfaz para el usuario
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: "activo" | "inactivo";
  fechaCreacion: string;
}

// Datos de ejemplo
const initialUsers: User[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    rol: "Administrador",
    estado: "activo",
    fechaCreacion: "2024-01-15",
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria.garcia@email.com",
    rol: "Vendedor",
    estado: "activo",
    fechaCreacion: "2024-02-20",
  },
  {
    id: 3,
    nombre: "Carlos López",
    email: "carlos.lopez@email.com",
    rol: "Cajero",
    estado: "inactivo",
    fechaCreacion: "2024-03-10",
  },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: "",
    email: "",
    rol: "",
    estado: "activo" as "activo" | "inactivo",
  });

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Crear nuevo usuario
  const handleCreateUser = () => {
    if (!newUser.nombre || !newUser.email || !newUser.rol) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    const user: User = {
      id: Date.now(),
      ...newUser,
      fechaCreacion: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, user]);
    setNewUser({
      nombre: "",
      email: "",
      rol: "",
      estado: "activo",
    });
    setIsModalOpen(false);
    toast.success("Usuario creado exitosamente");
  };

  // Eliminar usuario
  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    toast.success("Usuario eliminado exitosamente");
  };

  // Cambiar estado del usuario
  const toggleUserStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              estado: user.estado === "activo" ? "inactivo" : "activo",
            }
          : user
      )
    );
    toast.success("Estado del usuario actualizado");
  };

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
      key: "rol",
      title: "Rol",
      align: "center",
    },
    {
      key: "estado",
      title: "Estado",
      align: "center",
      render: (estado: "activo" | "inactivo") => (
        <Badge
          variant={estado === "activo" ? "default" : "secondary"}
          className={
            estado === "activo"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }
        >
          {estado}
        </Badge>
      ),
    },
    {
      key: "fechaCreacion",
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
            onClick={() => toggleUserStatus(record.id)}
            title={record.estado === "activo" ? "Desactivar" : "Activar"}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteUser(record.id)}
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa los datos para crear un nuevo usuario en el sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  value={newUser.nombre}
                  onChange={(e) =>
                    setNewUser({ ...newUser, nombre: e.target.value })
                  }
                  placeholder="Ingresa el nombre completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="usuario@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rol">Rol *</Label>
                <select
                  id="rol"
                  value={newUser.rol}
                  onChange={(e) =>
                    setNewUser({ ...newUser, rol: e.target.value })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Cajero">Cajero</option>
                  <option value="Inventario">Inventario</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  value={newUser.estado}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      estado: e.target.value as "activo" | "inactivo",
                    })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
              <Button onClick={handleCreateUser}>Crear Usuario</Button>
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
          Activos: {users.filter((u) => u.estado === "activo").length} |
          Inactivos: {users.filter((u) => u.estado === "inactivo").length}
        </div>
      </div>
    </div>
  );
};

export default Users;