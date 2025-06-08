import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile} from '../../types/Auth/AuthTypes';
import EditProfileModal from './EditProfileModal';

const UserProfileComponent: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile| null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Simular datos del usuario - en producción esto vendría de un contexto de autenticación o API
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const mockAuthCheck = () => {
      // Simular verificación de autenticación
      const isAuthenticated = true; // Esto vendría de tu sistema de auth
      
      if (!isAuthenticated) {
        navigate('/');
        return;
      }

      // Datos de ejemplo para diferentes tipos de usuario
      const mockUser: UserProfile = { 
        id: '1',
        fullName: 'Nombre Apellido',
        email: 'usuario@email.com',
        profilePicture: 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=USER',
        type: 'admin', // Cambiar a 'regular' para probar usuario normal
        createdAt: new Date('2022-03-12'),
        adoptionsManaged: 42,
        totalDonated: 3200
      };

      setUser(mockUser);
      setIsLoading(false);
    };

    mockAuthCheck();
  }, [navigate]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

    const handleSaveProfile = (updatedUser: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
      setIsEditingProfile(false);
      // Aquí iría la lógica para guardar en la API
      console.log('Perfil actualizado:', updatedUser);
    }
  };

  const handleCloseModal = () => {
    setIsEditingProfile(false);
  };

  const handleProfilePictureClick = () => {
    // Aquí iría la lógica para cambiar la foto de perfil
    console.log('Cambiar foto de perfil');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil</h1>
          <div className="h-1 w-20 bg-purple-500 mx-auto rounded"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Section */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-32 sm:h-40"></div>
          
          {/* Profile Content */}
          <div className="relative px-6 sm:px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-16 sm:-mt-20 mb-6">
              <div 
                className="relative group cursor-pointer"
                onClick={handleProfilePictureClick}
              >
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=USER'}
                  alt="Foto de perfil"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    ✏️ Cambiar
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {user.fullName}
              </h2>
              <p className="text-gray-600 text-lg mb-4">{user.email}</p>
              
              {/* Admin Badge */}
              {user.type === 'admin' && (
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
                  <span className="text-xl">👑</span>
                  <span className="font-semibold">Administrador</span>
                  <span className="text-sm bg-purple-200 px-2 py-1 rounded">
                    Acceso administrativo
                  </span>
                </div>
              )}
              
              <p className="text-gray-500">
                Miembro desde: {formatDate(user.createdAt)}
              </p>
            </div>

            {/* Admin Metrics */}
            {user.type === 'admin' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Adopciones Gestionadas */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                    <span className="text-2xl text-white">🏠</span>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Adopciones Gestionadas
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {user.adoptionsManaged}
                  </p>
                  <p className="text-blue-600 text-sm">
                    Total aprobadas: {user.adoptionsManaged}
                  </p>
                </div>

                {/* Total Donado */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                    <span className="text-2xl text-white">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Total Donado
                  </h3>
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    ${user.totalDonated?.toLocaleString()}
                  </p>
                  <p className="text-green-600 text-sm">
                    Tienes privilegios de gestión avanzados.
                  </p>
                </div>
              </div>
            )}

            {/* Edit Profile Button */}
            <div className="text-center">
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <span className="text-lg">✏️</span>
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info for Screen Readers */}
        <div className="sr-only">
          <p>
            Perfil de usuario de {user.fullName}. 
            {user.type === 'admin' 
              ? `Rol: Administrador con ${user.adoptionsManaged} adopciones gestionadas y $${user.totalDonated} donados.`
              : 'Rol: Usuario regular.'
            }
            Miembro desde {formatDate(user.createdAt)}.
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditingProfile}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfileComponent;
