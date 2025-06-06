export type Cat = {
    id: string;
    nombre: string;
    edad: number;
    descripcion: string;
    estado: 'Bueno' | 'Regular' | 'Critico';
    fecha_ingreso: string;
    condicion: string;
    imagen: string;
    imagen2?: string;
    imagen3?: string;
};