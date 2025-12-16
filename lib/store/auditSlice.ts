import { StateCreator } from "zustand";
import { AuditLog } from "@/types";

export interface AuditSlice {
  auditLogs: AuditLog[];
  setAuditLogs: (logs: AuditLog[]) => void;
  addAuditLog: (log: AuditLog) => void;
  getAuditLogsByUser: (userId: string) => AuditLog[];
  getAuditLogsByEntity: (entity: string) => AuditLog[];
}

export const createAuditSlice: StateCreator<AuditSlice> = (set, get) => ({
  auditLogs: [],
  
  setAuditLogs: (logs) => set({ auditLogs: logs }),
  
  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [log, ...state.auditLogs],
    })),
    
  getAuditLogsByUser: (userId) => {
    return get().auditLogs.filter((log) => log.userId === userId);
  },
  
  getAuditLogsByEntity: (entity) => {
    return get().auditLogs.filter((log) => log.entity === entity);
  },
});