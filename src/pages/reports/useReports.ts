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
    const loadTopProducts = async () => {
        try {
            const response = await getTopProducts(10);
            setTopProducts(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            toast.error('Error al cargar productos más vendidos');
        }
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

    // Cargar todos los datos
    const loadAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                loadDashboardStats(),
                loadSalesByPeriod(selectedPeriod),
                loadTopProducts(),
                loadSalesByClient(),
                loadInventoryStatus(),
                loadSalesByUser(),
                loadSalesByLicorType(),
                loadProfitAnalysis()
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
        loadAllData
    };
};

