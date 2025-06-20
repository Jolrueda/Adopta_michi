import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCat } from "../../utils/db";

const CrearGato = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    edad: 0,
    descripcion: "",
    estado: "Bueno" as "Bueno" | "Regular" | "Critico",
    condicion: "",
    disponibilidad: "disponible" as "disponible" | "adoptado" | "en proceso",
    fecha_ingreso: "",
    imagen: "",
    imagen2: "",
    imagen3: "",
  });

  const navigate = useNavigate();

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCat(formData);
      alert("Gato creado con éxito");
      navigate("/visualizacion/MainPage");
    } catch (error) {
      console.error("Error al crear el gato:", error);
      alert("Ocurrió un error al guardar el gato");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-300 via-purple-400 to-purple-600 px-6 py-12">
        <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-lg w-full space-y-6 border-4 border-purple-700"
        >
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-900 to-purple-800 text-center mb-10">
            Crear Nuevo Gato
          </h2>

          <div>
            <label htmlFor="nombre" className="block font-bold mb-1">
              Nombre del Gato
            </label>
            <input
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
                required
            />
          </div>

          <div>
            <label htmlFor="edad" className="block font-bold mb-1">
              Edad (en años)
            </label>
            <input
                id="edad"
                name="edad"
                type="number"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
                min={0}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
                required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block font-bold mb-1">
              Descripción
            </label>
            <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none resize-none text-lg font-medium"
                required
            />
          </div>

          <div>
            <label htmlFor="estado" className="block font-bold mb-1">
              Estado de Salud
            </label>
            <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
            >
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Critico">Crítico</option>
            </select>
          </div>

          <div>
            <label htmlFor="condicion" className="block font-bold mb-1">
              Condición Especial (Opcional)
            </label>
            <input
                id="condicion"
                name="condicion"
                placeholder="Condición especial"
                value={formData.condicion}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
            />
          </div>

          <div>
            <label htmlFor="disponibilidad" className="block font-bold mb-1">
              Disponibilidad
            </label>
            <select
                id="disponibilidad"
                name="disponibilidad"
                value={formData.disponibilidad}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
            >
              <option value="disponible">Disponible</option>
              <option value="en proceso">En proceso</option>
              <option value="adoptado">Adoptado</option>
            </select>
          </div>

          <div>
            <label htmlFor="fecha_ingreso" className="block font-bold mb-1">
              Fecha de Ingreso
            </label>
            <input
                id="fecha_ingreso"
                name="fecha_ingreso"
                type="date"
                value={formData.fecha_ingreso}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
                required
            />
          </div>

          <div>
            <label htmlFor="imagen" className="block font-bold mb-1">
              URL de Imagen Principal
            </label>
            <input
                id="imagen"
                name="imagen"
                placeholder="URL Imagen principal"
                value={formData.imagen}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
            />
          </div>

          <div>
            <label htmlFor="imagen2" className="block font-bold mb-1">
              URL de Imagen Secundaria
            </label>
            <input
                id="imagen2"
                name="imagen2"
                placeholder="URL Imagen secundaria"
                value={formData.imagen2}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
            />
          </div>

          <div>
            <label htmlFor="imagen3" className="block font-bold mb-1">
              URL de Imagen Adicional
            </label>
            <input
                id="imagen3"
                name="imagen3"
                placeholder="URL Imagen adicional"
                value={formData.imagen3}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border-2 border-purple-500 focus:border-purple-800 focus:ring-4 focus:ring-purple-300 transition outline-none text-lg font-medium"
            />
          </div>

          <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-purple-700 via-purple-900 to-purple-800 text-white font-extrabold text-lg shadow-lg hover:shadow-purple-600 transition duration-300"
          >
            Crear Gato
          </button>
        </form>
      </div>
  );
};

export default CrearGato;
