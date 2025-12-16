import { StateCreator } from "zustand";
import { User, Role } from "@/types";

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setRole: (role: Role) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
    
  setRole: (role) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            role,
          }
        : null,
    })),
    
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
});