"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils/formatters";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const getStudentById = useStore((state) => state.getStudentById);
  const getClassById = useStore((state) => state.getClassById);
  const deleteStudent = useStore((state) => state.deleteStudent);
  const getPaymentsByStudent = useStore((state) => state.getPaymentsByStudent);
  const getAttendanceByStudent = useStore((state) => state.getAttendanceByStudent);
  const getGradesByStudent = useStore((state) => state.getGradesByStudent);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const user = useStore((state) => state.user);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const student = getStudentById(studentId);
  const classObj = student ? getClassById(student.classId) : null;
  const payments = student ? getPaymentsByStudent(student.id) : [];
  const attendance = student ? getAttendanceByStudent(student.id) : [];
  const grades = student ? getGradesByStudent(student.id) : [];
  
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-4">The student you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/admin/students")}>
            Back to Students
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteStudent(student.id);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.DELETE,
        entity: AuditEntity.STUDENT,
        entityId: student.id,
        details: `Deleted student record for ${student.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/students");
  };
  
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">{student.name}</h1>
            <p className="text-gray-600">Admission No: {student.admissionNo}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/dashboard/admin/students/${student.id}/edit`)}
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
          <h3 className="text-lg font-semibold text-dark mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-dark">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium text-dark">{formatDate(student.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium text-dark">{student.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-dark">{student.address}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Academic Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-medium text-dark">{classObj?.name || "Unassigned"}</p>
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
            <div>
              <p className="text-sm text-gray-600">Enrollment Date</p>
              <p className="font-medium text-dark">{formatDate(student.enrollmentDate)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Parent/Guardian</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-dark">{student.parentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact</p>
              <p className="font-medium text-dark">{formatPhone(student.parentContact)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-dark">{student.parentEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency Contact</p>
              <p className="font-medium text-dark">{formatPhone(student.emergencyContact)}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Fee Information</h3>
          <div className="space-y-3">
            <div className="p-3 bg-danger/10 rounded">
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-danger">
                {formatCurrency(student.feeBalance)}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded">
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recent Payments</p>
              <p className="font-medium text-dark">{payments.length} transactions</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Attendance</h3>
          <div className="space-y-3">
            <div className="p-3 bg-primary/10 rounded">
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="font-medium text-dark">{presentCount} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-medium text-dark">{attendance.length} days</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-dark mb-4">Academic Performance</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Subjects Graded</p>
              <p className="text-2xl font-bold text-dark">
                {new Set(grades.map(g => g.subject)).size}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Grades</p>
              <p className="font-medium text-dark">{grades.length} entries</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="font-medium text-dark">
                {grades.length > 0
                  ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold text-dark mb-4">Recent Payments</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payments recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Receipt No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm text-dark">{payment.receiptNo}</td>
                    <td className="px-4 py-3 text-sm text-dark">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3 text-sm text-dark">{payment.method}</td>
                    <td className="px-4 py-3 text-sm text-dark">{formatDate(payment.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Student"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{student.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Student
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}