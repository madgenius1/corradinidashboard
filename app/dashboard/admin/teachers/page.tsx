"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Teacher, TeacherStatus } from "@/types";
import { Plus, Search } from "lucide-react";

export default function TeachersPage() {
  const router = useRouter();
  const teachers = useStore((state) => state.teachers);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    {
      header: "Employee ID",
      accessor: "employeeId" as keyof Teacher,
    },
    {
      header: "Name",
      accessor: "name" as keyof Teacher,
    },
    {
      header: "Email",
      accessor: "email" as keyof Teacher,
    },
    {
      header: "Subjects",
      accessor: (row: Teacher) => row.subjects.slice(0, 2).join(", "),
    },
    {
      header: "Classes",
      accessor: (row: Teacher) => row.assignedClasses.length,
    },
    {
      header: "Status",
      accessor: (row: Teacher) => (
        <Badge
          variant={
            row.status === TeacherStatus.ACTIVE
              ? "success"
              : row.status === TeacherStatus.ON_LEAVE
              ? "warning"
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
          <h1 className="text-3xl font-bold text-dark mb-2">Teachers</h1>
          <p className="text-gray-600">Manage teaching staff</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/teachers/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>
      
      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredTeachers}
          onRowClick={(teacher) =>
            router.push(`/dashboard/admin/teachers/${teacher.id}`)
          }
          emptyMessage="No teachers found"
        />
      </Card>
    </div>
  );
}