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

    // Cargar usuario del localStorage al inicializar
    useEffect(() => {
        const savedUser = localStorage.getItem('authUser');
        console.log('AuthContext: Valor guardado en localStorage:', savedUser);
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                console.log('AuthContext: Usuario parseado:', parsedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error al cargar usuario guardado:', error);
                localStorage.removeItem('authUser');
            }
        } else {
            console.log('AuthContext: No hay usuario guardado en localStorage');
            // Usuario de prueba temporal para desarrollo
            const testUser: User = {
                id: '1',
                fullName: 'Usuario de Prueba',
                email: 'test@unal.edu.co',
                password: '123456',
                type: 'admin',
                createdAt: new Date()
            };
            console.log('AuthContext: Estableciendo usuario de prueba:', testUser);
            setUser(testUser);
        }
    }, []);

    // Guardar usuario en localStorage cuando cambie
    useEffect(() => {
        console.log('AuthContext: Usuario cambió a:', user);
        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
            console.log('AuthContext: Usuario guardado en localStorage');
        } else {
            localStorage.removeItem('authUser');
            console.log('AuthContext: Usuario removido del localStorage');
        }
    }, [user]);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authUser');
    };

    const isAuthenticated = user !== null;
    const isAdmin = user?.type === 'admin';

    const value: AuthContextType = {
        user,
        setUser,
        logout,
        isAuthenticated,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 