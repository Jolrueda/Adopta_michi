import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "./FilterBar";
import CatList from "./CatList";
import Pagination from "./Pagination";
import Banner from "../general/Banner";
import { fetchCats } from "../../utils/db";
import type { Cat } from "../../types/visualizacion/typesCat";
import type { FilterBarProps } from "../../types/visualizacion/FilterBarProps"; // Asegúrate de importar el tipo correcto

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [filters, setFilters] = useState<{
    nombre: string;
    minAge: string;
    maxAge: string;
    estado: string;
    disponibilidad: string; // Cambiado a string genérico
  }>({
    nombre: "",
    minAge: "",
    maxAge: "",
    estado: "",
    disponibilidad: "", // Valor inicial permitido
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadCats = async () => {
      const data = await fetchCats();
      setCats(data);
      setFilteredCats(data);
    };
    loadCats();
  }, []);

  useEffect(() => {
    filterCats();
  }, [filters, cats]);

  const filterCats = () => {
    let filtered = cats;

    if (filters.nombre) {
      filtered = filtered.filter((cat) =>
          cat.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }
    if (filters.minAge) {
      filtered = filtered.filter((cat) => cat.edad >= parseInt(filters.minAge));
    }
    if (filters.maxAge) {
      filtered = filtered.filter((cat) => cat.edad <= parseInt(filters.maxAge));
    }
    if (filters.estado) {
      filtered = filtered.filter((cat) => cat.estado === filters.estado);
    }
    if (filters.disponibilidad) {
      filtered = filtered.filter(
          (cat) => cat.disponibilidad === filters.disponibilidad
      );
    }

    setFilteredCats(filtered);
    setCurrentPage(1); // Resetear a página 1 cuando filtros cambian
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange: FilterBarProps["onFilterChange"] = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSelectCat = (cat: Cat) => {
    navigate(`/cat/${cat.id}`);
  };

  const paginatedCats = filteredCats.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  return (
      <div className="p-2">
        <div className="mb-5">
          <Banner />
        </div>

        <div className="container mx-auto p-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Gatos Disponibles
          </h2>
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          <CatList cats={paginatedCats} onSelectCat={handleSelectCat} />
        </div>

        <Pagination
            totalItems={filteredCats.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
        />
      </div>
  );
};

export default MainPage;
