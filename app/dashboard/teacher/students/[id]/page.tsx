"use client";

import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/formatters";
import { ArrowLeft } from "lucide-react";

export default function TeacherStudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const getStudentById = useStore((state) => state.getStudentById);
  const getClassById = useStore((state) => state.getClassById);
  const getAttendanceByStudent = useStore((state) => state.getAttendanceByStudent);
  const getGradesByStudent = useStore((state) => state.getGradesByStudent);
  
  const student = getStudentById(studentId);
  const classObj = student ? getClassById(student.classId) : null;
  const attendance = student ? getAttendanceByStudent(student.id) : [];
  const grades = student ? getGradesByStudent(student.id) : [];
  
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-4">The student you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/teacher/students")}>
            Back to Students
          </Button>
        </div>
      </div>
    );
  }
  
  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const attendanceRate = attendance.length > 0
    ? ((presentCount / attendance.length) * 100).toFixed(1)
    : "0.0";
  
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">{student.name}</h1>
          <p className="text-gray-600">Admission No: {student.admissionNo}</p>
        </div>
      </div>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> As a teacher, you have read-only access to student information. 
          Contact the administration for any updates needed.
        </p>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-dark">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Admission Number</p>
              <p className="font-medium text-dark">{student.admissionNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-medium text-dark">{classObj?.name || "Unassigned"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium text-dark">{student.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Boarding Status</p>
              <Badge variant={student.boardingStatus === "BOARDING" ? "info" : "default"}>
                {student.boardingStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant={student.status === "ACTIVE" ? "success" : "danger"}>
                {student.status}
              </Badge>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Academic Performance</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Subjects Graded</p>
              <p className="text-2xl font-bold text-dark">
                {new Set(grades.map((g) => g.subject)).size}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Grades</p>
              <p className="text-2xl font-bold text-dark">{grades.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-dark">
                {grades.length > 0
                  ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Attendance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
            <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Days Present</p>
            <p className="text-2xl font-bold text-dark">{presentCount}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Days</p>
            <p className="text-2xl font-bold text-dark">{attendance.length}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Recent Grades</h3>
        {grades.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No grades recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Subject</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Score</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Term</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.slice(0, 10).map((grade) => (
                  <tr key={grade.id}>
                    <td className="px-4 py-3 text-sm text-dark">{grade.subject}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant={
                          grade.grade === "A"
                            ? "success"
                            : grade.grade === "B"
                            ? "info"
                            : grade.grade === "C"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {grade.grade}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark">
                      {grade.score}/{grade.maxScore}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark">{grade.term.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{grade.comment || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}