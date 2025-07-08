import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PageHeader from './PageHeader';
import ImageGallery from './ImageGallery';
import InfoGrid from './InfoGrid';
import AdoptionButton from './AdoptionButton';
import AdoptionForm from './AdoptionForm';
import EditarButton from './EditarButton';
import EditCatModal from './EditarGato';
import EliminarButton from './EliminarButton';

import { fetchCats } from '../../utils/db';
import { getAuthHeaders } from '../../utils/db';
import { useAuth } from '../../contexts/AuthContext'; // Importar el contexto
import type { Cat } from '../../types/visualizacion/typesCat';

const CatProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario del contexto

  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const handleAdoptionClick = () => setShowAdoptionForm(true);
  const handleCloseForm = () => setShowAdoptionForm(false);
  const handleBackToList = () => navigate('/visualizacion/MainPage');

  const handleAdoptionSuccess = () => {
    setCurrentStatus('Adoptado');
    setShowAdoptionForm(false);
  };

  const handleEditarClick = () => setShowEditModal(true);

  const handleCatUpdate = (updatedCat: Cat) => {
    setCat(updatedCat);
    setShowEditModal(false);
    setCurrentStatus(updatedCat.disponibilidad);
  };

  const handleEliminarClick = async () => {
    if (!cat) return;

    const confirmar = window.confirm(`¿Seguro que quieres eliminar a ${cat.nombre}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/cats/${cat.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error('Error al eliminar el gato');
      }

      alert('Gato eliminado correctamente');
      navigate('/visualizacion/MainPage'); // Regresa a la lista después de eliminar
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el gato');
    }
  };

  // Formulario de adopción
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

  // Cargando
  if (loading) {
    return (
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-center">Cargando...</p>
        </div>
    );
  }

  // Gato no encontrado
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

  // Perfil del gato
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

          <div className="flex gap-4 mt-4">
            {user?.type === 'admin' ? (
                <>
                  <EditarButton onClick={handleEditarClick} />
                  <EliminarButton onClick={handleEliminarClick} />
                </>
            ) : (
                currentStatus === 'disponible' && (
                    <AdoptionButton onClick={handleAdoptionClick} />
                )
            )}
          </div>

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

        {/* Modal de edición */}
        {showEditModal && cat && (
            <EditCatModal
                cat={cat}
                onClose={() => setShowEditModal(false)}
                onUpdate={handleCatUpdate}
            />
        )}
      </div>
  );
};

export default CatProfile;
