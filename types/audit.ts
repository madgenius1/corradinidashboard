export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  VIEW = "VIEW",
  EXPORT = "EXPORT",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export enum AuditEntity {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  CLASS = "CLASS",
  ATTENDANCE = "ATTENDANCE",
  GRADE = "GRADE",
  PAYMENT = "PAYMENT",
  EXPORT = "EXPORT",
  USER = "USER",
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}