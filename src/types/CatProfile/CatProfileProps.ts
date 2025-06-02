interface CatProfileProps {
    name: string;
    status: 'Disponible' | 'No disponible' | 'Adoptado';
    images: string[];
    age: string;
    health: string;
    description: {
      title: string;
      subtitle: string;
    };
    medicalConditions: {
      title: string;
      subtitle: string;
    };
}

export type { CatProfileProps };
  