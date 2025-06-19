export type Tab = 'login' | 'register';

export type RegisterData = {
  fullName: string;
  email: string;
  password: string;
  type: 'admin' | 'regular'; // Para registrar si es admin o usuario regular
};


export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  type: 'admin' | 'regular'; // distinguir roles
  createdAt: Date;
};

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  type: 'admin' | 'regular';
  createdAt: Date;
  // Estadísticas de administrador
  adoptionsManaged?: number;
  totalDonated?: number;
};

