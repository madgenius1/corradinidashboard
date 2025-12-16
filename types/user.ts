export enum Role {
  PRINCIPAL = "PRINCIPAL",
  BURSAR = "BURSAR",
  HEAD_OF_STUDIES = "HEAD_OF_STUDIES",
  TEACHER = "TEACHER",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface UserSession {
  user: User | null;
  isAuthenticated: boolean;
}