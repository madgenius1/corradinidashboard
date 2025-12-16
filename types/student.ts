export enum BoardingStatus {
  DAY = "DAY",
  BOARDING = "BOARDING",
}

export enum StudentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  classId: string;
  boardingStatus: BoardingStatus;
  status: StudentStatus;
  parentName: string;
  parentContact: string;
  parentEmail: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  address: string;
  emergencyContact: string;
  medicalInfo?: string;
  enrollmentDate: string;
  feeBalance: number;
}