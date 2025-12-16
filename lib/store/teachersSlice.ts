import { StateCreator } from "zustand";
import { Teacher } from "@/types";

export interface TeachersSlice {
  teachers: Teacher[];
  setTeachers: (teachers: Teacher[]) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  getTeacherById: (id: string) => Teacher | undefined;
}

export const createTeachersSlice: StateCreator<TeachersSlice> = (set, get) => ({
  teachers: [],
  
  setTeachers: (teachers) => set({ teachers }),
  
  addTeacher: (teacher) =>
    set((state) => ({
      teachers: [...state.teachers, teacher],
    })),
    
  updateTeacher: (id, teacherUpdate) =>
    set((state) => ({
      teachers: state.teachers.map((t) =>
        t.id === id ? { ...t, ...teacherUpdate } : t
      ),
    })),
    
  deleteTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((t) => t.id !== id),
    })),
    
  getTeacherById: (id) => {
    return get().teachers.find((t) => t.id === id);
  },
});