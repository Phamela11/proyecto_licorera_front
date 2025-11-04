import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "@/core/services/auth.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const useLogin = () => {    

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors }
    } = useForm();
    
  
    const onSubmit = async (data: any) => {
        try {
            console.log(data);
            const response = await login(data.email, data.password);
            console.log(response);
            
            // Guardar el usuario en el store de Zustand
            if (response.data) {
                setUser(response.data);
                // También guardar en localStorage para compatibilidad con interceptores de axios
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success(response.message || "Inicio de sesión exitoso");
            }
            
            navigate('/dashboard');
        } catch (error) {   
            toast.error((error as any).response?.data?.message || "Error al iniciar sesión");
        }
    };
  
  


    return {
        showPassword,
        register,
        errors,
        onSubmit,
        handleSubmitForm,
        setShowPassword
    }
}

export default useLogin