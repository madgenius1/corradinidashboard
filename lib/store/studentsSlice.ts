import { StateCreator } from "zustand";
import { Student } from "@/types";

export interface StudentsSlice {
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  getStudentsByClass: (classId: string) => Student[];
}

export const createStudentsSlice: StateCreator<StudentsSlice> = (set, get) => ({
  students: [],
  
  setStudents: (students) => set({ students }),
  
  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, student],
    })),
    
  updateStudent: (id, studentUpdate) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === id ? { ...s, ...studentUpdate } : s
      ),
    })),
    
  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((s) => s.id !== id),
    })),
    
  getStudentById: (id) => {
    return get().students.find((s) => s.id === id);
  },
  
  getStudentsByClass: (classId) => {
    return get().students.filter((s) => s.classId === classId);
  },
});