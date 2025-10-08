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
import useLicorTypes, { type LicorType } from "./useLicorTypes";

const LicorTypes = () => {
  const {
    licorTypes,
    filteredLicorTypes,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    openCreateModal,
    openEditModal,
    register,
    handleSubmitForm,
    isDeleteDialogOpen,
    licorTypeToDelete,
    openDeleteDialog,
    confirmDeleteLicorType,
    cancelDeleteLicorType,
    onSubmit,
  } = useLicorTypes();

  const columns: TableColumn<LicorType>[] = [
    {
      key: "nombre",
      title: "Nombre",
      width: "300px",
    },
    {
      key: "actions",
      title: "Acciones",
      align: "right",
      render: (_, record: LicorType) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
            title="Editar tipo de licor"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(record)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar tipo de licor"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Licor</h1>
          <p className="text-muted-foreground">Gestiona los tipos de licor</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Tipo de Licor
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Tipo de Licor" : "Crear Tipo de Licor"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Modifica el nombre del tipo de licor."
                  : "Ingresa el nombre del tipo de licor a crear."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input id="nombre" placeholder="Ej: Ron" {...register("nombre")} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitForm(onSubmit)}>
                {isEditMode ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <TableGlobal
        data={filteredLicorTypes}
        columns={columns}
        emptyMessage={
          searchTerm ? "No se encontraron tipos" : "No hay tipos de licor registrados"
        }
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          showTotal: true,
        }}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Total: {licorTypes.length}
          {searchTerm && ` | Filtrados: ${filteredLicorTypes.length}`}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteLicorType}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el tipo
              <strong> {licorTypeToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteLicorType}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLicorType}
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

export default LicorTypes;