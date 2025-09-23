import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getModulesByRole } from "../core/config/module";


export default function PrivateLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeModule, setActiveModule] = useState<number>(1);
  const [userModules, setUserModules] = useState<any[]>([]);

  useEffect(() => {
    // Obtener el rol del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user?.user_metadata?.role || 'admin';
    
    // Obtener módulos según el rol del usuario
    const modules = getModulesByRole(userRole);
    setUserModules(modules);

    // Determinar el módulo activo basado en la ruta actual
    const currentPath = location.pathname;
    const activeModuleId = modules.find((module: any) => 
      currentPath.includes(module.path)
    )?.id || 1;
    
    setActiveModule(activeModuleId);
  }, [location.pathname]);

  const handleModuleClick = (moduleId: number, path?: string) => {
    setActiveModule(moduleId);
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">

        <header className="flex items-center justify-between bg-white shadow-sm border-b border-gray-300 p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">Panel Administrativo</h1>
      
            <span className="text-lg text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {userModules.find(m => m.id === activeModule)?.name || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-600">
              Bienvenido, {JSON.parse(localStorage.getItem('user') || '{}')?.user_metadata?.email || 'Usuario'}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate("/");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
            >
              <span>🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </header>
      {/* Sidebar */}
      {/* Main */}
      <div className="flex-1 flex flex-row">
        {/* Header */}
        
      <aside className="w-64 border-r border-gray-300 ">
        <nav className="p-4">
          <ul className="space-y-1">
            {userModules.map((module) => (
              <li key={module.id}>
                <Link
                  to={module.path}
                  onClick={() => handleModuleClick(module.id, module.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    activeModule === module.id
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <module.icon className="w-5 h-5" />
                  <span className="font-medium">{module.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}