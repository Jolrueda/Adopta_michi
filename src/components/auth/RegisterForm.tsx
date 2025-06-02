import React, { useState } from 'react';
import type { RegisterData } from '../../types/Auth/AuthTypes';
import { FaUser } from "react-icons/fa6";
import { AiTwotoneMail } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";


const RegisterForm: React.FC = () => {
  const [data, setData] = useState<RegisterData>({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const validate = (): boolean => {
    const errs: Partial<RegisterData> = {};
    if (!data.fullName) errs.fullName = 'El nombre completo es obligatorio.';
    if (!/^[\w._%+-]+@unal\.edu\.co$/.test(data.email)) errs.email = 'Debe usar un correo @unal.edu.co';
    if (!/(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(data.password)) {
      errs.password = 'La contraseña debe tener 8+ caracteres, mayúscula, minúscula, número y caracter especial.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: llamada al API para registro !importante
    alert('Registro exitoso!');
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label className="block text-black font-semibold mb-1 bold">Nombre completo</label>
        <div className="relative">
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
            <FaUser />
          </span>
          <input
            type="text"
            className="w-full  px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 hover:bg-gray-300 hover:shadow-md"
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
        </div>
        <input
          type="email"
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500  bg-gray-100 hover:bg-gray-300 hover:shadow-md"
          placeholder="usuario@unal.edu.co"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-black font-semibold mb-1">Contraseña</label>
        <div className="relative">
          <span className="absolute right-5 top-5 -translate-y-1/2 text-gray-400">
            <FaLock />
          </span>
        </div>
        <input
          type="password"
          className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500  bg-gray-100 hover:bg-gray-300 hover:shadow-md"
          placeholder="Mínimo 8 caracteres"
          value={data.password}
          onChange={e => setData({ ...data, password: e.target.value })}
        />
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:font-semibold hover:bg-purple-800 transition"
      >
        Registrarse
      </button>
    </form>
  );
};

export default RegisterForm;
