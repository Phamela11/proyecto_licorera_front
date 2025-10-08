import React, { useState } from "react";
import TableGlobal, { type TableColumn } from "@/components/ui/tableGlobal";
import { Button } from "@/components/ui/button";

interface TipoLicor {
  id: number;
  nombre: string;
}

const TipoLicoresPage = () => {
  const [tipos, setTipos] = useState<TipoLicor[]>([]);
  const [nombre, setNombre] = useState("");

  // Columnas para la tabla
  const columns: TableColumn<TipoLicor>[] = [
    {
      key: "id",
      title: "ID",
      width: "80px",
      align: "center",
    },
    {
      key: "nombre",
      title: "Nombre del Tipo de Licor",
    },
  ];

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setTipos([
      ...tipos,
      { id: tipos.length + 1, nombre: nombre.trim() }
    ]);
    setNombre("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tipo de Licores</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre del tipo de licor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <Button type="submit">Agregar</Button>
      </form>
      <TableGlobal
        data={tipos}
        columns={columns}
        emptyMessage="No hay tipos de licores registrados"
      />
    </div>
  );
};

export default TipoLicoresPage;