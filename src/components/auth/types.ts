// Tipos de datos para autenticación
export type Tab = 'login' | 'register';

export type RegisterData = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};
