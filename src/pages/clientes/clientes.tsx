import { useState } from "react";
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
import TableGlobal, { type TableColumn } from "@/components/ui/tableGlobal";
import { toast } from "sonner";


interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
}


const initialClientes: Cliente[] = [];

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClienteId, setEditingClienteId] = useState<number | null>(null);
  const [newCliente, setNewCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  // Filtrar clientes por término de búsqueda
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm)
  );

  // Abrir modal para crear cliente
  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingClienteId(null);
    setNewCliente({
      nombre: "",
      email: "",
      telefono: "",
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar cliente
  const openEditModal = (cliente: Cliente) => {
    setIsEditMode(true);
    setEditingClienteId(cliente.id);
    setNewCliente({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
    });
    setIsModalOpen(true);
  };

  // Crear o actualizar cliente
  const handleSubmitCliente = () => {
    if (!newCliente.nombre || !newCliente.email || !newCliente.telefono) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (isEditMode && editingClienteId) {
      // Actualizar cliente existente
      setClientes(clientes.map(cliente => 
        cliente.id === editingClienteId 
          ? { ...cliente, ...newCliente }
          : cliente
      ));
      toast.success("Cliente actualizado exitosamente");
    } else {
      // Crear nuevo cliente
      const cliente: Cliente = {
        id: Date.now(),
        ...newCliente,
        fechaRegistro: new Date().toLocaleDateString('es-ES'),
      };
      setClientes([...clientes, cliente]);
      toast.success("Cliente creado exitosamente");
    }

    setNewCliente({
      nombre: "",
      email: "",
      telefono: "",
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingClienteId(null);
  };

  // Eliminar cliente
  const handleDeleteCliente = (id: number) => {
    setClientes(clientes.filter((cliente) => cliente.id !== id));
    toast.success("Cliente eliminado exitosamente");
  };

  // Configuración de columnas para TableGlobal
  const clienteColumns: TableColumn<Cliente>[] = [
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
      key: "fechaRegistro",
      title: "Fecha de Registro",
      align: "center",
    },
    {
      key: "actions",
      title: "Acciones",
      align: "right",
      render: (_, record: Cliente) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
            title="Editar cliente"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteCliente(record.id)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar cliente"
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
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona la base de datos de clientes
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Cliente
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabla de clientes con TableGlobal */}
      <TableGlobal
        data={filteredClientes}
        columns={clienteColumns}
        emptyMessage={
          searchTerm
            ? "No se encontraron clientes con ese criterio de búsqueda"
            : "No hay clientes registrados"
        }
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          showSizeChanger: true,
          showTotal: true,
        }}
      />

      {/* Resumen */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Total de clientes: {clientes.length}
          {searchTerm && ` | Filtrados: ${filteredClientes.length}`}
        </div>
      </div>

      {/* Modal para crear cliente */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Cliente" : "Crear Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Modifica los datos del cliente." 
                : "Completa los datos para registrar un nuevo cliente."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                value={newCliente.nombre}
                onChange={(e) =>
                  setNewCliente({ ...newCliente, nombre: e.target.value })
                }
                placeholder="Ingresa el nombre completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newCliente.email}
                onChange={(e) =>
                  setNewCliente({ ...newCliente, email: e.target.value })
                }
                placeholder="cliente@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                type="tel"
                value={newCliente.telefono}
                onChange={(e) =>
                  setNewCliente({ ...newCliente, telefono: e.target.value })
                }
                placeholder="555-0000"
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
            <Button onClick={handleSubmitCliente}>
              {isEditMode ? "Actualizar Cliente" : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clientes;
