export enum PaymentMethod {
  CASH = "CASH",
  MPESA = "MPESA",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHEQUE = "CHEQUE",
}

export enum PaymentStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  receiptNo: string;
  description: string;
  recordedBy: string;
}

export interface FeeStructure {
  id: string;
  classId: string;
  tuitionFee: number;
  boardingFee: number;
  examFee: number;
  activityFee: number;
  totalFee: number;
  term: string;
}