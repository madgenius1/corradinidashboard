import { StateCreator } from "zustand";
import { Payment, FeeStructure } from "@/types";

export interface PaymentsSlice {
  payments: Payment[];
  feeStructures: FeeStructure[];
  setPayments: (payments: Payment[]) => void;
  setFeeStructures: (feeStructures: FeeStructure[]) => void;
  addPayment: (payment: Payment) => void;
  updateFeeStructure: (id: string, feeStructure: Partial<FeeStructure>) => void;
  getPaymentsByStudent: (studentId: string) => Payment[];
  getTotalPaidByStudent: (studentId: string) => number;
}

export const createPaymentsSlice: StateCreator<PaymentsSlice> = (set, get) => ({
  payments: [],
  feeStructures: [],
  
  setPayments: (payments) => set({ payments }),
  
  setFeeStructures: (feeStructures) => set({ feeStructures }),
  
  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),
    
  updateFeeStructure: (id, feeStructureUpdate) =>
    set((state) => ({
      feeStructures: state.feeStructures.map((f) =>
        f.id === id ? { ...f, ...feeStructureUpdate } : f
      ),
    })),
    
  getPaymentsByStudent: (studentId) => {
    return get().payments.filter((p) => p.studentId === studentId);
  },
  
  getTotalPaidByStudent: (studentId) => {
    return get()
      .payments.filter((p) => p.studentId === studentId)
      .reduce((total, payment) => total + payment.amount, 0);
  },
});