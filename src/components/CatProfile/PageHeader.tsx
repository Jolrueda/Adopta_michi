import React from 'react';
import type { PageHeaderProps } from '../../types/CatProfile/PageHeader';


const PageHeader: React.FC<PageHeaderProps> = ({ title, status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Adoptado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses()}`}
      >
        {status}
      </span>
    </div>
  );
};

export default PageHeader; 