import React from 'react';
import type { BackButtonProps } from '../../types/general/BackButtonProps';

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  text = 'Volver a la lista',
  className = 'bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300'
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