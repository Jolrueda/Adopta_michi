import React from "react";
import { useNavigate } from "react-router-dom";

const Banner: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implementa la lógica de logout aquí
        console.log("Logout clicked");
        navigate("/");
    };

    const goToMainPage = () => {
        navigate("/visualizacion/MainPage");
    };

    const goToProfile = () => {
        navigate("/perfil");
    };

    return (
        <div className="flex justify-between items-center bg-purple-600 text-white p-4 rounded-lg shadow-md">

            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={goToMainPage}
            >
                <img
                    src="https://www.clker.com/cliparts/f/u/q/P/L/p/white-paw-print-hi.png"
                    alt="Cat Paw Logo"
                    className="w-10 h-10"
                />
                <h1 className="text-xl font-bold">ADOPTA UN MICHI</h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={goToProfile}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors duration-200"
                >
                    Mi Perfil
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-white text-purple-500 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-100"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default Banner;
