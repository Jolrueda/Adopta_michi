export type Cat = {
    id: string;
    nombre: string;
    edad: number;
    descripcion: string;
    estado: 'Bueno' | 'Regular' | 'Critico';
    fecha_ingreso: string;
    condicion: string;
    disponibilidad: 'disponible' | 'adoptado';
    imagen: string;
    imagen2?: string;
    imagen3?: string;
};