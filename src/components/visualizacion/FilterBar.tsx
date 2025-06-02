import React, { type ChangeEvent } from "react";

interface FilterBarProps {
    onFilterChange: (newFilters: { nombre: string; minAge: string; maxAge: string; estado: string }) => void;
    filters: { nombre: string; minAge: string; maxAge: string; estado: string };
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "nombre") {
            const regex = /^[A-Za-z\s]*$/;
            if (!regex.test(value)) return; // Ignora el cambio si contiene caracteres no permitidos
        }

        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
            <div className="flex flex-col flex-1">
                <label className="text-gray-700 font-semibold mb-1">Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Buscar por nombre"
                    value={filters.nombre}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-600 p-3 rounded w-full"
                />
            </div>
            <div className="flex flex-col flex-1">
                <label className="text-gray-700 font-semibold mb-1">Edad mínima</label>
                <input
                    type="number"
                    name="minAge"
                    placeholder="Edad mínima"
                    value={filters.minAge}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-600 p-3 rounded w-full"
                    min="0"
                />
            </div>
            <div className="flex flex-col flex-1">
                <label className="text-gray-700 font-semibold mb-1">Edad máxima</label>
                <input
                    type="number"
                    name="maxAge"
                    placeholder="Edad máxima"
                    value={filters.maxAge}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-600 p-3 rounded w-full"
                    min="0"
                />
            </div>
            <div className="flex flex-col flex-1">
                <label className="text-gray-700 font-semibold mb-1">Estado</label>
                <select
                    name="estado"
                    value={filters.estado}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-600 p-3 rounded w-full"
                >
                    <option value="">Todos</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Critico">Crítico</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
