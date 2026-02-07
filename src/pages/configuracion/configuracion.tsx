import { useState } from "react";
import { Save, Building2, Bell, Database, Info, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Configuracion = () => {
  // Estado para la información del negocio
  const [negocio, setNegocio] = useState({
    nombre: localStorage.getItem('negocio_nombre') || 'Licorera El Buen Gusto',
    direccion: localStorage.getItem('negocio_direccion') || 'Calle Principal #123',
    telefono: localStorage.getItem('negocio_telefono') || '300-123-4567',
    email: localStorage.getItem('negocio_email') || 'contacto@licorera.com',
    nit: localStorage.getItem('negocio_nit') || '900.123.456-7'
  });

  // Estado para notificaciones
  const [notificaciones, setNotificaciones] = useState({
    inventarioBajo: localStorage.getItem('notif_inventario') === 'true',
    ventasDiarias: localStorage.getItem('notif_ventas') === 'true',
    reportes: localStorage.getItem('notif_reportes') === 'true'
  });

  // Usuario actual
  const usuario = JSON.parse(localStorage.getItem('user') || '{}');

  // Guardar configuración del negocio
  const handleGuardarNegocio = () => {
    try {
      localStorage.setItem('negocio_nombre', negocio.nombre);
      localStorage.setItem('negocio_direccion', negocio.direccion);
      localStorage.setItem('negocio_telefono', negocio.telefono);
      localStorage.setItem('negocio_email', negocio.email);
      localStorage.setItem('negocio_nit', negocio.nit);
      toast.success('Configuración del negocio guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    }
  };

  // Guardar configuración de notificaciones
  const handleGuardarNotificaciones = () => {
    try {
      localStorage.setItem('notif_inventario', notificaciones.inventarioBajo.toString());
      localStorage.setItem('notif_ventas', notificaciones.ventasDiarias.toString());
      localStorage.setItem('notif_reportes', notificaciones.reportes.toString());
      toast.success('Preferencias de notificaciones guardadas');
    } catch (error) {
      toast.error('Error al guardar las notificaciones');
    }
  };

  // Exportar datos (simulado)
  const handleExportarDatos = () => {
    toast.info('Función de exportación en desarrollo');
  };

  // Limpiar caché
  const handleLimpiarCache = () => {
    try {
      // Solo limpiamos el caché específico, no la sesión del usuario
      const user = localStorage.getItem('user');
      localStorage.clear();
      if (user) localStorage.setItem('user', user);
      toast.success('Caché limpiado exitosamente. Recarga la página para ver los cambios.');
    } catch (error) {
      toast.error('Error al limpiar el caché');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración general del sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del Negocio */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Información del Negocio</CardTitle>
            </div>
            <CardDescription>
              Configura los datos principales de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre del Negocio</Label>
                <Input
                  id="nombre"
                  value={negocio.nombre}
                  onChange={(e) => setNegocio({ ...negocio, nombre: e.target.value })}
                  placeholder="Nombre de tu negocio"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  value={negocio.nit}
                  onChange={(e) => setNegocio({ ...negocio, nit: e.target.value })}
                  placeholder="900.123.456-7"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={negocio.direccion}
                onChange={(e) => setNegocio({ ...negocio, direccion: e.target.value })}
                placeholder="Dirección completa"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={negocio.telefono}
                  onChange={(e) => setNegocio({ ...negocio, telefono: e.target.value })}
                  placeholder="300-123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={negocio.email}
                  onChange={(e) => setNegocio({ ...negocio, email: e.target.value })}
                  placeholder="contacto@negocio.com"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleGuardarNegocio}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>
              Configura tus preferencias de notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inventario Bajo</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas cuando los productos están por agotarse
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificaciones.inventarioBajo}
                onChange={(e) => setNotificaciones({ ...notificaciones, inventarioBajo: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumen de Ventas</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe reportes diarios de ventas
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificaciones.ventasDiarias}
                onChange={(e) => setNotificaciones({ ...notificaciones, ventasDiarias: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reportes</Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones de reportes generados
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificaciones.reportes}
                onChange={(e) => setNotificaciones({ ...notificaciones, reportes: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleGuardarNotificaciones}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Preferencias
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Datos y Respaldo */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Datos y Respaldo</CardTitle>
            </div>
            <CardDescription>
              Gestiona tus datos y respaldos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleExportarDatos}
              >
                <Database className="mr-2 h-4 w-4" />
                Exportar Datos
              </Button>
              <p className="text-xs text-muted-foreground px-2">
                Descarga una copia de tus datos en formato CSV
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleLimpiarCache}
              >
                <Database className="mr-2 h-4 w-4" />
                Limpiar Caché
              </Button>
              <p className="text-xs text-muted-foreground px-2">
                Elimina datos temporales para mejorar el rendimiento
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información del Usuario */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Usuario Actual</CardTitle>
            </div>
            <CardDescription>
              Información de tu sesión
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Nombre</Label>
              <p className="text-sm font-medium">{usuario?.nombre || 'Usuario'}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{usuario?.email || 'N/A'}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Rol</Label>
              <p className="text-sm font-medium capitalize">
                {usuario?.user_metadata?.role || 'admin'}
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Lock className="mr-2 h-4 w-4" />
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle>Información del Sistema</CardTitle>
            </div>
            <CardDescription>
              Detalles técnicos de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Versión</Label>
              <p className="text-sm font-medium">1.0.0</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Base de Datos</Label>
              <p className="text-sm font-medium">PostgreSQL</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Estado del Servidor</Label>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-sm font-medium">Conectado</p>
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Última Actualización</Label>
              <p className="text-sm font-medium">Noviembre 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracion;

