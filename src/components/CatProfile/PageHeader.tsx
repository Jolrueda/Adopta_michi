import React from 'react';
import type { PageHeaderProps } from '../../types/CatProfile/PageHeader';
import BackButton from '../general/BackButton';

function capitalizarPalabra(palabra: string) {
  if (!palabra) return palabra; // Manejar cadenas vacías
  return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, clickbutton, status }) => {
  const displayStatus = capitalizarPalabra(status)
  const getStatusClasses = () => {
    switch (displayStatus) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Adoptado':
      case 'adoptado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <BackButton onClick={clickbutton} />
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses()}`}
        >
          {displayStatus}
        </span>
      </div>
    </div>
  );
};

export default PageHeader; 