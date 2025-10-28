import { Plus, Edit, Trash2, Search, X } from "lucide-react";
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
import useProducts from "./useProducts";
import type { Product } from "./useProducts";
// Interfaz para el usuario

const Products = () => {
  const { 
    products, 
    filteredProducts, 
    isModalOpen, 
    isEditMode,
    isDeleteDialogOpen,
    productToDelete,
    newProduct, 
    setIsModalOpen, 
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    confirmDeleteProduct,
    cancelDeleteProduct,
    onSubmit, 
    searchTerm,
    setSearchTerm,
    register,
    handleSubmitForm,
    licorTypes,
    providers,
    setNewProduct,
    setValue
  } = useProducts();

  // Configuración de columnas para TableGlobal
  const productColumns: TableColumn<Product>[] = [
    {
      key: "nombre",
      title: "Nombre",
      width: "200px",
    },
    {
      key: "tipo_licor_nombre",
      title: "Tipo de Licor",
      width: "150px",
    },
    {
      key: "precio_compra",
      title: "Precio Compra",
      align: "center",
      width: "120px",
      render: (precio: number | string) => (
        <span className="font-medium text-green-600">
          ${Number(precio).toFixed(2)}
        </span>
      ),
    },
    {
      key: "precio_venta",
      title: "Precio Venta",
      align: "center",
      width: "120px",
      render: (precio: number | string) => (
        <span className="font-medium text-blue-600">
          ${Number(precio).toFixed(2)}
        </span>
      ),
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
      render: (_, record: Product) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(record)}
            title="Editar producto"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(record)}
            className="text-red-600 hover:text-red-700"
            title="Eliminar producto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      width: "80px",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el inventario de productos
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Producto
        </Button>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Editar Producto" : "Crear Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Modifica los datos del producto seleccionado."
                  : "Completa los datos para crear un nuevo producto en el inventario."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del producto *</Label>
                <Input
                  id="nombre"
                  defaultValue={newProduct.nombre}
                  {...register('nombre')}
                  placeholder="Ingresa el nombre del producto"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="id_tipo_licor">Tipo de Licor *</Label>
                <select
                  id="id_tipo_licor"
                  defaultValue={newProduct.id_tipo_licor || ""}
                  {...register('id_tipo_licor')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona el tipo de licor</option>
                  {licorTypes.map((licorType) => (
                    <option key={licorType.id_tipo_licor} value={licorType.id_tipo_licor}>{licorType.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="id_proveedores">Proveedores</Label>
                <div className="space-y-2">
                  <select
                    id="proveedor-select"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value);
                      if (selectedId && !newProduct.id_proveedores.includes(selectedId)) {
                        const updatedProveedores = [...newProduct.id_proveedores, selectedId];
                        setNewProduct(prev => ({ ...prev, id_proveedores: updatedProveedores }));
                        setValue('id_proveedores', updatedProveedores);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Selecciona un proveedor para agregar</option>
                    {providers
                      .filter(provider => !newProduct.id_proveedores.includes(provider.id_proveedor))
                      .map((provider) => (
                        <option key={provider.id_proveedor} value={provider.id_proveedor}>
                          {provider.nombre}
                        </option>
                      ))}
                  </select>
                  
                  {/* Mostrar proveedores seleccionados */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-gray-50">
                    {newProduct.id_proveedores.length === 0 ? (
                      <span className="text-sm text-gray-500">No hay proveedores seleccionados</span>
                    ) : (
                      newProduct.id_proveedores.map((proveedorId) => {
                        const proveedor = providers.find(p => p.id_proveedor === proveedorId);
                        return (
                          <Badge 
                            key={proveedorId} 
                            variant="secondary" 
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            {proveedor?.nombre}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedProveedores = newProduct.id_proveedores.filter(id => id !== proveedorId);
                                setNewProduct(prev => ({ ...prev, id_proveedores: updatedProveedores }));
                                setValue('id_proveedores', updatedProveedores);
                              }}
                              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Campo oculto para el formulario */}
                  <input
                    type="hidden"
                    {...register('id_proveedores')}
                    value={newProduct.id_proveedores.join(',')}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="precio_compra">Precio de Compra *</Label>
                <Input
                  id="precio_compra"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={newProduct.precio_compra}
                  {...register('precio_compra')}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="precio_venta">Precio de Venta *</Label>
                <Input
                  id="precio_venta"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={newProduct.precio_venta}
                  {...register('precio_venta')}
                  placeholder="0.00"
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
                {isEditMode ? "Actualizar Producto" : "Crear Producto"}
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
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabla de productos con TableGlobal */}
      <TableGlobal
        data={filteredProducts}
        columns={productColumns}
        emptyMessage={
          searchTerm
            ? "No se encontraron productos con ese criterio de búsqueda"
            : "No hay productos registrados"
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
          Total de productos: {products.length}
          {searchTerm && ` | Filtrados: ${filteredProducts.length}`}
        </div>
        <div>
          Valor total inventario: $
          {products.length > 0 
            ? products.reduce((acc, p) => acc + (Number(p.precio_venta) || 0), 0).toFixed(2)
            : "0.00"
          }
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={cancelDeleteProduct}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto{" "}
              <strong>{productToDelete?.nombre}</strong> del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteProduct}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
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

export default Products;