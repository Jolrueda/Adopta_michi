interface FilterBarProps {
    onFilterChange: (newFilters: { nombre: string; minAge: string; maxAge: string; estado: string, disponibilidad: string }) => void;
    filters: {
        nombre: string;
        minAge: string;
        maxAge: string;
        estado: string;
        disponibilidad: string;
    };
}

export type { FilterBarProps };