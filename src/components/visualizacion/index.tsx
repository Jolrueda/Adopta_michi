import React, { useEffect, useState } from 'react';

// Tipo para un gato adoptable
type Cat = {
  id: string;
  name: string;
  age: number; // en meses o años
  healthStatus: 'Bueno' | 'Regular' | 'Crítico';
  adoptionState: 'Disponible' | 'Adoptado' | 'En tratamiento';
  photoUrl: string;
};

// Props de la página de gatos
type CatsPageProps = {};

const ITEMS_PER_PAGE = 8;

const CatsPage: React.FC<CatsPageProps> = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [filteredCats, setFilteredCats] = useState<Cat[]>([]);
  const [ageMin, setAgeMin] = useState<number | ''>('');
  const [ageMax, setAgeMax] = useState<number | ''>('');
  const [healthFilter, setHealthFilter] = useState<string>('');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // TODO: reemplazar con fetch real al backend
    const fetchCats = async () => {
      const data: Cat[] = await fetch('/api/cats').then(res => res.json());
      setCats(data);
      setFilteredCats(data);
    };
    fetchCats();
  }, []);

  useEffect(() => {
    let temp = cats;
    // Filtrar por rango de edad
    if (ageMin !== '' || ageMax !== '') {
      temp = temp.filter(c => {
        const okMin = ageMin === '' || c.age >= ageMin;
        const okMax = ageMax === '' || c.age <= ageMax;
        return okMin && okMax;
      });
    }
    // Filtrar por estado de salud
    if (healthFilter) {
      temp = temp.filter(c => c.healthStatus === healthFilter);
    }
    // Buscar por nombre (solo letras)
    if (nameSearch) {
      temp = temp.filter(c =>
        c.name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }
    setFilteredCats(temp);
    setCurrentPage(1);
  }, [ageMin, ageMax, healthFilter, nameSearch, cats]);

  // Paginación
  const totalPages = Math.ceil(filteredCats.length / ITEMS_PER_PAGE);
  const paginatedCats = filteredCats.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Gatos Adoptables</h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-gray-700">Edad mínima</label>
          <input
            type="number"
            min={0}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={ageMin}
            onChange={e => setAgeMin(e.target.value === '' ? '' : parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-gray-700">Edad máxima</label>
          <input
            type="number"
            min={0}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={ageMax}
            onChange={e => setAgeMax(e.target.value === '' ? '' : parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-gray-700">Estado de salud</label>
          <select
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={healthFilter}
            onChange={e => setHealthFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700">Buscar por nombre</label>
          <div className="flex mt-1">
            <input
              type="text"
              pattern="[A-Za-z ]*"
              className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Nombre del gato"
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value.replace(/[^A-Za-z ]/g, ''))}
            />
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition"
            >Buscar</button>
          </div>
        </div>
      </div>

      {/* Listado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedCats.map(cat => (
          <div key={cat.id} className="border rounded-2xl overflow-hidden shadow">
            <img src={cat.photoUrl} alt={cat.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{cat.name}</h3>
              <p className="text-sm">Edad: {cat.age}</p>
              <p className="text-sm">Salud: {cat.healthStatus}</p>
              <p className="text-sm">Estado: {cat.adoptionState}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${page === currentPage ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatsPage;
