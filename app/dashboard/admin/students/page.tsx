"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Student, StudentStatus } from "@/types";
import { Plus, Search } from "lucide-react";

export default function StudentsPage() {
  const router = useRouter();
  const students = useStore((state) => state.students);
  const classes = useStore((state) => state.classes);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getClassName = (classId: string) => {
    const classObj = classes.find((c) => c.id === classId);
    return classObj?.name || "Unknown";
  };
  
  const columns = [
    {
      header: "Admission No",
      accessor: "admissionNo" as keyof Student,
    },
    {
      header: "Name",
      accessor: "name" as keyof Student,
    },
    {
      header: "Class",
      accessor: (row: Student) => getClassName(row.classId),
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
        <Badge
          variant={
            row.status === StudentStatus.ACTIVE
              ? "success"
              : row.status === StudentStatus.SUSPENDED
              ? "danger"
              : "default"
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Students</h1>
          <p className="text-gray-600">Manage student records</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/students/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>
      
      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredStudents}
          onRowClick={(student) =>
            router.push(`/dashboard/admin/students/${student.id}`)
          }
          emptyMessage="No students found"
        />
      </Card>
    </div>
  );
}