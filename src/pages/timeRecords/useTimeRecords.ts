import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { 
    createTimeRecord, 
    getTimeRecords, 
    updateTimeRecord, 
    deleteTimeRecord 
} from "@/core/services/timeRecords.service";

// Función para formatear fecha
const formatDate = (dateString: string): string => {
    try {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn('Fecha inválida:', dateString);
            return dateString;
        }
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return dateString;
    }
};

// Función para formatear hora
const formatTime = (timeString: string | null): string => {
    if (!timeString) return '-';
    return timeString;
};

// Función para formatear horas trabajadas
const formatHours = (horas: number | null): string => {
    if (horas === null || horas === undefined) return '-';
    return `${Number(horas).toFixed(2)}h`;
};

// Función para mapear datos del backend al frontend
const mapTimeRecordFromAPI = (apiRecord: TimeRecordFromAPI): TimeRecord => ({
    id: apiRecord.id_registro,
    fecha: formatDate(apiRecord.fecha),
    fecha_raw: apiRecord.fecha,
    empleado: apiRecord.empleado_nombre,
    empleado_id: apiRecord.id_empleado,
    entrada: formatTime(apiRecord.hora_entrada),
    salida: formatTime(apiRecord.hora_salida),
    descanso: apiRecord.descanso || 0,
    horas: formatHours(apiRecord.horas_trabajadas),
    estado: apiRecord.estado,
    observaciones: apiRecord.observaciones
});

// Interfaz para los datos que vienen del backend
interface TimeRecordFromAPI {
    id_registro: number;
    fecha: string;
    id_empleado: number;
    empleado_nombre: string;
    hora_entrada: string | null;
    hora_salida: string | null;
    descanso: number | null;
    horas_trabajadas: number | null;
    estado: string;
    observaciones?: string;
}

// Interfaz para el frontend
export interface TimeRecord {
    id: number;
    fecha: string;
    fecha_raw: string;
    empleado: string;
    empleado_id: number;
    entrada: string;
    salida: string;
    descanso: number;
    horas: string;
    estado: string;
    observaciones?: string;
}

const useTimeRecords = () => {
    const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<TimeRecord | null>(null);
    const [newRecord, setNewRecord] = useState({
        fecha: "",
        empleado_id: "",
        entrada: "",
        salida: "",
        descanso: "0",
        observaciones: "",
    });
    const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

    useEffect(() => {
        getDataTimeRecords();
    }, []);

    const getDataTimeRecords = async () => {
        try {
            const response = await getTimeRecords();
            console.log('Datos del backend:', response.data);
            
            const mappedRecords = response.data.map((apiRecord: TimeRecordFromAPI) => 
                mapTimeRecordFromAPI(apiRecord)
            );
            console.log('Datos mapeados:', mappedRecords);
            
            setTimeRecords(mappedRecords);
        } catch (error) {
            console.log(error);
            toast.error("Error al obtener los registros de horas");
        }
    };

    // Filtrar registros por término de búsqueda
    const filteredRecords = useMemo(() => {
        return timeRecords.filter(
            (record) =>
                record.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.estado.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [timeRecords, searchTerm]);

    // Función para abrir modal de creación
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingRecordId(null);
        reset();
        setNewRecord({
            fecha: "",
            empleado_id: "",
            entrada: "",
            salida: "",
            descanso: "0",
            observaciones: "",
        });
        setIsModalOpen(true);
    };

    // Función para abrir modal de edición
    const openEditModal = (record: TimeRecord) => {
        setIsEditMode(true);
        setEditingRecordId(record.id);
        
        const descansoValue = record.descanso !== null && record.descanso !== undefined ? record.descanso : 0;
        
        setNewRecord({
            fecha: record.fecha_raw,
            empleado_id: record.empleado_id.toString(),
            entrada: record.entrada === '-' ? '' : record.entrada,
            salida: record.salida === '-' ? '' : record.salida,
            descanso: descansoValue.toString(),
            observaciones: record.observaciones || "",
        });
        
        setValue('fecha', record.fecha_raw.split('T')[0]);
        setValue('empleado_id', record.empleado_id);
        setValue('entrada', record.entrada === '-' ? '' : record.entrada);
        setValue('salida', record.salida === '-' ? '' : record.salida);
        setValue('descanso', descansoValue);
        setValue('observaciones', record.observaciones || '');
        setIsModalOpen(true);
    };

    // Crear o actualizar registro
    const onSubmit = async (data: any) => {
        try {
            // Validar que hora_entrada no esté vacía
            if (!data.entrada) {
                toast.error("La hora de entrada es obligatoria");
                return;
            }

            const recordData = {
                fecha: data.fecha,
                empleado_id: Number(data.empleado_id),
                hora_entrada: data.entrada,
                hora_salida: data.salida || null,
                descanso: Number(data.descanso) || 0,
                observaciones: data.observaciones || null
            };

            if (isEditMode && editingRecordId) {
                await updateTimeRecord({ ...recordData, id: editingRecordId });
                toast.success("Registro actualizado exitosamente");
            } else {
                await createTimeRecord(recordData);
                toast.success("Registro creado exitosamente");
            }
            
            reset();
            setNewRecord({
                fecha: "",
                empleado_id: "",
                entrada: "",
                salida: "",
                descanso: "0",
                observaciones: "",
            });
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingRecordId(null);
            await getDataTimeRecords();
            
        } catch (error) {
            console.log(error);
            toast.error(isEditMode ? "Error al actualizar el registro" : "Error al crear el registro");
        }
    };

    // Abrir modal de confirmación de eliminación
    const openDeleteDialog = (record: TimeRecord) => {
        setRecordToDelete(record);
        setIsDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDeleteRecord = async () => {
        if (!recordToDelete) return;
        
        try {
            await deleteTimeRecord(recordToDelete.id);
            await getDataTimeRecords();
            toast.success("Registro eliminado exitosamente");
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el registro");
        } finally {
            setIsDeleteDialogOpen(false);
            setRecordToDelete(null);
        }
    };

    // Cancelar eliminación
    const cancelDeleteRecord = () => {
        setIsDeleteDialogOpen(false);
        setRecordToDelete(null);
    };

    return {
        timeRecords,
        filteredRecords,
        isModalOpen,
        isEditMode,
        isDeleteDialogOpen,
        recordToDelete,
        newRecord,
        setIsModalOpen,
        openCreateModal,
        openEditModal,
        openDeleteDialog,
        confirmDeleteRecord,
        cancelDeleteRecord,
        onSubmit,
        searchTerm,
        setSearchTerm,
        register,
        handleSubmitForm
    };
};

export default useTimeRecords;

