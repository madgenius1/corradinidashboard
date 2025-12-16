export enum Term {
  TERM_1 = "TERM_1",
  TERM_2 = "TERM_2",
  TERM_3 = "TERM_3",
}

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  grade: string;
  score: number;
  maxScore: number;
  term: Term;
  year: number;
  comment?: string;
  teacherId: string;
  createdAt: string;
}