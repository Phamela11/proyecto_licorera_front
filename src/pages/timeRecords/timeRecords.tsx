import { Plus, Edit, Trash2, Search, Clock } from "lucide-react";
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
import useTimeRecords, { type TimeRecord } from "./useTimeRecords";
import { useEffect, useState } from "react";
import { getUsers } from "@/core/services/users.service";

// Función para obtener colores específicos por estado
const getEstadoStyles = (estado: string) => {
  const estadoUpper = estado?.toUpperCase();
  
  switch (estadoUpper) {
    case "COMPLETO":
      return {
        backgroundColor: "#d1e7dd",
        color: "#0a5827",
        hoverColor: "#badbcc",
        label: "Completo"
      };
    case "EN PROGRESO":
      return {
        backgroundColor: "#fcefb4",
        color: "#c36f09",
        hoverColor: "#f9e79f",
        label: "En Progreso"
      };
    case "AUSENTE":
      return {
        backgroundColor: "#f8d7da",
        color: "#842029",
        hoverColor: "#f5c2c7",
        label: "Ausente"
      };
    default:
      return {
        backgroundColor: "#e5e7eb",
        color: "#374151",
        hoverColor: "#d1d5db",
        label: estado || "Sin estado"
      };
  }
};

const TimeRecords = () => {
  const { 
    filteredRecords, 
    isModalOpen, 
    isEditMode,
    isDeleteDialogOpen,
    recordToDelete,
    newRecord, 
    setIsModalOpen, 
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    confirmDeleteRecord,
    cancelDeleteRecord,
    onSubmit, 
    searchTerm,
    setSearchTerm,
    register,
    handleSubmitForm
  } = useTimeRecords();

  const [empleados, setEmpleados] = useState<any[]>([]);

  useEffect(() => {
    // Cargar empleados para el select
    const loadEmpleados = async () => {
      try {
        const response = await getUsers();
        setEmpleados(response.data);
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      }
    };
    loadEmpleados();
  }, []);

  // Configuración de columnas para TableGlobal
  const timeRecordColumns: TableColumn<TimeRecord>[] = [
    {
      key: "fecha",
      title: "Fecha",
      width: "200px",
    },
    {
      key: "empleado",
      title: "Empleado",
      width: "200px",
    },
    {
      key: "entrada",
      title: "Entrada",
      align: "center",
      width: "100px",
    },
    {
      key: "salida",
      title: "Salida",
      align: "center",
      width: "100px",
    },
    {
      key: "horas",
      title: "Horas",
      align: "center",
      width: "100px",
    },
    {
      key: "estado",
      title: "Estado",
      align: "center",
      render: (estado: string) => {
        const styles = getEstadoStyles(estado);
        return (
          <div
            className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium transition-all duration-200 border-0"
            style={{
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              minWidth: '80px',
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
      key: "observaciones",
      title: "Observaciones",
      align: "center",
      render: (observaciones: string) => observaciones || '-',
    },
    {
      key: "actions",
      title: "Acciones",
      align: "right",
      render: (_, record: TimeRecord) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
            title="Editar registro"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(record)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar registro"
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="w-8 h-8 text-[#c9184a]" />
            Control de Tiempo
          </h1>
          <p className="text-muted-foreground">
            Registro de horas trabajadas por empleados
          </p>
        </div>
        <Button onClick={openCreateModal} style={{ backgroundColor: '#c9184a' }} className="hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Registrar Horas
        </Button>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Registro de Horas" : "Nuevo Registro de Horas"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Modifica los datos del registro seleccionado."
                  : "Completa los datos para registrar las horas trabajadas."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  defaultValue={newRecord.fecha}
                  {...register('fecha')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="empleado_id">Empleado *</Label>
                <select
                  id="empleado_id"
                  defaultValue={newRecord.empleado_id}
                  {...register('empleado_id')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona un empleado</option>
                  {empleados.map((emp) => (
                    <option key={emp.id_usuario} value={emp.id_usuario}>
                      {emp.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="entrada">Hora Entrada *</Label>
                  <Input
                    id="entrada"
                    type="time"
                    defaultValue={newRecord.entrada}
                    {...register('entrada')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salida">Hora Salida</Label>
                  <Input
                    id="salida"
                    type="time"
                    defaultValue={newRecord.salida}
                    {...register('salida')}
                  />
                  <p className="text-xs text-muted-foreground">Dejar vacío si aún está trabajando</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  id="observaciones"
                  type="text"
                  defaultValue={newRecord.observaciones || ""}
                  {...register('observaciones')}
                  placeholder="Agregar observaciones (opcional)"
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
              <Button 
                onClick={handleSubmitForm(onSubmit)}
                style={{ backgroundColor: '#c9184a' }}
                className="hover:opacity-90"
              >
                {isEditMode ? "Actualizar Registro" : "Crear Registro"}
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
            placeholder="Buscar por empleado, fecha o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabla de registros con TableGlobal */}
      <TableGlobal
        data={filteredRecords}
        columns={timeRecordColumns}
        emptyMessage={
          searchTerm
            ? "No se encontraron registros con ese criterio de búsqueda"
            : "No hay registros de horas"
        }
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          showTotal: true,
        }}
      />

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteRecord}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{" "}
              <strong>{recordToDelete?.empleado}</strong> del día{" "}
              <strong>{recordToDelete?.fecha}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteRecord}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRecord}
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

export default TimeRecords;

