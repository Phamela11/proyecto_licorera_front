import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReports } from './useReports';

// Colores para las gráficas
const COLORS = ['#b9375e', '#218380', '#47126b', '#c9184a', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];

// Formato de moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const Reports = () => {
  const {
    isLoading,
    dashboardStats,
    salesByPeriod,
    topProducts,
    salesByClient,
    inventoryStatus,
    salesByUser,
    salesByLicorType,
    profitAnalysis,
    selectedPeriod,
    handlePeriodChange,
    loadAllData
  } = useReports();

  if (isLoading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes y Análisis</h1>
          <p className="text-muted-foreground">
            Estadísticas y métricas del negocio
          </p>
        </div>
        <Button onClick={loadAllData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas Generales */}
      {dashboardStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-800">Total Ventas</CardTitle>
              <DollarSign className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">
                {formatCurrency(dashboardStats.monto_total_ventas)}
              </div>
              <p className="text-xs text-pink-600 mt-1">
                {dashboardStats.total_ventas} transacciones
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-white border-teal-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-800">Productos</CardTitle>
              <Package className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {dashboardStats.total_productos}
              </div>
              <p className="text-xs text-teal-600 mt-1">
                En catálogo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Clientes</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {dashboardStats.total_clientes}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Clientes registrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {dashboardStats.productos_stock_bajo}
              </div>
              <p className="text-xs text-orange-600 mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ventas por Período */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ventas por Período</CardTitle>
              <CardDescription>Evolución de ventas en el tiempo</CardDescription>
            </div>
            <Select value={selectedPeriod.toString()} onValueChange={(value) => handlePeriodChange(parseInt(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="15">Últimos 15 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="60">Últimos 60 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByPeriod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'total_ventas') return [formatCurrency(value), 'Monto'];
                  return [value, 'Cantidad'];
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cantidad_ventas" stroke="#218380" name="Cantidad de Ventas" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="total_ventas" stroke="#b9375e" name="Monto Total" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Productos y Ventas por Cliente */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Productos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>Top 10 productos por cantidad</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nombre" type="category" width={100} />
                <Tooltip formatter={(value: any) => value} />
                <Bar dataKey="cantidad_total" fill="#b9375e" name="Cantidad Vendida" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas por Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clientes</CardTitle>
            <CardDescription>Clientes con más compras</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByClient.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.nombre}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_compras"
                >
                  {salesByClient.slice(0, 5).map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ventas por Usuario y Tipo de Licor */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Ventas por Usuario */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Usuario</CardTitle>
            <CardDescription>Desempeño del equipo de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByUser}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="total_ventas" fill="#218380" name="Total Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas por Tipo de Licor */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Tipo de Licor</CardTitle>
            <CardDescription>Distribución por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByLicorType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.nombre}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_ventas"
                >
                  {salesByLicorType.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Utilidad */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Utilidad</CardTitle>
          <CardDescription>Productos con mayor ganancia potencial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Producto</th>
                  <th className="text-right p-2">Precio Compra</th>
                  <th className="text-right p-2">Precio Venta</th>
                  <th className="text-right p-2">Utilidad %</th>
                  <th className="text-right p-2">Stock</th>
                  <th className="text-right p-2">Ganancia Potencial</th>
                </tr>
              </thead>
              <tbody>
                {profitAnalysis.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{item.nombre}</td>
                    <td className="text-right p-2">{formatCurrency(item.precio_compra)}</td>
                    <td className="text-right p-2">{formatCurrency(item.precio_venta)}</td>
                    <td className="text-right p-2">
                      <Badge variant="secondary">{item.porcentaje_utilidad}%</Badge>
                    </td>
                    <td className="text-right p-2">{item.stock_actual}</td>
                    <td className="text-right p-2 font-bold text-green-600">
                      {formatCurrency(item.ganancia_potencial)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Inventario</CardTitle>
          <CardDescription>Productos ordenados por cantidad en stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Producto</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="text-right p-2">Precio Unitario</th>
                  <th className="text-right p-2">Valor Stock</th>
                  <th className="text-center p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStatus.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{item.producto_nombre}</td>
                    <td className="p-2 text-gray-600">{item.tipo_licor}</td>
                    <td className="text-right p-2">{item.cantidad}</td>
                    <td className="text-right p-2">{formatCurrency(item.precio_venta)}</td>
                    <td className="text-right p-2 font-bold">{formatCurrency(item.valor_stock)}</td>
                    <td className="text-center p-2">
                      <Badge 
                        variant={item.estado === 'bajo' ? 'destructive' : item.estado === 'medio' ? 'outline' : 'secondary'}
                      >
                        {item.estado === 'bajo' && '⚠️ Bajo'}
                        {item.estado === 'medio' && '📦 Medio'}
                        {item.estado === 'alto' && '✅ Alto'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
