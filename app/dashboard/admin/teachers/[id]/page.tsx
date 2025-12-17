"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDate, formatPhone } from "@/lib/utils/formatters";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";

export default function TeacherDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  
  const getTeacherById = useStore((state) => state.getTeacherById);
  const deleteTeacher = useStore((state) => state.deleteTeacher);
  const classes = useStore((state) => state.classes);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const user = useStore((state) => state.user);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const teacher = getTeacherById(teacherId);
  const assignedClasses = teacher
    ? classes.filter((c) => teacher.assignedClasses.includes(c.id))
    : [];
  
  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Teacher Not Found</h2>
          <p className="text-gray-600 mb-4">The teacher you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/admin/teachers")}>
            Back to Teachers
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteTeacher(teacher.id);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.DELETE,
        entity: AuditEntity.TEACHER,
        entityId: teacher.id,
        details: `Deleted teacher record for ${teacher.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/teachers");
  };
  
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Teachers
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">{teacher.name}</h1>
            <p className="text-gray-600">Employee ID: {teacher.employeeId}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/dashboard/admin/teachers/${teacher.id}/edit`)}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-dark">{teacher.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-dark">{teacher.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-dark">{formatPhone(teacher.phone)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-dark">{teacher.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency Contact</p>
              <p className="font-medium text-dark">{formatPhone(teacher.emergencyContact)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Employment Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-medium text-dark">{teacher.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Joining</p>
              <p className="font-medium text-dark">{formatDate(teacher.dateOfJoining)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge
                variant={
                  teacher.status === "ACTIVE"
                    ? "success"
                    : teacher.status === "ON_LEAVE"
                    ? "warning"
                    : "default"
                }
              >
                {teacher.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Qualifications</p>
              <p className="font-medium text-dark">{teacher.qualifications}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {teacher.subjects.map((subject) => (
            <Badge key={subject} variant="info">
              {subject}
            </Badge>
          ))}
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">
          Assigned Classes ({assignedClasses.length})
        </h3>
        {assignedClasses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No classes assigned</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedClasses.map((classObj) => (
              <div
                key={classObj.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/admin/classes/${classObj.id}`)}
              >
                <h4 className="font-semibold text-dark mb-2">{classObj.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Room: {classObj.room}</p>
                  <p>Students: {classObj.studentCount}</p>
                  <p>Type: {classObj.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Classes</p>
            <p className="text-2xl font-bold text-dark">{assignedClasses.length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-dark">
              {assignedClasses.reduce((sum, c) => sum + c.studentCount, 0)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Subjects Teaching</p>
            <p className="text-2xl font-bold text-dark">{teacher.subjects.length}</p>
          </div>
        </div>
      </Card>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Teacher"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{teacher.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Teacher
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}