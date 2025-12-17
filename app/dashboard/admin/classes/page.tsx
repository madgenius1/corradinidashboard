"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Class } from "@/types";
import { Plus } from "lucide-react";

export default function ClassesPage() {
  const router = useRouter();
  const classes = useStore((state) => state.classes);
  const teachers = useStore((state) => state.teachers);
  
  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher?.name || "Unassigned";
  };
  
  const columns = [
    {
      header: "Class Name",
      accessor: "name" as keyof Class,
    },
    {
      header: "Teacher",
      accessor: (row: Class) => getTeacherName(row.teacherId),
    },
    {
      header: "Students",
      accessor: (row: Class) => `${row.studentCount} / ${row.capacity}`,
    },
    {
      header: "Room",
      accessor: "room" as keyof Class,
    },
    {
      header: "Type",
      accessor: (row: Class) => (
        <Badge variant="info">{row.type}</Badge>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Classes</h1>
          <p className="text-gray-600">Manage school classes</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/classes/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={classes}
          onRowClick={(classObj) =>
            router.push(`/dashboard/admin/classes/${classObj.id}`)
          }
          emptyMessage="No classes found"
        />
      </Card>
    </div>
  );
}