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
import useProviders from "./useProviders";
import type { Provider } from "./useProviders";

const Providers = () => {
  const { 
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
  } = useProviders();

  // Configuración de columnas para TableGlobal
  const providerColumns: TableColumn<Provider>[] = [
    {
      key: "nombre",
      title: "Nombre",
      width: "250px",
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
      width: "300px",
    },
    {
      key: "fecha",
      title: "Fecha",
      align: "center",
      width: "120px",
    },
    {
      key: "actions",
      title: "Acciones",
      align: "right",
      render: (_, record: Provider) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
            title="Editar proveedor"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(record)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar proveedor"
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
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona la información de proveedores
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Proveedor
        </Button>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Proveedor" : "Crear Nuevo Proveedor"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Modifica los datos del proveedor seleccionado."
                  : "Completa los datos para crear un nuevo proveedor."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del proveedor *</Label>
                <Input
                  id="nombre"
                  defaultValue={newProvider.nombre}
                  {...register('nombre')}
                  placeholder="Ingresa el nombre del proveedor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  defaultValue={newProvider.telefono}
                  {...register('telefono')}
                  placeholder="Número de teléfono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  defaultValue={newProvider.direccion}
                  {...register('direccion')}
                  placeholder="Dirección completa"
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
                {isEditMode ? "Actualizar Proveedor" : "Crear Proveedor"}
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
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabla de proveedores con TableGlobal */}
      <TableGlobal
        data={filteredProviders}
        columns={providerColumns}
        emptyMessage={
          searchTerm
            ? "No se encontraron proveedores con ese criterio de búsqueda"
            : "No hay proveedores registrados"
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
          Total de proveedores: {providers.length}
          {searchTerm && ` | Filtrados: ${filteredProviders.length}`}
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteProvider}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor{" "}
              <strong>{providerToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteProvider}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProvider}
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

export default Providers;
