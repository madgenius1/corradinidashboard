import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthSlice, createAuthSlice } from "./authSlice";
import { StudentsSlice, createStudentsSlice } from "./studentsSlice";
import { TeachersSlice, createTeachersSlice } from "./teachersSlice";
import { ClassesSlice, createClassesSlice } from "./classesSlice";
import { AttendanceSlice, createAttendanceSlice } from "./attendanceSlice";
import { GradesSlice, createGradesSlice } from "./gradesSlice";
import { PaymentsSlice, createPaymentsSlice } from "./paymentsSlice";
import { ExportsSlice, createExportsSlice } from "./exportsSlice";
import { AuditSlice, createAuditSlice } from "./auditSlice";
import {
  generateTeachers,
  generateClasses,
  generateStudents,
  generateAttendance,
  generateGrades,
  generatePayments,
} from "@/lib/utils/seed-data";

type StoreState = AuthSlice &
  StudentsSlice &
  TeachersSlice &
  ClassesSlice &
  AttendanceSlice &
  GradesSlice &
  PaymentsSlice &
  ExportsSlice &
  AuditSlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createStudentsSlice(...a),
      ...createTeachersSlice(...a),
      ...createClassesSlice(...a),
      ...createAttendanceSlice(...a),
      ...createGradesSlice(...a),
      ...createPaymentsSlice(...a),
      ...createExportsSlice(...a),
      ...createAuditSlice(...a),
    }),
    {
      name: "school-management-storage",
    }
  )
);

export const initializeStore = () => {
  const store = useStore.getState();
  
  if (store.students.length === 0) {
    const teachers = generateTeachers(15);
    const classes = generateClasses(teachers);
    const students = generateStudents(classes, 200);
    const attendance = generateAttendance(students, classes, 30);
    const grades = generateGrades(students, classes);
    const payments = generatePayments(students);
    
    store.setTeachers(teachers);
    store.setClasses(classes);
    store.setStudents(students);
    store.setAttendance(attendance);
    store.setGrades(grades);
    store.setPayments(payments);
  }
};