"use client";

import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Student } from "@/types";
import { ArrowLeft, ClipboardCheck, BookOpen } from "lucide-react";

export default function TeacherClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  
  const getClassById = useStore((state) => state.getClassById);
  const getStudentsByClass = useStore((state) => state.getStudentsByClass);
  
  const classObj = getClassById(classId);
  const students = classObj ? getStudentsByClass(classObj.id) : [];
  
  if (!classObj) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Class Not Found</h2>
          <p className="text-gray-600 mb-4">The class you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/teacher/classes")}>
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }
  
  const studentColumns = [
    {
      header: "Admission No",
      accessor: "admissionNo" as keyof Student,
    },
    {
      header: "Name",
      accessor: "name" as keyof Student,
    },
    {
      header: "Boarding Status",
      accessor: (row: Student) => (
        <Badge variant={row.boardingStatus === "BOARDING" ? "info" : "default"}>
          {row.boardingStatus}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: (row: Student) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Classes
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">{classObj.name}</h1>
            <p className="text-gray-600">Room {classObj.room}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/dashboard/teacher/attendance/${classObj.id}`)}
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(`/dashboard/teacher/grades/${classObj.id}`)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Enter Grades
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Class Info</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Room</p>
              <p className="font-medium text-dark">{classObj.room}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <Badge variant="info">{classObj.type}</Badge>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Students</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-dark">{classObj.studentCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="font-medium text-dark">{classObj.capacity}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Subjects</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Teaching</p>
            <p className="text-2xl font-bold text-dark">{classObj.subjects.length}</p>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Class Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {classObj.subjects.map((subject) => (
            <Badge key={subject} variant="info">
              {subject}
            </Badge>
          ))}
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">
          Student List ({students.length})
        </h3>
        <Table
          columns={studentColumns}
          data={students}
          onRowClick={(student) =>
            router.push(`/dashboard/teacher/students/${student.id}`)
          }
          emptyMessage="No students in this class"
        />
      </Card>
    </div>
  );
}