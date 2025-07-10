import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnDownBackOutline } from "react-icons/io5";
import {
    fetchAdoptionRequests,
    filterPendingAdoptionRequests,
    filterHistoricalAdoptionRequests,
    fetchCats,
    updateCatAvailability,
} from "../../utils/db";
import type { AdoptionRequest } from "../../types/adopcion/AdoptionRequest";
import type { Cat } from "../../types/visualizacion/typesCat";
import RequestCard from "./RequestCard.tsx";

const AdoptionRequestsPage: React.FC = () => {
    const [pendingRequests, setPendingRequests] = useState<AdoptionRequest[]>([]);
    const [historicalRequests, setHistoricalRequests] = useState<AdoptionRequest[]>([]);
    const [cats, setCats] = useState<Record<string, Cat>>({});
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        try {
            const [requests, catsData] = await Promise.all([
                fetchAdoptionRequests(),
                fetchCats(),
            ]);

            // Filtrar solicitudes pendientes y solicitudes históricas
            const pendingRequests = filterPendingAdoptionRequests(requests);
            const historicalRequests = filterHistoricalAdoptionRequests(requests);

            // Crear un mapa de gatos para facilitar el acceso por ID
            const catsMap = catsData.reduce((map, cat) => {
                map[cat.id] = cat;
                return map;
            }, {} as Record<string, Cat>);

            setPendingRequests(pendingRequests);
            setHistoricalRequests(historicalRequests);
            setCats(catsMap);

            // Si no hay solicitudes pendientes, restablecer gatos "en proceso" a "disponible"
            if (pendingRequests.length === 0) {
                const catsEnProceso = catsData.filter(
                    (c) => c.disponibilidad === "en proceso"
                );
                await Promise.all(
                    catsEnProceso.map((cat) =>
                        updateCatAvailability(cat.id, "disponible")
                    )
                );
                // Refrescar gatos en memoria
                if (catsEnProceso.length) {
                    const refreshed = await fetchCats();
                    const refreshedMap = refreshed.reduce((m, c) => {
                        m[c.id] = c;
                        return m;
                    }, {} as Record<string, Cat>);
                    setCats(refreshedMap);
                }
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("Hubo un problema al cargar las solicitudes de adopción.");
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate("/visualizacion/MainPage")}
                className="w-20 h-12 p-2 bg-purple-200 rounded-2xl text-gray-600 hover:text-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg mb-6"
            >
                <IoReturnDownBackOutline className="text-black font-bold text-2xl" />
            </button>

            {/* Sección de solicitudes pendientes */}
            <h1 className="text-3xl font-semibold mb-6">Solicitudes de adopción pendientes</h1>
            {pendingRequests.length === 0 ? (
                <p className="text-gray-600">No hay solicitudes pendientes.</p>
            ) : (
                <ul className="space-y-4">
                    {pendingRequests.map((request) => (
                        <RequestCard key={request.id} request={request} catDetails={cats[String(request.catId)]} onActionComplete={loadData} />
                    ))}
                </ul>
            )}

            {/* Sección de historial de solicitudes */}
            <h1 className="text-3xl font-semibold mt-10 mb-6">Historial de solicitudes</h1>
            {historicalRequests.length === 0 ? (
                <p className="text-gray-600">No hay solicitudes en el historial.</p>
            ) : (
                <ul className="space-y-4">
                    {historicalRequests.map((request) => (
                        <RequestCard key={request.id} request={request} catDetails={cats[String(request.catId)]} onActionComplete={loadData} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdoptionRequestsPage;
