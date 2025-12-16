import {
  Student,
  Teacher,
  Class,
  Attendance,
  Grade,
  Payment,
  BoardingStatus,
  StudentStatus,
  TeacherStatus,
  ClassType,
  AttendanceStatus,
  Term,
  PaymentMethod,
  PaymentStatus,
} from "@/types";
import {
  generateId,
  generateAdmissionNumber,
  generateEmployeeId,
  generateReceiptNumber,
} from "./generators";
import {
  DUMMY_FIRST_NAMES,
  DUMMY_LAST_NAMES,
  DUMMY_PARENT_NAMES,
  CLASS_NAMES,
  ROOMS,
  DUMMY_SUBJECTS,
} from "../constants/dummy-data";

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateTeachers = (count: number = 15): Teacher[] => {
  const teachers: Teacher[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(DUMMY_FIRST_NAMES);
    const lastName = getRandomItem(DUMMY_LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    
    teachers.push({
      id: generateId(),
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.com`,
      phone: `+254${Math.floor(700000000 + Math.random() * 99999999)}`,
      subjects: getRandomItems(DUMMY_SUBJECTS, Math.floor(Math.random() * 3) + 2),
      assignedClasses: [],
      status: TeacherStatus.ACTIVE,
      dateOfJoining: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), 1).toISOString(),
      employeeId: generateEmployeeId(i + 1),
      qualifications: "Bachelor of Education",
      address: `${Math.floor(Math.random() * 999) + 1} Nairobi Street, Nairobi`,
      emergencyContact: `+254${Math.floor(700000000 + Math.random() * 99999999)}`,
    });
  }
  
  return teachers;
};

export const generateClasses = (teachers: Teacher[]): Class[] => {
  const classes: Class[] = [];
  
  CLASS_NAMES.forEach((className, index) => {
    const teacher = teachers[index % teachers.length];
    const classType = index < 6 ? ClassType.PRIMARY : ClassType.SECONDARY;
    
    const classObj: Class = {
      id: generateId(),
      name: className,
      teacherId: teacher.id,
      type: classType,
      capacity: 40,
      studentCount: 0,
      room: ROOMS[index],
      subjects: classType === ClassType.PRIMARY 
        ? DUMMY_SUBJECTS.slice(0, 6)
        : DUMMY_SUBJECTS,
    };
    
    classes.push(classObj);
    teacher.assignedClasses.push(classObj.id);
  });
  
  return classes;
};

export const generateStudents = (classes: Class[], count: number = 200): Student[] => {
  const students: Student[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomItem(DUMMY_FIRST_NAMES);
    const lastName = getRandomItem(DUMMY_LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const classObj = getRandomItem(classes);
    const boardingStatus = Math.random() > 0.6 ? BoardingStatus.BOARDING : BoardingStatus.DAY;
    
    students.push({
      id: generateId(),
      admissionNo: generateAdmissionNumber(currentYear, i + 1),
      name,
      classId: classObj.id,
      boardingStatus,
      status: StudentStatus.ACTIVE,
      parentName: getRandomItem(DUMMY_PARENT_NAMES),
      parentContact: `+254${Math.floor(700000000 + Math.random() * 99999999)}`,
      parentEmail: `parent${i + 1}@email.com`,
      dateOfBirth: new Date(2008 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      gender: Math.random() > 0.5 ? "MALE" : "FEMALE",
      address: `${Math.floor(Math.random() * 999) + 1} Street, Nairobi`,
      emergencyContact: `+254${Math.floor(700000000 + Math.random() * 99999999)}`,
      medicalInfo: Math.random() > 0.8 ? "No known allergies" : undefined,
      enrollmentDate: new Date(2023, 0, 1).toISOString(),
      feeBalance: Math.floor(Math.random() * 50000),
    });
    
    classObj.studentCount++;
  }
  
  return students;
};

export const generateAttendance = (
  students: Student[],
  classes: Class[],
  days: number = 30
): Attendance[] => {
  const attendance: Attendance[] = [];
  const today = new Date();
  
  for (let day = 0; day < days; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    
    students.forEach((student) => {
      const classObj = classes.find((c) => c.id === student.classId);
      if (!classObj) return;
      
      const random = Math.random();
      let status: AttendanceStatus;
      
      if (random > 0.95) {
        status = AttendanceStatus.ABSENT;
      } else if (random > 0.9) {
        status = AttendanceStatus.LATE;
      } else {
        status = AttendanceStatus.PRESENT;
      }
      
      attendance.push({
        id: generateId(),
        studentId: student.id,
        classId: classObj.id,
        date: date.toISOString().split("T")[0],
        status,
        markedBy: classObj.teacherId,
        notes: status === AttendanceStatus.ABSENT ? "Sick" : undefined,
      });
    });
  }
  
  return attendance;
};

export const generateGrades = (
  students: Student[],
  classes: Class[]
): Grade[] => {
  const grades: Grade[] = [];
  const currentYear = new Date().getFullYear();
  
  students.forEach((student) => {
    const classObj = classes.find((c) => c.id === student.classId);
    if (!classObj) return;
    
    classObj.subjects.forEach((subject) => {
      const score = Math.floor(Math.random() * 40) + 60;
      const maxScore = 100;
      let grade: string;
      
      if (score >= 80) grade = "A";
      else if (score >= 70) grade = "B";
      else if (score >= 60) grade = "C";
      else if (score >= 50) grade = "D";
      else grade = "E";
      
      grades.push({
        id: generateId(),
        studentId: student.id,
        classId: classObj.id,
        subject,
        grade,
        score,
        maxScore,
        term: Term.TERM_1,
        year: currentYear,
        comment: score >= 70 ? "Good performance" : "Needs improvement",
        teacherId: classObj.teacherId,
        createdAt: new Date().toISOString(),
      });
    });
  });
  
  return grades;
};

export const generatePayments = (students: Student[]): Payment[] => {
  const payments: Payment[] = [];
  
  students.forEach((student, index) => {
    const paymentCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < paymentCount; i++) {
      const amount = [10000, 15000, 20000, 25000][Math.floor(Math.random() * 4)];
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      payments.push({
        id: generateId(),
        studentId: student.id,
        amount,
        method: getRandomItem([
          PaymentMethod.CASH,
          PaymentMethod.MPESA,
          PaymentMethod.BANK_TRANSFER,
        ]),
        status: PaymentStatus.COMPLETED,
        date: date.toISOString(),
        receiptNo: generateReceiptNumber(),
        description: `Term ${i + 1} fees payment`,
        recordedBy: "Bursar",
      });
    }
  });
  
  return payments;
};