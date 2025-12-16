export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateAdmissionNumber = (year: number, sequence: number): string => {
  return `ADM${year}${sequence.toString().padStart(4, "0")}`;
};

export const generateEmployeeId = (sequence: number): string => {
  return `EMP${sequence.toString().padStart(4, "0")}`;
};

export const generateReceiptNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `RCP${year}${month}${random}`;
};

export const generateClassCode = (className: string): string => {
  return className.toUpperCase().replace(/\s+/g, "");
};