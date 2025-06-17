import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PageHeader from './PageHeader';
import ImageGallery from './ImageGallery';
import InfoGrid from './InfoGrid';
import AdoptionButton from './AdoptionButton';
import AdoptionForm from './AdoptionForm';

import { fetchCats } from '../../utils/db';
import type { Cat } from '../../types/visualizacion/typesCat';

const CatProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCat = async () => {
      try {
        const cats = await fetchCats();
        const foundCat = cats.find(c => c.id === id);
        if (foundCat) {
          setCat(foundCat);
          setCurrentStatus(foundCat.disponibilidad);
        }
      } catch (error) {
        console.error('Error al cargar el gato:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCat();
  }, [id]);

  const handleAdoptionClick = () => {
    setShowAdoptionForm(true);
  };

  const handleCloseForm = () => {
    setShowAdoptionForm(false);
  };

  const handleAdoptionSuccess = () => {
    setCurrentStatus('Adoptado');
    setShowAdoptionForm(false);
  };

  const handleBackToList = () => {
    navigate('/visualizacion/MainPage');
  };

  if (showAdoptionForm && cat) {
    return (
        <AdoptionForm
            catId={cat.id}
            onClose={handleCloseForm}
            onSuccess={handleAdoptionSuccess}
            status={currentStatus}
        />
    );
  }

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-center">Cargando...</p>
        </div>
    );
  }

  if (!cat) {
    return (
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-center">Gato no encontrado</p>
          <button
              onClick={handleBackToList}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
          >
            Volver a la lista
          </button>
        </div>
    );
  }

  return (
      <div>
        <div className="max-w-4xl mx-auto p-6">
          <PageHeader
              title="Perfil del gato"
              clickbutton={handleBackToList}
              status={currentStatus}
          />
          <h2 className="text-2xl font-bold mb-4">{cat.nombre}</h2>
          <ImageGallery
              images={[
                cat.imagen,
                ...(cat.imagen2 ? [cat.imagen2] : []),
                ...(cat.imagen3 ? [cat.imagen3] : []),
              ].filter(img => img)}
              name={cat.nombre}
          />
          <InfoGrid
              age={`${cat.edad} años`}
              health={cat.estado}
              description={{
                title: 'Descripción',
                subtitle: cat.descripcion,
              }}
              medicalConditions={{
                title: 'Condición médica',
                subtitle: cat.condicion,
              }}
          />
          {currentStatus === 'disponible' && (
              <AdoptionButton onClick={handleAdoptionClick} />
          )}

          {currentStatus === 'adoptado' && (
              <div className="w-full bg-red-500 p-4 rounded-lg mt-4">
                <p className="text-white font-semibold">
                  Este gato ya ha sido adoptado
                </p>
              </div>
          )}

          {currentStatus === 'en proceso' && (
              <div className="w-full bg-yellow-500 p-4 rounded-lg mt-4">
                <p className="text-white font-semibold">
                  Este gato tiene un proceso de adopción en curso
                </p>
              </div>
          )}
        </div>
      </div>
  );
};

export default CatProfile;
