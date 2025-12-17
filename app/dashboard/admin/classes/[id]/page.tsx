"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { Student } from "@/types";
import { ArrowLeft, Edit, Trash2, ClipboardCheck, BookOpen } from "lucide-react";
import { AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  
  const getClassById = useStore((state) => state.getClassById);
  const getTeacherById = useStore((state) => state.getTeacherById);
  const getStudentsByClass = useStore((state) => state.getStudentsByClass);
  const deleteClass = useStore((state) => state.deleteClass);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const user = useStore((state) => state.user);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const classObj = getClassById(classId);
  const teacher = classObj ? getTeacherById(classObj.teacherId) : null;
  const students = classObj ? getStudentsByClass(classObj.id) : [];
  
  if (!classObj) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Class Not Found</h2>
          <p className="text-gray-600 mb-4">The class you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/admin/classes")}>
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteClass(classObj.id);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.DELETE,
        entity: AuditEntity.CLASS,
        entityId: classObj.id,
        details: `Deleted class ${classObj.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/classes");
  };
  
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
    <div className="space-y-6 max-w-6xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classes
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">{classObj.name}</h1>
            <p className="text-gray-600">Room {classObj.room}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/dashboard/admin/classes/${classObj.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Class Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Class Name</p>
              <p className="font-medium text-dark">{classObj.name}</p>
            </div>
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
          <h3 className="text-lg font-semibold text-dark mb-4">Teacher Information</h3>
          {teacher ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-dark">{teacher.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-dark">{teacher.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-dark">{teacher.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No teacher assigned</p>
          )}
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Statistics</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-dark">{classObj.studentCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="text-2xl font-bold text-dark">{classObj.capacity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Seats</p>
              <p className="text-2xl font-bold text-primary">
                {classObj.capacity - classObj.studentCount}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {classObj.subjects.map((subject) => (
            <Badge key={subject} variant="info">
              {subject}
            </Badge>
          ))}
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark">
            Students ({students.length})
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push(`/dashboard/teacher/attendance/${classObj.id}`)}
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => router.push(`/dashboard/teacher/grades/${classObj.id}`)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Enter Grades
            </Button>
          </div>
        </div>
        
        <Table
          columns={studentColumns}
          data={students}
          onRowClick={(student) =>
            router.push(`/dashboard/admin/students/${student.id}`)
          }
          emptyMessage="No students in this class yet"
        />
      </Card>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Class"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{classObj.name}</strong>? 
            This action cannot be undone. Students will need to be reassigned.
          </p>
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Class
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}