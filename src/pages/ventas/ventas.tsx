import { Plus, Edit, Trash2, Search, ShoppingCart, DollarSign, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useVentas, formatCurrency } from "./useVentas";
import type { Sale } from "./useVentas";

const Ventas = () => {
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  
  const { 
    ventas, 
    filteredSales,
    clientes,
    usuarios,
    productos,
    isModalOpen, 
    isEditMode,
    isDeleteDialogOpen,
    saleToDelete,
    newSale,
    setIsModalOpen,
    setNewSale,
    setValue,
    searchTerm, 
    setSearchTerm,
    isLoading,
    totalVentas,
    totalClientesAtendidos,
    openCreateModal, 
    openEditModal, 
    closeModal,
    addProductToSale,
    removeProductFromSale,
    calculateTotal,
    onSubmit,
    handleDeleteSale,
    openDeleteDialog,
    setIsDeleteDialogOpen,
    setSaleToDelete,
    handleSubmit
  } = useVentas();
  
  // Función para manejar el cierre del modal y resetear el producto seleccionado
  const handleCloseModal = () => {
    setSelectedProductId(0);
    closeModal();
  };

  // Columnas de la tabla
  const saleColumns: TableColumn<Sale>[] = [
    {
      key: "fecha",
      title: "Fecha",
      width: "120px",
    },
    {
      key: "cliente_nombre",
      title: "Cliente",
      width: "200px",
    },
    {
      key: "usuario_nombre",
      title: "Usuario",
      width: "200px",
    },
    {
      key: "total",
      title: "Total",
      width: "150px",
      render: (total: number) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(total)}
        </span>
      ),
    },
    {
      key: "productos",
      title: "Productos",
      width: "200px",
      render: (productos: any[]) => (
        <div className="text-sm text-gray-600">
          {productos.length} producto{productos.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Acciones",
      width: "120px",
      render: (_, sale) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(sale)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(sale)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">
            Gestiona las ventas y transacciones del negocio
          </p>
        </div>
        <Button onClick={() => {
          setSelectedProductId(0);
          openCreateModal();
        }} className="bg-black text-white hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-gradient-to-br border-gray-200 text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow" style={{ backgroundColor: '#fff5f7', borderColor: '#fce7f3' }}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium" style={{ color: '#b9375e' }}>Total Ventas</p>
            <DollarSign className="h-5 w-5" style={{ color: '#b9375e' }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: '#b9375e' }}>{formatCurrency(totalVentas)}</div>
          <p className="text-xs mt-1" style={{ color: '#b9375e' }}>{ventas.length} transacciones</p>
        </div>
        <div className="rounded-lg border bg-gradient-to-br border-gray-200 text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow" style={{ backgroundColor: '#f5f3ff', borderColor: '#ede9fe' }}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium" style={{ color: '#47126b' }}>Clientes Atendidos</p>
            <Users className="h-5 w-5" style={{ color: '#47126b' }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: '#47126b' }}>{totalClientesAtendidos}</div>
          <p className="text-xs mt-1" style={{ color: '#47126b' }}>clientes únicos</p>
        </div>
        <div className="rounded-lg border bg-gradient-to-br border-gray-200 text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow" style={{ backgroundColor: '#ecfdf5', borderColor: '#d1fae5' }}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium" style={{ color: '#218380' }}>Total Items</p>
            <ShoppingCart className="h-5 w-5" style={{ color: '#218380' }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: '#218380' }}>{ventas.reduce((sum, v) => sum + v.productos.length, 0)}</div>
          <p className="text-xs mt-1" style={{ color: '#218380' }}>Productos vendidos</p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ventas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="rounded-md border">
        <TableGlobal
          data={filteredSales}
          columns={saleColumns}
          loading={isLoading}
          emptyMessage="No hay ventas registradas"
        />
      </div>

      {/* Resumen */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Total de ventas: {ventas.length}</span>
        <span>Valor total: {formatCurrency(totalVentas)}</span>
      </div>

      {/* Modal para crear/editar venta */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        } else {
          setIsModalOpen(true);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Venta" : "Nueva Venta"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Modifica los datos de la venta seleccionada" 
                : "Completa la información para crear una nueva venta"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Cliente */}
            <div className="grid gap-2">
              <Label htmlFor="id_cliente">Cliente *</Label>
              <Select
                value={newSale.id_cliente > 0 ? newSale.id_cliente.toString() : ""}
                onValueChange={(value: string) => {
                  setNewSale((prev: any) => ({ ...prev, id_cliente: parseInt(value) }));
                  setValue('id_cliente', parseInt(value));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente: any) => (
                    <SelectItem key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Usuario */}
            <div className="grid gap-2">
              <Label htmlFor="id_usuario">Usuario *</Label>
              <Select
                value={newSale.id_usuario > 0 ? newSale.id_usuario.toString() : ""}
                onValueChange={(value: string) => {
                  setNewSale((prev: any) => ({ ...prev, id_usuario: parseInt(value) }));
                  setValue('id_usuario', parseInt(value));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((usuario: any) => (
                    <SelectItem key={usuario.id_usuario} value={usuario.id_usuario.toString()}>
                      {usuario.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Productos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Productos</Label>
                {newSale.productos.length > 0 && (
                  <Badge variant="secondary">{newSale.productos.length} producto(s) agregado(s)</Badge>
                )}
              </div>
              
              {/* Agregar producto */}
              <div className="flex gap-2">
                <Select
                  value={selectedProductId > 0 ? selectedProductId.toString() : ""}
                  onValueChange={(productId: string) => {
                    setSelectedProductId(parseInt(productId));
                  }}
                >
                  <SelectTrigger className="flex-1 h-10">
                    <SelectValue placeholder="🔍 Buscar y agregar producto..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {productos.map((product: any) => (
                      <SelectItem key={product.id_producto} value={product.id_producto.toString()}>
                        <div className="flex justify-between items-center w-full">
                          <span>{product.nombre}</span>
                          <span className="ml-4 font-semibold text-green-600">{formatCurrency(product.precio_venta)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-4 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                  onClick={() => {
                    if (selectedProductId > 0) {
                      addProductToSale(selectedProductId, 1);
                      setSelectedProductId(0); // Vaciar el campo después de agregar
                    }
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </div>

              {/* Lista de productos seleccionados */}
              <div className="space-y-2">
                  {newSale.productos.map((productSale: any) => {
                    const product = productos.find((p: any) => p.id_producto === productSale.id_producto);
                    return (
                      <div key={productSale.id_producto} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{product?.nombre}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{product?.tipo_licor_nombre}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Precio unitario: {formatCurrency(productSale.precio_unitario)}</div>
                        </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Cantidad:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={productSale.cantidad}
                          onChange={(e) => {
                            const cantidad = parseInt(e.target.value) || 1;
                            setNewSale((prev: any) => ({
                              ...prev,
                              productos: prev.productos.map((p: any) => 
                                p.id_producto === productSale.id_producto 
                                  ? { ...p, cantidad }
                                  : p
                              )
                            }));
                          }}
                          className="w-20"
                        />
                        <span className="text-base font-bold text-green-600">
                          {formatCurrency(productSale.cantidad * productSale.precio_unitario)}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProductFromSale(productSale.id_producto)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                {isEditMode ? "Actualizar Venta" : "Crear Venta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la venta
              del cliente "{saleToDelete?.cliente_nombre}" por un valor de {saleToDelete && formatCurrency(saleToDelete.total)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSaleToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSale}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Ventas;
