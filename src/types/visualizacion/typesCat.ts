export type Cat = {
    id_gato: string;
    id: string;
    nombre: string;
    edad: number;
    descripcion: string;
    estado: 'Bueno' | 'Regular' | 'Critico';
    fecha_ingreso: string;
    condicion: string;
    disponibilidad: 'disponible' | 'adoptado' | 'en proceso';
    imagen: string;
    imagen2?: string;
    imagen3?: string;
};