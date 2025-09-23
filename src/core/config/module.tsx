import { 
    ChartBar, 
    CreditCard, 
    Users, 
    Wallet,
    Home,
    DollarSign,
    Settings,
    UserCircle,
    ShoppingCart
  } from "lucide-react";
  
  export interface Module {
    id: number;
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
    children?: Module[];
  }
  
  export const modules: Module[] = [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      roles: ['admin']
    },
    {
      id: 2,
      name: 'Empleado',
      path: '/usuarios',
      icon: Users,
      roles: ['admin']
    },
    {
      id: 3,
      name: 'Productos',
      path: '/productos',
      icon: ShoppingCart,
      roles: ['admin']
    },
    {
      id: 4,
      name: 'Clientes',
      path: '/clientes',
      icon: UserCircle,
      roles: ['admin']
    },
    {
      id: 5,
      name: 'Inventario',
      path: '/inventario',
      icon: CreditCard,
      roles: ['admin']
    },
    {
      id: 6,
      name: 'Ventas',
      path: '/ventas',
      icon: Wallet,
      roles: ['admin']
    },
    {
      id: 7,
      name: 'Reportes',
      path: '/reportes',
      icon: ChartBar,
      roles: ['admin']
    },
    {
      id: 8,
      name: 'Nómina',
      path: '/nomina',
      icon: DollarSign,
      roles: ['admin']
    },
    {
      id: 9,
      name: 'Configuración',
      path: '/configuracion',
      icon: Settings,
      roles: ['admin']
    }
  ];
  
  export const getModulesByRole = (userRole: string): Module[] => {
    return modules.filter(module => 
      module.roles.includes(userRole)
    );
  };