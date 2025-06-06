import React, {useState} from 'react';
import { updateCatAvailability } from '../../utils/db';
import { IoReturnDownBackOutline, IoPersonOutline, IoCallOutline, IoMailOutline } from "react-icons/io5";

interface AdoptionFormProps {
  catId: string;
  onClose?: () => void;
  onSuccess?: () => void;
  status: string; 
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ catId, onClose, onSuccess}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error de email cuando el usuario escribe
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const validateEmail = (email: string) => {
    return email.endsWith('@unal.edu.co');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar correo
    if (!validateEmail(formData.email)) {
      setEmailError('El correo debe ser del dominio @unal.edu.co');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Actualizar la disponibilidad del gato a "En proceso de adopción"
      await updateCatAvailability(catId, 'adoptado');
      
     
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al actualizar la disponibilidad:', error);
      alert('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Título */}
      <h1 className="text-3xl font-semibold mb-6">Solicitud de adopción</h1>

      {/* Contenedor del formulario */}
      <div className=" p-6 rounded-lg">
            <div className='bg-purple-200 mb-6 p-3 rounded-lg'>
                <h2 className="text-xl font-semibold mb-2">Formulario</h2>
                <p className="text-gray-600 mb-6">
                Completa los datos para solicitar la adopción de este gato.
                </p>
            </div>
        

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre completo */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                className="w-full p-3 pr-10 border border-gray-300 bg-gray-100 rounded-lg focus:border-transparent"
                required
              />
              <IoPersonOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+57 3001234567"
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg bg-gray-100 focus:border-transparent"
                required
              />
              <IoCallOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
            </div>
          </div>

          {/* Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@unal.edu.co"
                className={`w-full p-3 pr-10 border rounded-lg bg-gray-100 focus:border-transparent ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              <IoMailOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
            </div>
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          {/* Mensaje adicional */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje adicional (opcional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Cuéntanos por qué quieres adoptar"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:border-transparent resize-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            {/* Botón de envío */}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
            {/* Botón para volver (opcional) */}
            {onClose && (
              <button
                onClick={onClose}
                className="w-20 h-12 p-2 bg-purple-200 rounded-2xl text-gray-600 hover:text-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
                title="Volver al perfil del gato"
                aria-label="Volver al perfil del gato"
              >
                <IoReturnDownBackOutline className="text-black font-bold text-2xl" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;