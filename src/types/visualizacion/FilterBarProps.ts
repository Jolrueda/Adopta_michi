interface FilterBarProps {
    onFilterChange: (newFilters: { nombre: string; minAge: string; maxAge: string; estado: string }) => void;
    filters: { nombre: string; minAge: string; maxAge: string; estado: string };
}

export type { FilterBarProps };