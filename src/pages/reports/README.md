# 📊 Módulo de Reportes y Análisis

Sistema completo de reportes con gráficas interactivas usando **Recharts**.

## 📋 Reportes Implementados

### 1. **Estadísticas del Dashboard**
- Total de ventas (cantidad y monto)
- Total de productos en catálogo
- Total de clientes registrados
- Productos con stock bajo (< 10 unidades)

### 2. **Ventas por Período**
- Gráfica de línea temporal
- Muestra cantidad de ventas y monto total
- Selector de período: 7, 15, 30, 60, 90 días
- Actualización dinámica

### 3. **Top Productos Más Vendidos**
- Gráfica de barras horizontales
- Top 10 productos por cantidad vendida
- Muestra nombre del producto y cantidad

### 4. **Ventas por Cliente**
- Gráfica de pastel (pie chart)
- Top 5 clientes con más compras
- Muestra distribución de ventas

### 5. **Ventas por Usuario (Vendedor)**
- Gráfica de barras
- Desempeño del equipo de ventas
- Total de ventas por usuario

### 6. **Ventas por Tipo de Licor**
- Gráfica de pastel
- Distribución por categoría de licor
- Monto total por tipo

### 7. **Análisis de Utilidad**
- Tabla detallada
- Precio de compra vs precio de venta
- Porcentaje de utilidad
- Ganancia potencial por stock actual

### 8. **Estado del Inventario**
- Tabla completa del inventario
- Cantidad en stock
- Valor total del stock
- Estados: Alto, Medio, Bajo

## 🎨 Características

### Gráficas Interactivas
- **LineChart**: Ventas por período
- **BarChart**: Top productos y ventas por usuario
- **PieChart**: Distribución por clientes y tipos de licor
- **Tooltips**: Información detallada al pasar el mouse
- **Responsive**: Se adaptan a cualquier tamaño de pantalla

### Colores Corporativos
```javascript
const COLORS = [
  '#b9375e',  // Rosa/Magenta
  '#218380',  // Verde azulado
  '#47126b',  // Púrpura oscuro
  '#c9184a',  // Rosa intenso
  '#ff6b6b',  // Rojo claro
  '#4ecdc4',  // Turquesa
  '#45b7d1',  // Azul claro
  '#f7b731'   // Amarillo
];
```

### Formato de Moneda
```javascript
formatCurrency(1000000) // "$1.000.000"
// Formato: COP (Pesos Colombianos)
```

## 🚀 Uso

### Importar el componente
```typescript
import Reports from '@/pages/reports/reports';
```

### Funciones del Hook
```typescript
const {
  isLoading,           // Estado de carga
  dashboardStats,      // Estadísticas generales
  salesByPeriod,       // Ventas por período
  topProducts,         // Top productos
  salesByClient,       // Ventas por cliente
  inventoryStatus,     // Estado del inventario
  salesByUser,         // Ventas por usuario
  salesByLicorType,    // Ventas por tipo de licor
  profitAnalysis,      // Análisis de utilidad
  selectedPeriod,      // Período seleccionado
  handlePeriodChange,  // Cambiar período
  loadAllData          // Recargar todos los datos
} = useReports();
```

## 📡 Endpoints del Backend

### Base URL: `/api/reports`

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/dashboard-stats` | GET | Estadísticas generales |
| `/sales-by-period?days=30` | GET | Ventas por período |
| `/top-products?limit=10` | GET | Top productos más vendidos |
| `/sales-by-client?limit=10` | GET | Ventas por cliente |
| `/inventory-status` | GET | Estado del inventario |
| `/sales-by-user` | GET | Ventas por usuario |
| `/sales-by-licor-type` | GET | Ventas por tipo de licor |
| `/profit-analysis` | GET | Análisis de utilidad |

## 🔧 Archivos del Sistema

### Backend
```
back-licorera/src/
├── controllers/
│   └── reportsController.js    # Lógica de reportes
└── routes/
    └── reports.js               # Rutas de reportes
```

### Frontend
```
licorera/src/
├── pages/
│   └── reports/
│       ├── reports.tsx          # Componente principal
│       ├── useReports.ts        # Hook personalizado
│       └── README.md            # Documentación
├── core/
│   └── services/
│       └── reports.service.ts   # Servicios API
└── components/
    └── ui/
        └── card.tsx             # Componente Card
```

## 📊 Estructura de Datos

### Dashboard Stats
```typescript
{
  total_ventas: number;
  monto_total_ventas: number;
  total_productos: number;
  total_clientes: number;
  productos_stock_bajo: number;
}
```

### Ventas por Período
```typescript
{
  fecha: string;
  cantidad_ventas: number;
  total_ventas: number;
}[]
```

### Top Productos
```typescript
{
  id_producto: number;
  nombre: string;
  tipo_licor: string;
  veces_vendido: number;
  cantidad_total: number;
  ventas_totales: number;
}[]
```

### Análisis de Utilidad
```typescript
{
  id_producto: number;
  nombre: string;
  precio_compra: number;
  precio_venta: number;
  porcentaje_utilidad: number;
  ganancia_unitaria: number;
  stock_actual: number;
  ganancia_potencial: number;
}[]
```

## 🎯 Próximas Mejoras

- [ ] Exportar reportes a PDF
- [ ] Exportar datos a Excel
- [ ] Gráficas comparativas por períodos
- [ ] Filtros avanzados por fecha
- [ ] Reportes personalizados
- [ ] Programación de reportes automáticos
- [ ] Notificaciones de métricas importantes

## 💡 Ejemplos de Uso

### Cambiar período de ventas
```typescript
<Select 
  value={selectedPeriod.toString()} 
  onValueChange={(value) => handlePeriodChange(parseInt(value))}
>
  <SelectItem value="7">Últimos 7 días</SelectItem>
  <SelectItem value="30">Últimos 30 días</SelectItem>
</Select>
```

### Recargar datos manualmente
```typescript
<Button onClick={loadAllData} disabled={isLoading}>
  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
  Actualizar
</Button>
```

## 🔐 Seguridad

- Todos los endpoints requieren autenticación
- Los datos se filtran según permisos del usuario
- Validación de parámetros en el backend

## 📱 Responsive Design

Las gráficas se adaptan automáticamente a:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🎨 Personalización

### Cambiar colores de las gráficas
Edita el array `COLORS` en `reports.tsx`:
```typescript
const COLORS = ['#color1', '#color2', '#color3'];
```

### Modificar límites de datos
En `useReports.ts`:
```typescript
const loadTopProducts = async () => {
  const response = await getTopProducts(20); // Cambiar límite
  setTopProducts(response.data);
};
```

---

✨ **¡Módulo de Reportes Completo!** ✨

