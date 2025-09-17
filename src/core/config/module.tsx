import { 
    ChartBar, 
    CreditCard, 
    Users, 
    UserCheck, 
    Wallet,
    Home
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
      name: 'Usuarios',
      path: '/usuarios',
      icon: Users,
      roles: ['admin']
    },
    {
      id: 3,
      name: 'Empleados',
      path: '/empleados',
      icon: UserCheck,
      roles: ['admin']
    },
    {
      id: 4,
      name: 'Membresías',
      path: '/membresias',
      icon: CreditCard,
      roles: ['admin']
    },
    {
      id: 5,
      name: 'Caja',
      path: '/caja',
      icon: Wallet,
      roles: ['admin']
    },
    {
      id: 6,
      name: 'Reportes',
      path: '/reportes',
      icon: ChartBar,
      roles: ['admin']
    }
  ];
  
  export const getModulesByRole = (userRole: string): Module[] => {
    return modules.filter(module => 
      module.roles.includes(userRole)
    );
  };