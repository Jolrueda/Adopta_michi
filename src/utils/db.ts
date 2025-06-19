import type { User } from '../types/Auth/AuthTypes';
import type {Cat} from "../types/visualizacion/typesCat.ts";

const BASE_URL_USERS = 'http://localhost:3001/users';
const BASE_URL_CATS = 'http://localhost:3001/gatos';
const BASE_URL_ADOPTION_REQUESTS = 'http://localhost:3001/adoptionRequests';

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(BASE_URL_USERS);
    if (!response.ok) {
        throw new Error('Error al obtener usuarios.');
    }
    return response.json();
};

export const registerUser = async (user: User): Promise<void> => {
    const users = await getUsers();
    const userExists = users.some(u => u.email === user.email);

    if (userExists) {
        throw new Error('El correo ya está registrado.');
    }

    const response = await fetch(BASE_URL_USERS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error('Error al registrar el usuario.');
    }
};

export const updateCat = async (catId: string, updatedCat: Partial<Cat>): Promise<Cat> => {
    const response = await fetch(`${BASE_URL_CATS}/${catId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCat),
    });
  
    if (!response.ok) {
      throw new Error('Error al actualizar los datos del gato.');
    }
  
    return response.json();
  };
  

export const loginUser = async (email: string, password: string): Promise<User> => {
    console.log('loginUser: Intentando conectar a:', `${BASE_URL_USERS}?email=${email}&password=${password}`);
    
    try {
        const response = await fetch(`${BASE_URL_USERS}?email=${email}&password=${password}`);
        console.log('loginUser: Respuesta del servidor:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error('Error al buscar usuario.');
        }

        const users = await response.json();
        if (users.length === 0) {
            throw new Error('Correo o contraseña incorrectos.');
        }
        return users[0];
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
};

export const createCat = async (cat: Omit<Cat, 'id' | 'id_gato'>): Promise<Cat> => {
    const response = await fetch(BASE_URL_CATS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
  
    if (!response.ok) {
      throw new Error('Error al crear el gato.');
    }
  
    return response.json();
  };

export const fetchCats = async (): Promise<Cat[]> => {
    const response = await fetch(BASE_URL_CATS);
    if (!response.ok) {
        throw new Error('Error al obtener los gatos.');
    }
    const data = await response.json();

    // Mapear data para que cumpla con el tipo Cat
    return data.map((cat: Cat) => ({
        id: String(cat.id || cat.id_gato),
        nombre: cat.nombre,
        edad: cat.edad,
        descripcion: cat.descripcion,
        estado: cat.estado,
        fecha_ingreso: cat.fecha_ingreso,
        condicion: cat.condicion,
        disponibilidad: cat.disponibilidad,
        imagen: cat.imagen,
        imagen2: cat.imagen2,
        imagen3: cat.imagen3,
    }));
};

export const updateCatAvailability = async (catId: string, disponibilidad: string): Promise<Cat> => {
    const response = await fetch(`${BASE_URL_CATS}/${catId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disponibilidad }),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar la disponibilidad del gato.');
    }

    return response.json();
};

export const submitAdoptionRequest = async (request: {
    id: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    status: string;
}): Promise<void> => {
    const response = await fetch(BASE_URL_ADOPTION_REQUESTS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, status: 'pendiente' }), // Agregar status por defecto
    });

    if (!response.ok) {
        throw new Error('Error al enviar la solicitud de adopción.');
    }
};

export const fetchAdoptionRequests = async (): Promise<{ id: string; catId: string; name: string; phone: string; email: string; message: string; status: string; }[]> => {
    const response = await fetch(BASE_URL_ADOPTION_REQUESTS);
    if (!response.ok) {
        throw new Error('Error al obtener las solicitudes de adopción.');
    }
    return response.json();
};



export const filterPendingAdoptionRequests = (
    requests: { id: string; catId: string;  name: string; phone: string; email: string; message: string; status: string }[]
): { id: string; catId: string; name: string; phone: string; email: string; message: string; status: "pendiente" }[] => {
    return requests
        .filter((request) => request.status === "pendiente")
        .map((request) => ({
            ...request,
            status: request.status as "pendiente", // Garantizamos que el tipo sea correcto
        }));
};

export const filterHistoricalAdoptionRequests = (
    requests: { id: string; catId: string; name: string; phone: string; email: string; message: string; status: string }[]
): {
    id: string;
    catId: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    status: "aceptada" | "rechazada"
}[] => {
    return requests
        .filter((request) => request.status === "aceptada" || request.status === "rechazada")
        .map((request) => ({
            ...request,
            status: request.status as "aceptada" | "rechazada", // Garantizamos que el tipo sea correcto
        }));
};

export const acceptAdoptionRequest = async (requestId: string, catId: string): Promise<void> => {
    // Actualizar el estado de la solicitud a "aceptada"
    const response = await fetch(`${BASE_URL_ADOPTION_REQUESTS}/${requestId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'aceptada' }),
    });

    if (!response.ok) {
        throw new Error('Error al aceptar la solicitud de adopción.');
    }

    // Cambiar la disponibilidad del gato a "adoptado"
    await updateCatAvailability(catId, 'adoptado');
};


export const rejectAdoptionRequest = async (requestId: string, catId: string): Promise<void> => {
    // Actualizar el estado de la solicitud a "rechazada"
    const response = await fetch(`${BASE_URL_ADOPTION_REQUESTS}/${requestId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rechazada' }),
    });

    if (!response.ok) {
        throw new Error('Error al rechazar la solicitud de adopción.');
    }

    // Cambiar la disponibilidad del gato a "disponible"
    try {
        await updateCatAvailability(catId, 'disponible');
    } catch (error) {
        console.error('Error al actualizar la disponibilidad del gato:', error);
        throw new Error('No se pudo actualizar la disponibilidad del gato.');
    }
};

