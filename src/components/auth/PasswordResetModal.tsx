import React, { useState } from 'react';
import { AiTwotoneMail } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { 
  findUserByEmail, 
  generateVerificationCode, 
  sendPasswordResetEmail, 
  verifyResetCode, 
  updateUserPassword, 
  clearResetCode 
} from '../../utils/db';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResetStep = 'email' | 'verification' | 'newPassword' | 'success';

const isValidPassword = (password: string) => {
  // Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,]).{8,}$/;
  return regex.test(password);
};

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const resetModal = () => {
    setStep('email');
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setIsLoading(false);
    setShowPassword(false);
    setUserId('');
    setGeneratedCode('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Verificar si el usuario existe
      const user = await findUserByEmail(email);
      if (!user) {
        setError('No encontramos una cuenta con este correo electrónico.');
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      // Generar y enviar código de verificación
      const code = generateVerificationCode();
      await sendPasswordResetEmail(email, code);
      
      // Guardar el código generado para mostrarlo al usuario
      setGeneratedCode(code);

      setStep('verification');
      setError(null);
    } catch (error) {
      setError('Error al enviar el código de verificación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verificationCode.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    if (verifyResetCode(email, verificationCode)) {
      setStep('newPassword');
      setError(null);
    } else {
      setError('Código incorrecto o expirado. Inténtalo de nuevo.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isValidPassword(newPassword)) {
      setError('La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y al menos un carácter especial.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      await updateUserPassword(userId, newPassword);
      clearResetCode(email);
      setStep('success');
    } catch (error) {
      setError('Error al actualizar la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    try {
      const code = generateVerificationCode();
      await sendPasswordResetEmail(email, code);
      setGeneratedCode(code);
      setError(null);
    } catch (error) {
      setError('Error al reenviar el código.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Restablecer Contraseña
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Paso 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AiTwotoneMail className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ingresa tu correo electrónico
                </h3>
                <p className="text-gray-600 text-sm">
                  Te enviaremos un código de verificación para restablecer tu contraseña.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <AiTwotoneMail />
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="usuario@unal.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
          )}

          {/* Paso 2: Verificación */}
          {step === 'verification' && (
            <form onSubmit={handleVerificationSubmit}>
                            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdVerified className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verifica tu código
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Hemos enviado un código de 6 dígitos a <span className="font-semibold">{email}</span>
                </p>
                
                {/* Alerta visual con el código de verificación */}
                {generatedCode && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-blue-800 font-semibold text-sm">Tu código de verificación:</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-blue-900 tracking-widest bg-white px-4 py-2 rounded border">
                          {generatedCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedCode);
                            alert('Código copiado al portapapeles');
                          }}
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                          title="Copiar código"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <p className="text-blue-700 text-xs mt-2">
                      Copia este código en el campo de abajo
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition mb-3"
              >
                Verificar código
              </button>

                              <button
                  type="button"
                  onClick={resendCode}
                  disabled={isLoading}
                  className="w-full text-purple-600 py-2 text-sm hover:underline disabled:opacity-50"
                >
                  {isLoading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                </button>
                
                {!isLoading && generatedCode && (
                  <p className="text-green-600 text-xs text-center mt-2">
                    ✓ Nuevo código generado arriba
                  </p>
                )}
            </form>
          )}

          {/* Paso 3: Nueva contraseña */}
          {step === 'newPassword' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLock className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nueva contraseña
                </h3>
                <p className="text-gray-600 text-sm">
                  Ingresa tu nueva contraseña. Debe tener mínimo 8 caracteres, e incluir mayúsculas, minúsculas, números y caracteres especiales.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingresa tu nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirma tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="showPasswordReset"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label htmlFor="showPasswordReset" className="text-gray-700 text-sm cursor-pointer">
                  Mostrar contraseñas
                </label>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          )}

          {/* Paso 4: Éxito */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Contraseña actualizada!
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal; 