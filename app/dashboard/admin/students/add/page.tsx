"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { BoardingStatus, StudentStatus, AuditAction, AuditEntity } from "@/types";
import { generateId, generateAdmissionNumber } from "@/lib/utils/generators";
import { ArrowLeft } from "lucide-react";

export default function AddStudentPage() {
  const router = useRouter();
  const addStudent = useStore((state) => state.addStudent);
  const addClass = useStore((state) => state.updateClass);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const classes = useStore((state) => state.classes);
  const students = useStore((state) => state.students);
  const user = useStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    name: "",
    classId: classes[0]?.id || "",
    boardingStatus: BoardingStatus.DAY,
    parentName: "",
    parentContact: "",
    parentEmail: "",
    dateOfBirth: "",
    gender: "MALE" as "MALE" | "FEMALE",
    address: "",
    emergencyContact: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentYear = new Date().getFullYear();
    const studentCount = students.length;
    
    const newStudent = {
      id: generateId(),
      admissionNo: generateAdmissionNumber(currentYear, studentCount + 1),
      ...formData,
      status: StudentStatus.ACTIVE,
      enrollmentDate: new Date().toISOString(),
      feeBalance: 0,
    };
    
    addStudent(newStudent);
    
    const selectedClass = classes.find((c) => c.id === formData.classId);
    if (selectedClass) {
      addClass(selectedClass.id, {
        studentCount: selectedClass.studentCount + 1,
      });
    }
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.CREATE,
        entity: AuditEntity.STUDENT,
        entityId: newStudent.id,
        details: `Created student record for ${newStudent.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/students");
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
        <h1 className="text-3xl font-bold text-dark mb-2">Add New Student</h1>
        <p className="text-gray-600">Enter student information</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Select
              label="Class"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              options={classes.map((c) => ({ value: c.id, label: c.name }))}
              required
            />
            
            <Select
              label="Boarding Status"
              name="boardingStatus"
              value={formData.boardingStatus}
              onChange={handleChange}
              options={[
                { value: BoardingStatus.DAY, label: "Day Scholar" },
                { value: BoardingStatus.BOARDING, label: "Boarding" },
              ]}
              required
            />
            
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: "MALE", label: "Male" },
                { value: "FEMALE", label: "Female" },
              ]}
              required
            />
            
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Parent Name"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Parent Contact"
              name="parentContact"
              type="tel"
              value={formData.parentContact}
              onChange={handleChange}
              placeholder="+254..."
              required
            />
            
            <Input
              label="Parent Email"
              name="parentEmail"
              type="email"
              value={formData.parentEmail}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Emergency Contact"
              name="emergencyContact"
              type="tel"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="+254..."
              required
            />
            
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="md:col-span-2"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <Button type="submit">Add Student</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}