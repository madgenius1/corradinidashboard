"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AttendanceStatus, AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";
import { ArrowLeft } from "lucide-react";

export default function AttendancePage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  
  const user = useStore((state) => state.user);
  const getClassById = useStore((state) => state.getClassById);
  const getStudentsByClass = useStore((state) => state.getStudentsByClass);
  const getAttendanceByClass = useStore((state) => state.getAttendanceByClass);
  const markAttendance = useStore((state) => state.markAttendance);
  const addAuditLog = useStore((state) => state.addAuditLog);
  
  const classObj = getClassById(classId);
  const students = getStudentsByClass(classId);
  
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, AttendanceStatus>
  >({});
  
  useEffect(() => {
    const existingAttendance = getAttendanceByClass(classId, selectedDate);
    const map: Record<string, AttendanceStatus> = {};
    
    existingAttendance.forEach((a) => {
      map[a.studentId] = a.status;
    });
    
    students.forEach((s) => {
      if (!map[s.id]) {
        map[s.id] = AttendanceStatus.PRESENT;
      }
    });
    
    setAttendanceMap(map);
  }, [classId, selectedDate, students, getAttendanceByClass]);
  
  const handleToggle = (studentId: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]:
        prev[studentId] === AttendanceStatus.PRESENT
          ? AttendanceStatus.ABSENT
          : AttendanceStatus.PRESENT,
    }));
  };
  
  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newMap[s.id] = status;
    });
    setAttendanceMap(newMap);
  };
  
  const handleSave = () => {
    students.forEach((student) => {
      markAttendance({
        id: generateId(),
        studentId: student.id,
        classId,
        date: selectedDate,
        status: attendanceMap[student.id],
        markedBy: user?.id || "",
      });
    });
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.CREATE,
        entity: AuditEntity.ATTENDANCE,
        details: `Marked attendance for ${classObj?.name} on ${selectedDate}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/teacher/classes");
  };
  
  if (!classObj) {
    return <div>Class not found</div>;
  }
  
  const presentCount = Object.values(attendanceMap).filter(
    (s) => s === AttendanceStatus.PRESENT
  ).length;
  
  const absentCount = Object.values(attendanceMap).filter(
    (s) => s === AttendanceStatus.ABSENT
  ).length;
  
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classes
        </button>
        <h1 className="text-3xl font-bold text-dark mb-2">Mark Attendance</h1>
        <p className="text-gray-600">{classObj.name}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-end">
          <Button
            size="sm"
            onClick={() => handleMarkAll(AttendanceStatus.PRESENT)}
          >
            Mark All Present
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleMarkAll(AttendanceStatus.ABSENT)}
          >
            Mark All Absent
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-dark">{students.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Present</p>
            <p className="text-3xl font-bold text-primary">{presentCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Absent</p>
            <p className="text-3xl font-bold text-danger">{absentCount}</p>
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="space-y-2">
          {students.map((student) => {
            const status = attendanceMap[student.id];
            const isPresent = status === AttendanceStatus.PRESENT;
            
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                  isPresent
                    ? "bg-primary/5 border-primary"
                    : "bg-danger/5 border-danger"
                }`}
              >
                <div>
                  <h3 className="font-semibold text-dark">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    {student.admissionNo}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(student.id)}
                  className={`px-6 py-2 rounded font-medium transition-colors ${
                    isPresent
                      ? "bg-primary text-light"
                      : "bg-danger text-light"
                  }`}
                >
                  {isPresent ? "Present" : "Absent"}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
      
      <div className="flex gap-4">
        <Button onClick={handleSave}>Save Attendance</Button>
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}