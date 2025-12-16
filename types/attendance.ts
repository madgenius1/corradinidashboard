export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
}