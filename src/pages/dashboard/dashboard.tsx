import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  ChartBar, 
  Calculator,
  TrendingUp,
  ArrowRight,
  Wallet
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('user') || '{}');

  // Módulos principales del sistema
  const modulos = [
    {
      titulo: "Ventas",
      descripcion: "Registra y gestiona ventas",
      icono: Wallet,
      ruta: "/ventas",
      color: "bg-gradient-to-br from-[#602437] to-[#4a1c2b]",
      iconColor: "text-pink-100"
    },
    {
      titulo: "Inventario",
      descripcion: "Control de stock y productos",
      icono: Package,
      ruta: "/inventario",
      color: "bg-gradient-to-br from-[#c9184a] to-[#a01639]",
      iconColor: "text-pink-100"
    },
    {
      titulo: "Productos",
      descripcion: "Catálogo de productos",
      icono: ShoppingCart,
      ruta: "/productos",
      color: "bg-gradient-to-br from-[#218380] to-[#196663]",
      iconColor: "text-teal-100"
    },
    {
      titulo: "Clientes",
      descripcion: "Base de datos de clientes",
      icono: Users,
      ruta: "/clientes",
      color: "bg-gradient-to-br from-[#e05780] to-[#c04369]",
      iconColor: "text-pink-100"
    },
    {
      titulo: "Reportes",
      descripcion: "Análisis y estadísticas",
      icono: ChartBar,
      ruta: "/reportes",
      color: "bg-gradient-to-br from-[#8f2d56] to-[#6d2241]",
      iconColor: "text-pink-100"
    },
    {
      titulo: "Costos Operativos",
      descripcion: "Gestión de gastos",
      icono: Calculator,
      ruta: "/costos-operativos",
      color: "bg-gradient-to-br from-[#ebb3a9] to-[#d99590]",
      iconColor: "text-pink-100"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Card Principal de Bienvenida */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-[#ff7aa2] via-[#ff5e8e] to-[#e84c7a] text-white overflow-hidden relative">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src="/images/Licorera.jpg" 
            alt="Licorera" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                ¡Bienvenido de nuevo, {usuario?.nombre || 'Usuario'}!
              </CardTitle>
              <CardDescription className="text-white text-lg font-medium">
                Panel de control - Licorera
              </CardDescription>
            </div>
            <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-white mb-4 font-medium">
            Accede rápidamente a las funciones principales del sistema desde aquí
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white">Sistema operativo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-white">Base de datos conectada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de Acceso Rápido */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Acceso Rápido</h2>
        <p className="text-gray-600 mb-6">Selecciona un módulo para comenzar</p>
        
        {/* Grid de Cards de Módulos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modulos.map((modulo, index) => {
            const Icono = modulo.icono;
            return (
              <Card
                key={index}
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-none overflow-hidden group"
                onClick={() => navigate(modulo.ruta)}
              >
                <div className={`${modulo.color} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm ${modulo.iconColor}`}>
                      <Icono className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {modulo.titulo}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {modulo.descripcion}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Información Adicional */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-700">
              Usuario Activo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {usuario?.nombre || 'Admin'}
            </p>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              Rol: {usuario?.user_metadata?.role || 'admin'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-700">
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <p className="text-2xl font-bold text-gray-900">Operativo</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Todos los servicios funcionando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-700">
              Módulos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{modulos.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              Funciones disponibles
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
