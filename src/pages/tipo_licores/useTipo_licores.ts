import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  getTipoLicores,
  createTipoLicor,
  updateTipoLicor,
  deleteTipoLicor,
} from "../../core/services/tipo_licores.service.ts";

// Interfaces para los datos del backend y frontend
interface TipoLicorFromAPI {
  id_tipo_licor: number;
  nombre: string;
}

export interface TipoLicor {
  id: number;
  nombre: string;
}

// Mapear datos del backend al frontend
const mapTipoLicorFromAPI = (apiTipo: TipoLicorFromAPI): TipoLicor => ({
  id: apiTipo.id_tipo_licor,
  nombre: apiTipo.nombre,
});

const useTipoLicores = () => {
  const [tipos, setTipos] = useState<TipoLicor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTipoId, setEditingTipoId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tipoToDelete, setTipoToDelete] = useState<TipoLicor | null>(null);
  const [newTipo, setNewTipo] = useState({ nombre: "" });
  const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

  useEffect(() => {
    getDataTipoLicores();
  }, []);

  const getDataTipoLicores = async () => {
    try {
      const response = await getTipoLicores();
      const mapped = response.data.map((apiTipo: TipoLicorFromAPI) =>
        mapTipoLicorFromAPI(apiTipo)
      );
      setTipos(mapped);
    } catch (error) {
      toast.error("Error al obtener los tipos de licores");
    }
  };

  // Filtrar por búsqueda
  const filteredTipos = useMemo(() => {
    return tipos.filter((tipo) =>
      tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tipos, searchTerm]);

  // Abrir modal de creación
  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingTipoId(null);
    reset();
    setIsModalOpen(true);
  };

  // Abrir modal de edición
  const openEditModal = (tipo: TipoLicor) => {
    setIsEditMode(true);
    setEditingTipoId(tipo.id);
    setNewTipo({ nombre: tipo.nombre });
    setValue("nombre", tipo.nombre);
    setIsModalOpen(true);
  };

  // Crear o actualizar tipo de licor
  const onSubmit = async (data: any) => {
    try {
      if (isEditMode && editingTipoId) {
        await updateTipoLicor({ id: editingTipoId, ...data });
        toast.success("Tipo de licor actualizado");
      } else {
        await createTipoLicor(data);
        toast.success("Tipo de licor creado");
      }
      reset();
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingTipoId(null);
      await getDataTipoLicores();
    } catch (error) {
      toast.error(isEditMode ? "Error al actualizar" : "Error al crear");
    }
  };

  // Abrir diálogo de eliminación
  const openDeleteDialog = (tipo: TipoLicor) => {
    setTipoToDelete(tipo);
    setIsDeleteDialogOpen(true);
  };

  // Confirmar eliminación
  const confirmDeleteTipo = async () => {
    if (!tipoToDelete) return;
    try {
      await deleteTipoLicor(tipoToDelete.id);
      await getDataTipoLicores();
      toast.success("Tipo de licor eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    } finally {
      setIsDeleteDialogOpen(false);
      setTipoToDelete(null);
    }
  };

  // Cancelar eliminación
  const cancelDeleteTipo = () => {
    setIsDeleteDialogOpen(false);
    setTipoToDelete(null);
  };

  return {
    tipos,
    filteredTipos,
    isModalOpen,
    isEditMode,
    isDeleteDialogOpen,
    tipoToDelete,
    newTipo,
    setIsModalOpen,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    confirmDeleteTipo,
    cancelDeleteTipo,
    onSubmit,
    searchTerm,
    setSearchTerm,
    register,
    handleSubmitForm,
  };
};

export default useTipoLicores;