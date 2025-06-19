interface EliminarButtonProps {
    onClick: () => void;
  }
  
  const EliminarButton: React.FC<EliminarButtonProps> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Eliminar
    </button>
  );
  
  export default EliminarButton;
  