import { DollarSign, Plus, Check, FileText } from "lucide-react";
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
import { toast } from "sonner";
import useNomina from "./useNomina";

const Nomina = () => {
  const {
    nominas,
    empleados,
    isModalOpen,
    isEditMode,
    newNomina,
    setIsModalOpen,
    openCreateModal,
    openEditModal,
    handleCambiarEstado,
    register,
    handleSubmitForm,
    onSubmit,
    watch,
    handleCalcularHoras,
    generarPeriodoDesdeFecha
  } = useNomina();

  const empleadoSeleccionado = watch('id_usuario');
  const fechaInicio = watch('fecha_inicio');
  const fechaFin = watch('fecha_fin');
  const fechaPago = watch('fecha_pago');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Nómina</h1>
          <p className="text-gray-600 mt-1">Generación y control de pagos</p>
        </div>
        <Button onClick={openCreateModal} className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Crear Nómina
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pendiente de Pago */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Pendiente de Pago</p>
              <p className="text-2xl font-bold text-gray-900">
                ${nominas.filter(n => n.estado.toLowerCase() === 'pendiente').reduce((sum, n) => sum + n.monto + n.bono, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Total Pagado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
              <p className="text-2xl font-bold text-gray-900">
                ${nominas.filter(n => n.estado.toLowerCase() === 'pagado').reduce((sum, n) => sum + n.monto + n.bono, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Registros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{nominas.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Registros de Nómina */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Registros de Nómina</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Periodo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total Horas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Valor Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total a Pagar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Fecha Generación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nominas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No hay registros de nómina</p>
                      <p className="text-gray-400 text-sm mt-1">Crea una nómina para ver los registros aquí</p>
                    </div>
                  </td>
                </tr>
              ) : (
                nominas.map((nomina) => (
                  <tr key={nomina.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {nomina.empleado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {nomina.periodo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {nomina.total_horas}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${nomina.valor_hora.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${(nomina.monto + nomina.bono).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={nomina.estado}
                        onChange={(e) => handleCambiarEstado(nomina.id, e.target.value)}
                        className={`px-3 py-1 rounded-md text-xs font-medium border-0 cursor-pointer ${
                          nomina.estado.toLowerCase() === 'pagado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {nomina.fecha_pago}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        onClick={() => openEditModal(nomina)}
                        variant="outline"
                        size="sm"
                        className="text-blue-700 border-blue-300 hover:bg-blue-50"
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear/Editar Nómina */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Nómina" : "Crear Nueva Nómina"}
            </DialogTitle>
            <DialogDescription>
              Completa los datos para {isEditMode ? "actualizar" : "crear"} la nómina del empleado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id_usuario">Empleado *</Label>
              <select
                id="id_usuario"
                defaultValue={newNomina.id_usuario}
                {...register('id_usuario')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Selecciona un empleado</option>
                {empleados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre} - ${emp.valor_hora}/hora
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha_inicio">Fecha Inicio *</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  defaultValue={newNomina.fecha_inicio}
                  {...register('fecha_inicio')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fecha_fin">Fecha Fin *</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  defaultValue={newNomina.fecha_fin}
                  {...register('fecha_fin')}
                />
              </div>
            </div>

            <div className="flex justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Button
                type="button"
                onClick={() => {
                  if (!empleadoSeleccionado || !fechaInicio || !fechaFin) {
                    toast.warning("Por favor selecciona empleado, fecha inicio y fecha fin primero");
                    return;
                  }
                  handleCalcularHoras(Number(empleadoSeleccionado), fechaInicio, fechaFin);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Calcular Horas desde Registro de Horas
              </Button>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Nota:</strong> El sistema calculará automáticamente las horas trabajadas desde la tabla de registro de horas (solo jornadas finalizadas con hora de salida).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="total_horas">Total Horas</Label>
                <Input
                  id="total_horas"
                  type="number"
                  step="0.01"
                  defaultValue={newNomina.total_horas}
                  {...register('total_horas')}
                  placeholder="0"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="monto">Monto Base</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  defaultValue={newNomina.monto}
                  {...register('monto')}
                  placeholder="0.00"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bono">Bono (Opcional)</Label>
              <Input
                id="bono"
                type="number"
                step="0.01"
                defaultValue={newNomina.bono}
                {...register('bono')}
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha_pago">Fecha de Pago *</Label>
                <Input
                  id="fecha_pago"
                  type="date"
                  defaultValue={newNomina.fecha_pago}
                  {...register('fecha_pago')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="periodo">Periodo (YYYY-MM) *</Label>
                <Input
                  id="periodo"
                  type="text"
                  defaultValue={newNomina.periodo}
                  {...register('periodo')}
                  placeholder="Se generará automáticamente según la fecha de pago"
                  maxLength={7}
                  readOnly
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                {fechaPago && (
                  <p className="text-xs text-muted-foreground">
                    El período se genera automáticamente: <span className="font-medium text-blue-600">{generarPeriodoDesdeFecha(fechaPago)}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estado">Estado *</Label>
              <select
                id="estado"
                defaultValue={newNomina.estado}
                {...register('estado')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
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
            <Button onClick={handleSubmitForm(onSubmit)} className="bg-gray-900 hover:bg-gray-800">
              {isEditMode ? "Actualizar" : "Crear"} Nómina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nomina;
