import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getModulesByRole } from "../core/config/module";
import { LogOut } from "lucide-react";


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
    
    // Resetear todos los estilos de hover cuando cambie el módulo activo
    setTimeout(() => {
      const allLinks = document.querySelectorAll('[data-module-link]');
      allLinks.forEach((link) => {
        const element = link as HTMLElement;
        const moduleId = parseInt(element.getAttribute('data-module-id') || '0');
        if (moduleId !== activeModuleId) {
          element.style.backgroundColor = 'transparent';
        }
      });
    }, 100);
  }, [location.pathname]);

  const handleModuleClick = (moduleId: number, path?: string) => {
    setActiveModule(moduleId);
    
    // Resetear todos los estilos de hover
    const allLinks = document.querySelectorAll('[data-module-link]');
    allLinks.forEach((link) => {
      const element = link as HTMLElement;
      element.style.backgroundColor = 'transparent';
    });
    
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">

        <header className="flex items-center justify-between bg-black shadow-sm border-b border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">Panel Administrativo</h1>
      
            <span className="text-lg text-gray-300 bg-gray-800 px-2 py-1 rounded-full">
              {userModules.find(m => m.id === activeModule)?.name || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-300">
              Bienvenido, {JSON.parse(localStorage.getItem('user') || '{}')?.user_metadata?.email || 'Usuario'}
            </span>
          </div>
        </header>
      {/* Sidebar */}
      {/* Main */}
      <div className="flex-1 flex flex-row">
        {/* Header */}
        
      <aside className="w-64 bg-black border-r border-gray-700 flex flex-col">
        <nav className="p-4 flex-1">
          <ul className="space-y-1">
            {userModules.map((module) => (
              <li key={module.id}>
                <Link
                  to={module.path}
                  data-module-link
                  data-module-id={module.id}
                  onClick={() => handleModuleClick(module.id, module.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    activeModule === module.id
                      ? 'text-white shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: activeModule === module.id ? '#c9184a' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeModule !== module.id) {
                      e.currentTarget.style.backgroundColor = '#403d39';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeModule !== module.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <module.icon className="w-5 h-5" />
                  <span className="font-medium">{module.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Botón de cerrar sesión al final */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem('user');
              navigate("/");
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c9184a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}