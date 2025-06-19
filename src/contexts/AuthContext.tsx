import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/Auth/AuthTypes';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser) as User;
                setUser(parsedUser);
            } catch (error) {
                console.error('Error al cargar usuario desde localStorage:', error);
                localStorage.removeItem('authUser'); // Limpia datos corruptos
            }
        }
    }, []);

    // Sincronizar usuario con localStorage al cambiar
    useEffect(() => {
        if (user) {
            const currentLocalStorageUser = localStorage.getItem('authUser');
            const userString = JSON.stringify(user);
            if (currentLocalStorageUser !== userString) {
                localStorage.setItem('authUser', userString);
            }
        } else {
            localStorage.removeItem('authUser');
        }
    }, [user]);

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('authUser');
    };

    // Verificaciones
    const isAuthenticated = Boolean(user);
    const isAdmin = user?.type === 'admin';

    // Proveer valores al contexto
    const value: AuthContextType = {
        user,
        setUser,
        logout,
        isAuthenticated,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
