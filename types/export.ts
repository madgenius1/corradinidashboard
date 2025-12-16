export enum ExportStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum ExportDataType {
  STUDENT_RECORDS = "STUDENT_RECORDS",
  FEE_RECORDS = "FEE_RECORDS",
  ATTENDANCE_RECORDS = "ATTENDANCE_RECORDS",
  GRADE_RECORDS = "GRADE_RECORDS",
  FULL_REPORT = "FULL_REPORT",
}

export enum ExportFormat {
  PDF = "PDF",
  EXCEL = "EXCEL",
  CSV = "CSV",
}

export interface ExportRequest {
  id: string;
  requestedBy: string;
  dataType: ExportDataType;
  format: ExportFormat;
  status: ExportStatus;
  studentId?: string;
  classId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  justification: string;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  completedAt?: string;
}