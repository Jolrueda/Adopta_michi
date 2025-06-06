import React from 'react';


const Breadcrumb: React.FC = () => {

  return (
    <nav className="text-gray-500 text-sm mb-4">
      <ol className="list-reset flex">
        <li>
          <a href="#" className="hover:underline">Inicio</a>
        </li>
        <li>
          <span className="mx-2">&gt;</span>
        </li>
        <li>
          <a href="#" className="hover:underline">Gatos</a>
        </li>
        <li>
          <span className="mx-2">&gt;</span>
        </li>
        <li><a href="#" className="hover:underline">Perfil</a></li>
       
      </ol>
    </nav>
  );
};

export default Breadcrumb; 