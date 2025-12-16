import { StateCreator } from "zustand";
import { Attendance, AttendanceStatus } from "@/types";

export interface AttendanceSlice {
  attendance: Attendance[];
  setAttendance: (attendance: Attendance[]) => void;
  markAttendance: (attendance: Attendance) => void;
  updateAttendance: (id: string, status: AttendanceStatus) => void;
  getAttendanceByClass: (classId: string, date: string) => Attendance[];
  getAttendanceByStudent: (studentId: string) => Attendance[];
}

export const createAttendanceSlice: StateCreator<AttendanceSlice> = (set, get) => ({
  attendance: [],
  
  setAttendance: (attendance) => set({ attendance }),
  
  markAttendance: (attendanceRecord) =>
    set((state) => {
      const existing = state.attendance.find(
        (a) =>
          a.studentId === attendanceRecord.studentId &&
          a.classId === attendanceRecord.classId &&
          a.date === attendanceRecord.date
      );
      
      if (existing) {
        return {
          attendance: state.attendance.map((a) =>
            a.id === existing.id ? attendanceRecord : a
          ),
        };
      }
      
      return {
        attendance: [...state.attendance, attendanceRecord],
      };
    }),
    
  updateAttendance: (id, status) =>
    set((state) => ({
      attendance: state.attendance.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),
    
  getAttendanceByClass: (classId, date) => {
    return get().attendance.filter(
      (a) => a.classId === classId && a.date === date
    );
  },
  
  getAttendanceByStudent: (studentId) => {
    return get().attendance.filter((a) => a.studentId === studentId);
  },
});