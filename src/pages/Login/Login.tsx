
//import { Link } from 'react-router-dom';
import { Wine, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import useLogin from './useLogin';
import image from '../../assets/images/Licorera.jpg';

export default function Login() {

  const { showPassword, register, handleSubmitForm, setShowPassword, onSubmit } = useLogin();

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Imagen */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br  relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20">
        <img 
          src={image} 
          alt="Licorera.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 lg:hidden">
                <Wine className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
              <p className="text-gray-600">Inicia sesión en tu cuenta</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitForm(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password')}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
