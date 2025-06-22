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
    estado: "Bueno",
    descripcion: "",
    imagen: "",
    imagen2: "",
    imagen3: "",
    disponibilidad: "disponible",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Cat) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto" onClick={onClose}>
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
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Critico">Crítico</option>
          </select>
        </label>

        {["imagen", "imagen2", "imagen3"].map((field, index) => (
          <div key={field} className="mb-4">
            <label className="block mb-1">Imagen {index + 1}:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, field as keyof Cat)}
              className="w-full border p-2 rounded"
            />
            {formData[field as keyof Cat] && (
              <img
                src={formData[field as keyof Cat] as string}
                alt={`Vista previa imagen ${index + 1}`}
                className="w-24 h-24 object-cover rounded mt-2"
              />
            )}
          </div>
        ))}

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


