import React from "react";
import type { RequestCardProps } from "../../types/adopcion/AdoptionRequest";
import { acceptAdoptionRequest, rejectAdoptionRequest } from "../../utils/db";

const RequestCard: React.FC<RequestCardProps> = ({ request, catDetails }) => {
    const handleAccept = async () => {
        try {
            if (!catDetails) {
                alert("No se puede procesar la solicitud sin los detalles del gato.");
                return;
            }
            await acceptAdoptionRequest(request.id, catDetails.id);
        } catch (error) {
            console.error("Error al aceptar la solicitud:", error);
            alert("Ocurrió un error al aceptar la solicitud.");
        }
    };

    const handleReject = async () => {
        try {
            if (!catDetails) {
                alert("No se puede procesar la solicitud sin los detalles del gato.");
                return;
            }
            await rejectAdoptionRequest(request.id, catDetails.id);
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            alert("Ocurrió un error al rechazar la solicitud.");
        }
    };

    return (
        <li className="p-4 border border-gray-300 rounded-lg bg-gray-100 flex flex-col sm:flex-row gap-4">
            {/* Imagen del gato */}
            {catDetails && (
                <img
                    src={catDetails.imagen}
                    alt={catDetails.nombre}
                    className="w-32 h-32 object-cover rounded-lg"
                />
            )}

            {/* Detalles de la solicitud */}
            <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                    <p>Solicitante: {request.name}</p>
                </h2>
                <p className="text-sm text-gray-600">
                    <strong>Teléfono:</strong> {request.phone}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Correo:</strong> {request.email}
                </p>
                {request.message && (
                    <p className="text-sm text-gray-600">
                        <strong>Mensaje:</strong> {request.message}
                    </p>
                )}

                {/* Detalles del gato */}
                {catDetails && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">
                            <strong>Gato:</strong> {catDetails.nombre}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Edad:</strong> {catDetails.edad} años
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Condición:</strong> {catDetails.condicion}
                        </p>
                    </div>
                )}

                {/* Resolución de la solicitud */}
                {(request.status === "aceptada" || request.status === "rechazada") && (
                    <p className="mt-4 text-lg font-semibold text-gray-900">
                        Resolución de la solicitud:{" "}
                        <span
                            className={`${
                                request.status === "aceptada" ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {request.status === "aceptada" ? "Aceptada" : "Rechazada"}
                        </span>
                    </p>
                )}
            </div>

            {/* Botones de acción */}
            {request.status === "pendiente" && (
                <div className="flex gap-4 mt-4 sm:mt-0 sm:flex-col justify-center items-center">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
                        onClick={handleAccept}
                    >
                        Aceptar
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all"
                        onClick={handleReject}
                    >
                        Rechazar
                    </button>
                </div>
            )}
        </li>
    );
};

export default RequestCard;
