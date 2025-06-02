import React from 'react';
import { useState } from 'react';
import UserPerfil from '../UserPerfil';

const Breadcrumb: React.FC = () => {
  // Datos de ejemplo para el usuario
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const exampleUser = {
    name: "Nombre de Usuario",
    email: "usuario@example.com",
    // avatarUrl: "URL_DEL_AVATAR_OPCIONAL",
    // bio: "Biografía corta del usuario."
  };

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
        <li>
          <button className='hover:underline text-blue-500'  onClick={() => setIsUserProfileOpen(!isUserProfileOpen)}>
            {isUserProfileOpen ? 'Cerrar' : 'Perfil'}
            <UserPerfil user={exampleUser} />
          </button>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb; 