import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GraciasPorTuDonacion: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extraer los datos de la navegación
    const { selectedAmount, customAmount } = location.state || {};

    // Manejar casos en los que los datos no estén disponibles
    if (!selectedAmount && !customAmount) {
        navigate("/donacion");
        return null; // Evitar renderizar contenido si no hay datos
    }

    return (
        <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">¡Gracias por tu donación!</h2>
            <p className="text-lg mb-2">
                Hemos recibido tu donación de{" "}
                <span className="font-semibold text-purple-800">
                    ${selectedAmount ?? Number(customAmount).toLocaleString()}
                </span>
                .
            </p>
            <p className="mb-6">Puedes ver cuanto has donado en tu perfil.</p>
            <button
                onClick={() => navigate("/donacion")}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
            >
                Realizar otra donación
            </button>
        </div>
    );
};

export default GraciasPorTuDonacion;
