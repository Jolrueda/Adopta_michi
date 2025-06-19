import React from 'react';

interface EditarGatoButtonProps {
  onClick?: () => void;
}

const EditarGatoButton: React.FC<EditarGatoButtonProps> = ({ onClick }) => (
  <button
    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
    onClick={onClick}
  >
    Editar
  </button>
);

export default EditarGatoButton;