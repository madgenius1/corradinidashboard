"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ExportDataType, ExportFormat, ExportStatus, AuditAction, AuditEntity } from "@/types";
import { generateId } from "@/lib/utils/generators";
import { ArrowLeft } from "lucide-react";

export default function ExportRequestPage() {
  const router = useRouter();
  const createExport = useStore((state) => state.createExport);
  const addAuditLog = useStore((state) => state.addAuditLog);
  const students = useStore((state) => state.students);
  const classes = useStore((state) => state.classes);
  const user = useStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    dataType: ExportDataType.STUDENT_RECORDS,
    format: ExportFormat.PDF,
    studentId: "",
    classId: "",
    justification: "",
    dateFrom: "",
    dateTo: "",
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exportRequest = {
      id: generateId(),
      requestedBy: user?.name || "Admin",
      dataType: formData.dataType,
      format: formData.format,
      status: ExportStatus.PENDING,
      studentId: formData.studentId || undefined,
      classId: formData.classId || undefined,
      dateRange: formData.dateFrom && formData.dateTo ? {
        from: formData.dateFrom,
        to: formData.dateTo,
      } : undefined,
      justification: formData.justification,
      createdAt: new Date().toISOString(),
    };
    
    createExport(exportRequest);
    
    if (user) {
      addAuditLog({
        id: generateId(),
        userId: user.id,
        userName: user.name,
        action: AuditAction.CREATE,
        entity: AuditEntity.EXPORT,
        entityId: exportRequest.id,
        details: `Created export request for ${formData.dataType}`,
        timestamp: new Date().toISOString(),
      });
    }
    
    router.push("/dashboard/admin/exports");
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
          Back to Exports
        </button>
        <h1 className="text-3xl font-bold text-dark mb-2">New Export Request</h1>
        <p className="text-gray-600">Request data export for records</p>
      </div>
      
      <Card className="bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Export requests require approval before data can be downloaded. 
          Please provide a clear justification for your request.
        </p>
      </Card>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Data Type"
              name="dataType"
              value={formData.dataType}
              onChange={handleChange}
              options={[
                { value: ExportDataType.STUDENT_RECORDS, label: "Student Records" },
                { value: ExportDataType.FEE_RECORDS, label: "Fee Records" },
                { value: ExportDataType.ATTENDANCE_RECORDS, label: "Attendance Records" },
                { value: ExportDataType.GRADE_RECORDS, label: "Grade Records" },
                { value: ExportDataType.FULL_REPORT, label: "Full Report" },
              ]}
              required
            />
            
            <Select
              label="Export Format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              options={[
                { value: ExportFormat.PDF, label: "PDF" },
                { value: ExportFormat.EXCEL, label: "Excel" },
                { value: ExportFormat.CSV, label: "CSV" },
              ]}
              required
            />
            
            <Select
              label="Specific Student (Optional)"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              options={[
                { value: "", label: "All Students" },
                ...students.map((s) => ({
                  value: s.id,
                  label: `${s.name} (${s.admissionNo})`,
                })),
              ]}
            />
            
            <Select
              label="Specific Class (Optional)"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              options={[
                { value: "", label: "All Classes" },
                ...classes.map((c) => ({
                  value: c.id,
                  label: c.name,
                })),
              ]}
            />
            
            <Input
              label="Date From (Optional)"
              name="dateFrom"
              type="date"
              value={formData.dateFrom}
              onChange={handleChange}
            />
            
            <Input
              label="Date To (Optional)"
              name="dateTo"
              type="date"
              value={formData.dateTo}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-dark mb-1 block">
              Justification
            </label>
            <textarea
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Please provide a reason for this export request..."
              required
            />
          </div>
          
          <div className="flex gap-4">
            <Button type="submit">Submit Request</Button>
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