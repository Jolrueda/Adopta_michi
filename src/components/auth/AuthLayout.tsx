import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import type { Tab } from '../../types/Auth/AuthTypes';

const AuthLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('register');

  return (
    <div className="max-w-4xl mx-auto mt-16 p-6 bg-white shadow-2xl rounded-3xl">
      <h1 className="text-2xl font-bold text-center mb-6">ADOPTA UN MICHI</h1>
      <div className="flex justify-center space-x-8 mb-6">
        <button
          className={`pb-1 border-b-2 ${activeTab === 'login' ? ' font-bold border-purple-900 text-purple-700' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('login')}
        >
          Iniciar sesión
        </button>
        <button
          className={`pb-1 border-b-2  ${activeTab === 'register' ? ' font-bold border-purple-900 text-purple-700' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('register')}
        >
          Registrarse
        </button>
      </div>
      {activeTab === 'register' ? <RegisterForm /> : <LoginForm />}
    </div>
  );
};


export default AuthLayout;
