import { StateCreator } from "zustand";
import { Class } from "@/types";

export interface ClassesSlice {
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  addClass: (classObj: Class) => void;
  updateClass: (id: string, classObj: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  getClassById: (id: string) => Class | undefined;
}

export const createClassesSlice: StateCreator<ClassesSlice> = (set, get) => ({
  classes: [],
  
  setClasses: (classes) => set({ classes }),
  
  addClass: (classObj) =>
    set((state) => ({
      classes: [...state.classes, classObj],
    })),
    
  updateClass: (id, classUpdate) =>
    set((state) => ({
      classes: state.classes.map((c) =>
        c.id === id ? { ...c, ...classUpdate } : c
      ),
    })),
    
  deleteClass: (id) =>
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
    })),
    
  getClassById: (id) => {
    return get().classes.find((c) => c.id === id);
  },
});