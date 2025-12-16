export enum ClassType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
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