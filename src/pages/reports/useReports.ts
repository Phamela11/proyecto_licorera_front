import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    getDashboardStats,
    getSalesByPeriod,
    getTopProducts,
    getSalesByClient,
    getInventoryStatus,
    getSalesByUser,
    getSalesByLicorType,
    getProfitAnalysis
} from '@/core/services/reports.service';
import { getCostosOperativos } from '@/core/services/costosOperativos.service';

export const useReports = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dashboardStats, setDashboardStats] = useState<any>(null);
    const [salesByPeriod, setSalesByPeriod] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [salesByClient, setSalesByClient] = useState<any[]>([]);
    const [inventoryStatus, setInventoryStatus] = useState<any[]>([]);
    const [salesByUser, setSalesByUser] = useState<any[]>([]);
    const [salesByLicorType, setSalesByLicorType] = useState<any[]>([]);
    const [profitAnalysis, setProfitAnalysis] = useState<any[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [costosOperativos, setCostosOperativos] = useState<any[]>([]);
    const [productosPeriodo, setProductosPeriodo] = useState<'diario' | 'semanal' | 'mensual'>('mensual');

    // Cargar estadísticas del dashboard
    const loadDashboardStats = async () => {
        try {
            const response = await getDashboardStats();
            setDashboardStats(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            toast.error('Error al cargar estadísticas del dashboard');
        }
    };

    // Cargar ventas por período
    const loadSalesByPeriod = async (days: number = 30) => {
        try {
            const response = await getSalesByPeriod(days);
            setSalesByPeriod(response.data);
        } catch (error) {
            console.error('Error al cargar ventas por período:', error);
            toast.error('Error al cargar ventas por período');
        }
    };

    // Cargar top productos
    const loadTopProducts = async (periodo: string = 'mensual') => {
        try {
            const response = await getTopProducts(4, periodo);
            setTopProducts(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            toast.error('Error al cargar productos más vendidos');
        }
    };

    // Cambiar período de productos
    const handleProductosPeriodoChange = async (periodo: 'diario' | 'semanal' | 'mensual') => {
        setProductosPeriodo(periodo);
        await loadTopProducts(periodo);
    };

    // Cargar ventas por cliente
    const loadSalesByClient = async () => {
        try {
            const response = await getSalesByClient(10);
            setSalesByClient(response.data);
        } catch (error) {
            console.error('Error al cargar ventas por cliente:', error);
            toast.error('Error al cargar ventas por cliente');
        }
    };

    // Cargar estado del inventario
    const loadInventoryStatus = async () => {
        try {
            const response = await getInventoryStatus();
            setInventoryStatus(response.data);
        } catch (error) {
            console.error('Error al cargar inventario:', error);
            toast.error('Error al cargar estado del inventario');
        }
    };

    // Cargar ventas por usuario
    const loadSalesByUser = async () => {
        try {
            const response = await getSalesByUser();
            setSalesByUser(response.data);
        } catch (error) {
            console.error('Error al cargar ventas por usuario:', error);
            toast.error('Error al cargar ventas por usuario');
        }
    };

    // Cargar ventas por tipo de licor
    const loadSalesByLicorType = async () => {
        try {
            const response = await getSalesByLicorType();
            setSalesByLicorType(response.data);
        } catch (error) {
            console.error('Error al cargar ventas por tipo de licor:', error);
            toast.error('Error al cargar ventas por tipo de licor');
        }
    };

    // Cargar análisis de utilidad
    const loadProfitAnalysis = async () => {
        try {
            const response = await getProfitAnalysis();
            setProfitAnalysis(response.data);
        } catch (error) {
            console.error('Error al cargar análisis de utilidad:', error);
            toast.error('Error al cargar análisis de utilidad');
        }
    };

    // Cargar costos operativos del mes actual
    const loadCostosOperativos = async () => {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            
            const fecha_inicio = firstDayOfMonth.toISOString().split('T')[0];
            const fecha_fin = lastDayOfMonth.toISOString().split('T')[0];
            
            const response = await getCostosOperativos({
                fecha_inicio,
                fecha_fin
            });
            // El servicio retorna { success, message, total, data }
            // response es el objeto completo, response.data es el array de costos
            const costosArray = (response && response.data && Array.isArray(response.data)) 
                ? response.data 
                : [];
            setCostosOperativos(costosArray);
        } catch (error: any) {
            // Silenciar el error para no mostrar en consola, solo dejar array vacío
            if (error?.response?.status !== 404) {
                console.error('Error al cargar costos operativos:', error);
            }
            setCostosOperativos([]);
        }
    };

    // Cargar todos los datos
    const loadAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                loadDashboardStats(),
                loadSalesByPeriod(selectedPeriod),
                loadTopProducts(productosPeriodo),
                loadSalesByClient(),
                loadInventoryStatus(),
                loadSalesByUser(),
                loadSalesByLicorType(),
                loadProfitAnalysis(),
                loadCostosOperativos()
            ]);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Cambiar período de ventas
    const handlePeriodChange = async (days: number) => {
        setSelectedPeriod(days);
        await loadSalesByPeriod(days);
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        loadAllData();
    }, []);

    // Calcular métricas financieras
    const ingresosTotales = dashboardStats?.monto_total_ventas || 0;
    const totalCostosOperativos = Array.isArray(costosOperativos) 
        ? costosOperativos.reduce((sum, costo) => {
            const monto = typeof costo.monto === 'string' ? parseFloat(costo.monto) : (costo.monto || 0);
            return sum + (isNaN(monto) ? 0 : monto);
          }, 0)
        : 0;
    const gananciaNeta = ingresosTotales - totalCostosOperativos;
    const margenGanancia = ingresosTotales > 0 ? ((gananciaNeta / ingresosTotales) * 100) : 0;

    return {
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
        loadAllData,
        // Métricas financieras
        ingresosTotales,
        totalCostosOperativos,
        gananciaNeta,
        margenGanancia,
        // Productos
        productosPeriodo,
        handleProductosPeriodoChange
    };
};

