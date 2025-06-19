import React, { useState, useEffect } from "react";
import type { Cat } from "../../types/visualizacion/typesCat";


interface EditCatModalProps {
  cat: Cat | null;
  onClose: () => void;
  onUpdate: (updatedCat: Cat) => void;
}

const EditCatModal: React.FC<EditCatModalProps> = ({ cat, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Cat>({
    id: "",
    nombre: "",
    edad: 0,
    estado: "Bueno" as "Bueno" | "Regular" | "Critico",
    descripcion: "",
    imagen: "",
    imagen2: "",
    imagen3: "",
    disponibilidad: "disponible" as "disponible" | "adoptado" | "en proceso",
    condicion: "Sin condiciones especiales",
    fecha_ingreso: new Date().toISOString(),
    id_gato: ""
  });

  useEffect(() => {
    if (cat) setFormData(cat);
  }, [cat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "edad" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:3001/gatos/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      onUpdate(formData);
      alert("Gato actualizado correctamente");
      onClose();
    } catch (err) {
      console.error("Error al actualizar gato:", err);
      alert("Error al actualizar el gato.");
    }
  };

  if (!cat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Editar Gato</h2>

        <label className="block mb-2">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Edad:
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Estado:
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">Seleccionar</option>
            <option value="Disponible">Disponible</option>
            <option value="Adoptado">Adoptado</option>
            <option value="En tratamiento">En tratamiento</option>
          </select>
        </label>

        <label className="block mb-2">
          Imagen (URL):
          <input
            type="text"
            name="imagenUrl"
            value={formData.imagen}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCatModal;