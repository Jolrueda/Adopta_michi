import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User} from '../../types/Auth/AuthTypes';
import EditProfileModal from './EditProfileModal';
import BackButton from '../general/BackButton';
import { FaUserCircle } from 'react-icons/fa';

//import UserInfo from '../UserInfo';

import  { useAuth } from '../../contexts/AuthContext';
import { fetchDonations, updateUser, fetchProfile } from '../../utils/db';


const UserProfileComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  const { user: authUser, setUser } = useAuth();

  // Helper para mostrar nombre: fullName -> parte antes de @ -> "Sin nombre"
  const getDisplayName = () => {
    if (!authUser) return 'Sin nombre';
    if (authUser.fullName && authUser.fullName.trim() !== '') return authUser.fullName;
    if (authUser.email) {
      const base = authUser.email.split('@')[0];
      return base.charAt(0).toUpperCase() + base.slice(1);
    }
    return 'Sin nombre';
  };

  // Simular datos del usuario - en producción esto vendría de un contexto de autenticación o API
  useEffect(() => {
    const refreshProfile = async () => {
      if (authUser) {
        try {
          const fresh = await fetchProfile();
          setUser({ ...authUser, ...fresh });
        } catch (e) {
          console.error('Error refrescando perfil:', e);
        }
      }
    };

    refreshProfile();
    // Usuario autenticado cargado correctamente
    setIsLoading(false);
  }, [navigate, authUser]);

  // Agregar campos adicionales solo una vez
  useEffect(() => {
    if (authUser && !("adoptionsManaged" in authUser)) {
      const enhancedUser: User = {
        ...authUser,
        adoptionsManaged: 0,
        totalDonated: 0,
      };

      setUser(enhancedUser);
    }
  }, [authUser, setUser]);

  useEffect(() => {
    const fetchTotalDonations = async () => {
      if (!authUser) return;

      try {
        const donations = await fetchDonations();
        if (!donations || donations.length === 0) {
          setTotalDonations(0);
          return;
        }
        let total = 0;

        if (authUser.type === 'admin') {
          // Para admin: suma todas las donaciones
          total = donations.reduce((sum, donation) => {
            return sum + Number(donation.monto);
          }, 0);
        } else if (authUser.type === 'regular') {
          // Para usuario regular: suma solo sus donaciones
          const userDonations = donations.filter((donation) => donation.email === authUser.email);
          total = userDonations.reduce((sum, donation) => {
            return sum + Number(donation.monto);
          }, 0);
        }

        setTotalDonations(total);
      } catch (error) {
        console.error('Error al obtener las donaciones:', error);
        setTotalDonations(0);
      }
    };

    fetchTotalDonations();
  }, [authUser]);


  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (updatedFields: Partial<User>) => {
    console.log('🔄 Actualizando perfil:', Object.keys(updatedFields));

    if (authUser) {
      try {
        // Enviar solo los campos realmente modificados
        const apiUpdatedUser = await updateUser(authUser.id, updatedFields);

        // Unir para garantizar que todos los campos estén presentes
        const merged = { ...authUser, ...updatedFields, ...apiUpdatedUser } as User;
        setUser(merged);

        // Obtener perfil actualizado definitivo
        try {
          const fresh = await fetchProfile();
          setUser({ ...merged, ...fresh });
        } catch (e) {
          console.error('No se pudo refrescar perfil después de actualizar', e);
        }

        // Incrementar para bust de caché en imagen externa
        setForceUpdate((p) => p + 1);
      } catch (error) {
        console.error('❌ Error al actualizar usuario en la base de datos:', error);
        // Opcional: mostrar notificación de error
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = '❌ Error al actualizar el perfil. Inténtalo de nuevo.';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            if (notification.parentNode) {
              document.body.removeChild(notification);
            }
          }, 300);
        }, 3000);
        return;
      }
      
      // Cerrar el modal
      setIsEditingProfile(false);
      
      // Ya forzamos re-render arriba
      
      // Mostrar confirmación visual
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.innerHTML = '✅ Perfil actualizado exitosamente';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
      
      console.log('🎉 Perfil guardado exitosamente');
    } else {
      console.error('❌ No se pudo actualizar: authUser es null');
    }
  };

  const handleCloseModal = () => {
    setIsEditingProfile(false);
  };

  const handleProfilePictureClick = () => {
    // Abre el modal de edición de perfil
    setIsEditingProfile(true);
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        console.error('Fecha inválida:', date);
        return 'Fecha no disponible';
      }
      return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no disponible';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">

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
            <div className="flex justify-center -mt-12 sm:-mt-16 md:-mt-20 mb-6">
              <div 
                className="relative group cursor-pointer"
                onClick={handleProfilePictureClick}
              >
                {authUser.profilePicture ? (
                  <img
                    src={authUser.profilePicture.startsWith('data:') ? authUser.profilePicture : `${authUser.profilePicture}?v=${forceUpdate}`}
                    alt="Foto de perfil"
                    className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white bg-white shadow-lg object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <FaUserCircle className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 text-purple-500 rounded-full border-4 border-white bg-white shadow-lg transition-transform group-hover:scale-105" />
                )}
                <div className="absolute inset-0 rounded-full bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    ✏️ Cambiar
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {getDisplayName()}
              </h2>
              <p className="text-gray-600 text-lg mb-4">{authUser.email}</p>
              
              {/* User ID */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  <span className="text-xs">🆔</span>
                  ID: {authUser.id}
                </span>
              </div>
              
              {/* Admin Badge */}
              {authUser.type === 'admin' && (
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
                  <span className="text-xl">👑</span>
                  <span className="font-semibold">Administrador</span>
                  <span className="text-sm bg-purple-200 px-2 py-1 rounded">
                    Acceso administrativo
                  </span>
                </div>
              )}

              {/* Regular User Badge */}
              {authUser.type === 'regular' && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                  <span className="text-xl">👤</span>
                  <span className="font-semibold">Usuario Regular</span>
                </div>
              )}
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
                      <p className="font-medium text-gray-900">{authUser.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-sm text-gray-500">Nombre Completo</p>
                      <p className="font-medium text-gray-900">{getDisplayName()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{authUser.email}</p>
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
                        {authUser.type === 'admin' ? 'Administrador' : 'Usuario Regular'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Registro</p>
                      <p className="font-medium text-gray-900">{authUser.createdAt ? formatDate(authUser.createdAt) : 'Fecha no disponible'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">🖼️</span>
                    <div>
                      <p className="text-sm text-gray-500">Foto de Perfil</p>
                      <p className="font-medium text-gray-900">
                        {authUser.profilePicture ? 'Configurada' : 'No configurada'}
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
                      <div>
                        <p className="text-sm text-gray-500">
                          {authUser?.type === "admin" 
                            ? "Total Donado a Adopta un Michi" 
                            : "Total Donado por ti"
                          }
                        </p>
                        <p className="font-medium text-gray-900">
                          ${totalDonations.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
        

                  <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-center"> 
                    <BackButton onClick={() => navigate('/visualizacion/MainPage')} />
                    <button
                      onClick={handleEditProfile}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <span className="text-lg">✏️</span>
                      Editar Perfil
                    </button>
                  </div>
            </div>
          </div>
        </div>
       
      </div>

      {/* Edit Profile Modal */}
      {authUser && (
        <EditProfileModal
          key={`edit-modal-${authUser.id}`}
          user={authUser}
          isOpen={isEditingProfile}
          onClose={handleCloseModal}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default UserProfileComponent;
