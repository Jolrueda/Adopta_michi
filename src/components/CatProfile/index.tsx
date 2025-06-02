import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb'
import PageHeader from './PageHeader'
import ImageGallery from './ImageGallery'
import InfoGrid from './InfoGrid'
import AdoptionButton from './AdoptionButton'
import AdoptionForm from './AdoptionForm'

import type { CatProfileProps } from '../../types/CatProfile/CatProfileProps'



const CatProfile: React.FC<CatProfileProps> = ({
  name,
  status,
  images,
  age,
  health,
  description,
  medicalConditions,
}) => {
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

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

  if (showAdoptionForm) {
    return <AdoptionForm onClose={handleCloseForm} onSuccess={handleAdoptionSuccess} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Breadcrumb />
      <PageHeader title="Perfil del gato" status={currentStatus} />
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <ImageGallery images={images} name={name} />
      <InfoGrid
        age={age}
        health={health}
        description={description}
        medicalConditions={medicalConditions}
      />
      {currentStatus === 'Disponible' && (
        <AdoptionButton onClick={handleAdoptionClick} />
      )}
      {currentStatus === 'Adoptado' && (
        <div className='w-full bg-red-500 p-4 rounded-lg  mt-4'>
          <p className="text-white font-semibold">Este gato ya ha sido adoptado</p>

        </div>
      )}
    </div>
  );
};

export default CatProfile;
