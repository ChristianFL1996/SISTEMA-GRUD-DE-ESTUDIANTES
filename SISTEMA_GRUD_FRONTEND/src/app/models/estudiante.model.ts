export interface Estudiante {
  id?: number;
  nombre: string;
  carnet: string;
  email: string;
  carrera: string;
  semestre: number;
  estado: string;
}

export interface EstudianteResponse {
  data: Estudiante[];
  total: number;
}
