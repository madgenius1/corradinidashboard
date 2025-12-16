import { Role } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  [Role.PRINCIPAL]: "Principal",
  [Role.BURSAR]: "Bursar",
  [Role.HEAD_OF_STUDIES]: "Head of Studies",
  [Role.TEACHER]: "Teacher",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [Role.PRINCIPAL]: "Full system access and oversight",
  [Role.BURSAR]: "Financial management and fee oversight",
  [Role.HEAD_OF_STUDIES]: "Academic oversight and curriculum management",
  [Role.TEACHER]: "Class management, attendance, and grading",
};

export const ADMIN_ROLES = [Role.PRINCIPAL, Role.BURSAR, Role.HEAD_OF_STUDIES];
export const TEACHER_ROLES = [Role.TEACHER];

export const isAdmin = (role: Role): boolean => ADMIN_ROLES.includes(role);
export const isTeacher = (role: Role): boolean => TEACHER_ROLES.includes(role);