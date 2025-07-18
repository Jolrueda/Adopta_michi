import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginData } from '../../types/Auth/AuthTypes';
import { loginUser } from '../../utils/db';
import { useAuth } from '../../contexts/AuthContext';
import { AiTwotoneMail } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";
import PasswordResetModal from './PasswordResetModal';

const LoginForm: React.FC = () => {
    const [data, setData] = useState<LoginData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir
    const { setUser } = useAuth(); // Hook para manejar autenticación

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reiniciar error

        try {
            console.log('LoginForm: Intentando hacer login con:', data.email);
            const user = await loginUser(data.email, data.password);
            console.log('LoginForm: Usuario obtenido:', user);
            
            // Guardar la información del usuario en el contexto
            setUser(user);
            console.log('LoginForm: Usuario establecido en contexto');

            
            navigate("/visualizacion/MainPage"); // Redirige a MainPage
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <label className="block text-black font-semibold mb-1">Correo institucional</label>
                    <div className="relative">
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
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
                </div>

                <div className="mb-2">
                    <label className="block text-black font-semibold mb-1">Contraseña</label>
                    <div className="relative">
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaLock />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100 hover:bg-gray-300 hover:shadow-md"
                            placeholder="Ingresa tu contraseña"
                            value={data.password}
                            onChange={e => setData({ ...data, password: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mb-4 flex items-center">
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

                <div className="text-right mb-6">
                    <button
                        type="button"
                        onClick={() => setIsPasswordResetModalOpen(true)}
                        className="text-sm text-purple-600 hover:underline focus:outline-none"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:font-semibold hover:bg-purple-800 transition"
                >
                    Iniciar sesión
                </button>
            </form>

            {/* Modal de restablecimiento de contraseña - fuera del formulario */}
            <PasswordResetModal
                isOpen={isPasswordResetModalOpen}
                onClose={() => setIsPasswordResetModalOpen(false)}
            />
        </>
    );
};

export default LoginForm;
