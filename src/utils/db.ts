import type { User } from '../types/Auth/AuthTypes';


const BASE_URL_USERS = 'http://localhost:3001/users';
const BASE_URL_CATS = 'http://localhost:3001/gatos';

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

export const loginUser = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${BASE_URL_USERS}?email=${email}&password=${password}`);
    if (!response.ok) {
        throw new Error('Error al buscar usuario.');
    }

    const users = await response.json();
    if (users.length === 0) {
        throw new Error('Correo o contraseña incorrectos.');
    }
    return users[0];
};


export type Cat = {
    id: string;
    nombre: string;
    edad: number;
    descripcion: string;
    estado: 'Bueno' | 'Regular' | 'Critico';
    fecha_ingreso: string;
    condicion: string;
    disponibilidad: string;
    imagen: string;
    imagen2?: string;
    imagen3?: string;
};


export const fetchCats = async (): Promise<Cat[]> => {
    const response = await fetch(BASE_URL_CATS);
    if (!response.ok) {
        throw new Error('Error al obtener los gatos.');
    }
    const data = await response.json();

    // Mapear data para que cumpla con el tipo Cat
    return data.map((cat: any) => ({
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


