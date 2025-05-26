import type {User} from '../components/auth/types.ts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener usuarios desde localStorage
export const getUsers = async (): Promise<User[]> => {
    await delay(500); // Simula un retraso
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

export const registerUser = async (user: User): Promise<void> => {
    return new Promise((resolve, reject) => {
        const usersStr = localStorage.getItem('users');
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        // Validar que no exista el correo
        if (users.some(u => u.email === user.email)) {
            reject(new Error('El correo ya está registrado.'));
            return;
        }

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        resolve();
    });
};

// Validar credenciales para login
export const loginUser = async (email: string, password: string): Promise<User> => {
    const users = await getUsers();
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        throw new Error('Correo o contraseña incorrectos.');
    }
    return user;
};
