interface InfoGridProps {
    age: string;
    health: string;
    description: {
      title: string;
      subtitle?: string;
    };
    medicalConditions: {
      title: string;
      subtitle: string;
    };
}

export type { InfoGridProps };