import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User} from '../../types/Auth/AuthTypes';
//import EditProfileModal from './EditProfileModal';
import BackButton from '../general/BackButton';

//import UserInfo from '../UserInfo';

import  { useAuth } from '../../contexts/AuthContext';
import { fetchDonations } from '../../utils/db'; // Asegúrate de que esta función esté implementada correctamente



const UserProfileComponent: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User| null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [totalDonations, setTotalDonations] = useState<number>(0);

  const { user: authUser } = useAuth();
  // Simular datos del usuario - en producción esto vendría de un contexto de autenticación o API
  useEffect(() => {
    // Verificar si el usuario está autenticado
   
      if (authUser === null) {
        console.log('UserProfile: No hay usuario autenticado, redirigiendo al login');
        navigate('/');
        return;
      } 
      console.log('UserProfile: authUser value:', authUser);
      
      // Convertir User a UserProfile y agregar campos adicionales
      const userProfile: User = {
        id: authUser.id,
        fullName: authUser.fullName,
        email: authUser.email,
        type: authUser.type,
        createdAt: authUser.createdAt,
        password: authUser.password,
        profilePicture: undefined, // Por defecto sin foto de perfil (se puede agregar después)
        // Para administradores, agregar estadísticas (en producción vendrían de la API)
        adoptionsManaged: authUser.type === 'admin' ? 0: 0,
        totalDonated: authUser.type === 'admin' ? 0 : 0,
      };
      
      setUser(userProfile);
      setIsLoading(false);
      console.log('Usuario cargado:', userProfile);
    
    
  }, [navigate, authUser]);

  useEffect(() => {
    const fetchTotalDonations = async () => {
      if (user?.type === 'admin') {
        try {
          const donations = await fetchDonations();
          const total = donations.reduce((sum, donation) => sum + donation.monto, 0);
          setTotalDonations(total);
        } catch (error) {
          console.error('Error al obtener las donaciones:', error);
          setTotalDonations(0);
        }
      }
    };

    fetchTotalDonations();
  }, [user]);

  useEffect(() => {
    if (user?.type === "regular") {
      fetchDonations()
          .then((donations) => {
            const userDonations = donations.filter((donation) => donation.email === user.email);
            const total = userDonations.reduce((sum, donation) => sum + donation.monto, 0);
            setTotalDonations(total);
          })
          .catch((error) => {
            console.error("Error al cargar las donaciones del usuario:", error);
          });
    }
  }, [user]);


  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

    const handleSaveProfile = (updatedUser: Partial<User>) => {
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

  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString('es-ES', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric'
  //   });
  // };

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
              
              {/* User ID */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  <span className="text-xs">🆔</span>
                  ID: {user.id}
                </span>
              </div>
              
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

              {/* Regular User Badge */}
              {user.type === 'regular' && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                  <span className="text-xl">👤</span>
                  <span className="font-semibold">Usuario Regular</span>
                </div>
              )}
              
              {/* <p className="text-gray-500">
                Miembro desde: {formatDate(user.createdAt)}
              </p> */}
            </div>

            {/* Complete User Information Card */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                📋 Información Completa del Perfil
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">🆔</span>
                    <div>
                      <p className="text-sm text-gray-500">ID de Usuario</p>
                      <p className="font-medium text-gray-900">{user.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-sm text-gray-500">Nombre Completo</p>
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">🏷️</span>
                    <div>
                      <p className="text-sm text-gray-500">Tipo de Usuario</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {user.type === 'admin' ? 'Administrador' : 'Usuario Regular'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Registro</p>
                      {/* <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p> */}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">🖼️</span>
                    <div>
                      <p className="text-sm text-gray-500">Foto de Perfil</p>
                      <p className="font-medium text-gray-900">
                        {user.profilePicture ? 'Configurada' : 'No configurada'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              

              {/* Admin specific fields */}
          
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <span className="text-2xl">💰</span>
                      {user?.type === "admin" && (
                      <div>
                        <p className="text-sm text-gray-500">Total Donado a Adopta un Michi</p>
                        <p className="font-medium text-gray-900">
                          {user.type === 'admin' ? `$${totalDonations.toLocaleString()}` : '$0'}
                        </p>
                      </div>
                      )}
                      {user?.type === "regular" && (
                          <div>
                            <p className="text-sm text-gray-500">Total Donado por ti</p>
                            <p className="font-medium text-gray-900">
                              {`$${totalDonations.toLocaleString()}`}
                            </p>
                          </div>
                      )}

                    </div>
                  </div>
                </div>
        

                  <div className=" p-5 flex justify-center"> 
                    <BackButton onClick={() => navigate('/visualizacion/MainPage')} />
                  </div>
            </div>

            {/* Edit Profile Button */}
            {/* <div className="text-center">
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <span className="text-lg">✏️</span>
                Editar Perfil
              </button>
            </div> */}
          </div>
        </div>
       
      </div>

      
    </div>
  );
};

export default UserProfileComponent;
