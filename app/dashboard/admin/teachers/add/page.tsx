"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { TeacherStatus, AuditAction, AuditEntity } from "@/types";
import { generateId, generateEmployeeId } from "@/lib/utils/generators";
import { ArrowLeft } from "lucide-react";

const SUBJECTS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Science",
  "Social Studies",
  "Religious Education",
  "Physical Education",
  "Creative Arts",
  "Computer Studies",
  "Agriculture",
];

export default function AddTeacherPage() {
  const router = useRouter();
  const addTeacher = useStore((state) => state.addTeacher);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const classes = useStore((state) => state.classes);
  const teachers = useStore((state) => state.teachers);
  const user = useStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: [] as string[],
    assignedClasses: [] as string[],
    qualifications: "",
    address: "",
    emergencyContact: "",
  });
  
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTeacher = {
      id: generateId(),
      ...formData,
      status: TeacherStatus.ACTIVE,
      dateOfJoining: new Date().toISOString(),
      employeeId: generateEmployeeId(teachers.length + 1),
    };
    
    addTeacher(newTeacher);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.CREATE,
        entity: AuditEntity.TEACHER,
        entityId: newTeacher.id,
        details: `Created teacher record for ${newTeacher.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/teachers");
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleAddSubject = () => {
    if (selectedSubject && !formData.subjects.includes(selectedSubject)) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, selectedSubject],
      });
      setSelectedSubject("");
    }
  };
  
  const handleRemoveSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((s) => s !== subject),
    });
  };
  
  const handleAddClass = () => {
    if (selectedClass && !formData.assignedClasses.includes(selectedClass)) {
      setFormData({
        ...formData,
        assignedClasses: [...formData.assignedClasses, selectedClass],
      });
      setSelectedClass("");
    }
  };
  
  const handleRemoveClass = (classId: string) => {
    setFormData({
      ...formData,
      assignedClasses: formData.assignedClasses.filter((c) => c !== classId),
    });
  };
  
  const getClassName = (classId: string) => {
    return classes.find((c) => c.id === classId)?.name || "";
  };
  
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Teachers
        </button>
        <h1 className="text-3xl font-bold text-dark mb-2">Add New Teacher</h1>
        <p className="text-gray-600">Enter teacher information</p>
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
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+254..."
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
              label="Qualifications"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="e.g., Bachelor of Education"
              required
              className="md:col-span-2"
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
          
          <div>
            <label className="text-sm font-medium text-dark mb-2 block">
              Subjects
            </label>
            <div className="flex gap-2 mb-2">
              <Select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={[
                  { value: "", label: "Select a subject" },
                  ...SUBJECTS.map((s) => ({ value: s, label: s })),
                ]}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddSubject}>
                Add
              </Button>
            </div>
            {formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="hover:text-danger"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-dark mb-2 block">
              Assigned Classes
            </label>
            <div className="flex gap-2 mb-2">
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                  { value: "", label: "Select a class" },
                  ...classes.map((c) => ({ value: c.id, label: c.name })),
                ]}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddClass}>
                Add
              </Button>
            </div>
            {formData.assignedClasses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.assignedClasses.map((classId) => (
                  <span
                    key={classId}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                  >
                    {getClassName(classId)}
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(classId)}
                      className="hover:text-danger"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button type="submit">Add Teacher</Button>
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