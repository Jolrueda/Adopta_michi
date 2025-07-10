import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { User} from '../../types/Auth/AuthTypes';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    profilePicture: user?.profilePicture || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar formData solo cuando se abre el modal por primera vez
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: user?.fullName || '',
        profilePicture: user?.profilePicture || '',
      });
    }
  }, [isOpen]); // Solo depende de isOpen, no de user

  const validateForm = () => {
    const newErrors: Record<string, string> = {};


    if (formData.profilePicture && !formData.profilePicture.startsWith('data:') && !/^https?:\/\/.+/.test(formData.profilePicture)) {
      newErrors.profilePicture = 'La URL de la imagen debe ser válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular llamada a API
      
      
      // Solo enviar al backend los campos realmente modificados
      const updated: Partial<User> = {};

      const trimmedName = formData.fullName.trim();
      if (trimmedName !== (user.fullName || '').trim()) {
        updated.fullName = trimmedName;
      }

      if (formData.profilePicture !== (user.profilePicture || '')) {
        // Validar tamaño de imagen base64 para evitar errores 431
        if (formData.profilePicture.startsWith('data:') && formData.profilePicture.length > 1000000) {
          alert('La imagen es demasiado grande. Por favor selecciona una imagen más pequeña.');
          return;
        }
        updated.profilePicture = formData.profilePicture;
      }

      // Si no hay cambios, simplemente cerrar el modal
      if (Object.keys(updated).length === 0) {
        onClose();
        return;
      }

      onSave(updated);
      
      onClose();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        handleInputChange('profilePicture', reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-white bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal panel */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Editar Perfil
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <span className="w-8 h-8 flex items-center justify-center text-xl leading-none bg-red-600 text-white rounded-full transform transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-90">&times;</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Perfil (URL o archivo)
              </label>
              <input
                type="url"
                value={formData.profilePicture.startsWith('data:') ? '' : formData.profilePicture}
                onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
                placeholder="https://ejemplo.com/mi-foto.jpg"
              />
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors mb-2"
              >
                Seleccionar archivo
              </label>
              {errors.profilePicture && (
                <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
              )}
              {formData.profilePicture && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={formData.profilePicture}
                    alt="Vista previa"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80x80/7C3AED/FFFFFF?text=?';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tu nombre completo"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email eliminado: solo se edita nombre y foto */}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 