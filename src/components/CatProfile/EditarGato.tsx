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
    fecha_ingreso: new Date().toISOString().split("T")[0],
    id_gato: ""
  });

  useEffect(() => {
    if (cat) setFormData(cat);
  }, [cat]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "edad" ? Number(value) : value,
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl w-full max-w-lg max-h-screen overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-2xl font-bold text-purple-700 mb-6">
          Editar Gato
        </h2>

        {/* Nombre */}
        <div className="mb-4">
          <label className="block font-bold mb-1">Nombre del Gato</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 text-lg font-medium"
          />
        </div>

        {/* Edad */}
        <div className="mb-4">
          <label className="block font-bold mb-1">Edad (en años)</label>
          <input
            type="number"
            name="edad"
            min={0}
            value={formData.edad}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 text-lg font-medium"
          />
        </div>

        {/* Estado */}
        <div className="mb-4">
          <label className="block font-bold mb-1">Estado de Salud</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 text-lg font-medium"
          >
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Critico">Crítico</option>
          </select>
        </div>

        {/* Condición */}
        <div className="mb-4">
          <label className="block font-bold mb-1">Condición Especial</label>
          <input
            type="text"
            name="condicion"
            value={formData.condicion}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 text-lg font-medium"
          />
        </div>

        {/* Disponibilidad */}
        <div className="mb-4">
          <label className="block font-bold mb-1">Disponibilidad</label>
          <select
            name="disponibilidad"
            value={formData.disponibilidad}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 text-lg font-medium"
          >
            <option value="disponible">Disponible</option>
            <option value="en proceso">En proceso</option>
            <option value="adoptado">Adoptado</option>
          </select>
        </div>

        {/* Fecha ingreso */}
        <div className="mb-4">
          <label className="block font-bold mb-1">Fecha de Ingreso</label>
          <input
            type="date"
            name="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 text-lg font-medium"
          />
        </div>

        {/* Imágenes */}
        {["imagen", "imagen2", "imagen3"].map((field, index) => (
          <div key={field} className="mb-4">
            <label className="block font-bold mb-1 cursor-pointer text-purple-600 hover:underline">
              Cargar Imagen {index + 1}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, field as keyof Cat)}
                className="hidden"
              />
            </label>
            {formData[field as keyof Cat] && (
              <img
                src={formData[field as keyof Cat] as string}
                alt={`Imagen ${index + 1}`}
                className="mt-2 w-[60px] h-[60px] object-cover rounded"
              />
            )}
          </div>
        ))}

        {/* Descripción */}
        <div className="mb-4">
          <label className="block font-bold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 text-lg font-medium resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCatModal;




