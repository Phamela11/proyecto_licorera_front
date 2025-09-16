import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const useLogin = () => {    

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors }
    } = useForm();
    
  
    const onSubmit = (data: any) => {
        try {
            console.log(data);
            navigate('/');
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

export default useLogin