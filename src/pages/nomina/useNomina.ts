import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { 
    getNominas,
    createNomina,
    updateNomina,
    deleteNomina,
    calcularHorasPorEmpleado
} from "@/core/services/nomina.service";
import { getUsers } from "@/core/services/users.service";

// Función para formatear fecha
const formatDate = (dateString: string): string => {
    try {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return dateString;
    }
};

// Interfaz para los datos que vienen del backend
interface NominaFromAPI {
    id_nomina: number;
    id_usuario: number;
    empleado_nombre?: string;
    total_horas: number;
    fecha_pago: string;
    periodo: string;
    monto: number;
    bono: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado?: string;
    valor_hora?: number;
}

// Interfaz para el frontend
export interface Nomina {
    id: number;
    empleado: string;
    empleado_id: number;
    total_horas: number;
    fecha_pago: string;
    fecha_pago_raw: string;
    periodo: string;
    monto: number;
    bono: number;
    valor_hora: number;
    estado: string;
    fecha_inicio_raw: string;
    fecha_fin_raw: string;
}

// Interfaz para empleados
export interface Empleado {
    id: number;
    nombre: string;
    valor_hora: number;
}

// Función para mapear datos del backend al frontend
const mapNominaFromAPI = (apiNomina: NominaFromAPI): Nomina => ({
    id: apiNomina.id_nomina,
    empleado: apiNomina.empleado_nombre || 'Sin nombre',
    empleado_id: apiNomina.id_usuario,
    total_horas: apiNomina.total_horas,
    fecha_pago: formatDate(apiNomina.fecha_pago),
    fecha_pago_raw: apiNomina.fecha_pago,
    periodo: apiNomina.periodo,
    monto: Number(apiNomina.monto),
    bono: Number(apiNomina.bono || 0),
    valor_hora: Number(apiNomina.valor_hora || 0),
    estado: apiNomina.estado || 'Pendiente',
    fecha_inicio_raw: apiNomina.fecha_inicio,
    fecha_fin_raw: apiNomina.fecha_fin,
});

const useNomina = () => {
    const [nominas, setNominas] = useState<Nomina[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingNominaId, setEditingNominaId] = useState<number | null>(null);
    const [newNomina, setNewNomina] = useState({
        id_usuario: "",
        fecha_inicio: "",
        fecha_fin: "",
        fecha_pago: "",
        total_horas: 0,
        monto: 0,
        bono: 0,
        periodo: "",
        estado: "pendiente",
    });

    const { register, handleSubmit: handleSubmitForm, reset, setValue, watch } = useForm();

    // Observar cambios en la fecha de pago para actualizar el período automáticamente
    const fechaPago = watch('fecha_pago');

    useEffect(() => {
        getDataNominas();
        getDataEmpleados();
    }, []);

    // Función para generar período automáticamente basado en la fecha de pago
    const generarPeriodoDesdeFecha = (fecha: string): string => {
        if (!fecha) return '';
        try {
            const date = new Date(fecha);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // getMonth() devuelve 0-11, necesitamos 1-12
            return `${year}-${String(month).padStart(2, '0')}`;
        } catch (error) {
            return '';
        }
    };

    // Efecto para actualizar el período cuando cambie la fecha de pago
    useEffect(() => {
        if (fechaPago) {
            const periodoGenerado = generarPeriodoDesdeFecha(fechaPago);
            setValue('periodo', periodoGenerado);
            setNewNomina(prev => ({ ...prev, periodo: periodoGenerado }));
        }
    }, [fechaPago, setValue]);

    const getDataNominas = async () => {
        try {
            const response = await getNominas();
            console.log('Datos de nóminas del backend:', response.data);
            
            const mappedNominas = response.data.map((apiNomina: NominaFromAPI) => 
                mapNominaFromAPI(apiNomina)
            );
            
            setNominas(mappedNominas);
        } catch (error) {
            console.log('Error al obtener nóminas:', error);
            setNominas([]);
        }
    };

    const getDataEmpleados = async () => {
        try {
            const response = await getUsers();
            const mappedEmpleados = response.data.map((user: any) => ({
                id: user.id_usuario,
                nombre: user.nombre,
                valor_hora: user.valor_hora || 0
            }));
            setEmpleados(mappedEmpleados);
        } catch (error) {
            console.log('Error al obtener empleados:', error);
            toast.error("Error al obtener la lista de empleados");
        }
    };

    // Calcular horas trabajadas desde registro_horas
    const handleCalcularHoras = async (empleadoId: number, fechaInicio: string, fechaFin: string) => {
        try {
            const response = await calcularHorasPorEmpleado(empleadoId, fechaInicio, fechaFin);
            const datos = response.data;
            
            setValue('total_horas', datos.total_horas || 0);
            setValue('monto', datos.monto_total || 0);
            
            // El período se generará automáticamente cuando se seleccione la fecha de pago
            // Si ya hay una fecha de pago, generar el período
            const fechaPagoActual = watch('fecha_pago');
            if (fechaPagoActual) {
                const periodo = generarPeriodoDesdeFecha(fechaPagoActual);
                setValue('periodo', periodo);
                setNewNomina(prev => ({
                    ...prev,
                    total_horas: datos.total_horas || 0,
                    monto: datos.monto_total || 0,
                    periodo: periodo
                }));
            } else {
                setNewNomina(prev => ({
                    ...prev,
                    total_horas: datos.total_horas || 0,
                    monto: datos.monto_total || 0
                }));
            }
            
            toast.success(`Total: ${datos.total_horas} horas trabajadas`);
        } catch (error) {
            console.log(error);
            toast.error("Error al calcular las horas");
        }
    };

    // Abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingNominaId(null);
        reset();
        setNewNomina({
            id_usuario: "",
            fecha_inicio: "",
            fecha_fin: "",
            fecha_pago: "",
            total_horas: 0,
            monto: 0,
            bono: 0,
            periodo: "",
            estado: "pendiente",
        });
        setIsModalOpen(true);
    };

    // Abrir modal de edición
    const openEditModal = (nomina: Nomina) => {
        setIsEditMode(true);
        setEditingNominaId(nomina.id);
        
        const fechaPagoFormatted = nomina.fecha_pago_raw.split('T')[0];
        // Generar período automáticamente basado en la fecha de pago
        const periodoGenerado = generarPeriodoDesdeFecha(fechaPagoFormatted);
        
        const nominaData = {
            id_usuario: nomina.empleado_id.toString(),
            fecha_inicio: nomina.fecha_inicio_raw.split('T')[0],
            fecha_fin: nomina.fecha_fin_raw.split('T')[0],
            fecha_pago: fechaPagoFormatted,
            total_horas: nomina.total_horas,
            monto: nomina.monto,
            bono: nomina.bono,
            periodo: periodoGenerado,
            estado: nomina.estado,
        };
        
        setNewNomina(nominaData);
        setValue('id_usuario', nomina.empleado_id);
        setValue('fecha_inicio', nomina.fecha_inicio_raw.split('T')[0]);
        setValue('fecha_fin', nomina.fecha_fin_raw.split('T')[0]);
        setValue('fecha_pago', fechaPagoFormatted);
        setValue('total_horas', nomina.total_horas);
        setValue('monto', nomina.monto);
        setValue('bono', nomina.bono);
        setValue('periodo', periodoGenerado);
        setValue('estado', nomina.estado);
        
        setIsModalOpen(true);
    };

    // Crear o actualizar nómina
    const onSubmit = async (data: any) => {
        try {
            if (!data.id_usuario || !data.fecha_inicio || !data.fecha_fin || !data.fecha_pago) {
                toast.error("Por favor completa todos los campos obligatorios");
                return;
            }

            // Generar período automáticamente basado en la fecha de pago si no existe
            let periodoFinal = data.periodo;
            if (!periodoFinal || periodoFinal.trim() === '') {
                periodoFinal = generarPeriodoDesdeFecha(data.fecha_pago);
            } else {
                // Validar que el período coincida con la fecha de pago
                const periodoEsperado = generarPeriodoDesdeFecha(data.fecha_pago);
                if (periodoFinal !== periodoEsperado) {
                    // Si no coincide, usar el generado automáticamente
                    periodoFinal = periodoEsperado;
                }
            }

            const nominaData = {
                id_usuario: Number(data.id_usuario),
                fecha_inicio: data.fecha_inicio,
                fecha_fin: data.fecha_fin,
                fecha_pago: data.fecha_pago,
                total_horas: Number(data.total_horas || 0),
                monto: Number(data.monto || 0),
                bono: Number(data.bono || 0),
                periodo: periodoFinal,
                estado: data.estado || 'pendiente'
            };

            if (isEditMode && editingNominaId) {
                await updateNomina({ ...nominaData, id: editingNominaId });
                toast.success("Nómina actualizada exitosamente");
            } else {
                await createNomina(nominaData);
                toast.success("Nómina creada exitosamente");
            }
            
            reset();
            setNewNomina({
                id_usuario: "",
                fecha_inicio: "",
                fecha_fin: "",
                fecha_pago: "",
                total_horas: 0,
                monto: 0,
                bono: 0,
                periodo: "",
                estado: "pendiente",
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingNominaId(null);
            await getDataNominas();
            
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? "Error al actualizar la nómina" : "Error al crear la nómina");
        }
    };

    // Cambiar estado de nómina directamente desde la tabla
    const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
        try {
            await updateNomina({ id, estado: nuevoEstado });
            toast.success(`Estado actualizado a: ${nuevoEstado}`);
            await getDataNominas();
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el estado");
        }
    };

    // Calcular estadísticas
    const totalPendiente = nominas
        .filter(n => n.estado.toLowerCase() === 'pendiente')
        .reduce((sum, n) => sum + n.monto + n.bono, 0);

    const totalPagado = nominas
        .filter(n => n.estado.toLowerCase() === 'pagado')
        .reduce((sum, n) => sum + n.monto + n.bono, 0);

    const totalRegistros = nominas.length;

    return {
        nominas,
        empleados,
        isModalOpen,
        isEditMode,
        newNomina,
        totalPendiente,
        totalPagado,
        totalRegistros,
        setIsModalOpen,
        openCreateModal,
        openEditModal,
        handleCalcularHoras,
        handleCambiarEstado,
        onSubmit,
        register,
        handleSubmitForm,
        watch,
        generarPeriodoDesdeFecha
    };
};

export default useNomina;
