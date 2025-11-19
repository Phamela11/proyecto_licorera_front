import { 
    ChartBar, 
    CreditCard, 
    Users, 
    Wallet,
    Home,
    DollarSign,
    Settings,
    UserCircle,
    ShoppingCart,
    GlassWater,
    Truck,
    Clock,
    Calculator
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
      roles: ['admin', 'cajero']
    },
    {
      id: 4,
      name: 'Clientes',
      path: '/clientes',
      icon: UserCircle,
      roles: ['admin', 'cajero']
    },
     {
    id: 5, 
    name: "Tipo de Licores",
    path: "/tipo-licor",
    icon: GlassWater, 
    roles: ["admin", "empleado", "cajero"],
    },
    {
      id: 7,
      name: 'Proveedores',
      path: '/proveedores',
      icon: Truck,
      roles: ['admin', 'cajero']
    },
    {
      id: 6,
      name: 'Inventario',
      path: '/inventario',
      icon: CreditCard,
      roles: ['admin', 'cajero']
    },
    {
      id: 8,
      name: 'Ventas',
      path: '/ventas',
      icon: Wallet,
      roles: ['admin', 'cajero']
    },
    {
      id: 9,
      name: 'Reportes',
      path: '/reportes',
      icon: ChartBar,
      roles: ['admin']
    },
    {
      id: 10,
      name: 'Registro Horas',
      path: '/registro-horas',
      icon: Clock,
      roles: ['admin']
    },
    {
      id: 11,
      name: 'Nómina',
      path: '/nomina',
      icon: DollarSign,
      roles: ['admin']
    },
    {
    id: 12,
    name: 'Costos Operativos',
    path: '/costos-operativos',
    icon: Calculator,
    roles: ['admin']
    },
    {
      id: 13,
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