import React, { useState } from 'react';
import type { LoginData } from './types';
import { AiTwotoneMail } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";

const LoginForm: React.FC = () => {
  const [data, setData] = useState<LoginData>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: llamada al API para login !importante
    const success = true; // reemplazar con lógica real
    if (success) {
      // redirigir a inicio
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label className="block text-black font-semibold  mb-1">Correo institucional</label>
        <div className="relative">
          <span className="absolute right-5 top-5 -translate-y-1/2 text-gray-400">
              <AiTwotoneMail />
          </span>
        </div>

        <input
          type="email"
          className="w-full px-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500  bg-gray-100 hover:bg-gray-300 hover:shadow-md"
          placeholder="usuario@unal.edu.co"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="blocktext-black font-semibold  mb-1">Contraseña</label>
        <div className="relative">
            <span className="absolute right-5 top-5 -translate-y-1/2 text-gray-400">
                <FaLock />
            </span>
        </div>
        <input
          type="password"
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500  bg-gray-100 hover:bg-gray-300 hover:shadow-md"
          placeholder="Ingresa tu contraseña"
          value={data.password}
          onChange={e => setData({ ...data, password: e.target.value })}
        />
      </div>
      <div className="text-right mb-6">
        <a href="#" className="text-sm text-purple-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:font-semibold hover:bg-purple-800 transition"
      >
        Iniciar sesión
      </button>
    </form>
  );
};

export default LoginForm;
