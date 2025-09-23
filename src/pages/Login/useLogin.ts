import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "@/core/services/auth.service";
import { toast } from "sonner";

const useLogin = () => {    

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
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
            navigate('/dashboard');
        } catch (error) {   
            toast.error((error as any).response.data.message);
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