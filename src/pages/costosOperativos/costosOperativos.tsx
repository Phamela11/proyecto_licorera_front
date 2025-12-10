import { Plus, Edit, Trash2, Search, DollarSign, TrendingUp, FileText } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TableGlobal, { type TableColumn } from "@/components/ui/tableGlobal";
import useCostosOperativos from "./useCostosOperativos";
import type { CostoOperativoUI } from "./useCostosOperativos";
import { Badge } from "@/components/ui/badge";

const CostosOperativos = () => {
  const { 
    costosOperativos,
    loading,
    isModalOpen, 
    isEditMode,
    isDeleteDialogOpen,
    costoToDelete,
    estadisticas,
    setIsModalOpen, 
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    confirmDeleteCosto,
    cancelDeleteCosto,
    onSubmit, 
    searchTerm,
    setSearchTerm,
    register,
    handleSubmitForm,
    watch,
    generarPeriodoDesdeFecha
  } = useCostosOperativos();

  // Observar cambios en la fecha
  const fecha = watch('fecha');

  // Función para obtener color según categoría
  const getCategoriaColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      "Servicios Públicos": "bg-blue-100 text-blue-800",
      "Arriendo": "bg-purple-100 text-purple-800",
      "Salarios": "bg-green-100 text-green-800",
      "Mantenimiento": "bg-yellow-100 text-yellow-800",
      "Transporte": "bg-orange-100 text-orange-800",
      "Marketing": "bg-pink-100 text-pink-800",
      "Suministros": "bg-cyan-100 text-cyan-800",
      "Seguros": "bg-indigo-100 text-indigo-800",
      "Tecnología": "bg-violet-100 text-violet-800",
      "Otros": "bg-gray-100 text-gray-800"
    };
    return colors[categoria] || "bg-gray-100 text-gray-800";
  };

  // Configuración de columnas para TableGlobal
  const costoColumns: TableColumn<CostoOperativoUI>[] = [
    {
      key: "categoria",
      title: "Categoría",
      width: "150px",
      render: (value: string) => (
        <Badge className={getCategoriaColor(value)} variant="secondary">
          {value}
        </Badge>
      ),
    },
    {
      key: "descripcion",
      title: "Descripción",
      width: "250px",
    },
    {
      key: "montoFormateado",
      title: "Monto",
      align: "right",
      width: "120px",
      render: (value: string) => (
        <span className="font-semibold text-green-600">{value}</span>
      ),
    },
    {
      key: "fechaFormateada",
      title: "Fecha",
      align: "center",
      width: "120px",
    },
    {
      key: "periodo",
      title: "Periodo",
      align: "center",
      width: "120px",
      render: (value: string) => value || "-",
    },
    {
      key: "observaciones",
      title: "Observaciones",
      width: "200px",
      render: (value: string) => value || "-",
    },
    {
      key: "actions",
      title: "Acciones",
      align: "right",
      render: (_, record: CostoOperativoUI) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
            title="Editar costo"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(record)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar costo"
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
          <h1 className="text-3xl font-bold tracking-tight">Costos Operativos</h1>
          <p className="text-muted-foreground">
            Gestiona y controla los gastos operativos del negocio
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Costo
        </Button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.total}</div>
            <p className="text-xs text-muted-foreground">
              Suma total de costos operativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cantidad Registros</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.cantidad}</div>
            <p className="text-xs text-muted-foreground">
              Total de costos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.promedio}</div>
            <p className="text-xs text-muted-foreground">
              Costo promedio por registro
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar costos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabla de costos operativos con TableGlobal */}
      <TableGlobal
        data={costosOperativos}
        columns={costoColumns}
        loading={loading}
        emptyMessage={
          searchTerm
            ? "No se encontraron costos con ese criterio de búsqueda"
            : "No hay costos operativos registrados"
        }
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          showTotal: true,
        }}
      />

      {/* Modal para crear/editar costo operativo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Costo Operativo" : "Registrar Nuevo Costo"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Modifica los datos del costo operativo." 
                : "Completa los datos para registrar un nuevo costo operativo."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Input
                id="categoria"
                {...register('categoria', { required: true })}
                placeholder="Ej: Servicios Públicos, Arriendo, Salarios"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Input
                id="descripcion"
                {...register('descripcion', { required: true })}
                placeholder="Describe el costo operativo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="monto">Monto *</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  {...register('monto', { required: true, min: 0.01 })}
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  {...register('fecha', { required: true })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="periodo">Periodo</Label>
              <Input
                id="periodo"
                {...register('periodo')}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Se generará automáticamente según la fecha"
              />
              {fecha && (
                <p className="text-xs text-muted-foreground">
                  El período se genera automáticamente: <span className="font-medium text-blue-600">{generarPeriodoDesdeFecha(fecha)}</span>
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <textarea
                id="observaciones"
                {...register('observaciones')}
                placeholder="Notas adicionales sobre el costo"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              {isEditMode ? "Actualizar Costo" : "Registrar Costo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteCosto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el costo operativo{" "}
              <strong>{costoToDelete?.descripcion}</strong> por un monto de{" "}
              <strong>{costoToDelete?.montoFormateado}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteCosto}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCosto}
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

export default CostosOperativos;
