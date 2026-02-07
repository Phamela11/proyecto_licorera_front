import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, RefreshCw, TrendingUp, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReports } from './useReports';

// Función para obtener colores específicos por estado de inventario
const getEstadoInventarioStyles = (estado: string) => {
  const estadoUpper = estado?.toUpperCase();
  
  switch (estadoUpper) {
    case "BAJO":
      return {
        backgroundColor: "#f8d7da",
        color: "#842029",
        hoverColor: "#f5c2c7",
        label: "Bajo"
      };
    case "MEDIO":
      return {
        backgroundColor: "#fcefb4",
        color: "#c36f09",
        hoverColor: "#f9e79f",
        label: "Medio"
      };
    case "ALTO":
      return {
        backgroundColor: "#d1e7dd",
        color: "#0a5827",
        hoverColor: "#badbcc",
        label: "Alto"
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

// Colores para las gráficas - Paleta del proyecto
const COLORS = ['#c9184a', '#218380', '#8f2d56', '#e05780', '#602437', '#ebb3a9', '#ff7aa2', '#218380'];

// Formato de moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Formato de fecha para el eje X
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

// Formato de fecha para el tooltip
const formatDateTooltip = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

const Reports = () => {
  const {
    isLoading,
    dashboardStats,
    salesByPeriod,
    topProducts,
    inventoryStatus,
    selectedPeriod,
    handlePeriodChange,
    loadAllData,
    ingresosTotales,
    totalCostosOperativos,
    gananciaNeta,
    margenGanancia,
    productosPeriodo,
    handleProductosPeriodoChange
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

      {/* Reportes Financieros */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Reportes Financieros</h2>
        <p className="text-muted-foreground mb-4">Análisis completo del desempeño financiero</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Ingresos Totales */}
          <Card className="bg-gradient-to-br from-[#c9184a] to-[#a01639] text-white border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(ingresosTotales)}
              </div>
              <p className="text-xs text-white/80 mt-1">
                Este mes
              </p>
            </CardContent>
          </Card>

          {/* Margen de Ganancia */}
          <Card className="bg-gradient-to-br from-[#218380] to-[#196663] text-white border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
              <Percent className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {margenGanancia.toFixed(1)}%
              </div>
              <p className="text-xs text-white/80 mt-1">
                Promedio mensual
              </p>
            </CardContent>
          </Card>

          {/* Costos Operativos */}
          <Card className="bg-gradient-to-br from-[#8f2d56] to-[#6d2241] text-white border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Costos Operativos</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalCostosOperativos)}
              </div>
              <p className="text-xs text-white/80 mt-1">
                Este mes
              </p>
            </CardContent>
          </Card>

          {/* Ganancia Neta */}
          <Card className="bg-gradient-to-br from-[#e05780] to-[#c04369] text-white border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(gananciaNeta)}
              </div>
              <p className="text-xs text-white/80 mt-1">
                Este mes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

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
              <XAxis 
                dataKey="fecha" 
                tickFormatter={formatDate}
                angle={-45}
                textAnchor="end"
                height={80}
                interval="preserveStartEnd"
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(label) => formatDateTooltip(label)}
                formatter={(value: any, name: string) => {
                  if (name === 'total_ventas') return [formatCurrency(value), 'Monto Total'];
                  return [value, 'Cantidad de Ventas'];
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cantidad_ventas" stroke="#218380" name="Cantidad de Ventas" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="total_ventas" stroke="#c9184a" name="Monto Total" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análisis de Rentabilidad */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Análisis de Rentabilidad</CardTitle>
              <CardDescription>Distribución de ganancias y productos más rentables</CardDescription>
            </div>
            <Select value={productosPeriodo} onValueChange={(value: 'diario' | 'semanal' | 'mensual') => handleProductosPeriodoChange(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diario</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensual">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            {/* Distribución de Ganancias - Gráfico de Dona */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Distribución de Ganancias</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    paddingAngle={5}
                    dataKey="ganancia"
                    label={(entry: any) => `${((entry?.margen_ganancia || 0) as number).toFixed(0)}%`}
                  >
                    {topProducts.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.nombre || ''}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => {
                      const data = entry.payload;
                      const margen = data?.margen_ganancia || 0;
                      return `${data?.nombre || value} - ${margen.toFixed(0)}%`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Productos Más Rentables */}
            <div className="max-w-xs">
              <h3 className="text-lg font-semibold mb-4">Productos Más Rentables</h3>
              <div className="space-y-2">
                {topProducts.length > 0 ? (
                  topProducts.map((producto) => {
                    return (
                      <div key={producto.id_producto} className="border rounded-lg p-2.5 bg-gray-50">
                        <div className="mb-1.5">
                          <h4 className="font-semibold text-sm text-gray-900">{producto.nombre}</h4>
                          <p className="text-xs text-gray-600">{producto.cantidad_total} unidades vendidas</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1.5">
                          <div>
                            <p className="text-xs text-gray-500">Ventas</p>
                            <p className="font-semibold text-sm text-gray-900">{formatCurrency(producto.ventas_totales || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Costo</p>
                            <p className="font-semibold text-sm text-red-600">{formatCurrency(producto.costo_total || 0)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Ganancia</p>
                            <p className="font-semibold text-sm text-green-600">{formatCurrency(producto.ganancia || 0)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay datos disponibles para el período seleccionado
                  </div>
                )}
              </div>
            </div>
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
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-sm text-gray-700 bg-gray-50">Producto</th>
                  <th className="text-left p-3 font-semibold text-sm text-gray-700 bg-gray-50">Tipo</th>
                  <th className="text-right p-3 font-semibold text-sm text-gray-700 bg-gray-50">Cantidad</th>
                  <th className="text-right p-3 font-semibold text-sm text-gray-700 bg-gray-50">Precio Unitario</th>
                  <th className="text-right p-3 font-semibold text-sm text-gray-700 bg-gray-50">Valor Stock</th>
                  <th className="text-center p-3 font-semibold text-sm text-gray-700 bg-gray-50">Estado</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStatus.map((item, index) => {
                  const estadoStyles = getEstadoInventarioStyles(item.estado);
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium text-gray-900">{item.producto_nombre}</td>
                      <td className="p-3 text-gray-600">{item.tipo_licor}</td>
                      <td className="text-right p-3 text-gray-900">{item.cantidad}</td>
                      <td className="text-right p-3 text-gray-700">{formatCurrency(item.precio_venta)}</td>
                      <td className="text-right p-3 font-bold text-gray-900">{formatCurrency(item.valor_stock)}</td>
                      <td className="text-center p-3">
                        <div
                          className="inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 border-0"
                          style={{
                            backgroundColor: estadoStyles.backgroundColor,
                            color: estadoStyles.color,
                            minWidth: '70px',
                            textAlign: 'center',
                            border: 'none',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = estadoStyles.hoverColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = estadoStyles.backgroundColor;
                          }}
                        >
                          {estadoStyles.label}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
