export enum ClassType {
  PRIMARY = "LOWER",
  SECONDARY = "UPPER",
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  type: ClassType;
  capacity: number;
  studentCount: number;
  room: string;
  subjects: string[];
}