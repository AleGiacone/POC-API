export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estado: TaskStatus;
  fechaCreacion: Date;
}
