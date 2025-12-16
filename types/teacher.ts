export enum TeacherStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedClasses: string[];
  status: TeacherStatus;
  dateOfJoining: string;
  employeeId: string;
  qualifications: string;
  address: string;
  emergencyContact: string;
}