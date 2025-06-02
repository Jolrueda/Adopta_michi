import React, { useState } from 'react';
import type { RegisterData } from './types';
import { FaUser } from "react-icons/fa6";
import { AiTwotoneMail } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";
import { registerUser } from '../../utils/db';

const RegisterForm: React.FC = () => {
  const [data, setData] = useState<RegisterData>({ fullName: '', email: '', password: '', type: 'regular' });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para checkbox de admin

  const validate = (): boolean => {
    const errs: Partial<RegisterData> = {};
    if (!data.fullName) errs.fullName = 'El nombre completo es obligatorio.';
    if (!/^[\w._%+-]+@unal\.edu\.co$/.test(data.email)) errs.email = 'Debe usar un correo @unal.edu.co';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,]).{8,}$/.test(data.password)) {
      errs.password = 'La contraseña debe tener 8+ caracteres, mayúscula, minúscula, número y caracter especial.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validate()) return;

    try {
      await registerUser({ ...data, type: isAdmin ? 'admin' : 'regular' });
      setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setData({ fullName: '', email: '', password: '', type: 'regular' });
      setErrors({});
      setShowPassword(false);
      setIsAdmin(false); // Resetear checkbox
    } catch (err) {
      setErrors(prev => ({ ...prev, email: (err as Error).message }));
    }
  };

  return (
      <form onSubmit={handleSubmit} noValidate>
        {successMessage && <p className="text-sm text-green-600 mb-4">{successMessage}</p>}

        <div className="mb-4">
          <label className="block text-black font-semibold mb-1">Nombre completo</label>
          <div className="relative">
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
              <FaUser />
            </span>
            <input
                type="text"
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 hover:bg-gray-300 hover:shadow-md"
                placeholder="Tu nombre completo"
                value={data.fullName}
                onChange={e => setData({ ...data, fullName: e.target.value })}
            />
          </div>
          {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-black font-semibold mb-1">Correo institucional</label>
          <div className="relative">
            <span className="absolute right-5 top-5 -translate-y-1/2 text-gray-400">
              <AiTwotoneMail />
            </span>
            <input
                type="email"
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 hover:bg-gray-300 hover:shadow-md"
                placeholder="usuario@unal.edu.co"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
            />
          </div>
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div className="mb-2">
          <label className="block text-black font-semibold mb-1">Contraseña</label>
          <div className="relative">
            <span className="absolute right-5 top-5 -translate-y-1/2 text-gray-400">
              <FaLock />
            </span>
            <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 hover:bg-gray-300 hover:shadow-md"
                placeholder="Mínimo 8 caracteres"
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
            />
          </div>
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div className="mb-1 flex items-center">
          <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
              className="mr-2"
          />
          <label htmlFor="isAdmin" className="text-black select-none cursor-pointer">
            Registrarse como usuario admin
          </label>
        </div>

        <div className="mb-6 flex items-center">
          <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
          />
          <label htmlFor="showPassword" className="text-black select-none cursor-pointer">
            Mostrar contraseña
          </label>
        </div>

        <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:font-semibold hover:bg-purple-800 transition"
        >
          Registrarse
        </button>
      </form>
  );
};

export default RegisterForm;
