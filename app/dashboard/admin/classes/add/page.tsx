"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ClassType, AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";
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

export default function AddClassPage() {
  const router = useRouter();
  const addClass = useStore((state) => state.addClass);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const teachers = useStore((state) => state.teachers);
  const user = useStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    name: "",
    teacherId: teachers[0]?.id || "",
    type: ClassType.PRIMARY,
    capacity: "40",
    room: "",
    subjects: [] as string[],
  });
  
  const [selectedSubject, setSelectedSubject] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClass = {
      id: generateId(),
      name: formData.name,
      teacherId: formData.teacherId,
      type: formData.type,
      capacity: parseInt(formData.capacity),
      studentCount: 0,
      room: formData.room,
      subjects: formData.subjects.length > 0 ? formData.subjects : SUBJECTS.slice(0, 6),
    };
    
    addClass(newClass);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.CREATE,
        entity: AuditEntity.CLASS,
        entityId: newClass.id,
        details: `Created class ${newClass.name}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/classes");
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        <h1 className="text-3xl font-bold text-dark mb-2">Add New Class</h1>
        <p className="text-gray-600">Create a new class</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Class Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Grade 1, Form 2"
              required
            />
            
            <Select
              label="Assign Teacher"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              options={teachers.map((t) => ({ value: t.id, label: t.name }))}
              required
            />
            
            <Select
              label="Class Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: ClassType.PRIMARY, label: "Primary" },
                { value: ClassType.SECONDARY, label: "Secondary" },
              ]}
              required
            />
            
            <Input
              label="Capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Room Number"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="e.g., Room 101"
              required
              className="md:col-span-2"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-dark mb-2 block">
              Subjects (Optional - defaults will be applied)
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
          
          <div className="flex gap-4">
            <Button type="submit">Add Class</Button>
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