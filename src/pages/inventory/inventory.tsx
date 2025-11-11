import { useState } from "react";
import { Plus, Search, Package, TrendingUp, BarChart3 } from "lucide-react";
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
import useInventory from "./useInventory";
import type { InventoryEntry, InventoryMovement } from "./useInventory";

const Inventory = () => {
  const { 
    inventory, 
    movements,
    filteredInventory, 
    isMovementModalOpen,
    isDeleteDialogOpen,
    entryToDelete,
    newMovement,
    setIsMovementModalOpen,
    openMovementModal,
    confirmDeleteEntry,
    cancelDeleteEntry,
    onSubmitMovement,
    getDataMovements,
    searchTerm,
    setSearchTerm,
    register,
    handleSubmitForm,
    setValue,
    products,
    providers
  } = useInventory();

  // Estado para calcular total en tiempo real
  const [movementForm, setMovementForm] = useState({
    cantidad: 0,
    precio_unitario: 0
  });

  // Estado para el producto seleccionado
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Obtener proveedores filtrados según el producto seleccionado
  const filteredProviders = selectedProductId
    ? (() => {
        const selectedProduct = products.find((p: any) => p.id_producto === selectedProductId);
        if (selectedProduct) {
          // Usar id_proveedores o proveedores_ids (compatibilidad)
          const proveedoresIds = selectedProduct.id_proveedores || [];
          if (Array.isArray(proveedoresIds) && proveedoresIds.length > 0) {
            // Filtrar nulls/undefined
            const validIds = proveedoresIds.filter((id: any) => id !== null && id !== undefined);
            return providers.filter((provider: any) => 
              validIds.includes(provider.id_proveedor)
            );
          }
        }
        return [];
      })()
    : providers;

  // Configuración de columnas para la tabla de inventario (stock actual)
  const stockColumns: TableColumn<InventoryEntry>[] = [
    {
      key: "producto_nombre",
      title: "Producto",
      width: "300px",
      render: (nombre: string, record: InventoryEntry) => (
        <div>
          <div className="font-semibold text-gray-900 text-sm">{nombre}</div>
          <div className="text-xs text-gray-500">{record.categoria}</div>
        </div>
      ),
    },
    {
      key: "cantidad",
      title: "Stock Actual",
      align: "center",
      width: "150px",
      render: (cantidad: number) => (
        <span className="font-bold text-lg" style={{ color: '#c9184a' }}>
          {cantidad}
        </span>
      ),
    },
    {
      key: "precio_venta",
      title: "Precio de Venta (con IVA)",
      align: "center",
      width: "200px",
      render: (precio: number) => (
        <span className="font-medium text-sm" style={{ color: '#218380' }}>
          ${Number(precio || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "valor_total",
      title: "Valor Total",
      align: "center",
      width: "180px",
      render: (_, record: InventoryEntry) => {
        const valorTotal = (record.precio_venta || 0) * record.cantidad;
        return (
          <span className="font-bold text-sm" style={{ color: '#47126b' }}>
            ${valorTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
  ];

  // Configuración de columnas para la tabla de movimientos
  const movementsColumns: TableColumn<InventoryMovement>[] = [
    {
      key: "fecha_movimiento",
      title: "Fecha",
      align: "center",
      width: "150px",
      render: (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      },
    },
    {
      key: "id_inventario",
      title: "Producto",
      width: "200px",
      render: (id: number) => {
        const entry = inventory.find(e => e.id === id);
        return entry ? entry.producto_nombre : `ID: ${id}`;
      },
    },
    {
      key: "proveedor_nombre",
      title: "Proveedor", 
      width: "180px",
      align: "center",
      render: (proveedor: string, record: InventoryMovement) => {
        if (!proveedor || proveedor === 'null' || proveedor === null) {
          return <span className="text-gray-400 italic">N/A</span>;
        }
        return <span className="font-medium">{proveedor}</span>;
      },
    },
    {
      key: "tipo_movimiento",
      title: "Tipo",
      width: "120px",
      align: "center",
      render: (tipo: string) => (
        <div className="flex items-center justify-center">
          {tipo === 'ENTRADA' ? (
            <Badge variant="outline" className="text-white border-0" style={{ backgroundColor: '#218380' }}>
              <TrendingUp className="w-3 h-3 mr-1" />
              Entrada
            </Badge>
          ) : (
            <Badge variant="outline" className="text-white border-0" style={{ backgroundColor: '#b9375e' }}>
              <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
              Salida
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "cantidad",
      title: "Cantidad",
      align: "center",
      width: "100px",
      render: (cantidad: number, record: InventoryMovement) => (
        <span className="font-medium" style={{ color: record.tipo_movimiento === 'ENTRADA' ? '#218380' : '#b9375e' }}>
          {record.tipo_movimiento === 'ENTRADA' ? '+' : '-'}{cantidad}
        </span>
      ),
    },
    {
      key: "precio_unitario",
      title: "Precio Unit.",
      align: "center",
      width: "120px",
      render: (precio: number) => (
        <span className="font-medium" style={{ color: '#218380' }}>
          ${Number(precio).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "total",
      title: "Total",
      align: "center",
      width: "120px",
      render: (total: number) => (
        <span className="font-bold" style={{ color: '#47126b' }}>
          ${Number(total).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
  ];


  return (
      <div className="w-full min-h-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
              <p className="text-muted-foreground">
                Gestiona el stock a través de movimientos de inventario
              </p>
            </div>
          </div>
        </div>

        {/* Modal para movimientos de inventario */}
        <Dialog open={isMovementModalOpen} onOpenChange={(open) => {
          setIsMovementModalOpen(open);
          if (!open) {
            // Resetear el formulario cuando se cierre el modal
            setMovementForm({ cantidad: 0, precio_unitario: 0 });
            setSelectedProductId(null);
          } else {
            // Cuando se abre el modal, si hay una entrada de inventario seleccionada, establecer el producto
            if (newMovement.id_inventario > 0) {
              const inventoryEntry = inventory.find(e => e.id === newMovement.id_inventario);
              if (inventoryEntry) {
                setSelectedProductId(inventoryEntry.id_producto);
              }
            }
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nuevo Movimiento de Inventario</DialogTitle>
              <DialogDescription>
                {newMovement.id_inventario === 0 
                  ? "Registra una entrada de stock. Se creará automáticamente la entrada de inventario si no existe."
                  : "Registra una entrada de stock para este producto."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {newMovement.id_inventario === 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="id_producto">Producto *</Label>
                  <select
                    id="id_producto"
                    {...register('id_producto')}
                    onChange={(e) => {
                      const productId = e.target.value ? parseInt(e.target.value) : null;
                      setSelectedProductId(productId);
                      setValue('id_producto', e.target.value);
                      // Limpiar el proveedor cuando cambia el producto
                      setValue('id_proveedor', '');
                      // Cargar precio si existe el producto
                      if (productId) {
                        const product = products.find((p: any) => p.id_producto === productId);
                        if (product) {
                          setValue('precio_unitario', product.precio_compra || 0);
                          setMovementForm(prev => ({ ...prev, precio_unitario: product.precio_compra || 0 }));
                        }
                      }
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecciona el producto</option>
                    {products.map((product) => (
                      <option key={product.id_producto} value={product.id_producto}>
                        {product.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="id_proveedor">
                  Proveedor * 
                  {selectedProductId && filteredProviders.length === 0 && (
                    <span className="text-xs text-red-500 ml-2">(Este producto no tiene proveedores asignados)</span>
                  )}
                </Label>
                <select
                  id="id_proveedor"
                  {...register('id_proveedor')}
                  disabled={!selectedProductId || filteredProviders.length === 0}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {!selectedProductId 
                      ? "Primero selecciona un producto" 
                      : filteredProviders.length === 0 
                      ? "No hay proveedores para este producto"
                      : "Selecciona un proveedor"}
                  </option>
                  {filteredProviders.map((provider: any) => (
                    <option key={provider.id_proveedor} value={provider.id_proveedor}>
                      {provider.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  {...register('cantidad')}
                  placeholder="0"
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMovementForm(prev => ({ ...prev, cantidad: value }));
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="precio_unitario">Precio Unitario (precio de compra sin IVA) *</Label>
                <Input
                  id="precio_unitario"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('precio_unitario')}
                  placeholder="0.00"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setMovementForm(prev => ({ ...prev, precio_unitario: value }));
                  }}
                />
              </div>
          <div className="grid gap-2">
            <Label>Total Calculado</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className="font-semibold text-lg" style={{ color: '#47126b' }}>
                ${(movementForm.cantidad * movementForm.precio_unitario).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsMovementModalOpen(false);
                  setMovementForm({ cantidad: 0, precio_unitario: 0 });
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmitForm(onSubmitMovement)}>
                Registrar Movimiento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Barra de búsqueda */}
        <div className="flex items-center space-x-2 mb-4 px-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en inventario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Sección 1: Stock Actual de Productos */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-[1400px]">
            {/* Header del contenedor */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Stock Actual de Productos</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">Inventario actual generado automáticamente desde los movimientos</p>
            </div>
            
            {/* Tabla de stock actual */}
            <div className="p-6">
              <TableGlobal
                data={filteredInventory}
                columns={stockColumns}
                emptyMessage={
                  searchTerm
                    ? "No se encontraron productos con ese criterio de búsqueda"
                    : "No hay productos en inventario"
                }
                pagination={{
                  enabled: true,
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 50],
                  showSizeChanger: true,
                  showTotal: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Movimientos de Inventario */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-[1400px]">
            {/* Header del contenedor */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Movimientos de Inventario</h2>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={getDataMovements} size="sm" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Actualizar
                  </Button>
                  <Button onClick={() => {
                    // Abrir modal de movimiento sin producto específico
                    openMovementModal({
                      id: 0,
                      id_producto: 0,
                      producto_nombre: '',
                      categoria: '',
                      cantidad: 0,
                      estado: '',
                      fecha_actualizacion: '',
                      precio_venta: 0
                    });
                    setMovementForm({ cantidad: 0, precio_unitario: 0 });
                  }} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Movimiento
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Gestiona el inventario registrando entradas de stock. Las salidas se registran automáticamente desde las ventas.</p>
            </div>
            
            {/* Tabla de movimientos */}
            <div className="p-6">
              <TableGlobal
                data={movements}
                columns={movementsColumns}
                emptyMessage="No hay movimientos registrados"
                pagination={{
                  enabled: true,
                  pageSize: 10,
                  pageSizeOptions: [5, 10, 20, 50],
                  showSizeChanger: true,
                  showTotal: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Resumen en contenedor estilizado */}
        <div className="px-6 mt-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-[1400px]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#c9184a' }}>
                  {inventory.length}
                </div>
                <div className="text-sm" style={{ color: '#c9184a' }}>Productos en Inventario</div>
                {searchTerm && (
                  <div className="text-xs text-gray-400 mt-1">
                    {filteredInventory.length} filtrados
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#218380' }}>
                  {inventory.reduce((acc, entry) => acc + entry.cantidad, 0)}
                </div>
                <div className="text-sm" style={{ color: '#218380' }}>Unidades Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#47126b' }}>
                  ${inventory.reduce((acc, entry) => acc + (entry.precio_venta || 0) * entry.cantidad, 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm" style={{ color: '#47126b' }}>Valor Total Inventario</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#b9375e' }}>
                  {movements.length}
                </div>
                <div className="text-sm" style={{ color: '#b9375e' }}>Movimientos Registrados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación para eliminar */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteEntry}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la entrada de inventario{" "}
                <strong>{entryToDelete?.producto_nombre}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteEntry}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteEntry}
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

export default Inventory;
