import React from 'react';
import type { BackButtonProps } from '../../types/general/BackButtonProps';

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  text = 'Volver a la lista',
  className = 'bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 w-full sm:w-auto'
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
    >
      &larr; {text}
    </button>
  );
};

export default BackButton; 