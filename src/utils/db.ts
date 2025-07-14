import type { User } from '../types/Auth/AuthTypes';
import type {Cat} from "../types/visualizacion/typesCat.ts";
import type { Donation } from '../types/Donaciones/Donation.ts';
import { v4 as uuidv4 } from "uuid";

const BASE_URL_USERS = '/api/auth';
const BASE_URL_CATS = '/api/cats';
const BASE_URL_ADOPTION_REQUESTS = '/api/adoptions';
const BASE_URL_DONACIONES = '/api/donations';

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(BASE_URL_USERS);
    if (!response.ok) {
        throw new Error('Error al obtener usuarios.');
    }
    return response.json();
};

export const registerUser = async (user: { fullName: string; email: string; password: string; type: 'admin' | 'regular' }): Promise<void> => {
    const response = await fetch(`${BASE_URL_USERS}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const { message } = await response.json().catch(() => ({}));
        throw new Error(message || 'Error al registrar el usuario.');
    }
};

export const updateCat = async (catId: string, updatedCat: Partial<Cat>): Promise<Cat> => {
    const response = await fetch(`${BASE_URL_CATS}/${catId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updatedCat),
    });
  
    if (!response.ok) {
      throw new Error('Error al actualizar los datos del gato.');
    }
  
    return response.json();
  };

export const loginUser = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${BASE_URL_USERS}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const { message } = await response.json().catch(() => ({}));
        throw new Error(message || 'Correo o contraseña incorrectos.');
    }

    const { user, token } = await response.json();
    if (token) {
        localStorage.setItem('token', token);
    }
    return user;
};

export const createCat = async (cat: Omit<Cat, 'id' | 'id_gato'>): Promise<Cat> => {
    const response = await fetch(BASE_URL_CATS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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

    // Permitir tanto formato antiguo (array) como nuevo ({ cats, total })
    const catsArray: Cat[] = Array.isArray(data) ? data : Array.isArray(data.cats) ? data.cats : [];

    // Mapear data para que cumpla con el tipo Cat
    return catsArray.map((cat: any) => ({
        id: String(cat.id || cat.id_gato),
        id_gato: String(cat.id_gato || cat.id),
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
    })) as Cat[];
};

export const updateCatAvailability = async (catId: string, disponibilidad: string): Promise<Cat> => {
    const response = await fetch(`${BASE_URL_CATS}/${catId}/availability`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
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
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ ...request, status: 'pendiente' }), // Agregar status por defecto
    });

    if (!response.ok) {
        throw new Error('Error al enviar la solicitud de adopción.');
    }
};

export const fetchAdoptionRequests = async (): Promise<{ id: string; catId: string; name: string; phone: string; email: string; message: string; status: string; }[]> => {
    const response = await fetch(BASE_URL_ADOPTION_REQUESTS, {
        headers: { ...getAuthHeaders() },
    });
    if (!response.ok) {
        throw new Error('Error al obtener las solicitudes de adopción.');
    }

    const data = await response.json();
    // Normalizar catId (puede venir como catid desde el backend)
    return data.map((r: any) => ({
        ...r,
        catId: String(r.catId ?? r.catid),
    }));
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
            ...getAuthHeaders(),
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
            ...getAuthHeaders(),
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

// Función para verificar si existe un usuario con el email dado
export const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const response = await fetch(`${BASE_URL_USERS}?email=${email}`, {
            method: 'GET',
            cache: 'no-store', // evita respuesta 304 del navegador
        });

        // Si el servidor respondió con error, lanzar excepción
        if (!response.ok && response.status !== 304) {
            throw new Error('Error al buscar usuario.');
        }

        const data = await response.json();

        // Asegurarse de que 'data' sea un arreglo o un objeto de usuario
        const user = Array.isArray(data) ? data[0] : data;

        return user ? user : null;
    } catch (error) {
        console.error('findUserByEmail: Error al buscar usuario:', error);
        throw new Error('No se pudo buscar el usuario.');
    }
};


// Función para actualizar la contraseña de un usuario
export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL_USERS}/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la contraseña.');
        }
    } catch (error) {
        console.error('updateUserPassword: Error al actualizar contraseña:', error);
        throw new Error('No se pudo actualizar la contraseña.');
    }
};

// Función para generar un código de verificación (simulado)
export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
};

// Función para simular el envío de email (en producción sería un servicio real)
export const sendPasswordResetEmail = async (email: string, verificationCode: string): Promise<void> => {
    // Simulamos el envío de email
    console.log(`Enviando código de verificación ${verificationCode} a ${email}`);
    
    // En una aplicación real, aquí enviarías un email real
    // Por ahora solo simulamos el delay del envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Guardamos el código temporalmente en localStorage para simulación
    localStorage.setItem(`reset_code_${email}`, verificationCode);
    localStorage.setItem(`reset_code_time_${email}`, Date.now().toString());
};

// Función para verificar el código de verificación
export const verifyResetCode = (email: string, code: string): boolean => {
    const storedCode = localStorage.getItem(`reset_code_${email}`);
    const codeTime = localStorage.getItem(`reset_code_time_${email}`);
    
    if (!storedCode || !codeTime) {
        return false;
    }
    
    // El código expira en 10 minutos (600000 ms)
    const isExpired = (Date.now() - parseInt(codeTime)) > 600000;
    
    if (isExpired) {
        localStorage.removeItem(`reset_code_${email}`);
        localStorage.removeItem(`reset_code_time_${email}`);
        return false;
    }
    
    return storedCode === code;
};

// Función para limpiar el código de verificación después de usar
export const clearResetCode = (email: string): void => {
    localStorage.removeItem(`reset_code_${email}`);
    localStorage.removeItem(`reset_code_time_${email}`);
};

// Crear una donación
export const createDonation = async (donation: Omit<Donation, "id">): Promise<Donation> => {
    const response = await fetch(BASE_URL_DONACIONES, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ id: uuidv4(), ...donation }),
    });

    if (!response.ok) {
        throw new Error("Error al registrar la donación.");
    }

    return response.json();
};

// Obtener todas las donaciones
export const fetchDonations = async (): Promise<Donation[]> => {
    const response = await fetch(BASE_URL_DONACIONES, { headers: getAuthHeaders() });
    if (!response.ok) {
        throw new Error("Error al obtener las donaciones.");
    }
    return response.json();
};

// Función para actualizar datos de un usuario (nombre, email, foto de perfil, etc.)
export const updateUser = async (userId: string, updatedFields: Partial<User>): Promise<User> => {
    const response = await fetch(`/api/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar los datos del usuario.');
    }

    return response.json();
};

// Obtener perfil del usuario autenticado
export const fetchProfile = async (): Promise<User> => {
    const response = await fetch(`${BASE_URL_USERS}/profile`, { headers: getAuthHeaders() });
    if (!response.ok) {
        throw new Error('Error al obtener el perfil.');
    }
    return response.json();
};

// Función para limpiar datos corruptos del localStorage
export const clearCorruptedAuth = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    console.log('🧹 Datos de autenticación limpiados');
};

// Helper para añadir el token JWT a las peticiones protegidas
export const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    
    if (token) {
        // Si el token es demasiado grande, está corrupto
        if (token.length > 8000) {
            console.warn('🚨 Token corrupto detectado, limpiando...', token.length);
            clearCorruptedAuth();
            
            // Mostrar alerta y redirigir suavemente
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
            return {};
        }
        
        return { Authorization: `Bearer ${token}` };
    }
    
    // Solo log cuando no hay token (situación importante)
    console.warn('❌ No hay token disponible - usuario no autenticado');
    return {};
};