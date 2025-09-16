import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; 

const useRegister = () => {    

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        reset
    } = useForm();
    
  
    const onSubmit = (data: any) => {
        if (data.password !== data.confirmPassword) {
            toast.warning('Las contraseñas no coinciden');
            return;
        }
        try {
            console.log(data);
            toast.success('Registro exitoso');
            reset();
        } catch (error) {
            console.log(error);
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

export default useRegister