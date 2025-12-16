import { StateCreator } from "zustand";
import { Grade } from "@/types";

export interface GradesSlice {
  grades: Grade[];
  setGrades: (grades: Grade[]) => void;
  addGrade: (grade: Grade) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  getGradesByStudent: (studentId: string) => Grade[];
  getGradesByClass: (classId: string, subject?: string) => Grade[];
}

export const createGradesSlice: StateCreator<GradesSlice> = (set, get) => ({
  grades: [],
  
  setGrades: (grades) => set({ grades }),
  
  addGrade: (grade) =>
    set((state) => {
      const existing = state.grades.find(
        (g) =>
          g.studentId === grade.studentId &&
          g.subject === grade.subject &&
          g.term === grade.term &&
          g.year === grade.year
      );
      
      if (existing) {
        return {
          grades: state.grades.map((g) =>
            g.id === existing.id ? grade : g
          ),
        };
      }
      
      return {
        grades: [...state.grades, grade],
      };
    }),
    
  updateGrade: (id, gradeUpdate) =>
    set((state) => ({
      grades: state.grades.map((g) =>
        g.id === id ? { ...g, ...gradeUpdate } : g
      ),
    })),
    
  getGradesByStudent: (studentId) => {
    return get().grades.filter((g) => g.studentId === studentId);
  },
  
  getGradesByClass: (classId, subject) => {
    return get().grades.filter(
      (g) => g.classId === classId && (!subject || g.subject === subject)
    );
  },
});