import type {Cat} from "../visualizacion/typesCat";

export type AdoptionRequest = {
    id: string; // ID único de la solicitud
    catId: string; // ID del gato asociado
    name: string;
    phone: string;
    email: string;
    message?: string; // Mensaje opcional
    status: 'pendiente' | 'aceptada' | 'rechazada'; // Estado de la solicitud
};


export type RequestCardProps = {
    request: AdoptionRequest;
    catDetails?: Cat;
}