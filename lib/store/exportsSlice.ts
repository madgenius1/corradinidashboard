import { StateCreator } from "zustand";
import { ExportRequest, ExportStatus } from "@/types";

export interface ExportsSlice {
  exports: ExportRequest[];
  setExports: (exports: ExportRequest[]) => void;
  createExport: (exportRequest: ExportRequest) => void;
  approveExport: (id: string, approvedBy: string) => void;
  rejectExport: (id: string, reason: string) => void;
  getExportById: (id: string) => ExportRequest | undefined;
}

export const createExportsSlice: StateCreator<ExportsSlice> = (set, get) => ({
  exports: [],
  
  setExports: (exports) => set({ exports }),
  
  createExport: (exportRequest) =>
    set((state) => ({
      exports: [...state.exports, exportRequest],
    })),
    
  approveExport: (id, approvedBy) =>
    set((state) => ({
      exports: state.exports.map((e) =>
        e.id === id
          ? {
              ...e,
              status: ExportStatus.APPROVED,
              approvedBy,
              completedAt: new Date().toISOString(),
            }
          : e
      ),
    })),
    
  rejectExport: (id, reason) =>
    set((state) => ({
      exports: state.exports.map((e) =>
        e.id === id
          ? {
              ...e,
              status: ExportStatus.REJECTED,
              rejectionReason: reason,
            }
          : e
      ),
    })),
    
  getExportById: (id) => {
    return get().exports.find((e) => e.id === id);
  },
});