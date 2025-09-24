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
import useClientes from "./useClientes";
import type { Cliente } from "./useClientes";


const Clientes = () => {
  const { 
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
  } = useClientes();

  // Configuración de columnas para TableGlobal
  const clienteColumns: TableColumn<Cliente>[] = [
    {
      key: "nombre",
      title: "Nombre",
      width: "200px",
    },
    {
      key: "telefono",
      title: "Teléfono",
      align: "center",
      width: "150px",
    },
    {
      key: "direccion",
      title: "Dirección",
      width: "250px",
    },
    {
      key: "fechaRegistro",
      title: "Fecha de Registro",
      align: "center",
      width: "150px",
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
            onClick={() => openDeleteDialog(record)}
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
                defaultValue={newCliente.nombre}
                {...register('nombre')}
                placeholder="Ingresa el nombre completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                type="tel"
                defaultValue={newCliente.telefono}
                {...register('telefono')}
                placeholder="3001234567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                defaultValue={newCliente.direccion}
                {...register('direccion')}
                placeholder="Ingresa la dirección completa"
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
              {isEditMode ? "Actualizar Cliente" : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteClient}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{" "}
              <strong>{clienteToDelete?.nombre}</strong> de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteClient}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
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

export default Clientes;