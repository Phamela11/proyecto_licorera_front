import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  getLicorTypes, 
  createLicorType, 
  updateLicorType, 
  deleteLicorType 
} from "@/core/services/licorType.service";

// Tipos que vienen del backend
interface LicorTypeFromAPI {
  id_tipo_licor: number;
  nombre: string;
}

// Tipos usados en el frontend
export interface LicorType {
  id: number;
  nombre: string;
}

const mapFromAPI = (api: LicorTypeFromAPI): LicorType => ({
  id: api.id_tipo_licor,
  nombre: api.nombre,
});

const useLicorTypes = () => {
  const [licorTypes, setLicorTypes] = useState<LicorType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [licorTypeToDelete, setLicorTypeToDelete] = useState<LicorType | null>(null);

  const { register, handleSubmit: handleSubmitForm, reset, setValue } = useForm();

  useEffect(() => {
    loadLicorTypes();
  }, []);

  const loadLicorTypes = async () => {
    try {
      const response = await getLicorTypes();
      const data = Array.isArray(response.data) ? response.data : response;
      const mapped = data.map((item: LicorTypeFromAPI) => mapFromAPI(item));
      setLicorTypes(mapped);
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los tipos de licor");
    }
  };

  const filteredLicorTypes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return licorTypes.filter((t) => t.nombre.toLowerCase().includes(term));
  }, [licorTypes, searchTerm]);

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (licorType: LicorType) => {
    setIsEditMode(true);
    setEditingId(licorType.id);
    setValue("nombre", licorType.nombre);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (isEditMode && editingId) {
        await updateLicorType({ id: editingId, nombre: data.nombre });
        toast.success("Tipo de licor actualizado");
      } else {
        await createLicorType({ nombre: data.nombre });
        toast.success("Tipo de licor creado");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      reset();
      await loadLicorTypes();
    } catch (error) {
      console.log(error);
      toast.error(isEditMode ? "Error al actualizar" : "Error al crear");
    }
  };

  const openDeleteDialog = (licorType: LicorType) => {
    setLicorTypeToDelete(licorType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLicorType = async () => {
    if (!licorTypeToDelete) return;
    try {
      await deleteLicorType(licorTypeToDelete.id);
      toast.success("Tipo de licor eliminado");
      await loadLicorTypes();
    } catch (error) {
      console.log(error);
      toast.error("Error al eliminar");
    } finally {
      setIsDeleteDialogOpen(false);
      setLicorTypeToDelete(null);
    }
  };

  const cancelDeleteLicorType = () => {
    setIsDeleteDialogOpen(false);
    setLicorTypeToDelete(null);
  };

  return {
    licorTypes,
    filteredLicorTypes,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    openCreateModal,
    openEditModal,
    register,
    handleSubmitForm,
    isDeleteDialogOpen,
    licorTypeToDelete,
    openDeleteDialog,
    confirmDeleteLicorType,
    cancelDeleteLicorType,
    onSubmit,
  };
};

export default useLicorTypes;
