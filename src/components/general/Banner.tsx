import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Banner: React.FC = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth(); // Obtener el usuario y la función de logout del contexto

    const handleLogout = () => {
        logout();
        navigate("/"); // Redirige a la página de inicio (login)
    };

    const goToMainPage = () => {
        navigate("/visualizacion/MainPage");
    };

    const goToProfile = () => {
        navigate("/perfil");
    };

    const goToRequests = () => {
        navigate("/solicitudes");
    };

    const goToDonacion = () => {
        navigate("/donacion");
    };

    const goToCrearGato = () => {
        navigate("/crear-gato");
    };

    return (
        <div className="flex flex-col md:flex-row md:justify-between items-center bg-purple-600 text-white p-4 rounded-lg shadow-md">
            {/* Logo y título */}
            <div
                className="flex items-center gap-2 cursor-pointer mb-4 md:mb-0"
                onClick={goToMainPage}
            >
                <img
                    src="https://www.clker.com/cliparts/f/u/q/P/L/p/white-paw-print-hi.png"
                    alt="Cat Paw Logo"
                    className="w-10 h-10"
                />
                <h1 className="text-xl font-bold">ADOPTA UN MICHI</h1>
            </div>

            {/* Botones */}
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full md:w-auto">
                {user?.type === "admin" && (
                    <>
                        <button
                            onClick={goToRequests}
                            className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200"
                        >
                            Solicitudes de adopción
                        </button>
                        <button
                            onClick={goToCrearGato}
                            className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200"
                        >
                            Crear Gato
                        </button>
                    </>
                )}
                {user?.type === "regular" && (
                    <>
                        <button
                            onClick={goToDonacion}
                            className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200"
                        >
                            Donar
                        </button>
                    </>
                )}
                <button
                    onClick={goToProfile}
                    className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200"
                >
                    Mi Perfil
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full md:w-auto bg-white text-purple-500 font-semibold px-6 py-2 rounded-lg shadow hover:bg-purple-100"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default Banner;
